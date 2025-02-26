<template>
  <v-app :theme="theme">
    <!-- Шапка -->
    <v-app-bar color="indigo-darken-4" dark app>
      <!-- Пункты меню с иконками -->
      <v-btn to="/" variant="text" class="mx-2">
        <v-icon left>mdi-home</v-icon>
        Главная
      </v-btn>
      <v-btn to="/dictionary" variant="text" class="mx-2">
        <v-icon left>mdi-book-edit-outline</v-icon>
        Словарь
      </v-btn>
      <v-btn to="/numbers" variant="text" class="mx-2">
        <v-icon left>mdi-counter</v-icon>
        Числа
      </v-btn>
      <v-btn to="/test-one" variant="text" class="mx-2">
        <v-icon left>mdi-arrow-right-bold</v-icon>
        Тест 1
      </v-btn>
      <v-btn to="/test-two" variant="text" class="mx-2">
        <v-icon left>mdi-arrow-left-bold</v-icon>
        Тест 2
      </v-btn>

      <v-spacer></v-spacer>

      <!-- Переключатель темы -->
      <v-btn @click="toggleTheme" icon class="mx-2">
        <v-icon>{{ theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>
    </v-app-bar>

    <!-- Основной контент -->
    <v-main class="bg-grey-lighten-3">
      <v-container>
        <router-view></router-view>
      </v-container>
    </v-main>

    <!-- Подвал с названием компании -->
    <v-footer color="indigo-darken-4" dark app>
      <v-row justify="center" no-gutters>
        <v-col class="text-center" cols="12">
          <span>&copy; {{ new Date().getFullYear() }} - StandartSoft+</span>
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script setup>
import { ref } from 'vue';

// Состояние темы (по умолчанию светлая)
const theme = ref('light');

// Переключение темы
const toggleTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};
</script>