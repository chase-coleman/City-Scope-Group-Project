const {heroui} = require("@heroui/react");

module.exports = {
  content: [
    "./src/**/*.{html,js,jsx,ts,tsx}", // Update this with the correct paths if needed
  ],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/line-clamp'), 
    heroui()
  ],
}
