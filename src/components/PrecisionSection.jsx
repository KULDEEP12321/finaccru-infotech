// PrecisionSection — a "structured delivery" staircase.
// Style follows the provided EternaCloud/NexaCore spec (gradient lines, glass
// chips, badge, vw-based staircase); content is blended from protechplanner.com's
// 4-phase workflow (Discovery → Matching → Meet → Launch). Monochrome reskin:
// solid-ink type, single-blue accent, clean white surface.
//
// Static render only: no state, no hover, no animation.

const LOGO_ICON = '/favicon.svg' // our own mark, replacing the EternaCloud icon

const LINE_GRADIENT = 'linear-gradient(#0066cc, rgba(0,102,204,0))'

const PILLARS = [
  { label: 'Discover', items: ['needs', 'pain points', 'requirements', 'scope'], leftVw: 2.8, bottomVw: 7 },
  { label: 'Match', items: ['vetted talent', 'skills', 'timelines', 'fit'], leftVw: 22.4, bottomVw: 9.08 },
  { label: 'Validate', items: ['interview', 'assessment', 'alignment', 'sign-off'], leftVw: 41.2, bottomVw: 11.16 },
  { label: 'Launch', items: ['onboarding', 'contract', 'kickoff', 'go-live'], leftVw: 61.1, bottomVw: 13.24 },
]

const BADGE_SVG = (
  <svg width="19" height="18" style={{ flexShrink: 0 }} viewBox="0 0 17 16" fill="none">
    <g clipPath="url(#prec-clip)">
      <circle cx="8.5" cy="8" r="7" stroke="#0066cc" fill="none" />
      <path d="M9.5 11.5V10.5H7.5V11.5H9.5ZM7.5 14.5C7.5 15.0523 7.94772 15.5 8.5 15.5C9.05228 15.5 9.5 15.0523 9.5 14.5H7.5ZM8.5 11.5H7.5V14.5H8.5H9.5V11.5H8.5Z" fill="#0066cc" />
      <path d="M12 7H11V9H12V7ZM15 9C15.5523 9 16 8.55228 16 8C16 7.44772 15.5523 7 15 7V9ZM12 8V9H15V8V7L12 7V8Z" fill="#0066cc" />
      <path d="M5 9H6V7H5V9ZM2 7C1.44772 7 1 7.44772 1 8C1 8.55228 1.44772 9 2 9V7ZM5 8V7H2V8V9H5V8Z" fill="#0066cc" />
      <path d="M7.5 4.5V5.5H9.5V4.5H7.5ZM9.5 1.5C9.5 0.947715 9.05228 0.5 8.5 0.5C7.94772 0.5 7.5 0.947715 7.5 1.5H9.5ZM8.5 4.5H9.5V1.5H8.5H7.5V4.5H8.5Z" fill="#0066cc" />
    </g>
    <defs>
      <clipPath id="prec-clip">
        <rect width="16" height="16" fill="white" transform="translate(0.5)" />
      </clipPath>
    </defs>
  </svg>
)

