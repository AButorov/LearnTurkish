<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <h2 class="text-h4 font-weight-bold mb-4">Режим тестирования 2: Русский → Турецкий</h2>
    <v-card class="pa-4 text-center" width="600">
      <!-- Кнопка старта -->
      <v-btn @click="startTest" color="primary" block class="mb-4">
        Старт
      </v-btn>

      <!-- Кнопка для генерации слова или показа перевода -->
      <v-btn @click="handleButtonClick" :color="buttonColor" block class="mb-4">
        {{ buttonText }}
      </v-btn>

      <!-- Слово и перевод по центру -->
      <div v-if="currentWord" class="d-flex flex-column align-center">
        <!-- Увеличиваем шрифт русского слова и добавляем цвет -->
        <p class="text-h3" :style="{ color: '#1976D2' }">{{ currentWord.russian }}</p>
        <!-- Увеличиваем шрифт перевода и добавляем другой цвет -->
        <p class="text-h4 mt-4" :style="{ color: '#4CAF50', opacity: showTranslation ? 1 : 0, transition: 'opacity 0.3s ease' }">
          {{ showTranslation ? currentWord.turkish : '&nbsp;' }}
        </p>
      </div>
      <p v-else class="text-h6">Словарь пуст. Загрузите словарь для тестирования.</p>

      <!-- Блок статистики -->
      <v-card class="mt-4 pa-4">
        <p class="text-h6">Статистика:</p>
        <p>Показано слов: {{ shownWordsCount }}</p>
        <p>Повторов: {{ repeatedWordsCount }}</p>
      </v-card>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDictionaryStore } from '@/stores/dictionary';

const dictionaryStore = useDictionaryStore();
const currentWord = ref(null);
const showTranslation = ref(false);
const shownWords = ref(new Set()); // Множество для хранения показанных слов
const shownWordsCount = ref(0); // Количество показанных слов
const repeatedWordsCount = ref(0); // Количество повторов

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
    const word = dictionaryStore.words[randomIndex];

    // Проверяем, было ли слово показано ранее
    if (shownWords.value.has(word.russian)) {
      repeatedWordsCount.value += 1;
    } else {
      shownWords.value.add(word.russian);
      shownWordsCount.value += 1;
    }

    currentWord.value = word;
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

// Функция для сброса статистики и начала теста заново
const startTest = () => {
  shownWords.value.clear();
  shownWordsCount.value = 0;
  repeatedWordsCount.value = 0;
  currentWord.value = null;
  showTranslation.value = false;
  isGenerated.value = false;
};
</script>