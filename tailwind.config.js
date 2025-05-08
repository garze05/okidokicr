// tailwind.config.js
export default {
  content: [
    "./src/**/*.{astro,html,js,jsx,ts,tsx,svelte,vue}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)'],
        primary: ['var(--font-primary)'],
        secondary: ['var(--font-secondary)'],
        okidoki: ['var(--font-okidoki)'],
      },
    },
  },
  plugins: [],
};
