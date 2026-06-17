import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// RotatingWords — a single word slot that cycles through `words` on a timer,
// each word sliding up and out as the next slides in (the classic "Built for
// {impact → scale → speed}" headline treatment). Designed to sit at the END of
// a heading line so its width changes never disturb surrounding text.
//
// No-reflow trick: an invisible sizer rendered with the LONGEST word reserves a
// stable width/height, and the visible word is absolutely positioned on top of
// it inside an overflow-hidden mask — so the line never jumps as words swap.
//
// Respects prefers-reduced-motion: renders the first word statically with no
// timer and no animation.

const EASE = [0.28, 0.11, 0.32, 1] as const

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const sync = () => setReduced(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return reduced
}

export function RotatingWords({
  words,
  interval = 2200,
  className = '',
}: {
  words: string[]
  interval?: number
  className?: string
}) {
  const [i, setI] = useState(0)
  const reduced = usePrefersReducedMotion()

  useEffect(() => {
    if (reduced || words.length < 2) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduced, words.length, interval])

  // widest word by character count — reserves a stable box so nothing reflows
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? '')

  if (reduced) {
    return <span className={className}>{words[0]}</span>
  }

  return (
    <span className="relative inline-flex overflow-hidden align-bottom leading-[1.1]">
      {/* invisible sizer — fixes width to the longest word, height to one line */}
      <span aria-hidden className="invisible whitespace-nowrap">
        {longest}
      </span>
      <AnimatePresence initial={false}>
        <motion.span
          key={i}
          initial={{ y: '110%' }}
          animate={{ y: '0%' }}
          exit={{ y: '-110%' }}
          transition={{ duration: 0.5, ease: EASE }}
          className={`absolute inset-0 whitespace-nowrap ${className}`}
        >
          {words[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
