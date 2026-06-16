// A faux product UI for the hero — the "render resting on a surface" that earns
// the system's single drop-shadow. Pure solids, no gradients, accent used sparingly.
const bars = [42, 58, 50, 72, 64, 88, 78, 96]

export default function AppMock({ className = '' }) {
  return (
    <div
      className={`overflow-hidden rounded-lg bg-white shadow-product ring-1 ring-black/[0.04] ${className}`}
      aria-hidden="true"
    >
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-hairline/70 bg-pearl px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <div className="ml-3 h-5 w-44 rounded-pill bg-parchment" />
      </div>

      <div className="grid grid-cols-[140px_1fr]">
        {/* sidebar */}
        <div className="hidden flex-col gap-2 border-r border-hairline/70 p-4 sm:flex">
          <div className="mb-2 h-5 w-20 rounded bg-ink/90" />
          {['Overview', 'Pipelines', 'Reports', 'Settings'].map((l, i) => (
            <div
              key={l}
              className={`flex items-center gap-2 rounded-md px-2 py-1.5 ${
                i === 0 ? 'bg-primary/10' : ''
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-primary' : 'bg-hairline'}`} />
              <span className={`h-2 w-14 rounded ${i === 0 ? 'bg-primary/70' : 'bg-hairline'}`} />
            </div>
          ))}
        </div>

        {/* main */}
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="h-4 w-28 rounded bg-ink/80" />
            <div className="h-6 w-20 rounded-pill bg-primary" />
          </div>

          {/* KPI cards */}
          <div className="mb-5 grid grid-cols-3 gap-3">
            {[
              { v: '99.98%', l: 'Uptime' },
              { v: '1.2M', l: 'Requests' },
              { v: '34ms', l: 'p95' },
            ].map((k) => (
              <div key={k.l} className="rounded-md border border-hairline/70 p-3">
                <div className="text-[15px] font-semibold tracking-tight text-ink">{k.v}</div>
                <div className="mt-0.5 text-[10px] text-ink-muted48">{k.l}</div>
              </div>
            ))}
          </div>

          {/* chart */}
          <div className="rounded-md border border-hairline/70 p-4">
            <div className="mb-3 h-2.5 w-24 rounded bg-hairline" />
            <div className="flex h-28 items-end gap-2.5">
              {bars.map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t-sm ${i === bars.length - 1 ? 'bg-primary' : 'bg-primary/25'}`}
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
