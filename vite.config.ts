import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  
  server: {
    port: 5173,
    host: true
  },
  
  build: {
    outDir: 'dist',
    sourcemap: false,  // Desabilita sourcemaps em produção
    minify: 'terser',  // Minificação agressiva
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console.log em produção
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui-vendor': ['@mui/material', '@mui/icons-material'],
          'query-vendor': ['@tanstack/react-query'],
        },
      },
    },
  },
})



//export default defineConfig(({ mode }) => {
//  // Carrega variáveis de ambiente
//  const env = loadEnv(mode, process.cwd(), '')
//  
//  return {
//    plugins: [react()],
//    server: {
//      host: '0.0.0.0',
//      port: 5173,
//      watch: {
//        usePolling: true,
//      },
//      strictPort: true,
//      proxy: {
//        // Redireciona /api/* para o LocalStack
//        '/api': {
//          target: `http://localstack-lambda:4566/restapis/${env.VITE_API_ID}/dev/_user_request_`,
//          changeOrigin: true,
//          rewrite: (path) => path.replace(/^\/api/, ''),
//          configure: (proxy, options) => {
//            proxy.on('error', (err, req, res) => {
//              console.log('[Proxy Error]', err);
//            });
//            proxy.on('proxyReq', (proxyReq, req, res) => {
//              console.log('[Proxy Request]', req.method, req.url, '→', options.target + req.url);
//            });
//            proxy.on('proxyRes', (proxyRes, req, res) => {
//              console.log('[Proxy Response]', proxyRes.statusCode, req.url);
//            });
//          },
//        },
//      },
//    },
//  }
//})