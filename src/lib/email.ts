/**
 * Email utility for the contact form.
 *
 * Sends SMTP directly through Cloudflare Workers TCP sockets — no third-party
 * SDK. Ported from the reference architecture (Zapify). The brand-specific bits
 * (EHLO host, From display name, subjects) are read from `siteConfig`, so a
 * future rename is a one-file change; only the `ContactFormData` shape is
 * app-specific. The transport (STARTTLS / implicit-TLS, AUTH PLAIN, the
 * line-buffered SMTP reader) is unchanged.
 *
 * Runs only inside the Cloudflare Worker — it is reached via a dynamic import
 * from the `contact-form.ts` server function's handler, so `cloudflare:sockets`
 * / `cloudflare:workers` are always available here and never reach the client
 * bundle (the handler, and this import with it, is stripped from the client).
 */

// `connect` is the only export of `cloudflare:sockets`; `Socket` is a global
// ambient type from the generated Worker runtime types (worker-configuration.d.ts,
// produced by `npm run cf-typegen`), so it is referenced directly, not imported.
import { connect } from 'cloudflare:sockets'
import { env } from 'cloudflare:workers'
import { siteConfig } from '@/lib/site-config'
import {
  getContactFormLogMeta,
  getErrorDetails,
  logContactEvent,
} from '@/lib/contact-log-details'

// Hostname announced in the SMTP EHLO greeting. Cosmetic for authenticated
// relays; kept as the canonical brand domain for clean Received headers.
const EHLO_DOMAIN = siteConfig.domain
// Display name on the From header of outbound mail.
const FROM_NAME = siteConfig.name

type SmtpResponse = {
  code: number
  message: string
}

type SmtpSendInput = {
  from: string
  to: string[]
  subject: string
  html: string
  replyTo?: string
}

export type ContactFormData = {
  name: string
  email: string
  company: string
  service: string
  message: string
}

function getSMTPConfig() {
  return {
    host: env.SMTP_HOST,
    port: Number(env.SMTP_PORT),
    user: env.SMTP_USER,
    password: env.SMTP_PASSWORD,
  }
}

function getSMTPConfigLogMeta() {
  const adminEmails = getAdminEmails()
  const config = getSMTPConfig()

  return {
    provider: 'smtp',
    host: config.host,
    port: config.port,
    secureTransport: config.port === 465 ? 'on' : 'starttls',
    hasUser: Boolean(config.user),
    hasPassword: Boolean(config.password),
    adminEmailCount: adminEmails.length,
  }
}

function getAdminEmails(): string[] {
  return (env.ADMIN_EMAILS ?? '')
    .split(',')
    .map((email) => email.trim())
    .filter(Boolean)
}

function sanitizeHeader(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim()
}

