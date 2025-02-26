import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()], // Подключаем плагин Vue
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // Настройка алиаса @ для папки src/
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`, // Если вы используете SCSS
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // Лимит в килобайтах (по умолчанию 500)
  },
  base: '/LearnTurkish/',
  
});
