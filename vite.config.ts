import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  root: 'client',
  plugins: [react()],
  server: {
    port: 5173,
    // Toutes les requêtes qui commencent par /api sont envoyées au back (Express)
    proxy: { '/api': 'http://localhost:3001' },
  },
});
