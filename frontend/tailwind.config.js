/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body: ["'Cabinet Grotesk'", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#fff1f9",
          100: "#ffe4f3",
          200: "#ffc9e7",
          300: "#ff9dd2",
          400: "#ff60b3",
          500: "#ff2d8d",
          600: "#f0006e",
          700: "#cc005b",
          800: "#a8004c",
          900: "#8c0041",
        },
        violet: {
          50:  "#f5f0ff",
          100: "#ede0ff",
          200: "#d9c0ff",
          300: "#be90ff",
          400: "#9f55ff",
          500: "#8020ff",
          600: "#6b0df7",
          700: "#5a00e0",
          800: "#4900b8",
          900: "#3d0096",
        },
        surface: "#0a0a0f",
        card:    "#12121a",
        border:  "#1e1e2e",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "hero-gradient": "linear-gradient(135deg, #0a0a0f 0%, #12001f 50%, #0a0a0f 100%)",
        "card-gradient": "linear-gradient(145deg, #12121a, #1a1a2e)",
        "brand-gradient": "linear-gradient(135deg, #ff2d8d, #8020ff)",
        "brand-gradient-hover": "linear-gradient(135deg, #ff60b3, #9f55ff)",
      },
      animation: {
        "fade-up":    "fadeUp 0.6s ease forwards",
        "fade-in":    "fadeIn 0.4s ease forwards",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float":      "float 6s ease-in-out infinite",
        "shimmer":    "shimmer 2s linear infinite",
      },
      keyframes: {
        fadeUp:  { "0%": { opacity: 0, transform: "translateY(24px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:  { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
        float:   { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-12px)" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
