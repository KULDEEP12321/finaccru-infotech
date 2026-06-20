import { useEffect, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { siteContent } from '@/lib/site-content'
const { company } = siteContent

// AriaHero — the cinematic scene revealed once you've zoomed THROUGH the F.
//
// The background "character that looks where your cursor points" is a SCRUBBED
// frame sequence, NOT a <video>. The original used video.currentTime seeking on a
// 3828×2164 (4K) clip: every cursor move random-access-decoded a 4K frame (~251ms
// each, measured) which capped the scrub at ~4fps and stalled under fast movement
// ("laggy + stuck"). We pre-baked the 97 native frames to downscaled WebP
// (public/finn/frame-001..097.webp, 1600×904, ~2MB total) and scrub them on a
// <canvas>: a preloaded image swap is ~0ms, so the scrub runs at the display's
// full refresh rate. Motion is eased (dt-based, refresh-rate independent) so it
// glides toward the cursor instead of snapping.

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v))

// ── Frame-sequence config ────────────────────────────────────────────────────
const FRAME_COUNT = 97
const SENSITIVITY = 0.8 // frames per (full-width) sweep ≈ 0.8 * (FRAME_COUNT-1)
const PARK = Math.round((FRAME_COUNT - 1) * 0.18) // 17 → frame-018 (the resting frame)
const OBJ_X = 0.7 // object-position 70% (horizontal): hide 70% of overflow on the left
const OBJ_Y = 0.5 // object-position center (vertical)
const EASE_K = 24 // dt-based ease constant; higher = snappier (tighter cursor coupling)
const SETTLE = 0.004 // frame-units; snap + suspend the rAF below this
// Per-frame canvas cost ≈ backing-store pixel count × smoothing quality. Desktop
// affords the full 2× / 'high'; phones — especially low-end ones — get a smaller
// backing store + cheaper smoothing so the scrub holds the display's frame rate
// instead of stuttering. The 1600px source keeps it crisp even at 1.2×.
const DPR_CAP_FINE = 2
const DPR_CAP_TOUCH = 1.5
const DPR_CAP_LOW = 1.2
const lowEndDevice = () =>
  typeof navigator !== 'undefined' &&
  (((navigator.hardwareConcurrency || 8) <= 4) || ((navigator.deviceMemory || 8) <= 4))
const POSTER_URL = '/finn/frame-018.webp'
const frameURL = (i: number) => `/finn/frame-${String(i + 1).padStart(3, '0')}.webp`

// Touch tuning — a finger swipe should sweep more frames than the equivalent mouse
// move, and a comfortable phone tilt (gamma°) should cover the whole look range.
const TOUCH_SENSITIVITY = 2.4
const TILT_RANGE = 34 // ± degrees of left/right tilt mapped across the full sequence
const TILT_SMOOTH = 0.3 // low-pass on the noisy gyro signal (lower = smoother, more lag)
const TILT_DEADZONE = 0.6 // frame-units; a smaller tilt change is ignored so a still hand settles

// How the scene is driven, by input capability (re-evaluated live in E0):
//   'fine'  → precise hovering pointer (mouse): scrub follows the cursor; eager preload.
//   'touch' → coarse pointer (phone/tablet): scrub follows a finger drag + device tilt;
//             the ~2MB frame preload is deferred until the scene is reached (active).
//   'none'  → the static poster only (no canvas / preload / rAF).
const pointerMode = () => {
  if (typeof window === 'undefined' || !window.matchMedia) return 'none'
  // Battery-saver / low-power mode trips prefers-reduced-motion even on capable
  // phones, which used to silently drop FINN to a static poster. We keep the
  // interactive scene on for power-saving users too, and only fall back to the
  // poster when the *hardware* genuinely can't keep up — so the scrub stays
  // smooth on weak devices without hiding the effect from everyone else. (FINN's
  // motion is user-driven — cursor / finger / tilt — so it never auto-animates.)
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches && lowEndDevice()) return 'none'
  const fine =
    window.matchMedia('(any-pointer: fine)').matches &&
    window.matchMedia('(any-hover: hover)').matches
  if (fine) return 'fine'
  if (window.matchMedia('(any-pointer: coarse)').matches) return 'touch'
  return 'none'
}

