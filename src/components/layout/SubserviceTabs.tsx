import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icons'
import { cn } from '@/lib/cn'
import type { Subservice } from '@/data/site'

// SubserviceTabs — the "Imprint Technology" tabbed pattern (imprint.co, the
// "Built for impact, every step of the way." block): a row of selectable tabs
// on the left, with a crossfading copy paragraph beneath them and a crossfading
// brand visual on the right. Clicking a tab swaps both the visual and the
// paragraph together, exactly like the reference.
//
// This is an ALTERNATE presentation of the same `subservices` data that
// SubserviceShowcase renders as alternating rows — added alongside it (not in
// place of it) so the two layouts can be compared side by side.
//
// The right-hand visual reproduces the Imprint "Core" object look, colour-
// sampled straight from the reference render: a blue field that runs from a
// bright sky-blue corner (rgb 105 167 221) into deep navy (rgb 4 15 34), with a
// warm cream glow (rgb 242 226 222) breathing behind a frosted-glass tile that
// holds the active sub-service's icon. The glow pulses and the tile floats, so
// the panel feels alive even between tab changes. No new image assets needed.

// Sampled straight from the Imprint Core pad render (see colour notes above).
const FIELD_GRADIENT =
  'linear-gradient(150deg, #6ba6db 0%, #36608f 26%, #182f53 58%, #050f22 100%)'
const WARM_GLOW =
  'radial-gradient(circle, rgba(243,226,214,0.9) 0%, rgba(232,180,140,0.5) 38%, rgba(232,180,140,0) 70%)'
const COOL_GLOW =
  'radial-gradient(circle, rgba(125,185,232,0.6) 0%, rgba(125,185,232,0) 70%)'

const EASE = [0.28, 0.11, 0.32, 1] as const

// One crossfading content layer: floating frosted tile + icon, title, tech pills.
function Visual({
  item,
  num,
}: {
  item: Subservice
  num: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.span
        className="grid h-20 w-20 place-items-center rounded-[22px] bg-white/[0.13] text-white ring-1 ring-white/30 backdrop-blur-md max-sm:h-16 max-sm:w-16"
        style={{ boxShadow: '0 10px 34px rgba(5,15,34,0.45)' }}
        animate={{ y: [0, -7, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon name={item.icon} size={34} />
      </motion.span>
      <h3
        className="display-caps mt-6 max-w-[18ch] text-[clamp(20px,2.4vw,26px)] leading-tight text-white"
        style={{ textShadow: '0 1px 14px rgba(5,15,34,0.35)' }}
      >
        {item.title}
      </h3>
      {item.tech && (
        <div className="mt-5 flex max-w-[24ch] flex-wrap justify-center gap-1.5">
          {item.tech.slice(0, 4).map((t) => (
            <span
              key={t}
              className="rounded-pill border border-white/25 bg-white/[0.06] px-2.5 py-1 text-fine text-white/75 backdrop-blur-sm"
            >
              {t}
            </span>
          ))}
        </div>
      )}
      <span className="absolute left-5 top-4 font-display text-[12px] font-medium tracking-[0.18em] text-white/45">
        {num}
      </span>
    </motion.div>
  )
}

export default function SubserviceTabs({ items }: { items: Subservice[] }) {
  const [active, setActive] = useState(0)
  const item = items[active] ?? items[0]
  const num = String(active + 1).padStart(2, '0')

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,460px)] lg:gap-16 xl:gap-20">
      {/* ── Copy column: tabs → crossfading paragraph → learn more ───────── */}
      <div className="order-2 lg:order-1">
        {/* Tab row — active tab wears a white pill, inactive are muted labels.
            Wraps to multiple lines on narrow widths so long titles stay legible. */}
        <div role="tablist" aria-label="Capabilities" className="-mx-1 flex flex-wrap gap-1">
          {items.map((s, i) => {
            const on = i === active
            return (
              <button
                key={s.title}
                role="tab"
                aria-selected={on}
                onClick={() => setActive(i)}
                className={cn(
                  'rounded-[8px] px-3 py-2 text-[13px] font-medium tracking-[0.02em] transition-colors duration-200',
                  on
                    ? 'bg-white text-ink shadow-[0_1px_3px_rgba(12,33,71,0.08)] ring-1 ring-black/[0.06]'
                    : 'text-ink-muted48 hover:text-ink',
                )}
              >
                {s.title}
              </button>
            )
          })}
        </div>

        {/* Crossfading paragraph — swaps with the active tab. min-h keeps the
            "Learn more" link from jumping as copy length changes. */}
        <div className="relative mt-8 min-h-[5.5rem] max-w-md">
          <AnimatePresence mode="wait">
            <motion.p
              key={active}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: EASE }}
              className="text-body-lg text-ink-muted80"
            >
              {item.desc}
            </motion.p>
          </AnimatePresence>
        </div>

        <Link
          to="/contact"
          aria-label={`Learn more about ${item.title}`}
          className="group/link mt-2 inline-flex items-center gap-1.5 text-body-lg font-medium text-primary"
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
      </div>

      {/* ── Visual column: Imprint "Core" field — blue gradient + warm glow ── */}
      <div className="order-1 lg:order-2">
        <div
          className="relative mx-auto aspect-[4/3] w-full max-w-[460px] overflow-hidden rounded-[15px] ring-1 ring-black/5 sm:aspect-square"
          style={{ backgroundImage: FIELD_GRADIENT }}
        >
          {/* cool sky-blue highlight, top-left corner (breathes) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-[15%] -top-[18%] h-[75%] w-[75%] rounded-full blur-2xl"
            style={{ backgroundImage: COOL_GLOW }}
            animate={{ opacity: [0.45, 0.7, 0.45], scale: [1, 1.08, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          />
          {/* warm cream glow behind the tile — the Imprint Core signature (pulses) */}
          <motion.div
            aria-hidden
            className="pointer-events-none absolute left-1/2 top-[40%] h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
            style={{ backgroundImage: WARM_GLOW }}
            animate={{ opacity: [0.55, 0.9, 0.55], scale: [0.9, 1.12, 0.9] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
          />

          <AnimatePresence>
            <Visual key={active} item={item} num={num} />
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
