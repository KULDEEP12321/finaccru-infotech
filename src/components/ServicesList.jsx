import { Link } from 'react-router-dom'
import { Icon } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'
import { services } from '../data/site.js'

// ServicesList — an Armory-style "case studies" list grid for our six disciplines.
// Each row is a ruled grid: [ media · //index · title · description · » ]. On hover
// a colourful, softly-blurred image fades in (opacity 0→1) inside the left media
// cell — exactly the reveal Armory uses for its project image — while the icon
// flips to white, the title shifts to brand blue, and the chevron nudges.
//
// Images live in /public/img/services (abstract cosmic visuals). A dark brand
// gradient sits beneath each as a fallback/tint, and a radial scrim keeps the
// white icon legible over any photo.

const VISUALS = {
  software: { img: '/img/services/software.jpg', grad: 'linear-gradient(135deg,#0a2a4d,#0a1e3a)' },
  cloud: { img: '/img/services/cloud.jpg', grad: 'linear-gradient(135deg,#0a3a66,#08182e)' },
  apps: { img: '/img/services/apps.jpg', grad: 'linear-gradient(145deg,#1a0a2b,#04161f)' },
  data: { img: '/img/services/data.jpg', grad: 'linear-gradient(155deg,#04161f,#0a3550)' },
  security: { img: '/img/services/security.jpg', grad: 'linear-gradient(160deg,#0b1220,#1c2c3e)' },
  managed: { img: '/img/services/managed.jpg', grad: 'linear-gradient(150deg,#2a1604,#08182e)' },
}

function ServiceRow({ service, index }) {
  const v = VISUALS[service.id] || VISUALS.software
  const num = String(index + 1).padStart(2, '0')
  return (
    <Link
      to="/services"
      aria-label={`${service.name} — ${service.tagline}`}
      className="group relative block border-t border-hairline transition-colors duration-300 hover:bg-parchment/60 last:border-b"
    >
      <div className="grid grid-cols-1 items-stretch gap-x-0 gap-y-3 py-6 lg:grid-cols-[clamp(190px,19vw,264px)_84px_minmax(0,1.3fr)_minmax(0,1fr)_56px] lg:gap-y-0 lg:py-0">
        {/* ── Media cell — icon at rest, blurred image reveals on hover ────── */}
        <div className="relative hidden h-[clamp(124px,13vw,152px)] w-full self-center overflow-hidden rounded-md bg-parchment lg:block">
          {/* hover reveal layer (image over a dark brand tint) */}
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-[500ms] ease-out group-hover:opacity-100"
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
            <Icon name={service.icon} size={32} className="relative text-primary transition-colors duration-300 group-hover:text-white" />
          </span>
          <span className="label-caps absolute left-3 top-3 z-10 text-[10px] tracking-[0.16em] text-ink-muted48 transition-colors duration-300 group-hover:text-white/75">
            {num}
          </span>
        </div>

        {/* ── Index (//01) ─────────────────────────────────────────────── */}
        <div className="flex items-center lg:border-l lg:border-hairline lg:pl-9">
          <span className="font-display text-[14px] tracking-[0.04em] text-ink-muted48">//{num}</span>
        </div>

        {/* ── Title ────────────────────────────────────────────────────── */}
        <div className="flex items-center">
          <h3 className="display-caps text-[24px] text-ink transition-colors duration-300 group-hover:text-primary sm:text-[28px] lg:text-[31px]">
            {service.name}
          </h3>
        </div>

        {/* ── Description ──────────────────────────────────────────────── */}
        <div className="flex items-center lg:border-l lg:border-hairline lg:pl-9">
          <p className="max-w-md text-caption leading-relaxed text-ink-muted80 lg:text-ink-muted48">
            {service.summary}
          </p>
        </div>

        {/* ── Chevron ──────────────────────────────────────────────────── */}
        <div className="hidden items-center justify-end pr-1 text-primary lg:flex">
          <span className="text-[22px] font-semibold leading-none transition-transform duration-300 ease-apple group-hover:translate-x-1.5">
            &raquo;
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function ServicesList() {
  return (
    <div>
      {services.map((s, i) => (
        <Reveal key={s.id} delay={(i % 3) * 0.06} y={18}>
          <ServiceRow service={s} index={i} />
        </Reveal>
      ))}
    </div>
  )
}
