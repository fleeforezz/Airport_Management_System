/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        swiss: {
          black: "#000000",
          charcoal: "#111111",
          muted: "#4B5563",
          subtle: "#9CA3AF",
          border: "#E5E7EB",
          borderDark: "#1F2937",
          bg: "#F5F5F5",
          white: "#FFFFFF",
          red: "#DC2626",
          redHover: "#B91C1C",
          redSubtle: "#FEF2F2"
        },
        surface: {
          DEFAULT: '#f9f9f9',
          dim: '#dadada',
          bright: '#f9f9f9',
          container: '#eeeeee',
          lowest: '#ffffff',
          low: '#f3f3f3',
          high: '#e8e8e8',
          highest: '#e2e2e2',
        },
        primary: {
          DEFAULT: '#000000',
          container: '#1b1b1b',
          inverse: '#c6c6c6',
        },
        secondary: {
          DEFAULT: '#bb0112',
          container: '#e02928',
        },
        error: {
          DEFAULT: '#ba1a1a',
          container: '#ffdad6',
        }
      },
      fontFamily: {
        sans: ['"Inter"', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      borderRadius: {
        none: '0px',
        sm: '0px',
        DEFAULT: '0px',
        md: '0px',
        lg: '0px',
        xl: '0px',
        '2xl': '0px',
        full: '0px',
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.02em',
        caps: '0.08em',
        mono: '0.12em',
      }
    },
  },
  plugins: [],
}
