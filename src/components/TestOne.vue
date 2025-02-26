<template>
    <v-container class="d-flex flex-column align-center justify-center fill-height">
      <h2 class="text-h4 font-weight-bold mb-4">Режим тестирования 1: Турецкий → Русский</h2>
      <v-card class="pa-4 text-center" width="600">
        <!-- Кнопка сверху -->
        <v-btn @click="handleButtonClick" :color="buttonColor" block class="mb-4">
          {{ buttonText }}
        </v-btn>
  
        <!-- Слово и перевод по центру -->
        <div v-if="currentWord" class="d-flex flex-column align-center">
          <!-- Увеличиваем шрифт турецкого слова и добавляем цвет -->
          <p class="text-h3" :style="{ color: '#1976D2' }">{{ currentWord.turkish }}</p>
          <!-- Увеличиваем шрифт перевода и добавляем другой цвет -->
          <p v-if="showTranslation" class="text-h4 mt-4" :style="{ color: '#4CAF50' }">
            {{ currentWord.russian }}
          </p>
        </div>
        <p v-else class="text-h6">Словарь пуст. Загрузите словарь для тестирования.</p>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useDictionaryStore } from '@/stores/dictionary';
  
  const dictionaryStore = useDictionaryStore();
  const currentWord = ref(null);
  const showTranslation = ref(false);
  
  // Состояние кнопки
  const isGenerated = ref(false);
  
  // Текст кнопки
  const buttonText = computed(() => {
    return isGenerated.value ? 'Показать перевод' : 'Следующее слово';
  });
  
  // Цвет кнопки
  const buttonColor = computed(() => {
    return isGenerated.value ? 'success' : 'primary';
  });
  
  // Функция для выбора случайного слова
  const getRandomWord = () => {
    if (dictionaryStore.words.length > 0) {
      const randomIndex = Math.floor(Math.random() * dictionaryStore.words.length);
      currentWord.value = dictionaryStore.words[randomIndex];
      showTranslation.value = false;
      isGenerated.value = true; // Переключаем состояние кнопки
    } else {
      currentWord.value = null;
    }
  };
  
  // Показать перевод
  const showWordTranslation = () => {
    showTranslation.value = true;
    isGenerated.value = false; // Переключаем состояние кнопки
  };
  
  // Обработка нажатия кнопки
  const handleButtonClick = () => {
    if (isGenerated.value) {
      showWordTranslation(); // Показываем перевод
    } else {
      getRandomWord(); // Генерируем новое слово
    }
  };
  </script>