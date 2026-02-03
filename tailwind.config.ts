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
        // Background colors
        "bg-primary": "var(--bg-primary)",
        "bg-secondary": "var(--bg-secondary)",
        "bg-card": "var(--bg-card)",

        // Accent colors
        "accent-coral": "var(--accent-coral)",
        "accent-cyan": "var(--accent-cyan)",

        // Text colors
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",

        // Legacy compatibility
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        clash: ["var(--font-clash)", "system-ui", "sans-serif"],
        satoshi: ["var(--font-satoshi)", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "gradient-accent":
          "linear-gradient(135deg, var(--accent-coral) 0%, var(--accent-cyan) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 6s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        glow: {
          "0%": { boxShadow: "0 0 20px rgba(0, 229, 204, 0.3)" },
          "100%": { boxShadow: "0 0 40px rgba(0, 229, 204, 0.6)" },
        },
      },
      boxShadow: {
        "glow-coral": "0 0 20px rgba(255, 77, 77, 0.4)",
        "glow-cyan": "0 0 20px rgba(0, 229, 204, 0.4)",
      },
    },
  },
  plugins: [],
};

export default config;
