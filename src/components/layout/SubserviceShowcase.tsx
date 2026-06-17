import { useEffect, useRef } from 'react'
import { Link } from '@tanstack/react-router'
import { Icon } from '@/components/ui/Icons'
import { Reveal } from '@/components/ui/Reveal'
import type { Subservice } from '@/data/site'

// SubserviceShowcase — the brand "Imprint Core" pad shown ONCE as a hero
// showpiece, followed by a compact card grid of every sub-service.
//
// This previously rendered one full-height alternating row per sub-service, each
// playing the *same* baked pad clip — so on a 6–8 item category the identical
// pad filled most of the page and read as copy-paste. Now the pad earns its keep
// as a single hero (the reference, imprint.co, likewise shows the Core object
// once, not per feature), and the sub-services live in a scannable grid below:
// icon, title, description, optional tech pills, and a "Learn more" link.
//
// The hero is the pre-rendered, seamless pad video (navy field, dot texture and
// vignette baked into the clip). It plays for EVERYONE — including low-power /
// battery-saver / reduced-motion / low-end devices: the `autoPlay` attribute is
// silently ignored by power-saving browsers (iOS Low Power Mode, battery-saver
// Chrome), so we kick playback from JS and retry. The still poster always sits
// behind, so the tile is never blank while the clip buffers. Only one hardware-
// decoded clip plays, and only while on screen (IntersectionObserver pause/
// resume), so the GPU cost is ~zero and the scroll stays smooth.

const PAD_WEBM = '/video/showcase-pad.webm'
const PAD_MP4 = '/video/showcase-pad.mp4'
const PAD_POSTER = '/video/showcase-pad-poster.webp'

// The single hero pad. The baked loop plays everywhere; it's only paused while
// off screen so an idle clip never burns the GPU.
function HeroPad() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const wrap = wrapRef.current
    const v = videoRef.current
    if (!wrap || !v) return

    // Force autoplay everywhere. IntersectionObserver gates playback to on-screen
    // only (perf); on top of that we re-kick play() whenever the clip becomes
    // playable, on the first user gesture, and when the tab regains focus — the
    // states under which power-saving browsers will finally honor a play() call.
    let onScreen = true
    const tryPlay = () => {
      if (onScreen) void v.play().catch(() => {})
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting
        if (onScreen) tryPlay()
        else v.pause()
      },
      { threshold: 0.05 },
    )
    io.observe(wrap)

    const onInteract = () => tryPlay()
    const onVisible = () => {
      if (!document.hidden) tryPlay()
    }
    const events = ['touchstart', 'pointerdown', 'click', 'scroll', 'keydown']
    events.forEach((e) => window.addEventListener(e, onInteract, { passive: true }))
    document.addEventListener('visibilitychange', onVisible)
    v.addEventListener('canplay', tryPlay)
    tryPlay()

    return () => {
      io.disconnect()
      events.forEach((e) => window.removeEventListener(e, onInteract))
      document.removeEventListener('visibilitychange', onVisible)
      v.removeEventListener('canplay', tryPlay)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-[4/3] w-full max-w-[600px] overflow-hidden rounded-[18px] bg-[#0c2147] shadow-[0_30px_80px_-34px_rgba(12,33,71,0.55)] ring-1 ring-black/5 sm:aspect-[16/11]"
    >
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        poster={PAD_POSTER}
        muted
        loop
        playsInline
        autoPlay
        preload="metadata"
        aria-hidden
      >
        <source src={PAD_WEBM} type="video/webm" />
        <source src={PAD_MP4} type="video/mp4" />
      </video>
    </div>
  )
}

// One sub-service card. The whole card is the "Learn more" link (→ /contact),
// matching the old per-row CTA; the icon tile fills with brand blue on hover.
function SubserviceCard({ item, index }: { item: Subservice; index: number }) {
  const num = String(index + 1).padStart(2, '0')

  return (
    <Reveal delay={(index % 3) * 0.06} y={18} className="h-full">
      <Link
        to="/contact"
        aria-label={`Learn more about ${item.title}`}
        className="group flex h-full flex-col rounded-[16px] border border-hairline bg-pearl/50 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-parchment/70 hover:shadow-[0_18px_44px_-26px_rgba(12,33,71,0.45)] sm:p-7"
      >
        <div className="flex items-start justify-between">
          <span className="grid h-12 w-12 place-items-center rounded-[13px] bg-white text-primary ring-1 ring-black/[0.06] transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Icon name={item.icon} size={24} />
          </span>
          <span className="font-display text-[12px] font-medium tracking-[0.16em] text-ink-muted48">
            {num}
          </span>
        </div>

        <h3 className="display-caps mt-5 text-[20px] leading-tight text-ink">{item.title}</h3>
        <p className="mt-2.5 text-caption leading-relaxed text-ink-muted80">{item.desc}</p>

        {item.tech && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {item.tech.map((t) => (
              <span
                key={t}
                className="rounded-pill border border-hairline bg-white/60 px-2.5 py-1 text-fine text-ink-muted48"
              >
                {t}
              </span>
            ))}
          </div>
        )}

        <span className="mt-auto inline-flex items-center gap-1.5 pt-6 text-caption font-medium text-primary">
          <span className="border-b border-primary/35 pb-0.5 transition-colors group-hover:border-primary">
            Learn more
          </span>
          <Icon
            name="arrow"
            size={16}
            className="transition-transform duration-300 ease-apple group-hover:translate-x-1"
          />
        </span>
      </Link>
    </Reveal>
  )
}

export default function SubserviceShowcase({ items }: { items: Subservice[] }) {
  return (
    <div>
      <Reveal y={26}>
        <HeroPad />
      </Reveal>

      <div className="mt-16 grid gap-5 sm:mt-20 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {items.map((item, i) => (
          <SubserviceCard key={item.title} item={item} index={i} />
        ))}
      </div>
    </div>
  )
}
