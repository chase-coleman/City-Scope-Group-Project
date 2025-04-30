<<<<<<< HEAD
/** @type {import('tailwindcss').Config} */
=======
import { heroui } from "@heroui/react";

>>>>>>> 53a75f1e616db67e823624b4cd81efe19626b198
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
<<<<<<< HEAD
=======
    "./node_modules/@heroui/react/dist/**/*.{js,ts,jsx,tsx}" // Updated path to match package
>>>>>>> 53a75f1e616db67e823624b4cd81efe19626b198
  ],
  theme: {
    extend: {},
  },
  plugins: [
<<<<<<< HEAD
    require('@tailwindcss/line-clamp'),
  ],
};
=======
    require('@tailwindcss/line-clamp'), 
    heroui()
  ],
};
>>>>>>> 53a75f1e616db67e823624b4cd81efe19626b198
