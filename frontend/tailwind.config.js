/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        sky: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          400: "#38bdf8",
          500: "#0ea5e9",
          600: "#0284c7",
        },
        violet: {
          100: "#ede9fe",
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        cyan: {
          400: "#22d3ee",
          500: "#06b6d4",
        }
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #e0f2fe 0%, #ede9fe 50%, #f0fdf4 100%)",
        "card-gradient": "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(240,249,255,0.7))",
        "btn-gradient": "linear-gradient(135deg, #0ea5e9, #8b5cf6)",
        "result-gradient": "linear-gradient(135deg, #0ea5e9 0%, #22d3ee 50%, #8b5cf6 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 2s linear infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        }
      },
      boxShadow: {
        glow: "0 0 30px rgba(14, 165, 233, 0.3)",
        "glow-purple": "0 0 30px rgba(139, 92, 246, 0.3)",
        card: "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        lifted: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};
