import AppMock from '@/components/layout/AppMock'

// WorkMontage — the "our work" scene BEHIND the F-shaped window. Plain DOM (no
// WebGL), so it works everywhere and is what the viewer dives INTO as the aperture
// engulfs the screen. Authored larger than the viewport and clustered around the
// centre so no tile edges show through the small early F.
//
// Note: the live HLS showreel lives ONLY in FreedomSection lower on the page — we
// deliberately do NOT decode it again here (a second concurrent decode behind a
// 150vmax montage is wasteful); this tile is a static brand panel instead.

const chips = ['Custom Software', 'Cloud & DevOps', 'Data & AI', 'Mobile', 'Security']
const logos = [
  'https://svgl.app/library/cloudflare.svg',
  'https://svgl.app/library/figma.svg',
  'https://svgl.app/library/google-cloud.svg',
  'https://svgl.app/library/spotify.svg',
]

export default function WorkMontage() {
  return (
    <div className="pointer-events-none absolute inset-0 bg-tile1">
      {/* Padded canvas, clustered to centre so the small F never sees an edge. */}
      <div className="absolute left-1/2 top-1/2 h-[150vmax] w-[150vmax] -translate-x-1/2 -translate-y-1/2">
        <div className="grid h-full w-full grid-cols-12 grid-rows-12 gap-[1.2vmax] p-[3vmax]">
          {/* Brand-blue hero panel */}
          <div className="col-span-7 row-span-4 overflow-hidden rounded-[1.6vmax] bg-primary p-[2.4vmax] text-white">
            <p className="text-[1.4vmax] font-semibold uppercase tracking-[0.14em] text-white/70">
              Our work
            </p>
            <p className="mt-[1vmax] font-display text-[3vmax] font-semibold leading-[1.05]">
              Platforms that ship, scale, and stay up.
            </p>
            <div className="mt-[1.6vmax] flex flex-wrap gap-[0.8vmax]">
              {chips.map((c) => (
                <span
                  key={c}
                  className="rounded-pill bg-white/15 px-[1.2vmax] py-[0.5vmax] text-[1.15vmax] font-medium"
                >
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Dashboard product render */}
          <div className="col-span-5 row-span-7 flex items-center justify-center overflow-hidden rounded-[1.6vmax] bg-tile2 p-[1.6vmax]">
            <AppMock className="w-full" />
          </div>

          {/* Brand showreel tile (static — the live reel is in FreedomSection) */}
          <div className="col-span-4 row-span-4 overflow-hidden rounded-[1.6vmax] bg-black">
            <div className="flex h-full w-full flex-col justify-end bg-[radial-gradient(120%_120%_at_30%_20%,#ff6b5a_0%,#ff4d8b_45%,#0a1a1a_100%)] p-[1.6vmax] text-white">
              <p className="text-[1.2vmax] font-semibold uppercase tracking-[0.14em] text-white/70">
                Showreel
              </p>
              <p className="font-display text-[1.9vmax] font-semibold leading-tight">Fieldwork to launch</p>
            </div>
          </div>

          {/* Stat panel */}
          <div className="col-span-3 row-span-4 flex flex-col justify-center rounded-[1.6vmax] bg-tile3 p-[2vmax] text-white">
            <p className="font-display text-[3.4vmax] font-semibold leading-none">99.98%</p>
            <p className="mt-[0.6vmax] text-[1.3vmax] text-bodymuted">Platform uptime</p>
          </div>

          {/* Gradient brand sweep */}
          <div className="col-span-7 row-span-3 overflow-hidden rounded-[1.6vmax]">
            <div className="h-full w-full bg-[linear-gradient(110deg,#ff4d8b_0%,#ff6b5a_55%,#0a1a1a_100%)]" />
          </div>

          {/* Service card */}
          <div className="col-span-5 row-span-3 flex flex-col justify-center rounded-[1.6vmax] bg-white p-[2vmax]">
            <p className="font-display text-[1.9vmax] font-semibold text-ink">Cloud &amp; DevOps</p>
            <p className="mt-[0.6vmax] text-[1.25vmax] text-ink-muted48">
              Infrastructure that scales quietly.
            </p>
          </div>

          {/* Quiet logo strip */}
          <div className="col-span-12 row-span-2 flex items-center justify-around gap-[2vmax] rounded-[1.6vmax] bg-tile2 px-[3vmax]">
            {logos.map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                aria-hidden="true"
                className="h-[2.4vmax] w-auto opacity-50 invert"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Subtle vignette so the montage reads as depth, not a flat sheet. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 120% at 50% 45%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}
