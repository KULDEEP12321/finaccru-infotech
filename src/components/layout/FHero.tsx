import { useEffect, useRef, useState } from 'react'
import { Button, Eyebrow } from '@/components/ui/primitives'
import AriaHero from '@/components/layout/AriaHero'

// ── FHero — Podium-style "enter the logo" aperture, adapted to a capital F ───────
//
// Mechanism (chosen for CRISPNESS at huge zoom + integration simplicity):
//   • A tall scroll-track wraps a `sticky top-0 h-screen` stage.
//   • Behind everything sits <WorkMontage/> — a plain-DOM "our work" scene.
//   • OVER it sits ONE full-viewport <svg> painted SOLID PARCHMENT except an
//     F-shaped window, punched via a luminance <mask> (white rect = keep parchment,
//     black F = remove → montage shows through). The F is a real VECTOR path, so it
//     stays razor-crisp at any zoom (a raster mask would pixelate when zoomed THROUGH).
//
// Why we scale ONLY the black F (the load-bearing fact, per review):
//   Scaling the whole overlay just makes a bigger F on a bigger sheet and NEVER
//   engulfs. Instead we PIN the rect to the viewport and grow ONLY the F about the
//   stem midline. Engulf is reached when the scaled stem covers the viewport's
//   farthest edge — computed live below (aspect-correct), so it works on any screen.
//   We also crossfade the field parchment → the montage's own dark (#272729) so the
//   thin arm gaps dissolve invisibly, and drop the overlay before the page hands off.

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// ── F geometry, in a 1000×1000 square viewBox ──────────────────────────────────
// Stem x[400,500] (so half-width 50 about the midline), top arm to x690, mid arm to x640.
const VB = 1000
const F_D = 'M400 230 H690 V320 H500 V450 H640 V530 H500 V770 H400 Z'
const CX = 450 // grow about the stem MIDLINE (symmetric → no drift)
const CY = 500
const STEM_HALF = 50 // stem half-width in viewBox units (drives the engulf scale)

// ── Responsive F sizing ─────────────────────────────────────────────────────────
// The viewBox is `slice`-fit, so a native-size F scales with the LONGER viewport
// edge: it balloons on wide / 16:9 monitors (and clips on ultrawide) and crowds the
// copy on phones & portrait tablets. Instead we size the F to a target fraction of
// viewport HEIGHT — consistent on every device — and choose the layout by width:
//   • COMPACT (width < WIDE_BP): a small F as a centred badge, lifted into the upper
//     area, with the copy in a clean band below it (phones, portrait tablets, narrow
//     windows, short landscape tablets).
//   • WIDE   (width ≥ WIDE_BP): a large F centred on screen with the copy beside it
//     on the left (laptops & monitors), capped at WIDE_H of the height so it never
//     bleeds off the top/bottom.
// The engulf dive is untouched — the F still grows from this resting size to sEnd.
const F_H = 540 // F path height in viewBox units (y230 → y770)
const PHONE_BP = 640 // < this width the copy stacks in a full-width band below the F
const WIDE_BP = 1280 // ≥ this width the copy fits beside the F → wide layout
const COMPACT_H = 0.324 // resting F height as a fraction of viewport height (compact)
const COMPACT_CENTER = 0.325 // F vertical centre as a fraction of height (tablet)
const WIDE_H = 0.85 // max F height as a fraction of viewport height (wide)
const NAV_H = 69 // sticky navbar height (px); the stage sits below it at scroll 0
// Phone: how far (px) up from the viewport bottom the copy block reaches. The F is
// centred in the band between the navbar and this line, so the gaps above and below
// it match on every phone height. Larger when the two CTAs wrap to a second row.
const CTA_WRAP_BP = 405 // < this width the two CTAs wrap → taller copy block
const COPY_EXTENT_1ROW = 192 // px bottom→copy-top with the CTAs side by side
const COPY_EXTENT_2ROW = 247 // px bottom→copy-top with the CTAs stacked

