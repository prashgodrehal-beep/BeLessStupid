import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ── Fonts ───────────────────────────────────────────────────────────────
      fontFamily: {
        sans:     ["var(--font-dm-sans)", "Inter", "sans-serif"],
        playfair: ["var(--font-playfair)", "Playfair Display", "serif"],
        mono:     ["var(--font-jetbrains)", "JetBrains Mono", "monospace"],
      },
      // ── Colours (mirror globals.css CSS variables) ───────────────────────
      colors: {
        bg:          "#F8F7F4",
        surface:     "#FFFFFF",
        "surface-high": "#F1F0EC",
        border:      "#E6E4DF",
        "border-high": "#D0CEC8",
        text: {
          DEFAULT: "#1C1917",
          muted:   "#6B6762",
          dim:     "#A8A49E",
        },
        amber: {
          DEFAULT: "#B5720A",
          light:   "#D4890F",
          bg:      "#FEF3E2",
          border:  "#F5C97A",
        },
        green: {
          DEFAULT: "#16783A",
          bg:      "#F0FDF4",
          border:  "#86EFAC",
        },
        red: {
          DEFAULT: "#C0392B",
          bg:      "#FEF2F2",
          border:  "#FECACA",
        },
        blue: {
          DEFAULT: "#1D5FAD",
          bg:      "#EFF6FF",
          border:  "#BFDBFE",
        },
        purple: {
          DEFAULT: "#6D28D9",
          bg:      "#F5F3FF",
          border:  "#C4B5FD",
        },
      },
      // ── Border radius ────────────────────────────────────────────────────
      borderRadius: {
        card: "14px",
        chip: "20px",
        btn:  "8px",
        icon: "10px",
      },
      // ── Box shadow ───────────────────────────────────────────────────────
      boxShadow: {
        card:     "0 1px 4px rgba(0,0,0,.05)",
        elevated: "0 2px 12px rgba(0,0,0,.07)",
        modal:    "0 20px 60px rgba(0,0,0,.15)",
      },
      // ── Animation ────────────────────────────────────────────────────────
      keyframes: {
        fadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%,100%": { opacity: "1" },
          "50%":     { opacity: "0.3" },
        },
        scaleIn: {
          from: { opacity: "0", transform: "scale(0.95)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
        popIn: {
          from: { opacity: "0", transform: "scale(0.88)" },
          to:   { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.30s ease forwards",
        "blink":    "blink 1.40s ease infinite",
        "scale-in": "scaleIn 0.18s ease forwards",
        "pop-in":   "popIn 0.20s ease forwards",
      },
    },
  },
  plugins: [],
};

export default config;
