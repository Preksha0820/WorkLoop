// tailwind.config.js
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // ensure your file paths are correct
  ],
  theme: {
    extend: {
      input: 'w-full border px-3 py-2 rounded outline-blue-500',
      animation: {
        scroll: 'scroll 8s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};
