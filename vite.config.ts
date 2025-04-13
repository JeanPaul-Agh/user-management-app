import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteMockServe } from 'vite-plugin-mock';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteMockServe({
      mockPath: './mock', // path to your mock files
      enable: true, // enable mock in development
      watchFiles: true, // watch for file changes
      logger: true, // show request logs in console
    }),
  ],
});