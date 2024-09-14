import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        // Entry points for different parts of the extension
        background: resolve(__dirname, 'src/background.js'),  // Background (service worker)
        content: resolve(__dirname, 'src/contentScript.js'),  // Content script
        popup: resolve(__dirname, 'index.html'),  // Popup HTML file (moved to root)
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === 'background') {
            return 'background.js';  // Background script at the root
          }
          return 'src/[name].js';  // For other files like content scripts
        },
        assetFileNames: 'assets/[name][extname]',  // Ensure proper asset paths
      },
    }
  }
});
