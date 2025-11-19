import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true
  },
  test: {
    globals: true,              
    environment: 'jsdom',      
    setupFiles: './src/setupTests.js', 
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'src/main.jsx', 
        'src/setupTests.js',
        '**/*.config.js',
        '**/*.cjs',
        '**/dist/**',
        '**/*.test.jsx',  
        '**/*.spec.jsx'    
      ]
    }               
  }
})