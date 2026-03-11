import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/salary-calculator-india/',
  test: {
    environment: 'jsdom',
    setupFiles: './src/test/setup.js'
  }
});
