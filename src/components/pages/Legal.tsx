import { Link } from '@tanstack/react-router'
import { Container, Eyebrow } from '@/components/ui/primitives'
import { PageHero } from '@/components/ui/blocks'
import { Icon } from '@/components/ui/Icons'
import { siteContent, type LegalDoc, type LegalSlug } from '@/lib/site-content'
const { company } = siteContent

// The cross-links that sit at the foot of every legal page. Kept here (not in
// the doc data) so each policy automatically links to its siblings + the
// human-readable sitemap without repeating the list per document.
const LEGAL_NAV: { label: string; to: string; slug?: LegalSlug }[] = [
  { label: 'Privacy Policy', to: '/privacy', slug: 'privacy' },
  { label: 'Terms of Service', to: '/terms', slug: 'terms' },
  { label: 'Cookie Policy', to: '/cookies', slug: 'cookies' },
  { label: 'Sitemap', to: '/sitemap' },
]

/**
 * Renders any legal document (privacy / terms / cookies) from its typed
 * `LegalDoc` data. Presentational only — every string comes from
 * `siteContent.legal`, the single source of truth.
 */
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  return (
    <>
      <PageHero eyebrow="Legal" title={doc.title} lead={doc.summary}>
        <p className="text-fine uppercase tracking-[0.12em] text-ink-muted48">
          Last updated {doc.updated}
        </p>
      </PageHero>

      {/* Document body — a single readable measure on the canvas surface. */}
      <section className="bg-canvas">
        <Container width="content" className="py-16 sm:py-24">
          <p className="max-w-3xl text-lead-airy text-ink-muted80">{doc.intro}</p>

          <div className="mt-14 space-y-12">
            {doc.sections.map((section, i) => (
              <div key={section.heading} className="border-t border-hairline pt-7">
                <div className="grid gap-4 sm:grid-cols-[3rem_1fr]">
                  <span className="font-display text-tagline font-semibold text-primary">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="max-w-2xl">
                    <h2 className="display-caps text-[22px] text-ink sm:text-[26px]">
                      {section.heading}
                    </h2>
                    {section.body?.map((p, j) => (
                      <p key={j} className="mt-3 text-body-lg leading-relaxed text-ink-muted80">
                        {p}
                      </p>
                    ))}
                    {section.list && (
                      <ul className="mt-4 space-y-2.5">
                        {section.list.map((item) => (
                          <li key={item} className="flex gap-3 text-body-lg leading-relaxed text-ink-muted80">
                            <Icon
                              name="check"
                              size={18}
                              className="mt-1 shrink-0 text-primary"
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact strip — one place for the email/phone, sourced from `company`. */}
          <div className="mt-14 rounded-lg border border-hairline bg-parchment p-7 sm:p-9">
            <h2 className="display-caps text-[20px] text-ink">Questions about this page?</h2>
            <p className="mt-2 max-w-xl text-body-lg leading-relaxed text-ink-muted80">
              If anything here is unclear or you would like to exercise a right described above,
              get in touch and we will help.
            </p>
            <div className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-body-lg">
              <a
                href={`mailto:${company.email}`}
                className="inline-flex items-center gap-2 text-primary transition-colors hover:text-primary-focus"
              >
                <Icon name="chat" size={17} />
                {company.email}
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-primary transition-colors hover:text-primary-focus"
              >
                Contact us
                <Icon name="arrow" size={16} />
              </Link>
            </div>
          </div>

          {/* Cross-links to the sibling legal pages + the sitemap. */}
          <nav className="mt-12 border-t border-hairline pt-6">
            <Eyebrow className="mb-3">More</Eyebrow>
            <ul className="flex flex-wrap gap-x-7 gap-y-2">
              {LEGAL_NAV.filter((l) => l.slug !== doc.slug).map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    className="text-body-lg text-ink-muted80 transition-colors hover:text-primary"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </Container>
      </section>
    </>
  )
}
