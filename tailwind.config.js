/** @type {import('tailwindcss').Config} */
// Design tokens map 1:1 to design2.md (Clay-design-analysis).
// Edit tokens here, not inline hex, per the design2.md Iteration Guide.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // --- Action color. Clay's single action is near-black (was Apple Action Blue). ---
        primary: {
          DEFAULT: '#0a0a0a', // near-black — all primary CTAs + ink action/links
          focus: '#0a0a0a',   // focus ring = ink ("border thickens to ink")
          ondark: '#ffffff',  // action/link on dark teal surfaces
        },
        ink: {
          DEFAULT: '#0a0a0a', // headlines + primary text
          muted80: '#3a3a3a', // body — default running-text (Clay {colors.body})
          muted48: '#6a6a6a', // muted — sub-heads, footer body (Clay {colors.muted})
        },
        bodymuted: '#9a9a9a',  // muted-soft — captions / secondary copy
        divider: '#e5e5e5',    // hairline
        hairline: '#e5e5e5',   // 1px borders on cards + inputs
        canvas: '#fffaf0',     // cream-tinted white — the page floor
        parchment: '#faf5e8',  // surface-soft — footer / CTA-band / alt light band
        pearl: '#f5f0e0',      // surface-card — cream feature/testimonial cards
        tile1: '#1a2a2a',      // surface-dark-elevated (teal-tinted near-black)
        tile2: '#1a2a2a',      // surface-dark-elevated
        tile3: '#0a1a1a',      // surface-dark
        void: '#0a0a0a',       // ink (Clay uses no pure black)
        chip: 'rgba(245,240,224,0.7)', // translucent cream chip

        // --- Clay brand palette (design2.md). Additive; use the right card per feature. ---
        brand: {
          pink: '#ff4d8b',     // outbound / sequencer
          teal: '#1a3a3a',     // enterprise / featured
          lavender: '#b8a4ed', // AI-agent products
          peach: '#ffb084',    // general SaaS warmth
          ochre: '#e8b94a',    // community / experts + illustration accents
          mint: '#a4d4c5',     // illustration + badge accent
          coral: '#ff6b5a',    // highlight accent
        },
        surface: {
          soft: '#faf5e8',           // footer / CTA-band
          card: '#f5f0e0',           // cream feature / testimonial cards
          strong: '#ebe6d6',         // emphasized cream bands
          dark: '#0a1a1a',           // occasional dark cards (rare)
          'dark-elevated': '#1a2a2a',
        },
        body: {
          DEFAULT: '#3a3a3a', // default running-text
          strong: '#1a1a1a',  // emphasized body / lead paragraphs
        },
        muted: {
          DEFAULT: '#6a6a6a', // sub-heads, breadcrumbs, footer body
          soft: '#9a9a9a',    // captions, fine-print
        },
        onprimary: '#ffffff', // text on primary buttons + dark cards
        ondark: '#ffffff',
        success: '#22c55e',
        warning: '#f59e0b',
        error: '#ef4444',
      },
      fontFamily: {
        // Clay: Plain Black (licensed) → Inter weight 500 + negative tracking is the
        // display substitute; Inter also handles all body/UI. One type system.
        display: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        text: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing, fontWeight }] — Clay character:
        // display stays weight 500 (never bolder) with negative tracking; body 400, tracking 0.
        hero: ['56px', { lineHeight: '1.05', letterSpacing: '-2px', fontWeight: '500' }],
        'display-lg': ['40px', { lineHeight: '1.1', letterSpacing: '-1px', fontWeight: '500' }],
        'display-md': ['34px', { lineHeight: '1.15', letterSpacing: '-0.6px', fontWeight: '500' }],
        lead: ['28px', { lineHeight: '1.35', letterSpacing: '-0.3px', fontWeight: '400' }],
        'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        tagline: ['21px', { lineHeight: '1.3', letterSpacing: '-0.3px', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.55', letterSpacing: '0', fontWeight: '400' }],
        caption: ['14px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '400' }],
        fine: ['12px', { lineHeight: '1.4', letterSpacing: '0', fontWeight: '400' }],
        micro: ['10px', { lineHeight: '1.3', letterSpacing: '0', fontWeight: '400' }],
      },
      borderRadius: {
        none: '0px',
        xs: '5px',
        sm: '8px',
        md: '11px',
        lg: '18px',
        pill: '9999px',
      },
      spacing: {
        section: '80px',
        18: '72px',
      },
      maxWidth: {
        content: '980px',
        wide: '1440px',
      },
      boxShadow: {
        // The ONLY shadow in the system — for "product" renders resting on a surface.
        product: '3px 5px 30px 0 rgba(0,0,0,0.22)',
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.28, 0.11, 0.32, 1)',
      },
    },
  },
  plugins: [],
}
