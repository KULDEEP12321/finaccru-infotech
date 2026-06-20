import { useEffect, useRef, useState } from 'react'
import { Link, useLocation } from '@tanstack/react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Icon } from '@/components/ui/Icons'
import { Button } from '@/components/ui/primitives'
import { siteContent } from '@/lib/site-content'
const { serviceCategories } = siteContent

const EASE = [0.28, 0.11, 0.32, 1]

// ── ServicesMega ────────────────────────────────────────────────────────────
// Desktop "Services" hover megamenu, modelled on protechplanner.com: a left
// list of practices and a right panel that swaps to that practice's specialized
// solutions when a row is hovered. Pure fade/slide reveal (~200ms), styled to
// design.md — white canvas, hairline border, one soft float shadow, blue accent.
//
// Hover is bridged by a short close-delay so crossing the gap between the
// trigger and the panel doesn't flicker it shut. Desktop only (md+); the mobile
// tray lists the same practices.
export default function ServicesMega({ linkBase }: { linkBase: string }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const { pathname } = useLocation()

  const openMenu = () => {
    clearTimeout(timer.current)
    setOpen(true)
  }
  const scheduleClose = () => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      setOpen(false)
      setActive(-1)
    }, 140)
  }

  // Close + reset whenever the route changes (e.g. clicking a row).
  useEffect(() => {
    setOpen(false)
    setActive(-1)
  }, [pathname])

  useEffect(() => () => clearTimeout(timer.current), [])

  const isOnServices = pathname.startsWith('/services')
  const cat = active >= 0 ? serviceCategories[active] : null

  return (
    <div
      className="relative flex items-center"
      onMouseEnter={openMenu}
      onMouseLeave={scheduleClose}
      onFocusCapture={openMenu}
      onBlurCapture={scheduleClose}
    >
      <Link
        to="/services"
        aria-haspopup="true"
        aria-expanded={open}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            setOpen(false)
            setActive(-1)
          }
        }}
        className={`${linkBase} inline-flex items-center gap-1 ${
          open || isOnServices ? 'text-ink' : 'text-ink-muted48 hover:text-ink'
        }`}
      >
        Services
        <Icon
          name="chevron"
          size={13}
          className={`transition-transform duration-200 ease-apple ${open ? 'rotate-180' : ''}`}
        />
      </Link>

      <AnimatePresence>
        {open && (
          <motion.div
            key="services-mega"
            initial={{ opacity: 0, y: -8, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -8, x: '-50%' }}
            transition={{ duration: 0.2, ease: EASE }}
            onMouseEnter={openMenu}
            onMouseLeave={scheduleClose}
            className="fixed left-1/2 top-[67px] z-50 w-[min(900px,calc(100vw-2rem))]"
          >
            <div className="grid grid-cols-[290px_1fr] overflow-hidden rounded-lg border border-black/[0.07] bg-canvas/95 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.28)] backdrop-blur-xl backdrop-saturate-150">
              {/* ── Left: practice list ─────────────────────────────────── */}
              <div className="border-r border-black/[0.06] bg-parchment/70 p-3">
                <div className="px-3 pb-2.5 pt-2">
                  <p className="display-caps text-[15px] text-ink">All services</p>
                  <p className="mt-0.5 text-fine text-ink-muted48">
                    Hover to view specialized solutions
                  </p>
                </div>
                <div className="flex flex-col">
                  {serviceCategories.map((c, i) => (
                    <Link
                      key={c.slug}
                      to="/services/$slug"
                      params={{ slug: c.slug }}
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      className={`flex items-center justify-between gap-2 rounded-md px-3 py-2.5 text-[14px] transition-colors duration-150 ${
                        active === i
                          ? 'bg-canvas text-primary'
                          : 'text-ink-muted80 hover:bg-canvas/60'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <Icon
                          name={c.icon}
                          size={17}
                          className={active === i ? 'text-primary' : 'text-ink-muted48'}
                        />
                        {c.name}
                      </span>
                      <Icon
                        name="arrow"
                        size={14}
                        className={`shrink-0 text-primary transition-all duration-200 ease-apple ${
                          active === i ? 'translate-x-0 opacity-100' : '-translate-x-1 opacity-0'
                        }`}
                      />
                    </Link>
                  ))}
                </div>
                <Link
                  to="/services"
                  className="mt-1.5 flex items-center gap-1.5 border-t border-black/[0.06] px-3 pb-1 pt-3 text-fine text-ink-muted48 transition-colors hover:text-primary"
                >
                  View all services
                  <Icon name="arrow" size={13} />
                </Link>
              </div>

              {/* ── Right: default invite / specialized solutions ───────── */}
              <div className="p-6">
                {!cat ? (
                  <div className="flex h-full min-h-[244px] flex-col items-center justify-center text-center">
                    <span className="grid h-12 w-12 place-items-center rounded-md bg-parchment text-ink-muted48">
                      <Icon name="chevron" size={22} />
                    </span>
                    <p className="display-caps mt-4 text-[17px] text-ink">Explore our practices</p>
                    <p className="mt-1.5 max-w-[260px] text-caption text-ink-muted48">
                      Hover over any service to view its specialized solutions.
                    </p>
                    <Button to="/contact" className="mt-5 !px-5 !py-2.5 !text-[13px]">
                      Get started
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.18, ease: EASE }}
                  >
                    <p className="display-caps text-[18px] text-ink">{cat.name}</p>
                    <p className="mt-1 text-caption text-ink-muted48">
                      {cat.subLead || cat.summary}
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-2.5">
                      {cat.subservices.map((s) => (
                        <Link
                          key={s.title}
                          to="/services/$slug"
                          params={{ slug: cat.slug }}
                          className="flex items-center gap-2.5 rounded-md border border-hairline bg-canvas px-3 py-2.5 transition-colors hover:border-primary/40"
                        >
                          <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[6px] bg-parchment text-primary">
                            <Icon name={s.icon} size={15} />
                          </span>
                          <span className="text-[13px] leading-tight text-ink-muted80">
                            {s.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <Link
                      to="/services/$slug"
                      params={{ slug: cat.slug }}
                      className="press mt-4 inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-ink px-4 py-2.5 text-[13px] text-white transition-colors hover:bg-black"
                    >
                      Explore {cat.name}
                      <Icon name="arrow" size={14} />
                    </Link>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
