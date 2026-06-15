import { useEffect, useRef, useState } from 'react'
import { Button, Eyebrow } from './primitives.jsx'
import AriaHero from './AriaHero.jsx'

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

const clamp = (v, a, b) => Math.min(b, Math.max(a, v))
const lerp = (a, b, t) => a + (b - a) * t
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)

// ── F geometry, in a 1000×1000 square viewBox ──────────────────────────────────
// Stem x[400,500] (so half-width 50 about the midline), top arm to x690, mid arm to x640.
const VB = 1000
const F_D = 'M400 230 H690 V320 H500 V450 H640 V530 H500 V770 H400 Z'
const CX = 450 // grow about the stem MIDLINE (symmetric → no drift)
const CY = 500
const STEM_HALF = 50 // stem half-width in viewBox units (drives the engulf scale)

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

export default function FHero() {
  const trackRef = useRef(null)
  const fRef = useRef(null) // <g> wrapping ONLY the F subpath (scaled per frame)
  const rectRef = useRef(null) // parchment field (crossfades → dark)
  const overlayRef = useRef(null) // the whole svg overlay (dropped at the end)
  const montageRef = useRef(null) // montage layer (settle + brighten)
  const copyRef = useRef(null) // hero copy + scroll hint (fades out first)
  const divedRef = useRef(false) // latch: have we engulfed past the reveal point?

  // Initialise synchronously so the first render is already correct (no flash).
  const [reduced, setReduced] = useState(prefersReduced)
  // Flips true once the F has engulfed enough to "land" inside AriaHero — drives
  // its typewriter + pill reveal so they fire on arrival, not on page load.
  const [dived, setDived] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    if (!mq) return
    const apply = () => setReduced(mq.matches)
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  // ── Single rAF loop, Lenis-synced via getBoundingClientRect (not scroll events) ─
  useEffect(() => {
    if (reduced) return
    let raf = 0

    // parchment #f5f5f7 → dark tile #272729 (== WorkMontage bg, so slivers vanish)
    const F5 = [0xf5, 0xf5, 0xf7]
    const DK = [0x27, 0x27, 0x29]
    const mixField = (t) =>
      `rgb(${(lerp(F5[0], DK[0], t) | 0)},${(lerp(F5[1], DK[1], t) | 0)},${(lerp(F5[2], DK[2], t) | 0)})`

    const tick = () => {
      const t = trackRef.current
      if (t) {
        const r = t.getBoundingClientRect()
        // Offscreen early-out: skip all layout writes when the hero isn't visible.
        if (r.bottom > 0 && r.top < window.innerHeight) {
          const denom = r.height - window.innerHeight
          const p = denom > 0 ? clamp(-r.top / denom, 0, 1) : 0
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
          const S = lerp(1, sEnd, e)

          // Scale ONLY the F subpath about (CX,CY). The translate/scale/translate
          // triple encodes the origin (CSS transform-origin is ignored for the SVG
          // `transform` ATTRIBUTE, so we don't set it).
          if (fRef.current) {
            fRef.current.setAttribute(
              'transform',
              `translate(${CX} ${CY}) scale(${S}) translate(${-CX} ${-CY})`
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
    return () => cancelAnimationFrame(raf)
  }, [reduced])

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
    <div className="absolute bottom-10 left-6 max-w-[78vw] text-left sm:bottom-14 sm:left-12 sm:max-w-md">
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
    <div className="absolute bottom-12 right-6 hidden flex-col items-center gap-2 sm:right-12 sm:flex">
      <span className="label-caps text-[11px] tracking-[0.16em] text-ink-muted48">
        Scroll into the F
      </span>
      <span className="block h-9 w-[1.5px] animate-pulse bg-ink-muted48/60" />
    </div>
  )

  // ── Reduced-motion: short, static, fully readable (no track, no rAF) ────────────
  if (reduced) {
    return (
      <section className="relative bg-parchment">
        <div className="relative h-screen overflow-hidden">
          <div className="absolute inset-0">
            <AriaHero active />
          </div>
          {windowSvg}
          <div className="absolute inset-0">{copyBlock}</div>
        </div>
      </section>
    )
  }

  return (
    // Tall scroll-track; the stage inside is sticky for the scrubbed aperture dive.
    <section ref={trackRef} className="relative bg-parchment" style={{ height: '260vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden bg-parchment">
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
