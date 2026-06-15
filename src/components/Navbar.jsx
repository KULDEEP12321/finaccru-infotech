import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Container, Button, Logo } from './primitives.jsx'
import { Icon } from './Icons.jsx'
import { nav } from '../data/site.js'

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
          {nav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `${linkBase} ${isActive ? 'text-ink' : 'text-ink-muted48 hover:text-ink'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
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
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `display-caps border-b border-black/[0.05] py-4 text-[22px] ${
                    isActive ? 'text-primary' : 'text-ink'
                  }`
                }
              >
                {item.label}
              </NavLink>
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
