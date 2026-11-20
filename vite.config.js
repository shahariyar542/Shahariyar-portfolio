import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Custom TTS audio proxy plugin for native Bengali speech
const ttsProxyPlugin = () => ({
  name: 'bengali-tts-proxy',
  configureServer(server) {
    server.middlewares.use('/api/tts', async (req, res) => {
      try {
        const urlObj = new URL(req.url, 'http://localhost');
        const text = urlObj.searchParams.get('q') || '';
        const lang = urlObj.searchParams.get('tl') || 'bn';
        const googleUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${lang}&client=tw-ob`;

        const response = await fetch(googleUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        });

        if (!response.ok) {
          res.statusCode = response.status;
          res.end('TTS fetch failed');
          return;
        }

        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        const arrayBuffer = await response.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));
      } catch (err) {
        res.statusCode = 500;
        res.end(err.message);
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), ttsProxyPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('three')) {
            return 'three';
          }
          if (id.includes('framer-motion')) {
            return 'motion';
          }
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
})
