/**
 * Email template: user confirmation.
 * Sent to the person who submitted the contact form.
 *
 * Branding follows the Clay design system (cream canvas, near-black ink header,
 * teal accents). URLs/identity are read from `siteConfig` so flipping the
 * production domain stays a one-line change (see src/lib/site-config.ts).
 */

import { siteConfig } from '@/lib/site-config'
import type { ContactFormData } from '../email'

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

export function sendToUserTemplate(data: ContactFormData): string {
  const firstName = escapeHtml(data.name.split(' ')[0] || 'there')
  const site = siteConfig.url

  const link = (href: string, label: string) => `
                <div style="margin: 8px 0;">
                  <a href="${href}" style="color: #1a3a3a; text-decoration: none; font-size: 14px;">${label}</a>
                </div>`

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>We received your message</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #fffaf0;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td style="padding: 40px 20px;">
        <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border: 1px solid #e5e5e5; border-radius: 14px; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background-color: #0a0a0a; padding: 30px; text-align: center;">
              <div style="color: #ffffff; font-size: 18px; font-weight: 700; letter-spacing: -0.01em;">${siteConfig.name}</div>
              <h1 style="margin: 10px 0 0 0; color: #ffffff; font-size: 22px; font-weight: 600;">Thanks for reaching out</h1>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 30px;">

              <p style="margin: 0 0 16px 0; color: #0a0a0a; font-size: 14px; line-height: 1.6;">
                Hi <strong>${firstName}</strong>,
              </p>

              <p style="margin: 0 0 16px 0; color: #0a0a0a; font-size: 14px; line-height: 1.6;">
                Thank you for contacting ${siteConfig.name}. We have received your message — a real
                engineer will review it and get back to you, usually within one business day.
              </p>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <!-- Quick links -->
              <div style="margin: 20px 0;">
                <h3 style="margin: 0 0 12px 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">In the meantime</h3>
${link(`${site}/services`, '→ Explore what we build')}
${link(`${site}/pricing`, '→ Engagement models & pricing')}
${link(`${site}/about`, `→ About ${siteConfig.name}`)}
${link(`${site}/blog`, '→ Read the engineering blog')}
              </div>

              <hr style="border: none; border-top: 1px solid #e5e5e5; margin: 20px 0;">

              <!-- Support info -->
              <div style="margin-top: 8px;">
                <h3 style="margin: 0 0 8px 0; color: #0a0a0a; font-size: 15px; font-weight: 600;">Need to reach us sooner?</h3>
                <p style="margin: 0; color: #6a6a6a; font-size: 13px;">
                  Email us any time at
                  <a href="mailto:${siteConfig.email}" style="color: #1a3a3a; text-decoration: none;">${siteConfig.email}</a>.
                </p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #faf5e8; padding: 20px 30px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; text-align: center; color: #9a9a9a; font-size: 11px; line-height: 1.6;">
                © ${new Date().getFullYear()} ${siteConfig.name}. All rights reserved.<br>
                Custom software, cloud &amp; DevOps, mobile &amp; web, data, AI/ML, and cybersecurity.
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
