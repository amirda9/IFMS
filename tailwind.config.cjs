/** @type {import("tailwindcss").Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        p: "#006BBC",
        b: "#E7EFF7",
        g: "#D9D9D9",
        buttonColor: "#B3BDF2",
        blueLight: "#9BC7F4",
        goodGray: "#D9D9D9",
        gray96: "#969696",
        gis:"#C0E7F2",
      },
      fontFamily: {
        s: ["Sansation"]
      }
    }
  },
  plugins: []
};
