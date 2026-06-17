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
// The rotation runs for EVERYONE — it's a small, GPU-cheap transform that we
// intentionally keep on even under power-saving / battery-saver / reduced-motion
// so the headline reads the same on every device.

const EASE = [0.28, 0.11, 0.32, 1] as const

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

  useEffect(() => {
    if (words.length < 2) return
    const id = setInterval(() => setI((n) => (n + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [words.length, interval])

  // widest word by character count — reserves a stable box so nothing reflows
  const longest = words.reduce((a, b) => (b.length > a.length ? b : a), words[0] ?? '')

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
