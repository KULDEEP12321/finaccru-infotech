// Seamless, pure-CSS logo marquee. Each card carries an equal trailing margin
// (no flex gap), so the doubled track is perfectly periodic — translateX(-50%)
// loops without a seam. Logos are quiet (grayscale) until hovered.
const logos = [
  { src: 'https://svgl.app/library/shopify.svg', alt: 'Shopify' },
  { src: 'https://svgl.app/library/figma.svg', alt: 'Figma' },
  { src: 'https://svgl.app/library/spotify.svg', alt: 'Spotify' },
  { src: 'https://svgl.app/library/blender.svg', alt: 'Blender' },
  { src: 'https://svgl.app/library/google-cloud.svg', alt: 'Google Cloud' },
  { src: 'https://svgl.app/library/bing.svg', alt: 'Bing' },
  { src: 'https://svgl.app/library/lottielab.svg', alt: 'Lottielab' },
  { src: 'https://svgl.app/library/vercel.svg', alt: 'Vercel' },
]

function Card({ logo }) {
  return (
    <div className="group me-5 grid h-20 w-44 shrink-0 place-items-center rounded-pill bg-canvas ring-1 ring-hairline transition-colors hover:ring-primary/40">
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        className="max-h-7 max-w-[58%] object-contain opacity-55 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0"
        onError={(e) => {
          // Graceful fallback to a wordmark if the CDN logo can't load.
          const el = e.currentTarget
          el.style.display = 'none'
          el.insertAdjacentHTML(
            'afterend',
            `<span class="text-caption font-semibold text-ink-muted48">${logo.alt}</span>`
          )
        }}
      />
    </div>
  )
}

export default function Marquee() {
  const track = [...logos, ...logos]
  return (
    <div className="marquee-pause marquee-mask overflow-hidden py-2">
      <div className="flex w-max animate-marquee">
        {track.map((logo, i) => (
          <Card key={i} logo={logo} />
        ))}
      </div>
    </div>
  )
}
