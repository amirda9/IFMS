/** @type {import('tailwindcss').Config} */
module.exports= {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        p:"#006BBC",
        b:'#E7EFF7',
        g:'#D9D9D9',
        blueLight:"#9BC7F4",
        goodGray:"#D9D9D9",
      },
      fontFamily:{
        s:["Sansation"]
      }
    },
  },
  plugins: [],
}
