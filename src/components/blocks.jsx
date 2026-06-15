import { Link } from 'react-router-dom'
import { Container, Eyebrow, Button } from './primitives.jsx'
import { Icon } from './Icons.jsx'

// ── ServiceCard ────────────────────────────────────────────────────────
export function ServiceCard({ service }) {
  return (
    <Link
      to="/services"
      className="press group flex flex-col rounded-lg border border-hairline bg-canvas p-8 transition-colors hover:border-primary/40"
    >
      <span className="grid h-12 w-12 place-items-center rounded-md bg-parchment text-primary">
        <Icon name={service.icon} size={24} />
      </span>
      <h3 className="display-caps mt-6 text-[20px] text-ink">{service.name}</h3>
      <p className="mt-2 text-caption font-medium text-ink-muted80">{service.tagline}</p>
      <p className="mt-3 flex-1 text-caption leading-relaxed text-ink-muted48">{service.summary}</p>
      <span className="label-caps mt-6 inline-flex items-center gap-1.5 text-[12px] tracking-[0.1em] text-primary">
        Learn more
        <Icon name="arrow" size={15} className="transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  )
}

// ── PageHero ───────────────────────────────────────────────────────────
export function PageHero({ eyebrow, title, lead, children, surface = 'parchment' }) {
  const bg = surface === 'light' ? 'bg-canvas' : 'bg-parchment'
  return (
    <section className={bg}>
      <Container className="py-24 text-center sm:py-36">
        {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
        <h1 className="display-caps mx-auto max-w-4xl text-[44px] text-ink sm:text-[68px]">
          {title}
        </h1>
        {lead && (
          <p className="mx-auto mt-6 max-w-2xl text-lead font-normal text-ink-muted80">{lead}</p>
        )}
        {children && <div className="mt-9 flex flex-wrap justify-center gap-3">{children}</div>}
      </Container>
    </section>
  )
}

// ── CTASection ─────────────────────────────────────────────────────────
export function CTASection({
  title = "Let's build something that lasts.",
  lead = 'Tell us where you want to be in twelve months. We will show you the shortest credible path there.',
}) {
  return (
    <section className="bg-tile1 text-white">
      <Container className="py-24 text-center sm:py-32">
        <h2 className="display-caps mx-auto max-w-3xl text-[36px] sm:text-[56px]">{title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-lead text-bodymuted">{lead}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Button to="/contact">Start a conversation</Button>
          <Button to="/pricing" variant="ghostDark">
            See engagement models
          </Button>
        </div>
      </Container>
    </section>
  )
}

// ── StatRow ────────────────────────────────────────────────────────────
export function StatRow({ stats, onDark = false }) {
  return (
    <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label}>
          <div
            className={`font-display text-[44px] font-semibold leading-none tracking-[-0.02em] ${
              onDark ? 'text-white' : 'text-ink'
            }`}
          >
            {s.value}
          </div>
          <div
            className={`label-caps mt-3 text-[11px] tracking-[0.14em] ${
              onDark ? 'text-bodymuted' : 'text-ink-muted48'
            }`}
          >
            {s.label}
          </div>
        </div>
      ))}
    </div>
  )
}
