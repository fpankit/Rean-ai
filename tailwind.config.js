/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#000000',
          card: '#0B0D14',
          surface: '#111420',
          border: '#1E2336',
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", 'Outfit', 'Inter', 'sans-serif'],
        jakarta: ["'Plus Jakarta Sans'", 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'ripple': 'ripple 3s linear infinite',
        'wave': 'wave 1.2s ease-in-out infinite',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 25px rgba(99, 102, 241, 0.4)' },
          '50%': { boxShadow: '0 0 50px rgba(99, 102, 241, 0.8)' },
        },
        wave: {
          '0%, 100%': { transform: 'scaleY(0.3)' },
          '50%': { transform: 'scaleY(1)' },
        }
      }
    },
  },
  plugins: [],
}
