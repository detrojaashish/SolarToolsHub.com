import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// OUT=<dir> lets several builds run side by side (e.g. OUT=dist-design). Default: dist
const OUT = process.env.OUT || 'dist';

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  publicDir: isSsrBuild ? false : 'public',
  build: isSsrBuild
    ? { outDir: OUT + '-server', emptyOutDir: true, minify: false }
    : {
        outDir: OUT,
        emptyOutDir: true,
        manifest: true,
        target: 'es2019',
        cssCodeSplit: false,
        modulePreload: { polyfill: false },
        rollupOptions: {
          input: 'src/client.js',
          output: {
            entryFileNames: 'assets/[name]-[hash].js',
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash][extname]',
            manualChunks(id) {
              // keep tiny runtime helpers out of the big lazy chunks (otherwise jsPDF loads on every page)
              if (id.includes('preload-helper') || id.includes('commonjsHelpers') || id.includes('modulepreload-polyfill')) return 'rt';
              if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) return 'react';
              if (id.includes('jspdf') || id.includes('fflate') || id.includes('html2canvas') || id.includes('dompurify') || id.includes('canvg')) return 'pdf';
            },
          },
        },
      },
}));
