import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Syne'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f0ff",
          100: "#e4e4ff",
          200: "#ccccff",
          300: "#a8a8ff",
          400: "#8080ff",
          500: "#6157f6",
          600: "#5240eb",
          700: "#4530d0",
          800: "#3928a8",
          900: "#302585",
          950: "#1e1660",
        },
        surface: {
          DEFAULT: "var(--color-bg)",
          1: "var(--color-surface1)",
          2: "var(--color-surface2)",
          3: "var(--color-surface3)",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #6157f6 0%, #a855f7 50%, #06b6d4 100%)",
        "gradient-card":  "linear-gradient(135deg, rgba(97,87,246,0.12) 0%, rgba(168,85,247,0.08) 100%)",
        "gradient-glow":  "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(97,87,246,0.4) 0%, transparent 70%)",
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.5s ease forwards",
        "glow-pulse": "glowPulse 3s ease-in-out infinite",
        "float":      "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp:    { "0%": { opacity: "0", transform: "translateY(20px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        fadeIn:    { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        glowPulse: { "0%,100%": { opacity: "0.6" }, "50%": { opacity: "1" } },
        float:     { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-12px)" } },
      },
      boxShadow: {
        glow:   "0 0 40px rgba(97,87,246,0.35)",
        "glow-sm": "0 0 20px rgba(97,87,246,0.25)",
        card:   "0 4px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
