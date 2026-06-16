import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'

// AutomationHero — a full-viewport (100vh) statement over a fixed background
// video. The section is transparent; the video is pinned to the viewport behind
// ALL page content at z-index:-1, so every (opaque) section covers it and only
// this transparent section reveals it — a true viewport-fixed parallax, no bleed.
//
// The video plays for EVERYONE — including low-power / power-saving / reduced-
// motion / low-end devices. We no longer skip it for any device class.
//  • A static poster image always sits behind, so the section is NEVER blank
//    while the video buffers or if it genuinely fails to load.
//  • Many browsers (iOS Low Power Mode, battery-saver Chrome) ignore the
//    `autoPlay` attribute, so we also kick playback from JS and retry on the
//    first user interaction and whenever the tab becomes visible again.
//  • Reduced-motion still disables the text word-stagger (text renders
//    instantly) — that's an accessibility nicety unrelated to the video.

const VIDEO_SRC = '/video/automation-hero.mp4'
const POSTER = '/img/automation-hero-poster.jpg'
const HEADING = 'WE BUILD END-TO-END AI AUTOMATION SYSTEMS.'
const WORDS = HEADING.split(' ')
const EASE = [0.22, 1, 0.36, 1]

export default function AutomationHero() {
  const reduce = useReducedMotion()
  const videoRef = useRef<HTMLVideoElement>(null)

  // Force autoplay everywhere. The `autoPlay` attribute alone is silently
  // ignored on power-saving / low-power devices, so we call play() on mount and
  // keep retrying on the first user gesture or when the tab regains focus.
  useEffect(() => {
    const v = videoRef.current
    if (!v) return

    const tryPlay = () => {
      const p = v.play()
      if (p && typeof p.catch === 'function') p.catch(() => {})
    }

    tryPlay()

    const onInteract = () => tryPlay()
    const onVisible = () => { if (!document.hidden) tryPlay() }
    const events = ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown']
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }))
    document.addEventListener('visibilitychange', onVisible)
    v.addEventListener('canplay', tryPlay)

    return () => {
      events.forEach((e) => window.removeEventListener(e, onInteract))
      document.removeEventListener('visibilitychange', onVisible)
      v.removeEventListener('canplay', tryPlay)
    }
  }, [])

  return (
    <section className="font-helvetica-now relative flex h-screen flex-col justify-center px-8 pb-8 pt-[70px] max-[900px]:px-[18px] max-[900px]:pt-[90px]">
      {/* Static poster — always behind, so the section is never blank. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-cover bg-center"
        style={{ zIndex: -2, backgroundImage: `url(${POSTER})` }}
      />

      {/* Fixed background video — always rendered, plays for every device. */}
      <video
        ref={videoRef}
        className="pointer-events-none fixed left-0 top-0 h-screen w-full object-cover"
        style={{ zIndex: -1 }}
        src={VIDEO_SRC}
        poster={POSTER}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="flex max-w-[720px] flex-col items-start">
        <h2
          className="m-0 flex flex-wrap"
          style={{
            gap: '0.25em',
            fontSize: 'clamp(26px, 3vw, 42px)',
            fontWeight: 700,
            lineHeight: 1.08,
            letterSpacing: '-0.01em',
            textTransform: 'uppercase',
            color: '#fff',
          }}
        >
          {WORDS.map((word, i) => (
            <motion.span
              key={`${word}-${i}`}
              initial={reduce ? false : { opacity: 0, y: 32 }}
              whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={reduce ? undefined : { duration: 0.7, delay: 0.15 + i * 0.08, ease: EASE }}
            >
              {word}
            </motion.span>
          ))}
        </h2>

        <motion.p
          initial={reduce ? false : { opacity: 0, y: 24 }}
          whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={reduce ? undefined : { duration: 0.7, delay: 0.9, ease: EASE }}
          style={{
            marginTop: 24,
            fontSize: 14,
            lineHeight: 1.65,
            color: 'rgba(255,255,255,0.85)',
            maxWidth: 260,
          }}
        >
          We provide all-in-one AI automation services in one place.
        </motion.p>
      </div>
    </section>
  )
}
