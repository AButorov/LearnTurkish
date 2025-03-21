<template>
  <v-container class="d-flex flex-column align-center justify-center fill-height">
    <h2 class="text-h4 font-weight-bold mb-4">Режим тестирования 2: Русский → Турецкий</h2>
    <v-card class="pa-4 text-center" width="600">
      <!-- Кнопка старта -->
      <v-btn @click="startTest" color="primary" block class="mb-4">
        Старт
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
      <p v-else-if="dictionaryStore.words.length === 0" class="text-h6">Словарь пуст. Загрузите словарь для тестирования.</p>
      <p v-else class="text-h6">Нажмите "Старт", чтобы начать тестирование.</p>

      <!-- Кнопка "Показать перевод" -->
      <v-btn v-if="currentWord && !showTranslation" @click="showWordTranslation" color="info" block class="mb-4">
        Показать перевод
      </v-btn>

      <!-- Кнопки "Знаю" и "Повторить" -->
      <v-row v-if="currentWord" class="mt-4">
        <v-col cols="6">
          <v-btn @click="handleKnow" color="success" block :disabled="!showTranslation">Знаю</v-btn>
        </v-col>
        <v-col cols="6">
          <v-btn @click="handleRepeat" color="warning" block :disabled="!showTranslation">Повторить</v-btn>
        </v-col>
      </v-row>
    </v-card>

    <!-- Блок статистики и прогресса -->
    <v-card class="mt-4 pa-4" width="600">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Общее количество слов: {{ dictionaryStore.words.length }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Выучено слов: {{ learnedWordsCount }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title>Повторов: {{ repeatedWordsCount }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-progress-linear
        v-model="progress"
        color="primary"
        height="20"
        class="mt-2"
      >
        <strong>{{ progress }}%</strong>
      </v-progress-linear>
    </v-card>

    <!-- Блок для слов, которые нужно повторить -->
    <v-card v-if="wordsToRepeat.length > 0" class="mt-4 pa-4" width="600">
      <v-list>
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="text-h6">Слова для повторения:</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-for="(word, index) in wordsToRepeat" :key="index">
          <v-list-item-content>
            <v-list-item-title>{{ word.russian }} - {{ word.turkish }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
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
const learnedWordsCount = ref(0); // Количество выученных слов
const repeatedWordsCount = ref(0); // Количество повторов
const wordsToRepeat = ref([]); // Слова для повторения

// Прогресс в процентах
const progress = computed(() => {
  return Math.round((learnedWordsCount.value / dictionaryStore.words.length) * 100);
});

// Функция для выбора случайного слова
const getRandomWord = () => {
  let availableWords = dictionaryStore.words.filter(word => !shownWords.value.has(word.russian));

  // Если есть слова для повторения, добавляем их в доступные слова
  if (wordsToRepeat.value.length > 0) {
    availableWords = [...availableWords, ...wordsToRepeat.value];
  }

  if (availableWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];

    // Если слово было взято из списка для повторения, удаляем его оттуда
    if (wordsToRepeat.value.includes(word)) {
      wordsToRepeat.value = wordsToRepeat.value.filter(w => w !== word);
    }

    currentWord.value = word;
    showTranslation.value = false;
  } else {
    currentWord.value = null;
  }
};

// Показать перевод
const showWordTranslation = () => {
  showTranslation.value = true;
};

// Обработка нажатия кнопки "Знаю"
const handleKnow = () => {
  shownWords.value.add(currentWord.value.russian);
  learnedWordsCount.value += 1;
  getRandomWord();
};

// Обработка нажатия кнопки "Повторить"
const handleRepeat = () => {
  wordsToRepeat.value.push(currentWord.value);
  repeatedWordsCount.value += 1;
  getRandomWord();
};

// Функция для сброса статистики и начала теста заново
const startTest = () => {
  shownWords.value.clear();
  learnedWordsCount.value = 0;
  repeatedWordsCount.value = 0;
  wordsToRepeat.value = [];
  currentWord.value = null;
  showTranslation.value = false;
  getRandomWord();
};
</script>