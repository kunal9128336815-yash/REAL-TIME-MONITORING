import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
    proxy: {
      '/pi-proxy': {
        target: 'http://192.168.137.214:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pi-proxy/, '/data'),
      },
    },
  },
})
