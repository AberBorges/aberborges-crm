import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// v5 - offline localStorage sync
export default defineConfig({
    plugins: [react()],
    build: {
          rollupOptions: {
                  output: {
                            entryFileNames: `assets/[name]-[hash].js`,
                            chunkFileNames: `assets/[name]-[hash].js`,
                  }
          }
    }
})
