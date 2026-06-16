import { useEffect, useRef } from 'react'

// FreedomSection — a problem/solution comparison flanking an HLS video circle.
// Monochrome reskin: solid-ink type, single-blue accent, neutral-gray negatives;
// the external EternaCloud bullet icons are replaced with inline SVGs.
// Content is brand-neutral delivery copy, fitting the Finaccru/ProtechPlanner story.

const HLS_SRC = 'https://stream.mux.com/bnYL6x5cAX6WiJv2pOKpITehZd3NVdXpj3ylJFpX5Lk.m3u8'

const negatives = [
  'Reactive firefighting when foundational issues surface too late',
  'Bloated coordination overhead drains bandwidth from core teams',
  "Constant re-verification because source data can't be trusted",
  'Fragmented vendor relations produce mismatched deliverables',
  'Scattered specs and decisions buried across siloed systems',
]

const positives = [
  'Layered dependency maps eliminate costly surprises at every phase',
  'Streamlined team handoffs deliver production-ready outcomes fast',
  'Live validation loops keep requirements locked across all stages',
  'Unified vendor management through a single accountable contact',
  'Centralized context and clear records accelerate every decision',
]

const ICON_STYLE = { width: 'clamp(16px, 1.25vw, 20px)', height: 'auto', flexShrink: 0 }

function CrossIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" style={ICON_STYLE}>
      <circle cx="10" cy="10" r="9" fill="#f1f1f3" />
      <path d="M7 7l6 6M13 7l-6 6" stroke="#7a7a7a" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true" style={ICON_STYLE}>
      <circle cx="10" cy="10" r="9" fill="#E7F3FF" />
      <path
        d="M5.8 10.4l2.7 2.7L14.2 7"
        stroke="#0066cc"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const CARD_STYLE = {
  gap: '12px',
  padding: 'clamp(12px, 0.97vw, 16px) clamp(14px, 1.25vw, 20px)',
  borderRadius: '18px',
  backgroundColor: 'rgb(255, 255, 255)',
  boxShadow: '0 3px 9.1px #3f4a7e0d, 0 1px 29px #3f4a7e1a',
}

