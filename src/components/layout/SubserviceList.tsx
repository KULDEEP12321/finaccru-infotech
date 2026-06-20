import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icons'
import type { Subservice } from '@/lib/site-content'

// SubserviceList — the newgenre.studio/services hover-reveal pattern, rebuilt on
// Finaccru's design tokens, tuned for every screen.
//
// The reference (https://newgenre.studio/services, the "Strategy" block) renders
// each sub-service as a quiet row on a hairline-ruled list. On hover a small
// solid dot fades in to the LEFT of the label, the label nudges right to make
// room, and a preview image fades in — absolutely positioned to the right and
// just below the cursor's row, floating OVER the rows beneath. The list itself
// never reflows; only the floating preview and the dot move. (Measured straight
// off the live site: row padding 32px 0, 8px dot gap, 16px ink dot in a 20px
// slot, ~512×288 16:9 preview at offset dx≈+399 / dy≈+87, 1px cool-grey rule.)
//
// Finaccru has no per-service photography, so the floating "image" is the brand
// "Imprint Core" tile already used by SubserviceTabs — a blue field with a warm
// glow behind a frosted icon plate — crossfading its content as you move between
// rows.
//
// ── Mode is chosen by CAPABILITY, not raw width ─────────────────────────────
// • 'hover'  — a real pointer AND room (hover:hover + pointer:fine + ≥1024px):
//   the right-hand floating tile glides to and crossfades the hovered row.
// • 'scroll' — anything else (phones, AND touch tablets like iPad landscape that
//   are ≥1024px but cannot hover): the row nearest the viewport centre becomes
//   active and its Core preview rides up as a pinned bar at the BOTTOM of the
//   screen, crossfading as you scroll and sliding away once the section leaves
//   the centre band.
// Only the active mode's elements are mounted, so there is never a hidden fixed
// bar on desktop nor an unreachable hover tile on touch.
//
// Cost discipline for all screens:
// • The breathing Core glows only animate while their card is actually shown
//   (hovered / barShown) — no perpetual blur compositing at rest.
// • The scroll tracker measures via getBoundingClientRect on scroll/resize,
//   coalesced to one rAF per frame and gated by an IntersectionObserver, so it
//   does zero work while idle or while the section is off-screen. Reading live
//   layout (not scrollY) keeps it correct under Lenis without scroll-event lag.

// ── Brand "Core" field — colour-sampled from the Imprint Core render, identical
//    to SubserviceTabs so the two presentations stay visually of a piece. ──────
const FIELD_GRADIENT =
  'linear-gradient(150deg, #6ba6db 0%, #36608f 26%, #182f53 58%, #050f22 100%)'
const WARM_GLOW =
  'radial-gradient(circle, rgba(243,226,214,0.9) 0%, rgba(232,180,140,0.5) 38%, rgba(232,180,140,0) 70%)'
const COOL_GLOW =
  'radial-gradient(circle, rgba(125,185,232,0.6) 0%, rgba(125,185,232,0) 70%)'

const EASE = [0.28, 0.11, 0.32, 1] as const

