import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 2000, // bump the warning so you don’t get spammed at 500k
  },
  resolve: {
    alias: {
      web3: 'web3/dist/web3.min.js',
    },
  },
  base: "/geologicai-assignment"
});
