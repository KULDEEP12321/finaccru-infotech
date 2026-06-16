import { useEffect, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { Container, Button, Logo } from '@/components/ui/primitives'
import { Icon } from '@/components/ui/Icons'
import ServicesMega from '@/components/layout/ServicesMega'
import { nav, serviceCategories } from '@/data/site'

// Podium-clean nav: one row, white, generous air, uppercase geometric links,
// a single blue accent ("Get started"). No utility bar, no chrome.
export default function Navbar() {
  const [open, setOpen] = useState(false)
  const location = useLocation()

  useEffect(() => setOpen(false), [location.pathname])

  const linkBase = 'label-caps text-[13px] tracking-[0.02em] transition-colors'

  return (
    <header className="sticky top-0 z-50 border-b border-black/[0.06] bg-canvas/80 backdrop-blur-xl backdrop-saturate-150">
      <Container className="flex h-[68px] items-center justify-between gap-6">
        <Logo />

        <nav className="hidden items-center gap-8 md:flex">
          {nav.map((item) =>
            item.to === '/services' ? (
              <ServicesMega key={item.to} linkBase={linkBase} />
            ) : (
              <Link
                key={item.to}
                to={item.to}
                activeOptions={{ exact: item.to === '/' }}
                className={linkBase}
                activeProps={{ className: 'text-ink' }}
                inactiveProps={{ className: 'text-ink-muted48 hover:text-ink' }}
              >
                {item.label}
              </Link>
            )
          )}
          <Button to="/contact" className="!px-5 !py-2.5 !text-[13px]">
            Get started
          </Button>
        </nav>

        {/* Mobile toggle */}
        <button
          className="press grid h-10 w-10 place-items-center text-ink md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <Icon name={open ? 'close' : 'menu'} size={22} />
        </button>
      </Container>

      {/* Mobile tray */}
      {open && (
        <div className="border-t border-black/[0.06] bg-canvas/95 backdrop-blur-xl md:hidden">
          <Container className="flex flex-col py-4">
            {nav.map((item) => (
              <div key={item.to} className="contents">
                <Link
                  to={item.to}
                  activeOptions={{ exact: item.to === '/' }}
                  onClick={() => setOpen(false)}
                  className="display-caps border-b border-black/[0.05] py-4 text-[22px]"
                  activeProps={{ className: 'text-primary' }}
                  inactiveProps={{ className: 'text-ink' }}
                >
                  {item.label}
                </Link>
                {item.to === '/services' &&
                  serviceCategories.map((c) => (
                    <Link
                      key={c.slug}
                      to="/services/$slug"
                      params={{ slug: c.slug }}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-2.5 border-b border-black/[0.05] py-3.5 pl-4 text-[15px]"
                      activeProps={{ className: 'text-primary' }}
                      inactiveProps={{ className: 'text-ink-muted80' }}
                    >
                      <Icon name={c.icon} size={17} className="text-ink-muted48" />
                      {c.name}
                    </Link>
                  ))}
              </div>
            ))}
            <div className="pt-5">
              <Button to="/contact" onClick={() => setOpen(false)} className="w-full">
                Get started
              </Button>
            </div>
          </Container>
        </div>
      )}
    </header>
  )
}