// Per-frame smoothing for the scrub. The displayed progress eases toward the
// scroll-derived target instead of snapping to it, so the dive glides — buttery
// on smooth wheel, and crucially un-janky on coarse/touch scroll (where Lenis
// doesn't smooth). The dive runs on EVERY device (reduced-motion included).
const SMOOTH = 0.16

export default function FHero() {
  const trackRef = useRef<HTMLElement>(null)
  const fRef = useRef<SVGGElement>(null) // <g> wrapping ONLY the F subpath (scaled per frame)
  const rectRef = useRef<SVGRectElement>(null) // parchment field (crossfades → dark)
  const overlayRef = useRef<SVGSVGElement>(null) // the whole svg overlay (dropped at the end)
  const montageRef = useRef<HTMLDivElement>(null) // montage layer (settle + brighten)
  const copyRef = useRef<HTMLDivElement>(null) // hero copy + scroll hint (fades out first)
  const divedRef = useRef(false) // latch: have we engulfed past the reveal point?
  const pSmoothRef = useRef(0) // eased scrub progress (lags the raw scroll target)
  const firstRef = useRef(true) // snap (don't ease) on the very first frame

  // Flips true once the F has engulfed enough to "land" inside AriaHero — drives
  // its typewriter + pill reveal so they fire on arrival, not on page load.
  const [dived, setDived] = useState(false)

  // ── Single rAF loop, Lenis-synced via getBoundingClientRect (not scroll events) ─
  useEffect(() => {
    let raf = 0

    // Cheap OUTER gate: once the hero is well offscreen we must not keep calling
    // getBoundingClientRect() every frame (a forced synchronous layout that would
    // otherwise tax the main thread at refresh rate for the entire rest of the
    // page). An IntersectionObserver flips this flag; the precise per-frame
    // `r.bottom>0 && r.top<innerHeight` test below still governs ALL visual work,
    // so the dive is byte-identical whenever the hero is near/in view. The 400px
    // rootMargin wakes the loop slightly before the section actually enters, so
    // the precise gate is always live in time — no missed edge frames.
    let nearView = true

    // parchment #f5f5f7 → dark tile #272729 (== WorkMontage bg, so slivers vanish)
    const F5 = [0xf5, 0xf5, 0xf7]
    const DK = [0x27, 0x27, 0x29]
    const mixField = (t: number) =>
      `rgb(${(lerp(F5[0], DK[0], t) | 0)},${(lerp(F5[1], DK[1], t) | 0)},${(lerp(F5[2], DK[2], t) | 0)})`

    const tick = () => {
      const t = nearView ? trackRef.current : null
      if (t) {
        const r = t.getBoundingClientRect()
        // Offscreen early-out: skip all layout writes when the hero isn't visible.
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const denom = r.height - window.innerHeight
          const pTarget = denom > 0 ? clamp(-r.top / denom, 0, 1) : 0
          // Ease the displayed progress toward the scroll target (snap on frame 1)
          // so the dive glides instead of snapping — smooth even on touch scroll.
          if (firstRef.current) {
            pSmoothRef.current = pTarget
            firstRef.current = false
          } else {
            pSmoothRef.current += (pTarget - pSmoothRef.current) * SMOOTH
          }
          const p = pSmoothRef.current
          const sp = clamp(p / 0.85, 0, 1) // finish the meaningful growth by p=0.85
          const e = ease(sp)

          // Latch the reveal once we're meaningfully "inside" the F (one setState).
          if (!divedRef.current && p > 0.5) {
            divedRef.current = true
            setDived(true)
          }

          // ── Aspect-correct engulf scale ───────────────────────────────────────
          // viewBox is cover-fit ("slice"): 1 unit = u px, u = max(w,h)/VB, centred.
          const w = window.innerWidth
          const h = window.innerHeight
          const u = Math.max(w, h) / VB
          const originX = w / 2 + (CX - 500) * u // growth origin in px
          const dxPx = Math.max(originX, w - originX) // farthest horizontal edge
          // scaled stem half-width (STEM_HALF*u*S) must reach dxPx, + margin
          const sEnd = Math.max(6, (dxPx / (STEM_HALF * u)) * 1.25)

          // ── Responsive resting size + position (see constants above) ──────────
          // Height-targeted so the F is a consistent fraction of the viewport on
          // every device; the dive still grows from `base` to the SAME sEnd.
          const compact = w < WIDE_BP
          let targetH = WIDE_H
          let centerFrac = 0.5
          if (w < PHONE_BP) {
            // Phone: the copy stacks in a band BELOW the F. Centre the F in the band
            // between the navbar and the copy's top so the gaps above and below it
            // match at any phone height (no big void on tall phones); on short phones
            // the band shrinks, so the F shrinks too and can't hit the copy.
            const copyExtent = w < CTA_WRAP_BP ? COPY_EXTENT_2ROW : COPY_EXTENT_1ROW
            const band = Math.max(0, h - NAV_H - copyExtent)
            targetH = Math.min(COMPACT_H, (band * 0.6) / h)
            centerFrac = band / (2 * h)
          } else if (compact) {
            // Tablet / narrow window: copy sits bottom-left, clear of the centred F.
            targetH = COMPACT_H
            centerFrac = COMPACT_CENTER
          }
          const base = Math.min(1, (targetH * h) / (F_H * u)) // never enlarge past native
          const rise = ((0.5 - centerFrac) * h) / u // viewBox units the F lifts upward
          const S = lerp(base, sEnd, e)

          // Scale ONLY the F subpath about (CX,CY). The translate/scale/translate
          // triple encodes the origin (CSS transform-origin is ignored for the SVG
          // `transform` ATTRIBUTE, so we don't set it).
          if (fRef.current) {
            const pre = rise > 0.5 ? `translate(0 ${-rise.toFixed(1)}) ` : ''
            fRef.current.setAttribute(
              'transform',
              `${pre}translate(${CX} ${CY}) scale(${S}) translate(${-CX} ${-CY})`
            )
          }
          // Field parchment → dark (done by ~p=0.62) so arm gaps dissolve.
          if (rectRef.current) {
            rectRef.current.setAttribute('fill', mixField(clamp((p - 0.08) / 0.54, 0, 1)))
          }
          // Montage settles + brightens as you arrive "inside" the F.
          if (montageRef.current) {
            montageRef.current.style.transform = `scale(${lerp(1.12, 1, e)})`
            montageRef.current.style.filter = `brightness(${lerp(0.86, 1, e)})`
          }
          // Hero copy clears out first.
          if (copyRef.current) {
            copyRef.current.style.opacity = String(clamp(1 - p / 0.22, 0, 1))
            copyRef.current.style.pointerEvents = p > 0.28 ? 'none' : 'auto'
          }
          // Drop the overlay once the window owns the screen → clean handoff.
          if (overlayRef.current) {
            overlayRef.current.style.opacity = String(1 - clamp((p - 0.8) / 0.08, 0, 1))
            overlayRef.current.style.display = p > 0.9 ? 'none' : 'block'
          }
        }
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    // Drive the outer gate. Default-true above means it works before the first
    // IO callback fires (the hero is at the very top, on screen at load).
    let io: IntersectionObserver | undefined
    const trackEl = trackRef.current
    if (trackEl && typeof IntersectionObserver !== 'undefined') {
      io = new IntersectionObserver(([entry]) => { nearView = entry.isIntersecting }, {
        rootMargin: '400px 0px',
      })
      io.observe(trackEl)
    }

    return () => {
      cancelAnimationFrame(raf)
      if (io) io.disconnect()
    }
  }, [])

  // ── F window SVG (shared by both branches) ─────────────────────────────────────
  const windowSvg = (
    <svg
      ref={overlayRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${VB} ${VB}`}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <filter id="pebbleBlur" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="26" />
        </filter>
        <mask id="fWindow" maskUnits="userSpaceOnUse" x="0" y="0" width={VB} height={VB}>
          <rect x="0" y="0" width={VB} height={VB} fill="white" />
          <g ref={fRef}>
            <path d={F_D} fill="black" />
          </g>
        </mask>
      </defs>
      <g mask="url(#fWindow)">
        <rect ref={rectRef} x="0" y="0" width={VB} height={VB} fill="#f5f5f7" />
        {/* soft 'pebble' blobs OUTSIDE the F, clipped to the field */}
        <circle cx="150" cy="220" r="70" fill="#1d1d1f" opacity="0.10" filter="url(#pebbleBlur)" />
        <circle cx="845" cy="360" r="95" fill="#0066cc" opacity="0.12" filter="url(#pebbleBlur)" />
        <circle cx="760" cy="800" r="80" fill="#1d1d1f" opacity="0.08" filter="url(#pebbleBlur)" />
      </g>
    </svg>
  )

  // Copy sits BOTTOM-LEFT on the parchment (Podium-style) so it never lands
  // unreadable over the dark F window; the scroll hint sits bottom-right.
  const copyBlock = (
    // The sticky stage is h-[100dvh] but sits BELOW the 68px sticky navbar in flow,
    // so at scroll 0 its bottom overflows ~68px past the visible viewport — bottom-
    // anchored content must clear that offset or it's clipped. Both breakpoints add
    // NAV_H to the desired visible gap: mobile bottom-24 (96px → 28px gap, extra room
    // for wrapped CTAs); desktop sm:bottom-[124px] (68px navbar + 56px gap). Earlier
    // sm:bottom-14 (56px < 68px) left the "Start a project" CTA cut off at the bottom.
    <div className="absolute bottom-24 left-6 right-6 max-w-none text-left sm:bottom-[124px] sm:left-12 sm:right-auto sm:max-w-md">
      <Eyebrow className="mb-3">A ProtechPlanner company · Software &amp; IT</Eyebrow>
      <h1 className="display-caps text-[26px] text-ink sm:text-[46px]">
        We build the software your business runs on.
      </h1>
      <div className="pointer-events-auto mt-6 flex flex-wrap gap-3">
        <Button to="/contact">Start a project</Button>
        <Button to="/services" variant="ghost">
          Explore services
        </Button>
      </div>
    </div>
  )

  const scrollHint = (
    // Desktop-only (sm:flex). bottom-[116px] = 68px navbar overflow + 48px visible gap,
    // so the hint clears the same overflow as the copy block (was bottom-12 → clipped).
    <div className="absolute bottom-[116px] right-6 hidden flex-col items-center gap-2 sm:right-12 sm:flex">
      <span className="label-caps text-[11px] tracking-[0.16em] text-ink-muted48">
        Scroll into the F
      </span>
      <span className="block h-9 w-[1.5px] animate-pulse bg-ink-muted48/60" />
    </div>
  )

  return (
    // Tall scroll-track; the stage inside is sticky for the scrubbed aperture dive.
    <section ref={trackRef} className="relative bg-parchment" style={{ height: '260vh' }}>
      {/* h-[100dvh] (not h-screen/100vh): on mobile the browser chrome eats into
          100vh, so a bottom-anchored copy block lands behind it and clips the CTAs.
          dvh tracks the VISIBLE viewport; on desktop dvh == vh (byte-identical). */}
      <div className="sticky top-0 h-[100dvh] overflow-hidden bg-parchment">
        {/* 1 — the cinematic AriaHero scene, visible ONLY through the F window */}
        <div ref={montageRef} className="absolute inset-0 will-change-transform">
          <AriaHero active={dived} />
        </div>

        {/* 2 — parchment overlay with the crisp F window punched out */}
        {windowSvg}

        {/* 3 — hero copy (bottom-left) + scroll hint (bottom-right), clears first */}
        <div ref={copyRef} className="pointer-events-none absolute inset-0">
          {copyBlock}
          {scrollHint}
        </div>
      </div>
    </section>
  )
}
