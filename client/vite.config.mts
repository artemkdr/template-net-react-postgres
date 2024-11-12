/// <reference types="vitest" />

import { defineConfig } from "vite"
import tsconfigPaths from "vite-tsconfig-paths"
import react from "@vitejs/plugin-react-swc";
import checker from 'vite-plugin-checker';

export default defineConfig({
  plugins: [
    react(), 
    tsconfigPaths(), 
    checker({
      typescript: true,
      eslint: {
        lintCommand: "eslint .",
        useFlatConfig: true
      }
    })
  ],
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000,
  },
  test: {    
    environment: 'jsdom',
    globals: true,    
    setupFiles: './src/tests/setup.ts',
  }
})