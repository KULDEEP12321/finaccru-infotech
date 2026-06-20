import { useEffect, useRef, useState, type Ref } from 'react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import { siteContent, type Service } from '@/lib/site-content'
const { services } = siteContent

// ServicesList — an Armory-style "case studies" list grid for our six disciplines.
// Each row is a ruled grid: [ media · //index · title · description · » ]. On hover
// a colourful, softly-blurred image fades in (opacity 0→1) inside the left media
// cell — exactly the reveal Armory uses for its project image — while the icon
// flips to white, the title shifts to brand blue, and the chevron nudges.
//
// Touch devices have no hover, so below `lg` the same reveal is driven by SCROLL:
// the row crossing the viewport centre becomes "active" (an IntersectionObserver
// with a thin centre band picks it), and gets the identical treatment. A compact
// media square is shown on mobile so the image reveal has somewhere to land.
//
// Images live in /public/img/services (abstract cosmic visuals). A dark brand
// gradient sits beneath each as a fallback/tint, and a radial scrim keeps the
// white icon legible over any photo.

const VISUALS: Record<string, { img: string; grad: string }> = {
  software: { img: '/img/services/software.jpg', grad: 'linear-gradient(135deg,#0a2a4d,#0a1e3a)' },
  cloud: { img: '/img/services/cloud.jpg', grad: 'linear-gradient(135deg,#0a3a66,#08182e)' },
  apps: { img: '/img/services/apps.jpg', grad: 'linear-gradient(145deg,#1a0a2b,#04161f)' },
  data: { img: '/img/services/data.jpg', grad: 'linear-gradient(155deg,#04161f,#0a3550)' },
  security: { img: '/img/services/security.jpg', grad: 'linear-gradient(160deg,#0b1220,#1c2c3e)' },
  managed: { img: '/img/services/managed.jpg', grad: 'linear-gradient(150deg,#2a1604,#08182e)' },
}