// Breathing glows shared by the desktop tile and the mobile bar. They only run
// while `playing` so an at-rest (hidden) card costs nothing to composite.
function CoreGlows({ playing }: { playing: boolean }) {
  return (
    <>
      {/* cool sky-blue highlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-[15%] -top-[30%] h-[120%] w-[60%] rounded-full blur-2xl"
        style={{ backgroundImage: COOL_GLOW }}
        animate={playing ? { opacity: [0.45, 0.7, 0.45], scale: [1, 1.08, 1] } : { opacity: 0.5, scale: 1 }}
        transition={playing ? { duration: 9, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
      />
      {/* warm cream glow — the Core signature */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[140%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-2xl"
        style={{ backgroundImage: WARM_GLOW }}
        animate={playing ? { opacity: [0.55, 0.9, 0.55], scale: [0.9, 1.12, 0.9] } : { opacity: 0.7, scale: 1 }}
        transition={playing ? { duration: 6.5, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
      />
    </>
  )
}

// The desktop floating tile's crossfading content layer (one per active row).
function PreviewContent({ item, num }: { item: Subservice; num: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 1.03 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.99 }}
      transition={{ duration: 0.4, ease: EASE }}
      className="absolute inset-0 z-10 flex flex-col items-center justify-center px-8 text-center"
    >
      <motion.span
        className="grid h-16 w-16 place-items-center rounded-[18px] bg-white/[0.13] text-white ring-1 ring-white/30 backdrop-blur-md"
        style={{ boxShadow: '0 10px 34px rgba(5,15,34,0.45)' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon name={item.icon} size={30} />
      </motion.span>
      <h3
        className="display-caps mt-5 max-w-[16ch] text-[clamp(18px,1.6vw,22px)] leading-tight text-white"
        style={{ textShadow: '0 1px 14px rgba(5,15,34,0.35)' }}
      >
        {item.title}
      </h3>
      {item.tech && (
        <div className="mt-4 flex max-w-[22ch] flex-wrap justify-center gap-1.5">
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

export default function SubserviceList({ items }: { items: Subservice[] }) {
  // 'hover' is the SSR/first-paint default; the only mode-specific visible
  // elements are invisible at rest, so correcting to 'scroll' on mount never
  // flashes. Hydration matches because the first client render also uses 'hover'.
  const [mode, setMode] = useState<'hover' | 'scroll'>('hover')

  // Desktop hover. `active` = hovered/focused row; lastRef keeps the tile showing
  // the right content while it fades out.
  const [active, setActive] = useState<number | null>(null)
  const [previewY, setPreviewY] = useState(0)
  const lastRef = useRef(0)
  const listRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  // Mobile scroll-driven state.
  const [scrollIdx, setScrollIdx] = useState<number | null>(null)
  const [barShown, setBarShown] = useState(false)
  const rowRefs = useRef<(HTMLDivElement | null)[]>([])

  if (active !== null) lastRef.current = active
  const shownIndex = active ?? lastRef.current
  const shown = items[shownIndex] ?? items[0]
  const open = active !== null

  const mobileIndex = scrollIdx ?? 0
  const mobileItem = items[mobileIndex] ?? items[0]

  // Pick the mode from device capability + width.
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 1024px)')
    const apply = () => setMode(mq.matches ? 'hover' : 'scroll')
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // Glide the desktop tile so it sits centred on the active row, clamped inside
  // the list so the last rows don't push it past the bottom edge.
  const point = (i: number, el: HTMLElement) => {
    if (mode !== 'hover') return
    setActive(i)
    const listH = listRef.current?.offsetHeight ?? 0
    const previewH = previewRef.current?.offsetHeight ?? 240
    const center = el.offsetTop + el.offsetHeight / 2 - previewH / 2
    setPreviewY(Math.min(Math.max(center, 0), Math.max(listH - previewH, 0)))
  }

  // Scroll mode: track the row nearest the viewport centre. Measures live layout
  // on scroll/resize (coalesced to one rAF/frame), gated by IntersectionObserver
  // so it idles when off-screen and never runs in hover mode.
  useEffect(() => {
    if (mode !== 'scroll') {
      setBarShown(false)
      return
    }
    const listEl = listRef.current
    if (!listEl) return
    let frame = 0
    let attached = false

    const measure = () => {
      frame = 0
      const vh = window.innerHeight
      const mid = vh / 2
      const rows = rowRefs.current
      let best = 0
      let bestDist = Infinity
      for (let i = 0; i < rows.length; i++) {
        const el = rows[i]
        if (!el) continue
        const r = el.getBoundingClientRect()
        const dist = Math.abs(r.top + r.height / 2 - mid)
        if (dist < bestDist) {
          bestDist = dist
          best = i
        }
      }
      const lr = listEl.getBoundingClientRect()
      setScrollIdx(best)
      setBarShown(lr.top < vh * 0.7 && lr.bottom > vh * 0.3)
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(measure)
    }
    const attach = () => {
      if (attached) return
      attached = true
      window.addEventListener('scroll', schedule, { passive: true })
      window.addEventListener('resize', schedule)
    }
    const detach = () => {
      if (!attached) return
      attached = false
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }

    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        attach()
        measure()
      } else {
        detach()
        setBarShown(false)
      }
    })
    io.observe(listEl)

    return () => {
      io.disconnect()
      detach()
      if (frame) cancelAnimationFrame(frame)
    }
  }, [mode, items.length])

  return (
    <div ref={listRef} className="relative">
      {/* ── The list ─────────────────────────────────────────────────────── */}
      <div
        onMouseLeave={() => setActive(null)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node)) setActive(null)
        }}
      >
        {items.map((item, i) => {
          const on = mode === 'hover' ? active === i : barShown && scrollIdx === i
          return (
            <Link
              key={item.title}
              to="/contact"
              aria-label={`Learn more about ${item.title}`}
              onMouseEnter={(e) => point(i, e.currentTarget)}
              onFocus={(e) => point(i, e.currentTarget)}
              className="group block border-t border-hairline last:border-b"
            >
              {/* pr in hover mode reserves the right-hand zone the floating tile
                  occupies, so a long uppercase title can never slide under it. */}
              <div
                ref={(el) => {
                  rowRefs.current[i] = el
                }}
                className="flex items-center py-6 lg:py-8 lg:pr-[clamp(360px,34vw,480px)]"
              >
                {/* Dot slot — collapsed to 0 width until active, so the label
                    nudges right as the dot fades + scales in. */}
                <motion.span
                  aria-hidden
                  className="block overflow-hidden"
                  initial={false}
                  animate={{ width: on ? 24 : 0 }}
                  transition={{ duration: 0.32, ease: EASE }}
                >
                  <motion.span
                    className="block h-2.5 w-2.5 rounded-pill bg-ink"
                    initial={false}
                    animate={{ opacity: on ? 1 : 0, scale: on ? 1 : 0.2 }}
                    transition={{ duration: 0.32, ease: EASE }}
                  />
                </motion.span>

                <h3 className="display-caps text-[20px] leading-tight text-ink sm:text-[24px] lg:text-[26px]">
                  {item.title}
                </h3>
              </div>
            </Link>
          )
        })}
      </div>

      {/* ── Desktop floating tile — mounted only in hover mode. ───────────── */}
      {mode === 'hover' && (
        <motion.div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none absolute right-0 z-20 w-[clamp(320px,32vw,420px)]"
          initial={false}
          animate={{
            top: previewY,
            opacity: open ? 1 : 0,
            scale: open ? 1 : 0.97,
            y: open ? 0 : 8,
          }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <div
            className="relative aspect-[4/3] w-full overflow-hidden rounded-lg shadow-product ring-1 ring-black/5"
            style={{ backgroundImage: FIELD_GRADIENT }}
          >
            <CoreGlows playing={open} />
            <AnimatePresence mode="wait">
              <PreviewContent
                key={shownIndex}
                item={shown}
                num={String(shownIndex + 1).padStart(2, '0')}
              />
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* ── Mobile bottom bar — mounted only in scroll mode; rides up when the
            section hits the centre band, crossfading the centred row. ─────── */}
      {mode === 'scroll' && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed inset-x-0 bottom-0 z-30 px-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
          initial={false}
          animate={{ y: barShown ? 0 : 140, opacity: barShown ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        >
          <div
            className="relative mx-auto max-w-md overflow-hidden rounded-lg shadow-product ring-1 ring-black/10"
            style={{ backgroundImage: FIELD_GRADIENT }}
          >
            <CoreGlows playing={barShown} />
            <AnimatePresence mode="wait">
              <motion.div
                key={mobileIndex}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, ease: EASE }}
                className="relative z-10 flex items-center gap-4 p-4"
              >
                <span
                  className="grid h-14 w-14 shrink-0 place-items-center rounded-[16px] bg-white/[0.13] text-white ring-1 ring-white/30 backdrop-blur-md"
                  style={{ boxShadow: '0 8px 24px rgba(5,15,34,0.4)' }}
                >
                  <Icon name={mobileItem.icon} size={26} />
                </span>
                <div className="min-w-0">
                  <h3
                    className="display-caps text-[15px] leading-tight text-white"
                    style={{ textShadow: '0 1px 12px rgba(5,15,34,0.35)' }}
                  >
                    {mobileItem.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-fine leading-snug text-white/75">
                    {mobileItem.desc}
                  </p>
                </div>
                <span className="ml-auto self-start font-display text-[11px] font-medium tracking-[0.18em] text-white/40">
                  {String(mobileIndex + 1).padStart(2, '0')}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  )
}
