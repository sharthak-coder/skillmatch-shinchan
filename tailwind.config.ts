import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        shin: {
          cream: "#FFFDF9",
          canvas: "#FFF9EE",
          paper: "#FFFFFF",
          red: {
            DEFAULT: "#EF4444",
            hover: "#DC2626",
            light: "#FEE2E2",
            50: "#FEF2F2",
          },
          yellow: {
            DEFAULT: "#FACC15",
            hover: "#EAB308",
            light: "#FEF9C3",
            50: "#FEFCE8",
          },
          blue: {
            DEFAULT: "#0284C7",
            sky: "#38BDF8",
            light: "#E0F2FE",
            50: "#F0F9FF",
          },
          kamen: {
            purple: "#7C3AED",
            green: "#10B981",
            gold: "#F59E0B",
          },
          shiro: {
            white: "#FFFFFF",
            fur: "#F8FAFC",
            gray: "#94A3B8",
          },
          ink: {
            DEFAULT: "#1E293B",
            muted: "#64748B",
            subtle: "#94A3B8",
          },
        },
      },
      boxShadow: {
        'pop': '4px 4px 0px 0px rgba(30, 41, 59, 1)',
        'pop-sm': '2px 2px 0px 0px rgba(30, 41, 59, 1)',
        'pop-lg': '6px 6px 0px 0px rgba(30, 41, 59, 1)',
        'pop-red': '4px 4px 0px 0px #EF4444',
        'pop-yellow': '4px 4px 0px 0px #F59E0B',
        'pop-blue': '4px 4px 0px 0px #0284C7',
      },
      animation: {
        'bounce-subtle': 'bounceSubtle 2s infinite ease-in-out',
        'pulse-glow': 'pulseGlow 2.5s infinite ease-in-out',
        'float-slow': 'floatSlow 4s infinite ease-in-out',
        'wiggle': 'wiggle 1s ease-in-out infinite',
      },
      keyframes: {
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-8px) rotate(1.5deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
export default config;