function ServiceRow({
  service,
  index,
  active,
  rowRef,
}: {
  service: Service
  index: number
  active: boolean
  rowRef: Ref<HTMLAnchorElement>
}) {
  const v = VISUALS[service.id] || VISUALS.software
  const num = String(index + 1).padStart(2, '0')
  return (
    <Link
      ref={rowRef}
      data-index={index}
      to="/services"
      aria-label={`${service.name} — ${service.tagline}`}
      className={cn(
        'group relative block border-t border-hairline transition-colors duration-300 hover:bg-parchment/60 last:border-b',
        active && 'bg-parchment/60' // mobile: scroll-active highlight (desktop never sets this)
      )}
    >
      {/* flex (media | text) on mobile; the original 5-column grid on lg (the text
          wrapper is display:contents at lg, so the grid is byte-identical there). */}
      <div className="flex items-center gap-4 py-5 sm:gap-6 sm:py-7 lg:grid lg:grid-cols-[clamp(190px,19vw,264px)_84px_minmax(0,1.3fr)_minmax(0,1fr)_56px] lg:items-stretch lg:gap-0 lg:py-0">
        {/* ── Media cell — compact square on mobile, big rectangle on lg ────── */}
        <div className="relative h-[72px] w-[72px] shrink-0 self-center overflow-hidden rounded-md bg-parchment sm:h-[104px] sm:w-[104px] lg:h-[clamp(124px,13vw,152px)] lg:w-full">
          {/* reveal layer (image over a dark brand tint) — hover on desktop, active on mobile */}
          <div
            className={cn(
              'absolute inset-0 transition-opacity duration-[500ms] ease-out group-hover:opacity-100',
              active ? 'opacity-100' : 'opacity-0'
            )}
            style={{ background: v.grad }}
          >
            <img
              src={v.img}
              alt=""
              aria-hidden="true"
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full scale-[1.15] object-cover blur-[5px] transition-transform duration-[1200ms] ease-out group-hover:scale-[1.22]"
            />
            {/* radial scrim → keeps the white icon readable on any image */}
            <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 48%, rgba(0,0,0,0.5), rgba(0,0,0,0.18) 52%, transparent 76%)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 48%, rgba(0,0,0,0.42) 100%)' }} />
          </div>
          {/* icon (flips to white over the revealed image) */}
          <span className="absolute inset-0 grid place-items-center">
            <Icon
              name={service.icon}
              size={32}
              className={cn('relative transition-colors duration-300 group-hover:text-white', active ? 'text-white' : 'text-primary')}
            />
          </span>
          {/* corner index — desktop only (it's already in the text column on mobile) */}
          <span className="label-caps absolute left-3 top-3 z-10 hidden text-[10px] tracking-[0.16em] text-ink-muted48 transition-colors duration-300 group-hover:text-white/75 lg:block">
            {num}
          </span>
        </div>

        {/* text cells — stacked column on phone; a wrapping row on tablet (index +
            title share a line, description drops full-width below); three grid
            items on lg (contents → the desktop grid is byte-identical). */}
        <div className="flex min-w-0 flex-col gap-1 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-3 sm:gap-y-2 lg:contents">
          {/* ── Index (//01) ─────────────────────────────────────────────── */}
          <div className="flex items-center lg:border-l lg:border-hairline lg:pl-9">
            <span className="font-display text-[13px] tracking-[0.04em] text-ink-muted48 lg:text-[14px]">//{num}</span>
          </div>

          {/* ── Title ────────────────────────────────────────────────────── */}
          <div className="flex items-center">
            <h3
              className={cn(
                'display-caps text-[22px] transition-colors duration-300 group-hover:text-primary sm:text-[28px] lg:text-[31px]',
                active ? 'text-primary' : 'text-ink'
              )}
            >
              {service.name}
            </h3>
          </div>

          {/* ── Description ──────────────────────────────────────────────── */}
          <div className="flex items-center sm:basis-full lg:border-l lg:border-hairline lg:pl-9">
            <p className="max-w-md text-caption leading-relaxed text-ink-muted80 lg:text-ink-muted48">
              {service.summary}
            </p>
          </div>
        </div>

        {/* ── Chevron (tablet + desktop; hidden on phone) ──────────────────── */}
        <div className="hidden items-center justify-end pr-1 text-primary sm:flex">
          <span className="text-[22px] font-semibold leading-none transition-transform duration-300 ease-apple group-hover:translate-x-1.5">
            &raquo;
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ServicesList() {
  const [activeIndex, setActiveIndex] = useState(-1)
  const rowsRef = useRef<(HTMLAnchorElement | null)[]>([])

  // Below `lg`, light up the row crossing the viewport centre as you scroll — the
  // touch-friendly stand-in for :hover. A near-zero centre band means exactly one
  // row qualifies at a time. Desktop keeps pure hover (observer never runs).
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(max-width: 1023px)')
    let io: IntersectionObserver | null = null
    const setup = () => {
      io?.disconnect()
      io = null
      setActiveIndex(-1)
      if (!mq.matches) return // desktop → hover handles it
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) setActiveIndex(Number((e.target as HTMLElement).dataset.index))
          }
        },
        { rootMargin: '-46% 0px -46% 0px', threshold: 0 }
      )
      rowsRef.current.forEach((el) => el && io!.observe(el))
    }
    setup()
    mq.addEventListener?.('change', setup)
    return () => {
      io?.disconnect()
      mq.removeEventListener?.('change', setup)
    }
  }, [])

  return (
    <div>
      {services.map((s, i) => (
        <Reveal key={s.id} delay={(i % 3) * 0.06} y={18}>
          <ServiceRow
            service={s}
            index={i}
            active={i === activeIndex}
            rowRef={(el) => {
              rowsRef.current[i] = el
            }}
          />
        </Reveal>
      ))}
    </div>
  )
}
