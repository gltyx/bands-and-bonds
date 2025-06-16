import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: './',
  server: {
    allowedHosts: true,
  },
  plugins: [vue()],
})
