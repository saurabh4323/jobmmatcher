/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./lib/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Surface scale for the light theme (950 = base surface, white).
        ink: {
          950: "#ffffff",
          900: "#ffffff",
          850: "#f8fafc",
          800: "#f1f5f9",
          700: "#e2e8f0",
          600: "#cbd5e1",
        },
        brand: { DEFAULT: "#1d4ed8", light: "#3b82f6", dark: "#1e3a8a" }, // blue
        accent: { DEFAULT: "#059669", light: "#10b981", dark: "#065f46" }, // green
        info: "#0891b2",
        success: "#16a34a",
        warning: "#d97706",
        danger: "#dc2626",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        soft: "0 1px 2px rgba(15,23,42,.04), 0 4px 12px rgba(15,23,42,.06)",
        lift: "0 2px 4px rgba(15,23,42,.04), 0 12px 32px rgba(15,23,42,.10)",
      },
      keyframes: {
        "fade-up": {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up .35s ease-out both",
      },
    },
  },
  plugins: [],
};