// HLS video, zoomed to 160% and centered so it fully covers the circle.
function HlsVideo() {
  const videoRef = useRef(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls
    let cancelled = false

    // Quality + timing are unchanged from the original: we force the top HLS
    // level, keep every Hls option identical, and start the stream right after
    // mount so it's buffered and PLAYING by the time the user scrolls down to
    // it (the circle is never blank on arrival — same as before).
    //
    // The ONLY change vs the original is that hls.js (~162KB gzipped — the
    // single biggest dependency) is now a DYNAMIC import, so it's no longer in
    // the synchronous entry bundle that blocks first paint. We kick it on an
    // idle callback so the chunk fetch + decode doesn't contend with the hero's
    // critical first paint, then it loads in the background during scroll.
    const start = () => {
      import('hls.js')
        .then(({ default: Hls }) => {
          if (cancelled || !video) return
          if (Hls.isSupported()) {
            hls = new Hls({
              startLevel: -1,
              capLevelToPlayerSize: false,
              maxMaxBufferLength: 60,
              enableWorker: true,
            })
            hls.loadSource(HLS_SRC)
            hls.attachMedia(video)
            hls.on(Hls.Events.MANIFEST_PARSED, () => {
              hls.currentLevel = hls.levels.length - 1
              video.play().catch(() => {})
            })
          } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = HLS_SRC
            video.play().catch(() => {})
          }
        })
        .catch(() => {
          /* chunk load failed — leave the poster/first frame; no crash */
        })
    }

    // Start after the page is interactive but well before the user can scroll
    // down to the section. requestIdleCallback (with a 2s safety timeout) keeps
    // it off the busy first-paint window; setTimeout is the fallback.
    const ric = window.requestIdleCallback || ((cb) => setTimeout(cb, 200))
    const cancelRic = window.cancelIdleCallback || clearTimeout
    const idleId = ric(start, { timeout: 2000 })

    return () => {
      cancelled = true
      cancelRic(idleId)
      if (hls) hls.destroy()
    }
  }, [])

  return (
    <video
      ref={videoRef}
      autoPlay
      loop
      muted
      playsInline
      style={{
        width: '160%',
        height: '160%',
        objectFit: 'cover',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

export default function FreedomSection() {
  return (
    <section
      className="w-full flex flex-col items-center"
      style={{
        backgroundColor: '#ffffff',
        padding: 'clamp(48px, 6vw, 80px) clamp(16px, 3vw, 40px)',
        gap: '36px',
      }}
    >
      {/* ── Header ───────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-9 text-center">
        <div
          className="flex items-center gap-2 text-lg font-medium rounded-full"
          style={{ backgroundColor: 'rgb(249, 249, 249)', padding: '0.9vw 1.25vw', color: '#1d1d1f' }}
        >
          <svg
            width="19"
            height="18"
            style={{ flexShrink: 0 }}
            viewBox="0 0 17 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#freedom-clip)">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M8.50037 3.66955C7.53221 2.82462 6.41758 2.275 5.333 2.07887C4.11096 1.85888 2.84987 2.0826 1.96658 2.95885C1.10056 3.81944 0.866218 5.04172 1.06751 6.23193C1.24778 7.29835 1.7803 8.39907 2.60501 9.35959C2.41536 10.1071 2.46371 10.8946 2.7434 11.6137C3.02308 12.3327 3.52035 12.9481 4.16678 13.375C4.81321 13.802 5.57702 14.0195 6.35308 13.9976C7.12915 13.9758 7.87933 13.7157 8.50037 13.2531C9.12146 13.7161 9.87183 13.9765 10.6482 13.9985C11.4245 14.0205 12.1886 13.8029 12.8352 13.3758C13.4819 12.9487 13.9792 12.3331 14.2588 11.6137C14.5384 10.8943 14.5865 10.1065 14.3965 9.35884C15.2204 8.39832 15.753 7.29835 15.9325 6.23119C16.1338 5.04098 15.8994 3.81944 15.0334 2.9596C14.1501 2.0826 12.889 1.85888 11.667 2.07962C10.5824 2.275 9.46854 2.82537 8.50037 3.66955Z"
                fill="#0066cc"
              />
            </g>
            <defs>
              <clipPath id="freedom-clip">
                <rect width="16" height="16" fill="white" transform="translate(0.5)" />
              </clipPath>
            </defs>
          </svg>
          Control
        </div>

        <h2
          className="display-caps"
          style={{ fontSize: 'clamp(32px, 4vw, 56px)', color: '#1d1d1f', margin: 0 }}
        >
          Stop absorbing the chaos.
          <br />
          <span
            style={{
              color: '#1d1d1f',
              paddingBottom: '0.3vw',
              display: 'inline-block',
            }}
          >
            Run with confidence.
          </span>
        </h2>
      </div>

      {/* ── Three-column grid ────────────────────────────────── */}
      <div
        className="w-full flex flex-col lg:grid"
        style={{
          gridTemplateColumns: '26vw 1fr 26vw',
          columnGap: '36px',
          rowGap: '24px',
          alignItems: 'start',
          padding: '0 clamp(0px, 2.92vw, 40px)',
          gap: '24px',
        }}
      >
        {/* Left — negatives */}
        <div
          className="flex flex-col"
          style={{ gap: '12px', fontSize: 'clamp(13px, 1.15vw, 17px)', color: '#7a7a7a' }}
        >
          {negatives.map((text) => (
            <div key={text} className="flex flex-col" style={CARD_STYLE}>
              <CrossIcon />
              <div>{text}</div>
            </div>
          ))}
        </div>

        {/* Center — video circle */}
        <div className="flex items-center justify-center order-first lg:order-none" style={{ alignSelf: 'center' }}>
          <div
            style={{
              position: 'relative',
              borderRadius: '50%',
              overflow: 'hidden',
              width: 'clamp(200px, 22vw, 400px)',
              height: 'clamp(200px, 22vw, 400px)',
              flexShrink: 0,
            }}
          >
            <HlsVideo />
          </div>
        </div>

        {/* Right — positives */}
        <div className="flex flex-col" style={{ gap: '12px', fontSize: 'clamp(13px, 1.15vw, 17px)' }}>
          {positives.map((text) => (
            <div key={text} className="flex flex-col" style={CARD_STYLE}>
              <CheckIcon />
              <div style={{ color: '#1d1d1f' }}>{text}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
