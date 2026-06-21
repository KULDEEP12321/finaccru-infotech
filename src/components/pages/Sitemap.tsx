import { Link } from '@tanstack/react-router'
import { Container } from '@/components/ui/primitives'
import { PageHero } from '@/components/ui/blocks'
import { Icon } from '@/components/ui/Icons'
import { siteContent } from '@/lib/site-content'
const { nav, serviceCategories } = siteContent

// A human-readable index of the site, grouped for scanning. Every link is
// derived from the same `site-content` source of truth as the nav and footer,
// so new pages and services appear here automatically. The machine-readable
// XML feed lives at /sitemap.xml (linked at the foot of this page).
const groups: { heading: string; links: { label: string; to: string }[] }[] = [
  {
    heading: 'Explore',
    links: nav,
  },
  {
    heading: 'Services',
    links: [
      ...serviceCategories.map((c) => ({ label: c.label, to: `/services/${c.slug}` })),
      { label: 'All services', to: '/services' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', to: '/privacy' },
      { label: 'Terms of Service', to: '/terms' },
      { label: 'Cookie Policy', to: '/cookies' },
    ],
  },
]

export default function Sitemap() {
  return (
    <>
      <PageHero
        eyebrow="Sitemap"
        title="Everything on this site"
        lead="A quick index of every page. Looking for something specific? It is probably one click away."
      />

      <section className="bg-canvas">
        <Container className="py-16 sm:py-24">
          <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {groups.map((group) => (
              <div key={group.heading} className="border-t border-hairline pt-6">
                <h2 className="label-caps text-[12px] tracking-[0.14em] text-ink">
                  {group.heading}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {group.links.map((link) => (
                    <li key={link.to + link.label}>
                      <Link
                        to={link.to}
                        className="group inline-flex items-center gap-1.5 text-body-lg text-ink-muted80 transition-colors hover:text-primary"
                      >
                        {link.label}
                        <Icon
                          name="arrow"
                          size={15}
                          className="opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-14 border-t border-hairline pt-6 text-caption text-ink-muted48">
            Prefer the machine-readable version?{' '}
            <a href="/sitemap.xml" className="text-primary transition-colors hover:text-primary-focus">
              View the XML sitemap
            </a>
            .
          </p>
        </Container>
      </section>
    </>
  )
}