export default function PrecisionSection() {
  return (
    <section
      style={{
        backgroundColor: '#ffffff',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: 'clamp(48px, 8vw, 120px) clamp(16px, 4vw, 60px) clamp(48px, 5.56vw, 80px)',
        gap: 'clamp(32px, 4vw, 56px)',
      }}
    >
      {/* ── Block 1 — Header ─────────────────────────────────── */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '36px' }}>
        {/* Badge pill */}
        <div
          style={{
            backgroundColor: 'rgb(249, 249, 249)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: 'clamp(14px, 1.1vw, 18px)',
            fontWeight: 500,
            borderRadius: '36px',
            padding: 'clamp(8px, 0.9vw, 14px) clamp(12px, 1.25vw, 20px)',
            color: '#1d1d1f',
            whiteSpace: 'nowrap',
          }}
        >
          {BADGE_SVG}
          Structured Delivery
        </div>

        {/* Heading + subtext */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            maxWidth: 'clamp(700px, 60vw, 900px)',
            gap: '22px',
          }}
        >
          <h2
            className="display-caps"
            style={{
              fontSize: 'clamp(28px, 4vw, 56px)',
              color: '#1d1d1f',
              margin: 0,
            }}
          >
            <span className="sm:whitespace-nowrap" style={{ display: 'block' }}>
              One vetted team, end-to-end.
            </span>
            <span
              style={{
                color: '#1d1d1f',
                paddingBottom: '0.3vw',
                display: 'block',
              }}
            >
              Compounding operational value.
            </span>
          </h2>

          <p style={{ fontSize: 'clamp(15px, 1.2vw, 20px)', color: '#7a7a7a', margin: 0 }}>
            Finaccru teams discover, match, validate and launch exactly the talent and systems that
            keep your programs on track.
          </p>
        </div>
      </div>

      {/* ── Block 2 — Pillars ────────────────────────────────── */}
      <div style={{ width: '100%', maxWidth: '82.292vw', margin: '0 auto' }}>
        {/* Desktop staircase */}
        <div
          className="hidden sm:block"
          style={{ position: 'relative', width: '82.292vw', height: '31.94vw', color: '#1d1d1f' }}
        >
          {PILLARS.map((pillar) => (
            <div
              key={pillar.label}
              style={{
                position: 'absolute',
                bottom: `${pillar.bottomVw}vw`,
                left: `${pillar.leftVw}vw`,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
              }}
            >
              {/* Chip */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  fontSize: '18px',
                  fontWeight: 500,
                  borderRadius: '20px',
                  paddingTop: '0.972vw',
                  paddingBottom: '0.972vw',
                  paddingLeft: '1.736vw',
                  paddingRight: '1.736vw',
                  whiteSpace: 'nowrap',
                  gap: '8px',
                }}
              >
                <img src={LOGO_ICON} alt="" style={{ width: '1.111vw', height: 'auto', display: 'inline-block' }} />
                {pillar.label}
              </div>

              {/* Line + items */}
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '0.56vw',
                    left: '1.94vw',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    fontSize: '16px',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                  }}
                >
                  {pillar.items.map((item) => (
                    <div
                      key={item}
                      style={{
                        paddingTop: '0.69vw',
                        paddingBottom: '0.69vw',
                        paddingLeft: '1.04vw',
                        paddingRight: '1.04vw',
                        display: 'flex',
                        alignItems: 'flex-start',
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                <div style={{ backgroundImage: LINE_GRADIENT, width: '1px', height: '14.24vw' }} />
              </div>
            </div>
          ))}
        </div>

        {/* Mobile alternating flow */}
        <div className="flex flex-col sm:hidden w-full" style={{ color: '#1d1d1f', gap: 0 }}>
          {PILLARS.map((pillar, index) => {
            const isRight = index % 2 !== 0
            return (
              <div
                key={pillar.label}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: isRight ? 'flex-end' : 'flex-start',
                  width: '100%',
                  paddingBottom: '8px',
                }}
              >
                {/* Chip */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e0e0e0',
                    fontSize: '15px',
                    fontWeight: 500,
                    borderRadius: '20px',
                    padding: '10px 18px',
                    whiteSpace: 'nowrap',
                    gap: '7px',
                  }}
                >
                  <img src={LOGO_ICON} alt="" style={{ width: 16, height: 'auto' }} />
                  {pillar.label}
                </div>

                {/* Line + items row */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: isRight ? 'row-reverse' : 'row',
                    alignItems: 'stretch',
                    width: '100%',
                  }}
                >
                  <div
                    style={{
                      width: '1px',
                      flexShrink: 0,
                      backgroundImage: LINE_GRADIENT,
                      marginLeft: isRight ? 0 : '22px',
                      marginRight: isRight ? '22px' : 0,
                      minHeight: '120px',
                    }}
                  />
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 0,
                      paddingLeft: isRight ? 0 : '20px',
                      paddingRight: isRight ? '20px' : 0,
                      paddingTop: '8px',
                      paddingBottom: '8px',
                      alignItems: isRight ? 'flex-end' : 'flex-start',
                    }}
                  >
                    {pillar.items.map((item) => (
                      <div key={item} style={{ fontSize: '14px', color: '#7a7a7a', padding: '8px 0' }}>
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
