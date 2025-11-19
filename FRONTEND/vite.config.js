import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Keeps the frontend on port 3000
    host: true  // Mandatory for Docker to expose the port
  },
  test: {
    globals: true,              // Allows using 'describe', 'it', 'expect' without imports
    environment: 'jsdom',       // Simulates a browser environment
    setupFiles: './src/setupTests.js', // Runs setup before tests
    css: true,                  // Processes CSS during tests (optional but good for checking styles)
  }
})