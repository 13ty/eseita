import { defineConfig } from 'vite';
    import react from '@vitejs/plugin-react';
    import { compression } from 'vite-plugin-compression2';
    import { visualizer } from 'rollup-plugin-visualizer';

    export default defineConfig({
      plugins: [
        react(),
        compression({
          algorithm: 'gzip',
          exclude: [/\.(br)$/, /\.(gz)$/]
        }),
        visualizer({
          filename: './stats.html',
          open: false
        })
      ],
      build: {
        chunkSizeWarningLimit: 1000,
        rollupOptions: {
          output: {
            manualChunks(id) {
              if (id.includes('node_modules')) {
                return 'vendor';
              }
            }
          }
        },
        sourcemap: true
      },
      server: {
        port: 3000,
        open: true,
        proxy: {
          '/api': {
            target: 'http://localhost:11434',
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, '')
          }
        }
      },
      optimizeDeps: {
        include: [
          'react', 
          'react-dom', 
          'axios', 
          'react-icons',
          'react-modal'
        ]
      }
    });
