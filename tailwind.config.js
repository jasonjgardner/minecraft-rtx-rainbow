module.exports = {
  content: ["src/assets/css/input.css", "index.html"],
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
    require("tailwindcss-image-rendering")(),
  ],
  theme: {
    extend: {
      colors: {
        "minecraft-slate": {
          50: "#fcfdfd",
          100: "#e6e7e8",
          200: "#d0d1d4",
          300: "#8c8d90",
          400: "#6a6c70",
          500: "#606265",
          600: "#5a5b5c",
          700: "#48494a",
          800: "#313233",
          900: "#1e1e1f",
        },
        "minecraft-blue": "#2e6be5",
        "minecraft-green": {
          50: "#75b75d",
          100: "#52a535",
          200: "#3c8527",
          300: "#1d4d13",
        },
      },
    },
  },
};
