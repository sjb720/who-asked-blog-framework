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
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
          muted: "var(--bg-muted)",
          overlay: "var(--bg-overlay)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          muted: "var(--text-muted)",
          placeholder: "var(--text-placeholder)",
          disabled: "var(--text-disabled)",
          inverse: "var(--text-inverse)",
        },
        border: {
          primary: "var(--border-primary)",
          secondary: "var(--border-secondary)",
          focus: "var(--border-focus)",
        },
        accent: {
          primary: "var(--accent-primary)",
          "primary-hover": "var(--accent-primary-hover)",
          "primary-light": "var(--accent-primary-light)",
          "primary-dark": "var(--accent-primary-dark)",
          secondary: "var(--accent-secondary)",
          "secondary-hover": "var(--accent-secondary-hover)",
        },
        status: {
          "success-bg": "var(--status-success-bg)",
          "success-text": "var(--status-success-text)",
          "warning-bg": "var(--status-warning-bg)",
          "warning-text": "var(--status-warning-text)",
          "error-bg": "var(--status-error-bg)",
          "error-text": "var(--status-error-text)",
          error: "var(--status-error)",
          "error-hover": "var(--status-error-hover)",
          "error-dark": "var(--status-error-dark)",
        },
        hover: {
          bg: "var(--hover-bg)",
        },
        active: {
          bg: "var(--active-bg)",
        },
        focus: {
          ring: "var(--focus-ring)",
        },
      },
      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },
      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },
      transitionDuration: {
        fast: "var(--transition-fast)",
        normal: "var(--transition-normal)",
        slow: "var(--transition-slow)",
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
          },
        },
      },
    },
  },
  plugins: [],
};

export default config;
