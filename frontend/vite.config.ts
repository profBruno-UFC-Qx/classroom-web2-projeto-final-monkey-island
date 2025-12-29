import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite' // Mantenha se estiver usando tailwind

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Aqui dizemos que o '@' aponta para a pasta 'src'
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})