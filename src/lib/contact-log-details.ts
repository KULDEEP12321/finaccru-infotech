import type { ContactFormData } from '@/lib/email'

type UnknownRecord = Record<string, unknown>

export type ContactLogLevel = 'info' | 'error'

export type ContactLogDetails = Record<string, unknown>

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null
}

function getStringField(value: unknown, field: string): string | undefined {
  if (!isRecord(value)) return undefined
  const fieldValue = value[field]
  return typeof fieldValue === 'string' ? fieldValue : undefined
}

export function getErrorDetails(error: unknown): ContactLogDetails {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      code: getStringField(error, 'code'),
      command: getStringField(error, 'command'),
      stack: error.stack,
    }
  }

  if (isRecord(error)) {
    return {
      name: getStringField(error, 'name'),
      message: getStringField(error, 'message'),
      code: getStringField(error, 'code'),
      command: getStringField(error, 'command'),
    }
  }

  return {
    message: String(error),
  }
}

// Log only non-PII shape/length metadata, never raw field values. The email
// domain is kept (useful for spam triage) but the local-part is dropped.
export function getContactFormLogMeta(data: ContactFormData): ContactLogDetails {
  const [, emailDomain = 'unknown'] = data.email.split('@')

  return {
    nameLength: data.name.length,
    emailDomain,
    company: data.company ? 'provided' : 'empty',
    service: data.service,
    messageLength: data.message.length,
  }
}

export function logContactEvent(
  level: ContactLogLevel,
  event: string,
  details: ContactLogDetails = {},
) {
  const payload = {
    event,
    service: 'finaccru-website',
    feature: 'contact-form',
    ...details,
  }

  console[level]('[contact-form]', JSON.stringify(payload))
}