function encodeBase64(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

function encodeHeader(value: string): string {
  const sanitizedValue = sanitizeHeader(value)
  return /^[\x20-\x7E]*$/.test(sanitizedValue)
    ? sanitizedValue
    : `=?UTF-8?B?${encodeBase64(sanitizedValue)}?=`
}

function formatAddress(email: string, name?: string): string {
  if (!name) return `<${sanitizeHeader(email)}>`
  return `"${sanitizeHeader(name).replaceAll('"', "'")}" <${sanitizeHeader(email)}>`
}

function dotStuffBody(value: string): string {
  return value.replace(/\r?\n/g, '\r\n').replace(/^\./gm, '..')
}

function createEmailMessage(input: SmtpSendInput): string {
  const headers = [
    `From: ${formatAddress(input.from, FROM_NAME)}`,
    `To: ${input.to.map((email) => formatAddress(email)).join(', ')}`,
    input.replyTo ? `Reply-To: ${formatAddress(input.replyTo)}` : undefined,
    `Subject: ${encodeHeader(input.subject)}`,
    `Date: ${new Date().toUTCString()}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset="UTF-8"',
    'Content-Transfer-Encoding: 8bit',
  ].filter(Boolean)

  return `${headers.join('\r\n')}\r\n\r\n${dotStuffBody(input.html)}`
}

class SmtpClient {
  private decoder = new TextDecoder()
  private encoder = new TextEncoder()
  private reader: ReadableStreamDefaultReader<Uint8Array>
  private writer: WritableStreamDefaultWriter<Uint8Array>
  private pendingText = ''

  constructor(private socket: Socket) {
    this.reader = socket.readable.getReader()
    this.writer = socket.writable.getWriter()
  }

  static async connect() {
    const config = getSMTPConfig()
    const hasImplicitTls = config.port === 465
    const socket = connect(
      { hostname: config.host, port: config.port },
      { secureTransport: hasImplicitTls ? 'on' : 'starttls', allowHalfOpen: false },
    )
    await socket.opened
    const client = new SmtpClient(socket)
    await client.expect([220])
    await client.command(`EHLO ${EHLO_DOMAIN}`, [250])

    if (!hasImplicitTls) {
      await client.command('STARTTLS', [220])
      const secureSocket = socket.startTls()
      await secureSocket.opened
      client.resetSocket(secureSocket)
      await client.command(`EHLO ${EHLO_DOMAIN}`, [250])
    }

    return client
  }

  async authenticate() {
    const config = getSMTPConfig()
    if (!config.user || !config.password) {
      throw new Error('SMTP_USER or SMTP_PASSWORD is not configured')
    }

    const authPayload = encodeBase64(`\u0000${config.user}\u0000${config.password}`)
    await this.command(`AUTH PLAIN ${authPayload}`, [235])
  }

  async send(input: SmtpSendInput) {
    await this.command(`MAIL FROM:<${sanitizeHeader(input.from)}>`, [250])

    for (const recipient of input.to) {
      await this.command(`RCPT TO:<${sanitizeHeader(recipient)}>`, [250, 251])
    }

    await this.command('DATA', [354])
    await this.write(`${createEmailMessage(input)}\r\n.\r\n`)
    await this.expect([250])
  }

  async close() {
    try {
      await this.command('QUIT', [221])
    } finally {
      this.reader.releaseLock()
      this.writer.releaseLock()
      await this.socket.close()
    }
  }

  private resetSocket(socket: Socket) {
    this.reader.releaseLock()
    this.writer.releaseLock()
    this.socket = socket
    this.reader = socket.readable.getReader()
    this.writer = socket.writable.getWriter()
    this.pendingText = ''
  }

  private async command(command: string, expectedCodes: number[]) {
    await this.write(`${command}\r\n`)
    return this.expect(expectedCodes)
  }

  private async write(value: string) {
    await this.writer.write(this.encoder.encode(value))
  }

  private async expect(expectedCodes: number[]) {
    const response = await this.readResponse()
    if (!expectedCodes.includes(response.code)) {
      throw new Error(`SMTP command failed with ${response.code}: ${response.message}`)
    }
    return response
  }

  private async readResponse(): Promise<SmtpResponse> {
    while (true) {
      const lineEnd = this.pendingText.indexOf('\r\n')
      if (lineEnd !== -1) {
        const line = this.pendingText.slice(0, lineEnd)
        this.pendingText = this.pendingText.slice(lineEnd + 2)
        const code = Number(line.slice(0, 3))
        const separator = line[3]
        const lines = [line]

        if (Number.isNaN(code)) {
          throw new Error(`Invalid SMTP response: ${line}`)
        }

        if (separator === '-') {
          while (true) {
            const nextLine = await this.readLine()
            lines.push(nextLine)
            if (nextLine.startsWith(`${code} `)) break
          }
        }

        return {
          code,
          message: lines.join('\n'),
        }
      }

      const { value, done } = await this.reader.read()
      if (done) {
        throw new Error('SMTP connection closed before response was received')
      }
      this.pendingText += this.decoder.decode(value, { stream: true })
    }
  }

  private async readLine(): Promise<string> {
    while (true) {
      const lineEnd = this.pendingText.indexOf('\r\n')
      if (lineEnd !== -1) {
        const line = this.pendingText.slice(0, lineEnd)
        this.pendingText = this.pendingText.slice(lineEnd + 2)
        return line
      }

      const { value, done } = await this.reader.read()
      if (done) {
        throw new Error('SMTP connection closed before line was received')
      }
      this.pendingText += this.decoder.decode(value, { stream: true })
    }
  }
}

async function sendEmail(input: SmtpSendInput): Promise<void> {
  const client = await SmtpClient.connect()

  try {
    await client.authenticate()
    await client.send(input)
  } finally {
    await client.close()
  }
}

export async function sendToAdmins(data: ContactFormData): Promise<void> {
  logContactEvent('info', 'admin_email_send_started', {
    smtp: getSMTPConfigLogMeta(),
    form: getContactFormLogMeta(data),
  })

  const adminEmails = getAdminEmails()
  const { sendToAdminTemplate } = await import('./email_templates/sendToAdmin')
  const htmlContent = sendToAdminTemplate(data)

  await sendEmail({
    from: env.SMTP_USER,
    to: adminEmails,
    subject: `New enquiry: ${data.service} — ${data.name}`,
    html: htmlContent,
    replyTo: data.email,
  })

  logContactEvent('info', 'admin_email_send_succeeded', {
    smtp: getSMTPConfigLogMeta(),
    form: getContactFormLogMeta(data),
  })
}

export async function sendToUser(data: ContactFormData): Promise<void> {
  logContactEvent('info', 'user_email_send_started', {
    smtp: getSMTPConfigLogMeta(),
    form: getContactFormLogMeta(data),
  })

  const { sendToUserTemplate } = await import('./email_templates/sendToUser')
  const htmlContent = sendToUserTemplate(data)

  await sendEmail({
    from: env.SMTP_USER,
    to: [data.email],
    subject: `We received your message — ${siteConfig.name}`,
    html: htmlContent,
  })

  logContactEvent('info', 'user_email_send_succeeded', {
    smtp: getSMTPConfigLogMeta(),
    form: getContactFormLogMeta(data),
  })
}

export async function sendContactFormEmails(data: ContactFormData): Promise<{
  success: boolean
  error?: string
}> {
  try {
    logContactEvent('info', 'email_process_started', {
      smtp: getSMTPConfigLogMeta(),
      form: getContactFormLogMeta(data),
    })

    try {
      await sendToAdmins(data)
    } catch (adminError) {
      logContactEvent('error', 'admin_email_send_failed', {
        smtp: getSMTPConfigLogMeta(),
        form: getContactFormLogMeta(data),
        error: getErrorDetails(adminError),
      })
      throw new Error(
        `Admin email failed: ${adminError instanceof Error ? adminError.message : 'Unknown error'}`,
      )
    }

    try {
      await sendToUser(data)
    } catch (userError) {
      logContactEvent('error', 'user_email_send_failed', {
        smtp: getSMTPConfigLogMeta(),
        form: getContactFormLogMeta(data),
        error: getErrorDetails(userError),
      })
      throw new Error(
        `User email failed: ${userError instanceof Error ? userError.message : 'Unknown error'}`,
      )
    }

    logContactEvent('info', 'email_process_succeeded', {
      smtp: getSMTPConfigLogMeta(),
      form: getContactFormLogMeta(data),
    })
    return { success: true }
  } catch (error) {
    logContactEvent('error', 'email_process_failed', {
      smtp: getSMTPConfigLogMeta(),
      form: getContactFormLogMeta(data),
      error: getErrorDetails(error),
    })
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    }
  }
}
