import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://tapovan-stock.onrender.com',
        changeOrigin: true,
      },
    },
  },
})
