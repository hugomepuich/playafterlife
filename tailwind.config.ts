import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'medieval': {
          900: '#000000', // noir pur
          800: '#0A0A0A', // presque noir
          700: '#121212', // gris très foncé
          600: '#1A1A1A', // gris foncé
          500: '#2A2A2A', // gris moyen-foncé
          400: '#3A3A3A', // gris moyen
          300: '#808080', // gris moyen-clair
          accent: '#0F0F0F', // noir pour les accents
          highlight: '#FFFFFF', // blanc pur pour les surbrillances
          ethereal: '#E0E0E0', // blanc cassé éthéré
          parchment: '#FFFFFF', // blanc pur (parchemin)
          corruption: '#1A1A1A', // gris foncé pour représenter la corruption
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "bg-1": "url('/backgrounds/HighresScreenshot00017.png')",
        "bg-2": "url('/backgrounds/HighresScreenshot00018.png')",
        "bg-3": "url('/backgrounds/HighresScreenshot00021.png')",
        "bg-4": "url('/backgrounds/HighresScreenshot00082.png')",
        "bg-5": "url('/backgrounds/HighresScreenshot00091.png')",
        "bg-6": "url('/backgrounds/HighresScreenshot00097.png')",
      },
      fontFamily: {
        'title': ['Cinzel', 'serif'],
        'body': ['EB Garamond', 'serif'],
      },
      boxShadow: {
        'medieval': '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(0, 0, 0, 0.1)',
        'ethereal': '0 0 15px rgba(255, 255, 255, 0.3)',
        'glow': '0 0 20px rgba(255, 255, 255, 0.4)',
        'medieval-glow': '0 0 25px rgba(255, 255, 255, 0.25)',
      },
      borderWidth: {
        '3': '3px',
      },
      animation: {
        'float-slow': 'float 8s ease-in-out infinite',
        'float-medium': 'float 6s ease-in-out infinite',
        'float-fast': 'float 4s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '25%': { transform: 'translateY(-15px) translateX(15px)' },
          '50%': { transform: 'translateY(-25px) translateX(0)' },
          '75%': { transform: 'translateY(-15px) translateX(-15px)' },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
export default config; 