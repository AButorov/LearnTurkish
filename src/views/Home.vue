<template>
    <v-container class="d-flex flex-column align-center justify-center fill-height">
      <!-- Убрали заголовок "Турецкий язык" -->
      <v-row justify="center" class="mt-8">
        <v-col cols="12" sm="6" md="4" v-for="(mode, index) in modes" :key="index" class="d-flex justify-center">
          <v-card width="400" class="pa-6 text-center" elevation="6">
            <!-- Уникальные иконки для каждого режима -->
            <v-icon size="96" :color="mode.color">{{ mode.icon }}</v-icon>
            <!-- Заголовок режима с возможностью переноса на две строки -->
            <v-card-title class="text-h4 mt-4" style="min-height: 96px; display: flex; align-items: center; justify-content: center;">
              {{ mode.title }}
            </v-card-title>
            <v-card-text class="text-h6">{{ mode.description }}</v-card-text>
            <v-btn :to="mode.route" :color="mode.color" class="mt-4" size="large">Перейти</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  const modes = [
    {
      title: 'Работа со словарём',
      description: 'Добавляйте, редактируйте и изучайте турецкие слова. Удобный интерфейс для управления вашим словарём.',
      icon: 'mdi-book-edit-outline',
      route: '/dictionary',
      color: 'primary', // Синий
    },
    {
      title: 'Тренировка с числами',
      description: 'Учитесь считать на турецком языке. Генерация случайных чисел и их перевод на турецкий.',
      icon: 'mdi-counter',
      route: '/numbers',
      color: 'teal', // Бирюзовый
    },
    {
      title: 'Тест: Турецкий → Русский',
      description: 'Проверьте знание турецких слов. Переводите слова с турецкого на русский и улучшайте свои навыки.',
      icon: 'mdi-arrow-right-bold',
      route: '/test-one',
      color: 'orange', // Оранжевый
    },
    {
      title: 'Тест: Русский → Турецкий',
      description: 'Проверьте знание русских слов на турецком. Переводите слова с русского на турецкий и тренируйтесь.',
      icon: 'mdi-arrow-left-bold',
      route: '/test-two',
      color: 'purple', // Фиолетовый
    },
    {
      title: 'Другие режимы',
      description: 'Скоро появятся новые функции! Следите за обновлениями.',
      icon: 'mdi-star-outline',
      route: '/',
      color: 'pink', // Розовый
    },
  ];
  </script>
  
  <style scoped>
  /* Стили для карточек */
  .v-card {
    transition: transform 0.2s;
    min-height: 400px; /* Увеличиваем минимальную высоту карточки */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  
  .v-card:hover {
    transform: scale(1.05);
  }
  
  /* Стили для заголовка */
  .v-card-title {
    white-space: normal; /* Разрешаем перенос текста */
    line-height: 1.5; /* Увеличиваем межстрочный интервал */
  }
  </style>