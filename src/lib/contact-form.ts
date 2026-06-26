/**
 * Contact form submission server function.
 *
 * Handles contact-form POSTs: validates the payload, rate-limits by client IP
 * via the Cloudflare Worker `CONTACT_FORM_RATE_LIMITER` binding, then fires the
 * admin + user emails through the `sendContactFormEmails` helper.
 *
 * Ported from the reference architecture (Zapify) and adapted to Finaccru's
 * form fields (name / email / company / service / message). The transport and
 * rate-limiting strategy are unchanged — this runs in the Cloudflare Worker, so
 * `cloudflare:workers` and the rate-limit binding are available here.
 */

import { createServerFn } from '@tanstack/react-start'
import { getRequest } from '@tanstack/react-start/server'
import { env } from 'cloudflare:workers'
import {
  getContactFormLogMeta,
  getErrorDetails,
  logContactEvent,
} from '@/lib/contact-log-details'
import type { ContactFormData } from '@/lib/email'

export const submitContactForm = createServerFn({ method: 'POST' })
  .validator((data: ContactFormData) => {
    // `company` is optional; everything else is required.
    if (!data.name || !data.email || !data.service || !data.message) {
      throw new Error('Please fill in your name, email, service, and message.')
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(data.email)) {
      throw new Error('Please enter a valid email address.')
    }
    // Normalise: trim everything, coerce a missing company to an empty string.
    return {
      name: data.name.trim(),
      email: data.email.trim(),
      company: (data.company ?? '').trim(),
      service: data.service.trim(),
      message: data.message.trim(),
    }
  })
  .handler(async ({ data }) => {
    const startedAt = Date.now()
    const request = getRequest()
    const headers = request?.headers
    const clientIp =
      headers?.get('cf-connecting-ip') ||
      headers?.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      'unknown'
    const requestMeta = {
      clientIp,
      cfRay: headers?.get('cf-ray') ?? undefined,
      userAgent: headers?.get('user-agent') ?? undefined,
      form: getContactFormLogMeta(data),
    }

    logContactEvent('info', 'submit_started', requestMeta)

    try {
      logContactEvent('info', 'rate_limit_check_started', requestMeta)
      const { success: withinLimit } = await env.CONTACT_FORM_RATE_LIMITER.limit({
        key: clientIp,
      })
      logContactEvent('info', 'rate_limit_check_finished', {
        ...requestMeta,
        withinLimit,
      })

      if (!withinLimit) {
        logContactEvent('error', 'rate_limit_rejected', requestMeta)
        throw new Error('Too many requests. Please wait a minute before trying again.')
      }

      logContactEvent('info', 'email_send_started', requestMeta)
      const { sendContactFormEmails } = await import('@/lib/email')
      const result = await sendContactFormEmails(data)
      logContactEvent('info', 'email_send_finished', {
        ...requestMeta,
        success: result.success,
        durationMs: Date.now() - startedAt,
      })

      if (!result.success) {
        logContactEvent('error', 'email_send_failed', {
          ...requestMeta,
          emailError: result.error,
          durationMs: Date.now() - startedAt,
        })
        throw new Error('Failed to send your message. Please try again later.')
      }

      logContactEvent('info', 'submit_succeeded', {
        ...requestMeta,
        durationMs: Date.now() - startedAt,
      })

      return {
        success: true,
        message: 'Your message has been sent successfully!',
      }
    } catch (error) {
      logContactEvent('error', 'submit_failed', {
        ...requestMeta,
        error: getErrorDetails(error),
        durationMs: Date.now() - startedAt,
      })
      throw new Error(
        error instanceof Error
          ? error.message
          : 'An error occurred while processing your request.',
      )
    }
  })
