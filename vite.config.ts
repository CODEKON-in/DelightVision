import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Honour an assigned PORT so the dev server can move off a busy 5173.
    port: Number(process.env.PORT) || 5173,
  },
})
