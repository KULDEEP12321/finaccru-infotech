/**
 * Email template: admin notification.
 * Sent to ADMIN_EMAILS when a new contact form is submitted.
 *
 * Branding follows the Clay design system (cream canvas, near-black ink header,
 * teal accents). URLs/identity are read from `siteConfig` so flipping the
 * production domain stays a one-line change (see src/lib/site-config.ts).
 */

import { siteConfig } from '@/lib/site-config'
import type { ContactFormData } from '../email'

// Minimal HTML-escape so user input can't break out of the markup.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sendToAdminTemplate(data: ContactFormData): string {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const company = escapeHtml(data.company || '—')
  const service = escapeHtml(data.service)
  const message = escapeHtml(data.message)
  // URL-context encodings for the mailto links: `encodeURI` keeps the address
  // readable (does not encode `@`) while escaping quotes/spaces/brackets that
  // would otherwise be unsafe in an href; the subject uses full component
  // encoding. Both derive from the raw (unescaped) values.
  const emailHref = encodeURI(data.email)
  const replySubject = encodeURIComponent(`Re: ${data.service}`)
  const submitted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  const row = (label: string, valueHtml: string) => `
                <tr>
                  <td style="padding: 10px 0;">
                    <div style="color: #6a6a6a; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 4px;">${label}</div>
                    <div style="color: #0a0a0a; font-size: 15px; font-weight: 600;">${valueHtml}</div>
                  </td>
                </tr>`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New contact form submission</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fffaf0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 14px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 28px 30px; text-align: center;">
              <div style="color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">${siteConfig.name}</div>
              <div style="margin-top: 6px; color: rgba(255,255,255,0.6); font-size: 13px;">New contact form submission</div>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">

              <p style="margin: 0 0 20px 0; color: #1a3a3a; font-size: 14px;">📩 You have a new enquiry from the website contact form.</p>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <table role="presentation" style="width: 100%; border-collapse: collapse;">
${row('Name', name)}
${row('Email', `<a href="mailto:${emailHref}" style="color: #1a3a3a; font-size: 15px; text-decoration: none;">${email}</a>`)}
${row('Company', company)}
${row('Service of interest', service)}
${row('Submitted', `<span style="font-weight: 400; font-size: 14px;">${submitted}</span>`)}
              </table>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <!-- Message -->
              <div style="margin: 20px 0;">
                <div style="color: #6a6a6a; font-size: 12px; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px;">Message</div>
                <div style="color: #0a0a0a; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${message}</div>
              </div>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <!-- Reply button -->
              <div style="text-align: center; margin: 20px 0;">
                <a href="mailto:${emailHref}?subject=${replySubject}"
                   style="display: inline-block; background-color: #0a0a0a; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 9999px; font-weight: 600; font-size: 14px;">
                  Reply to ${name}
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf5e8; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; text-align: center; color: #9a9a9a; font-size: 11px;">
                © ${new Date().getFullYear()} ${siteConfig.name}. Sent from the website contact form.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}