// ── useTypewriter ───────────────────────────────────────────────────────────
// Reveals `text` one character at a time after `startDelay`. Returns { displayed, done }.
function useTypewriter(
  text: string,
  {
    speed = 38,
    startDelay = 600,
    run = true,
  }: { speed?: number; startDelay?: number; run?: boolean } = {}
) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (!run) return
    setDisplayed('')
    setDone(false)
    let i = 0
    let interval: ReturnType<typeof setInterval> | undefined
    const start = setTimeout(() => {
      interval = setInterval(() => {
        i += 1
        setDisplayed(text.slice(0, i))
        if (i >= text.length) {
          clearInterval(interval)
          setDone(true)
        }
      }, speed)
    }, startDelay)
    return () => {
      clearTimeout(start)
      clearInterval(interval)
    }
  }, [text, speed, startDelay, run])

  return { displayed, done }
}

// Small overlapping-rectangles "copy" glyph (12×12).
function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="3.4" y="3.4" width="6.2" height="6.2" rx="1.2" stroke="currentColor" strokeWidth="1.1" />
      <path d="M8.2 3.4V2.6A1 1 0 0 0 7.2 1.6H3a1 1 0 0 0-1 1V7a1 1 0 0 0 1 1h.8" stroke="currentColor" strokeWidth="1.1" />
    </svg>
  )
}

