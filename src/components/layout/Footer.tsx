import { Link } from '@tanstack/react-router'
import { Container, Logo } from '@/components/ui/primitives'
import { siteContent } from '@/lib/site-content'
const { footerColumns, company } = siteContent

export default function Footer() {
  const year = 2026 // build-time constant; avoids per-render Date()
  return (
    <footer className="bg-parchment text-ink-muted80">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-4 text-caption text-ink-muted48">
              We design, build, and run the software ambitious businesses depend on.
            </p>
            <p className="mt-4 text-caption text-ink-muted48">{company.hq}</p>
          </div>

          {footerColumns.map((col) => (
            <div key={col.heading}>
              <h4 className="label-caps text-[12px] tracking-[0.14em] text-ink">{col.heading}</h4>
              <ul className="mt-2">
                {col.links.map((link) => (
                  <li key={link.label} className="leading-[2.41]">
                    <Link
                      to={link.to}
                      className="text-body-lg text-ink-muted80 transition-colors hover:text-primary max-sm:flex max-sm:min-h-[44px] max-sm:items-center"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-black/[0.06] pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fine text-ink-muted48">
            © {year} {company.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            {[
              { label: 'Privacy', to: '/privacy' },
              { label: 'Terms', to: '/terms' },
              { label: 'Cookies', to: '/cookies' },
              { label: 'Sitemap', to: '/sitemap' },
            ].map((l) => (
              <Link key={l.label} to={l.to} className="text-fine text-ink-muted48 hover:text-ink">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
