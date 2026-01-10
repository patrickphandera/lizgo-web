// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  // Don't define env here unless necessary
  server: {
    allowedHosts: ['d0406266fa3f.ngrok-free.app']
  }
})
