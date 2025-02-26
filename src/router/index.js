import { createRouter, createWebHistory } from 'vue-router';
import Home from '@/views/Home.vue';
import Dictionary from '@/components/Dictionary.vue';
import Numbers from '@/components/Numbers.vue';
import TestOne from '@/components/TestOne.vue';
import TestTwo from '@/components/TestTwo.vue';

const routes = [
  { path: '/', component: Home }, // Главная страница
  { path: '/dictionary', component: Dictionary }, // Словарь
  { path: '/numbers', component: Numbers }, // Числа
  { path: '/test-one', component: TestOne }, // Тест 1: Турецкий → Русский
  { path: '/test-two', component: TestTwo }, // Тест 2: Русский → Турецкий
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;