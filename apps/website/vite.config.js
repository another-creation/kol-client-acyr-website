import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import svgr from 'vite-plugin-svgr'

// https://vite.dev/config/
// redeploy trigger 2026-05-18
export default defineConfig({
  // .env.local lives at repo root so Node scripts (sync-printful, migrate-sanity)
  // and Vite share the same secrets file.
  envDir: '../../',
  // host: true binds 0.0.0.0 (all interfaces) so the dev server is reachable
  // over the LAN (192.168.x) and the tailnet (100.x) IP, not just localhost.
  server: { host: true },
  plugins: [react(), svgr(), tailwindcss()],
})
