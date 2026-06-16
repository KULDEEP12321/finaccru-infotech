/** @type {import('tailwindcss').Config} */
// Design tokens map 1:1 to design.md (Apple-design-analysis).
// Edit tokens here, not inline hex, per the design.md Iteration Guide.
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    // The single accent + the surface ladder. No second brand color exists.
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0066cc', // Action Blue — the one interactive color
          focus: '#0071e3',   // keyboard focus ring
          ondark: '#2997ff',  // Sky Link Blue — links on dark tiles only
        },
        ink: {
          DEFAULT: '#1d1d1f', // near-black ink for all headlines + body
          muted80: '#333333',
          muted48: '#7a7a7a',
        },
        bodymuted: '#cccccc',  // secondary copy on dark tiles
        divider: '#f0f0f0',
        hairline: '#e0e0e0',
        canvas: '#ffffff',
        parchment: '#f5f5f7',  // signature off-white
        pearl: '#fafafc',
        tile1: '#272729',      // primary dark tile
        tile2: '#2a2a2c',      // micro-step lighter
        tile3: '#252527',      // micro-step darker
        void: '#000000',       // global nav only
        chip: 'rgba(210,210,215,0.64)',
      },
      fontFamily: {
        // Jost = the free Futura substitute → the Podium-clean geometric display voice.
        display: ['"Jost"', 'Futura', 'system-ui', 'sans-serif'],
        // Inter for body copy (readable at small sizes).
        text: ['"Inter"', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }] — the Apple-tight type ladder.
        hero: ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
        'display-lg': ['40px', { lineHeight: '1.1', letterSpacing: '0', fontWeight: '600' }],
        'display-md': ['34px', { lineHeight: '1.12', letterSpacing: '-0.374px', fontWeight: '600' }],
        lead: ['28px', { lineHeight: '1.21', letterSpacing: '0.196px' }],
        'lead-airy': ['24px', { lineHeight: '1.5', letterSpacing: '0', fontWeight: '300' }],
        tagline: ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '600' }],
        'body-lg': ['17px', { lineHeight: '1.47', letterSpacing: '-0.374px' }],
        caption: ['14px', { lineHeight: '1.43', letterSpacing: '-0.224px' }],
        fine: ['12px', { lineHeight: '1.33', letterSpacing: '-0.12px' }],
        micro: ['10px', { lineHeight: '1.3', letterSpacing: '-0.08px' }],
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
