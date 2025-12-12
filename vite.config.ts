import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react(), // just use the plugin, no extra babel plugins
  ],
  server: {
    host: true,
  },
});
