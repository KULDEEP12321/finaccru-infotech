import { motion, useReducedMotion } from 'motion/react'

// AutomationHero — a full-viewport (100vh) statement over a fixed background
// video. The section is transparent; the video is pinned to the viewport behind
// ALL page content at z-index:-1, so every (opaque) section covers it and only
// this transparent section reveals it — a true viewport-fixed parallax, no bleed.
//
// Graceful degradation for old / low-power devices:
//  • A static poster image always sits behind, so the section is NEVER blank —
//    even if the video fails to load or autoplay is blocked (iOS Low Power Mode,
//    old browsers): the <video poster> frame / the poster layer shows instead.
//  • On reduced-motion, data-saver, or very weak devices we skip the video
//    entirely (no 6 MB download, no continuous decode) and show only the poster.
//  • Reduced-motion also disables the word stagger (text renders instantly).

const VIDEO_SRC = '/video/automation-hero.mp4'
const POSTER = '/img/automation-hero-poster.jpg'
const HEADING = 'WE BUILD END-TO-END AI AUTOMATION SYSTEMS.'
const WORDS = HEADING.split(' ')
const EASE = [0.22, 1, 0.36, 1]

// True for devices/users where a fixed autoplay video is unwelcome or unaffordable.
function useLiteMode(reduce) {
  if (reduce) return true
  if (typeof navigator === 'undefined') return false
  const c = navigator.connection
  if (c && c.saveData) return true
  if (navigator.deviceMemory && navigator.deviceMemory <= 2) return true
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) return true
  return false
}

export default function AutomationHero() {
  const reduce = useReducedMotion()
  const lite = useLiteMode(reduce)

  return (
    <section className="font-helvetica-now relative flex h-screen flex-col justify-center px-8 pb-8 pt-[70px] max-[900px]:px-[18px] max-[900px]:pt-[90px]">
      {/* Static poster — always behind, so the section is never blank. */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 bg-cover bg-center"
        style={{ zIndex: -2, backgroundImage: `url(${POSTER})` }}
      />

      {/* Fixed background video — skipped entirely on lite/reduced-motion devices. */}
      {!lite && (
        <video
          className="pointer-events-none fixed left-0 top-0 h-screen w-full object-cover"
          style={{ zIndex: -1 }}
          src={VIDEO_SRC}
          poster={POSTER}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden="true"
        />
      )}

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
