import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://<user>.github.io/seating-chart/ on GitHub Pages.
  // Change to "/" if deploying to a user/org site (<user>.github.io repo).
  base: "/seating-chart/",
  plugins: [react(), tailwindcss()],
})
