import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Container, Eyebrow, Button } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icons'
import { siteContent } from '@/lib/site-content'
const { services, company, offices } = siteContent

const field =
  'h-12 w-full rounded-pill border border-black/[0.08] bg-canvas px-5 text-body-lg text-ink placeholder:text-ink-muted48 focus:border-primary focus:outline-none'

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    service: services[0].name,
    message: '',
  })

  const update =
    (k: keyof typeof form) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    // No backend in this build — surface the captured payload as confirmation.
    setSent(true)
  }

  return (
    <>
      <section className="bg-parchment">
        <Container className="grid gap-12 py-16 sm:py-24 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          {/* Left — copy + offices */}
          <div>
            <Eyebrow className="mb-4">Contact</Eyebrow>
            <h1 className="display-caps text-[40px] text-ink sm:text-[48px]">
              Tell us what you are building.
            </h1>
            <p className="mt-5 max-w-md text-lead font-normal text-ink-muted80">
              Send a few lines about your project. You will hear back from a real engineer — usually
              within one business day.
            </p>

            <div className="mt-10 space-y-4">
              <a
                href={`mailto:${company.email}`}
                className="flex items-center gap-3 text-body-lg text-ink"
              >
                <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas text-primary ring-1 ring-black/[0.06]">
                  <Icon name="arrow" size={18} />
                </span>
                {company.email}
              </a>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-4 border-t border-hairline pt-8 sm:grid-cols-3">
              {offices.map((o) => (
                <div key={o.city}>
                  <p className="text-fine uppercase tracking-[0.06em] text-primary">{o.role}</p>
                  <p className="mt-2 text-caption font-semibold text-ink">{o.city}</p>
                  <p className="text-fine text-ink-muted48">{o.country}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div className="rounded-lg bg-canvas p-7 ring-1 ring-black/[0.05] sm:p-10">
            {sent ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
                  <Icon name="check" size={32} />
                </span>
                <h2 className="mt-6 display-caps text-[34px] sm:text-[40px] text-ink">
                  Thanks, {form.name.split(' ')[0] || 'there'}.
                </h2>
                <p className="mt-3 max-w-sm text-body-lg text-ink-muted80">
                  Your message is in. We will reply to{' '}
                  <span className="text-primary">{form.email || 'your inbox'}</span> within one
                  business day.
                </p>
                <Button
                  variant="ghost"
                  className="mt-8"
                  onClick={() => {
                    setSent(false)
                    setForm({ name: '', email: '', company: '', service: services[0].name, message: '' })
                  }}
                >
                  Send another
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block label-caps text-[11px] tracking-[0.12em] text-ink">Name</label>
                    <input
                      className={field}
                      placeholder="Jane Cooper"
                      value={form.name}
                      onChange={update('name')}
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block label-caps text-[11px] tracking-[0.12em] text-ink">Email</label>
                    <input
                      type="email"
                      className={field}
                      placeholder="jane@company.com"
                      value={form.email}
                      onChange={update('email')}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1.5 block label-caps text-[11px] tracking-[0.12em] text-ink">Company</label>
                  <input
                    className={field}
                    placeholder="Company name"
                    value={form.company}
                    onChange={update('company')}
                  />
                </div>

                <div>
                  <label className="mb-1.5 block label-caps text-[11px] tracking-[0.12em] text-ink">
                    What do you need?
                  </label>
                  <select className={`${field} appearance-none`} value={form.service} onChange={update('service')}>
                    {services.map((s) => (
                      <option key={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block label-caps text-[11px] tracking-[0.12em] text-ink">
                    Project details
                  </label>
                  <textarea
                    rows={4}
                    className="w-full rounded-lg border border-black/[0.08] bg-canvas px-5 py-3.5 text-body-lg text-ink placeholder:text-ink-muted48 focus:border-primary focus:outline-none"
                    placeholder="A few lines about what you want to build and by when."
                    value={form.message}
                    onChange={update('message')}
                    required
                  />
                </div>

                <Button type="submit" className="w-full">
                  Send message
                </Button>
                <p className="text-center text-fine text-ink-muted48">
                  By sending this you agree to our privacy policy. No spam, ever.
                </p>
              </form>
            )}
          </div>
        </Container>
      </section>
    </>
  )
}
