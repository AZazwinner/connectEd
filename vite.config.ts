// frontend/vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // --- ADD THIS SERVER CONFIGURATION ---
  server: {
    proxy: {
      // Any request starting with /api will be proxied
      '/api': {
        // The address of your Python backend
        target: 'https://connected-backend-hssr.onrender.com', // Or whatever port it's on
        changeOrigin: true,
      },
    }
  }
})