export default function AriaHero({ active = true }: { active?: boolean }) {
  // Seeded synchronously so the first paint is already correct (no canvas flash on
  // touch). 'fine' scrubs eagerly; 'touch' waits until the scene is reached (active)
  // before mounting the canvas + preloading frames, so phones don't pay for ~2MB
  // unless they actually dive in.
  const [mode, setMode] = useState(pointerMode) // 'fine' | 'touch' | 'none'
  // SSR/first-client render must match: the server has no pointer capabilities,
  // so render the poster only until mounted, then let the canvas engine attach.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const interactive = mounted && (mode === 'fine' || (mode === 'touch' && active))
  const [ready, setReady] = useState(false) // first real frame drawn → fade canvas in

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imagesRef = useRef<(HTMLImageElement | null)[]>([]) // HTMLImageElement[]
  const loadedRef = useRef(new Uint8Array(FRAME_COUNT)) // 0/1 per frame
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef(0)
  const dprRef = useRef(1)
  const visibleRef = useRef(true)
  const readyRef = useRef(false)
  // The entire scrub hot-path lives in refs → no re-render at pointer rate.
  const s = useRef<{
    current: number
    target: number
    prevX: number | null
    lastDrawn: number
    dirty: boolean
    lastT: number
    touching: boolean
    tilt: number | null
  }>({ current: PARK, target: PARK, prevX: null, lastDrawn: -1, dirty: true, lastT: 0, touching: false, tilt: null })

  // ── E0 — capability listeners: plugging in a mouse / toggling reduced-motion re-picks the mode.
  useEffect(() => {
    const mqs = [
      '(any-pointer: fine)',
      '(any-hover: hover)',
      '(any-pointer: coarse)',
      '(prefers-reduced-motion: reduce)',
    ].map((q) => window.matchMedia?.(q))
    const apply = () => setMode(pointerMode())
    mqs.forEach((mq) => mq?.addEventListener?.('change', apply))
    return () => mqs.forEach((mq) => mq?.removeEventListener?.('change', apply))
  }, [])

  // ── E1 — the whole scrub engine (preload + size + listeners + rAF). Runs only
  //         when interactive; teardown is fully symmetric (StrictMode-safe).
  useEffect(() => {
    if (!interactive) return
    const canvas = canvasRef.current
    if (!canvas) return

    let cancelled = false
    const st = s.current
    st.current = PARK
    st.target = PARK
    st.prevX = null
    st.lastDrawn = -1
    st.dirty = true
    st.lastT = 0
    st.touching = false
    st.tilt = null
    loadedRef.current = new Uint8Array(FRAME_COUNT)
    imagesRef.current = new Array(FRAME_COUNT).fill(null)

    // Per-capability quality knobs. Touch (esp. low-end) trades a little crispness
    // for a steady frame rate; low-end also preloads/draws every 2nd frame, halving
    // the decode footprint and the blits per sweep.
    const lowEnd = lowEndDevice()
    const dprCap = mode === 'touch' ? (lowEnd ? DPR_CAP_LOW : DPR_CAP_TOUCH) : DPR_CAP_FINE
    const smoothQ = mode === 'fine' ? 'high' : lowEnd ? 'low' : 'medium'
    const frameStride = lowEnd ? 2 : 1

    const getCtx = () => {
      if (ctxRef.current) return ctxRef.current
      const ctx = canvas.getContext('2d', { alpha: false })
      if (ctx) {
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = smoothQ
      }
      ctxRef.current = ctx
      return ctx
    }

    // Size the DEVICE-pixel backing store from the transform-INVARIANT layout box.
    // (FHero scales an ancestor every dive frame; getBoundingClientRect would
    // return the scaled visual rect and thrash the backing store — clientWidth
    // is the layout box and is immune to ancestor transforms.)
    const sizeCanvas = () => {
      const cw = canvas.clientWidth
      const ch = canvas.clientHeight
      if (!cw || !ch) return
      const dpr = (dprRef.current = Math.min(window.devicePixelRatio || 1, dprCap))
      const bw = Math.max(1, Math.round(cw * dpr))
      const bh = Math.max(1, Math.round(ch * dpr))
      if (canvas.width !== bw || canvas.height !== bh) {
        canvas.width = bw // assigning width/height clears the bitmap + resets ctx state
        canvas.height = bh
        const ctx = getCtx()
        if (ctx) {
          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = smoothQ
        }
        st.dirty = true
        requestTick()
      }
    }

    // Nearest already-loaded frame to `i` (graceful while the sequence streams in).
    const nearestLoaded = (i: number) => {
      if (loadedRef.current[i]) return i
      for (let r = 1; r < FRAME_COUNT; r++) {
        if (i - r >= 0 && loadedRef.current[i - r]) return i - r
        if (i + r < FRAME_COUNT && loadedRef.current[i + r]) return i + r
      }
      return -1
    }

    // Cover-fit blit (exact CSS object-fit:cover + object-position:70% center).
    const drawFrame = (idx: number, force: boolean) => {
      const ctx = getCtx()
      if (!ctx) return
      const dstW = canvas.width
      const dstH = canvas.height
      if (!dstW || !dstH) return
      const want = clamp(Math.round(idx), 0, FRAME_COUNT - 1)
      const i = nearestLoaded(want)
      if (i < 0) return // nothing loaded yet → poster underneath carries the pixels
      if (!force && i === st.lastDrawn) return
      const img = imagesRef.current[i]
      if (!img || !img.naturalWidth) return
      const srcW = img.naturalWidth
      const srcH = img.naturalHeight
      const scale = Math.max(dstW / srcW, dstH / srcH) // cover → fully covers both axes
      const drawW = Math.ceil(srcW * scale)
      const drawH = Math.ceil(srcH * scale)
      const dx = Math.round(-(drawW - dstW) * OBJ_X)
      const dy = Math.round(-(drawH - dstH) * OBJ_Y)
      ctx.drawImage(img, 0, 0, srcW, srcH, dx, dy, drawW, drawH)
      st.lastDrawn = i
      if (!readyRef.current) {
        readyRef.current = true
        setReady(true) // first real frame painted → crossfade the canvas over the poster
      }
    }

    const tick = (t: number) => {
      rafRef.current = 0
      if (cancelled || !visibleRef.current) return
      const last = st.lastT || t
      const dt = Math.min(0.05, Math.max(0, (t - last) / 1000))
      st.lastT = t
      const diff = st.target - st.current
      let moving = false
      if (Math.abs(diff) < SETTLE) {
        st.current = st.target
      } else {
        st.current += diff * (1 - Math.exp(-EASE_K * dt)) // dt-based → refresh-rate independent
        moving = true
      }
      drawFrame(st.current, st.dirty)
      st.dirty = false
      // Self-reschedule DIRECTLY (not via requestTick) so st.lastT is preserved and
      // dt keeps accumulating — going through requestTick would reset lastT=0 every
      // frame, pinning dt at 0 and freezing the ease.
      if (moving) rafRef.current = requestAnimationFrame(tick)
    }

    // Arm the loop from an IDLE state (movement / resize / re-entering the viewport).
    // Resets lastT so the first tick after a suspension has dt=0 (no jump). The loop
    // self-suspends when settled (battery-friendly).
    function requestTick() {
      if (cancelled || !visibleRef.current || rafRef.current) return
      st.lastT = 0
      rafRef.current = requestAnimationFrame(tick)
    }

    const onMove = (e: MouseEvent) => {
      if (!visibleRef.current) {
        st.prevX = null
        return
      }
      if (st.prevX === null) {
        st.prevX = e.clientX
        return
      }
      const delta = e.clientX - st.prevX
      st.prevX = e.clientX
      st.target = clamp(
        st.target + (delta / window.innerWidth) * SENSITIVITY * (FRAME_COUNT - 1),
        0,
        FRAME_COUNT - 1
      )
      requestTick()
    }
    const onLeave = () => {
      st.prevX = null // re-entry far away won't fling
    }

    // ── Touch: drag horizontally to aim FINN (same delta→frame mapping as the mouse,
    //    just brisker so a finger swipe covers the look range).
    const onTouchStart = (e: TouchEvent) => {
      st.touching = true
      const t = e.touches[0]
      if (t) st.prevX = t.clientX
    }
    const onTouchMove = (e: TouchEvent) => {
      if (!visibleRef.current) {
        st.prevX = null
        return
      }
      const t = e.touches[0]
      if (!t) return
      if (st.prevX === null) {
        st.prevX = t.clientX
        return
      }
      const delta = t.clientX - st.prevX
      st.prevX = t.clientX
      st.target = clamp(
        st.target + (delta / window.innerWidth) * TOUCH_SENSITIVITY * (FRAME_COUNT - 1),
        0,
        FRAME_COUNT - 1
      )
      requestTick()
    }
    const onTouchEnd = () => {
      st.prevX = null
      st.touching = false
    }
    // ── Device tilt: ambient "looks where you tilt" — gamma is the left/right tilt in
    //    degrees (flat → centre frame). Yields to an active finger drag. Fires on
    //    Android out of the box; on iOS only once motion access is granted.
    const onTilt = (e: DeviceOrientationEvent) => {
      if (!visibleRef.current || st.touching) return
      const g = e.gamma
      if (g == null) return
      // Low-pass the noisy sensor (EMA) so motion glides; the sub-frame deadzone lets
      // a steady hand settle the rAF instead of churning a redraw on every jittery
      // sample — the single biggest "smoothness" win on low-end devices.
      st.tilt = st.tilt == null ? g : st.tilt + (g - st.tilt) * TILT_SMOOTH
      const norm = clamp(st.tilt / TILT_RANGE, -1, 1)
      const target = (FRAME_COUNT - 1) * (0.5 + norm * 0.5)
      if (Math.abs(target - st.target) < TILT_DEADZONE) return
      st.target = target
      requestTick()
    }

    // Preload frames upfront in priority order (PARK first, spiralling out) so
    // teardown can abort every one symmetrically — no deferred-creation race. Low-end
    // keeps only every 2nd frame (+ PARK): half the decode footprint, and the scrub
    // naturally draws the loaded frames via nearestLoaded (≈ half the blits / sweep).
    const order = [PARK]
    for (let r = 1; r < FRAME_COUNT; r++) {
      if (PARK - r >= 0) order.push(PARK - r)
      if (PARK + r < FRAME_COUNT) order.push(PARK + r)
    }
    const loadOrder =
      frameStride > 1 ? order.filter((i) => i === PARK || i % frameStride === 0) : order
    const settle = (i: number, img: HTMLImageElement) => {
      if (cancelled || loadedRef.current[i] || !img.naturalWidth) return
      loadedRef.current[i] = 1
      st.lastDrawn = -1 // a closer frame may now be available → allow a repaint
      st.dirty = true
      if (i === PARK) {
        sizeCanvas()
        drawFrame(PARK, true)
      }
      requestTick()
    }
    for (const i of loadOrder) {
      const img = new Image()
      img.decoding = 'async'
      imagesRef.current[i] = img
      const done = () => settle(i, img)
      img.onload = done
      img.onerror = () => {} // leave loadedRef[i]=0 → nearestLoaded covers the gap
      img.src = frameURL(i)
      if (img.decode) img.decode().then(done).catch(() => {}) // warm; onload is authoritative
    }

    // Initial size + paint attempt, then keep it sized across layout/DPR changes.
    sizeCanvas()
    requestTick()

    const ro = new ResizeObserver(() => sizeCanvas())
    ro.observe(canvas)

    const io = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting
        if (entry.isIntersecting) {
          st.prevX = null
          st.dirty = true
          requestTick()
        }
      },
      { threshold: 0 }
    )
    io.observe(canvas)

    // DPR can change without an element resize (drag between monitors of different
    // scaling) — the resolution media query is the only reliable signal.
    let removeDpr = () => {}
    const armDpr = () => {
      const mq = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
      const onDpr = () => {
        removeDpr()
        armDpr()
        sizeCanvas()
      }
      mq.addEventListener?.('change', onDpr)
      removeDpr = () => mq.removeEventListener?.('change', onDpr)
    }
    armDpr()

    // Input source by capability. Mouse → cursor scrub; touch → finger-drag scrub
    // plus ambient device tilt. We never force the iOS motion-permission prompt here;
    // drag works regardless, and tilt lights up wherever the sensor is already allowed.
    if (mode === 'touch') {
      window.addEventListener('touchstart', onTouchStart, { passive: true })
      window.addEventListener('touchmove', onTouchMove, { passive: true })
      window.addEventListener('touchend', onTouchEnd, { passive: true })
      window.addEventListener('touchcancel', onTouchEnd, { passive: true })
      window.addEventListener('deviceorientation', onTilt, { passive: true })
    } else {
      window.addEventListener('mousemove', onMove, { passive: true })
      document.addEventListener('mouseleave', onLeave)
    }
    window.addEventListener('blur', onLeave)
    window.addEventListener('resize', sizeCanvas)

    return () => {
      cancelled = true
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('touchcancel', onTouchEnd)
      window.removeEventListener('deviceorientation', onTilt)
      window.removeEventListener('blur', onLeave)
      window.removeEventListener('resize', sizeCanvas)
      ro.disconnect()
      io.disconnect()
      removeDpr()
      for (const img of imagesRef.current) {
        if (img) {
          img.onload = null
          img.onerror = null
          try {
            img.src = ''
          } catch {
            /* best-effort fetch abort; the `cancelled` flag is the real guard */
          }
        }
      }
      imagesRef.current = []
      loadedRef.current = new Uint8Array(FRAME_COUNT)
      ctxRef.current = null
      readyRef.current = false
      setReady(false)
    }
  }, [interactive, mode])

  // ── Reveal choreography: start typing + fade pills once the F has engulfed ───
  const [armed, setArmed] = useState(false)
  const [showPills, setShowPills] = useState(false)
  useEffect(() => {
    if (!active) return
    const a = setTimeout(() => setArmed(true), 200)
    const b = setTimeout(() => setShowPills(true), 600) // independent of typing
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
  }, [active])

  const { displayed, done } = useTypewriter(
    'Glad you found your way in. We turn ambitious ideas into software that ships — so, what are we building?',
    { startDelay: 500, run: armed }
  )

  const [copied, setCopied] = useState(false)
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(company.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — no-op */
    }
  }

  const pills = [
    { label: 'Pitch us a project', to: '/contact' },
    { label: 'Explore our services', to: '/services' },
    { label: 'See pricing', to: '/pricing' },
    { label: 'Join the team', to: '/about' },
  ]

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden bg-tile1">
      {/* Local keyframes so we don't touch global css. */}
      <style>{`@keyframes ariaBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>

      {/* 1 — background. Poster (always present: the static fallback for touch /
             reduced-motion, and the seamless under-layer while frames stream in)
             + the scrub canvas (interactive only), crossfaded in once a real frame
             is painted so the swap is invisible. */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          backgroundImage: `url('${POSTER_URL}')`,
          backgroundSize: 'cover',
          backgroundPosition: '70% center',
        }}
      />
      {interactive && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="absolute inset-0 h-full w-full"
          style={{ opacity: ready ? 1 : 0, transition: 'opacity 240ms ease' }}
        />
      )}

      {/* 2 — readability scrims (left + bottom) so copy reads over any frame */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-black/5" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/25" />
      {/* faint brand wash, keeps it Finaccru rather than generic */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_12%_88%,rgba(0,102,204,0.28),transparent_55%)]" />

      {/* 3 — content: bottom-left on mobile, centred-left on desktop */}
      <div className="absolute inset-0 flex flex-col justify-end px-6 pb-16 sm:px-12 sm:justify-center sm:pb-0 md:px-16">
        <div className="max-w-2xl">
          {/* blurred intro label */}
          <p
            className="mb-5 select-none font-text sm:mb-6"
            style={{
              fontSize: 'clamp(16px, 3.4vw, 24px)',
              lineHeight: 1.3,
              fontWeight: 400,
              color: '#fff',
              filter: 'blur(4px)',
            }}
          >
            Hey there — meet FINN,
            <br />
            Finaccru&rsquo;s Infotech Navigator.
          </p>

          {/* typewriter line */}
          <p
            className="mb-6 font-text text-white sm:mb-7"
            style={{
              fontSize: 'clamp(20px, 4.2vw, 32px)',
              lineHeight: 1.32,
              fontWeight: 400,
              minHeight: 64,
              letterSpacing: '-0.01em',
            }}
          >
            {displayed}
            {!done && (
              <span
                className="ml-[2px] inline-block h-[1.1em] w-[2px] bg-white align-middle"
                style={{ animation: 'ariaBlink 1s step-end infinite' }}
              />
            )}
          </p>

          {/* action pills — fade + slide up, independent of the typewriter */}
          <div
            className="flex flex-wrap gap-y-1"
            style={{
              opacity: showPills ? 1 : 0,
              transform: showPills ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.5s ease, transform 0.5s ease',
              pointerEvents: active ? 'auto' : 'none',
            }}
          >
            {pills.map((p) => (
              <Link
                key={p.label}
                to={p.to}
                className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center whitespace-nowrap rounded-pill border border-white/15 bg-white px-4 py-[0.42em] text-[13px] font-medium text-ink transition-colors duration-200 hover:bg-ink hover:text-white max-sm:min-h-[44px] sm:px-5 sm:text-[15px]"
              >
                {p.label}
              </Link>
            ))}

            <button
              type="button"
              onClick={copyEmail}
              className="mx-[0.2em] mb-[0.4em] inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-pill border border-white bg-transparent px-4 py-[0.42em] text-[13px] font-medium text-white transition-colors duration-200 hover:bg-white hover:text-ink max-sm:min-h-[44px] sm:gap-3 sm:px-5 sm:text-[15px]"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-2">{company.email}</span>
              </span>
              <CopyIcon />
              <span className="sr-only">{copied ? 'Copied' : 'Copy email'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* subtle vignette so the scene reads as depth (matches the old montage) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 60% 45%, transparent 60%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  )
}
