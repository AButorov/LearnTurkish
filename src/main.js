import { createApp } from 'vue';
import { createPinia } from 'pinia'; // Импортируем Pinia
import { createVuetify } from 'vuetify'; // Импортируем createVuetify
import * as components from 'vuetify/components'; // Импортируем компоненты Vuetify
import * as directives from 'vuetify/directives'; // Импортируем директивы Vuetify
import { aliases, mdi } from 'vuetify/iconsets/mdi'; // Иконки Material Design
import 'vuetify/styles'; // Подключаем стили Vuetify
import '@mdi/font/css/materialdesignicons.css'; // Подключаем шрифт Material Design Icons
import App from './App.vue';
import router from '@/router'; // Подключение роутера
import vuetify from './plugins/vuetify'; // Импортируем настройки Vuetify

const app = createApp(App);

// Подключаем Vuetify с настройками из vuetify.js
app.use(vuetify);

// Подключаем роутер
app.use(router);

// Подключаем Pinia
app.use(createPinia());

// Монтируем приложение
app.mount('#app');