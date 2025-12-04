import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              // Split vendor code
              'vendor-react': ['react', 'react-dom', 'react-router-dom'],
              'vendor-icons': ['lucide-react'],
              // Split heavy services into separate chunks
              'pdf-service': ['./services/pdfService'],
              'email-service': ['./services/emailService'],
              // Split theme renderers
              'invoice-themes': ['./components/InvoiceThemeRenderer'],
              'contract-themes': ['./components/ContractThemeRenderer']
            }
          }
        },
        chunkSizeWarningLimit: 600, // Increase to 600KB for vendor bundles
      }
    };
});
