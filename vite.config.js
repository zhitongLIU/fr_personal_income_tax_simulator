import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/tax_simulator/', // Base path pour GitHub Pages (changez si votre repo a un nom différent)
})
