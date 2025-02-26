import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { aliases, mdi } from 'vuetify/iconsets/mdi';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

export default createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'light', // Тема по умолчанию
    themes: {
      light: {
        colors: {
          primary: '#1976D2', // Синий
          secondary: '#424242', // Серый
          accent: '#82B1FF', // Голубой
          error: '#FF5252', // Красный
          info: '#2196F3', // Голубой
          success: '#4CAF50', // Зелёный
          warning: '#FFC107', // Жёлтый
        },
      },
      dark: {
        colors: {
          primary: '#2196F3', // Синий
          secondary: '#757575', // Светло-серый
          accent: '#FF4081', // Розовый
          error: '#FF5252', // Красный
          info: '#2196F3', // Голубой
          success: '#4CAF50', // Зелёный
          warning: '#FFC107', // Жёлтый
          background: '#1E1E1E', // Тёмно-серый фон (менее мрачный, чем чёрный)
          surface: '#2E2E2E', // Цвет для поверхностей (карточек, панелей)
          onBackground: '#FFFFFF', // Цвет текста на фоне
          onSurface: '#FFFFFF', // Цвет текста на поверхностях
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});