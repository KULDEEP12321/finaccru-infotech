import { useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { Icon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import { cn } from '@/lib/cn'
import type { Subservice } from '@/data/site'

// SubserviceShowcase — alternating image+copy "feature rows" (the Imprint Core
// pattern: a large visual on one side, headline + description + "Learn more" on
// the other, flipping sides each row). It replaces the old 3-up card grid.
//
// We have no per-subservice product photography, so the "image" is a brand
// gradient "device" panel — a deep-blue/navy field (the system's single accent
// family) with a soft sky glow, a faint dot texture, and a frosted tile holding
// the service glyph. The panel drifts with a gentle scroll parallax (disabled
// under prefers-reduced-motion), echoing the reference's product render.
//
// Layout: a 2-col grid at lg (visual ~half, copy ~half) with a generous gutter;
// below lg every row stacks visual-over-copy. Sides alternate via lg:order only,
// so the DOM order (visual first) — and therefore the mobile stack — is stable.

// The exact gradient baked into Imprint's "Imprint Core" object video, rebuilt
// in CSS from sampled corners (TL #74abdd bright blue, TR #030d23 near-black
// navy, BL #edf1f7 near-white, BR #3b4d74 slate): a diagonal dark→light field
// (top-right → bottom-left) plus a bright-blue glow in the upper-left.
const OBJECT_GRADIENT =
  'radial-gradient(100% 95% at 14% 16%, rgba(120,176,222,0.92) 0%, rgba(120,176,222,0) 46%),' +
  'linear-gradient(218deg, #020b1f 0%, #0c2147 24%, #2a4670 46%, #44679a 60%, #84aed7 76%, #cfe1f3 90%, #edf1f7 100%)'

// Warm peach glow inside the pad (its interior dots sampled ~#ffebe2).
const WARM_GLOW =
  'radial-gradient(46% 42% at 50% 50%, rgba(255,214,188,0.50) 0%, rgba(255,214,188,0) 72%)'

// The "Imprint Core" wordmark colours, sampled left→right across the letters:
// sage #a9c2c2 → tan #adac96 → taupe #a08b7a → rosy-brown #8a5d53. Reused as a
// background-clip:text gradient on every row heading.
export const WORDMARK_GRADIENT =
  'linear-gradient(95deg, #a9c2c2 0%, #abbab3 16%, #adac96 34%, #a08b7a 54%, #946e62 76%, #8a5d53 100%)'

function Panel({ icon, num }: { icon: string; num: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  // Drift the inner artwork as the panel crosses the viewport (start→end pass).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['-7%', '7%'])

  return (
    <div
      ref={ref}
      className="group/panel relative aspect-[4/3] w-full overflow-hidden rounded-lg ring-1 ring-black/5 sm:aspect-square"
      style={{ background: OBJECT_GRADIENT }}
    >
      {/* warm peach glow — the light cast by the pad's interior dots */}
      <div className="pointer-events-none absolute inset-0" style={{ background: WARM_GLOW }} />
      {/* faint dot texture, fading toward the edges */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.10) 1px, transparent 1.4px)',
          backgroundSize: '22px 22px',
          maskImage: 'radial-gradient(80% 80% at 50% 50%, #000 30%, transparent 78%)',
          WebkitMaskImage: 'radial-gradient(80% 80% at 50% 50%, #000 30%, transparent 78%)',
        }}
      />
      {/* parallax artwork: a frosted tile holding the service glyph */}
      <motion.div style={{ y }} className="absolute inset-0 grid place-items-center">
        <span className="grid h-[clamp(88px,18vw,116px)] w-[clamp(88px,18vw,116px)] place-items-center rounded-lg bg-white/10 ring-1 ring-white/15 backdrop-blur-sm transition-transform duration-500 ease-apple group-hover/panel:scale-[1.06]">
          <Icon name={icon} size={48} className="text-white" />
        </span>
      </motion.div>
      {/* bottom vignette for depth */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'linear-gradient(180deg, transparent 55%, rgba(0,0,0,0.28) 100%)' }}
      />
      {/* corner index */}
      <span className="absolute left-5 top-4 font-display text-[12px] font-medium tracking-[0.18em] text-white/45">
        {num}
      </span>
    </div>
  )
}

function ShowcaseRow({ item, index }: { item: Subservice; index: number }) {
  const flip = index % 2 === 1
  const num = String(index + 1).padStart(2, '0')
  return (
    <div className="grid items-center gap-9 sm:gap-12 lg:grid-cols-2 lg:gap-16 xl:gap-20">
      {/* ── Visual (always first in DOM → sits on top when stacked on mobile) ── */}
      <Reveal y={26} className={cn(flip && 'lg:order-2')}>
        <Panel icon={item.icon} num={num} />
      </Reveal>

      {/* ── Copy ──────────────────────────────────────────────────────────── */}
      <Reveal y={26} delay={0.08} className={cn(flip && 'lg:order-1')}>
        <p className="font-display text-[13px] tracking-[0.06em] text-ink-muted48">//&nbsp;{num}</p>
        {/* heading wears the sampled "Imprint Core" wordmark gradient (sage→brown) */}
        <h3
          className="display-caps mt-4 w-fit text-[clamp(26px,5.6vw,38px)]"
          style={{
            backgroundImage: WORDMARK_GRADIENT,
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {item.title}
        </h3>
        <p className="mt-5 max-w-md text-body-lg text-ink-muted80">{item.desc}</p>

        {item.tech && (
          <div className="mt-6 flex flex-wrap gap-2">
            {item.tech.map((t) => (
              <span
                key={t}
                className="rounded-pill border border-hairline bg-pearl px-2.5 py-1 text-fine text-ink-muted48"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <Link
          to="/contact"
          aria-label={`Learn more about ${item.title}`}
          className="group/link mt-7 inline-flex items-center gap-1.5 text-body-lg font-medium text-primary"
        >
          <span className="border-b border-primary/35 pb-0.5 transition-colors group-hover/link:border-primary">
            Learn more
          </span>
          <Icon
            name="arrow"
            size={17}
            className="transition-transform duration-300 ease-apple group-hover/link:translate-x-1"
          />
        </Link>
      </Reveal>
    </div>
  )
}

export default function SubserviceShowcase({ items }: { items: Subservice[] }) {
  return (
    <div className="space-y-16 sm:space-y-24 lg:space-y-28">
      {items.map((item, i) => (
        <ShowcaseRow key={item.title} item={item} index={i} />
      ))}
    </div>
  )
}
