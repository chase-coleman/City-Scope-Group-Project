import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths';
import tailwindcss from "@tailwindcss/vite"

// https://vite.dev/config/
export default defineConfig({
<<<<<<< HEAD
  plugins: [
    react(),
    tailwindcss()
  ],
=======
  plugins: [react(), tsconfigPaths(), tailwindcss()],
>>>>>>> 53a75f1e616db67e823624b4cd81efe19626b198
})
