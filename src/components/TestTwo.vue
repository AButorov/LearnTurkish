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
      <p v-else-if="isTestFinished" class="text-h6">Тестирование завершено!</p>
      <p v-else class="text-h6">Нажмите "Старт", чтобы начать тестирование.</p>

      <!-- Кнопка "Показать перевод" или кнопки "Знаю" и "Повторить" -->
      <v-row v-if="currentWord" class="mt-4">
        <v-col cols="12">
          <v-btn
            v-if="!showTranslation"
            @click="showWordTranslation"
            color="info"
            block
            class="mb-4"
          >
            Показать перевод
          </v-btn>
          <v-row v-else>
            <v-col cols="6">
              <v-btn @click="handleKnow" color="success" block>Знаю</v-btn>
            </v-col>
            <v-col cols="6">
              <v-btn @click="handleRepeat" color="error" block>Повторить</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-card>

    <!-- Блок статистики и прогресса -->
    <v-card class="mt-4 pa-4" width="600">
      <v-list dense>
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
            <v-list-item-title>Повторов: {{ wordsToRepeat.length }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <v-progress-linear
        v-model="progress"
        color="success"
        height="25"
        class="mt-2"
      >
        <strong>{{ progress }}%</strong>
      </v-progress-linear>
    </v-card>

    <!-- Блок для слов, которые нужно повторить -->
    <v-card class="mt-4 pa-4" width="600">
      <v-btn @click="toggleRepeatList" color="secondary" block class="mb-4">
        {{ showRepeatList ? 'Скрыть слова для повторения' : 'Показать слова для повторения' }}
      </v-btn>
      <v-list v-if="showRepeatList && wordsToRepeat.length > 0">
        <v-list-item v-for="(word, index) in wordsToRepeat" :key="index">
          <v-list-item-content>
            <v-list-item-title class="text-h5">
              <span :style="{ color: '#1976D2' }">{{ word.russian }}</span> - 
              <span :style="{ color: '#4CAF50' }">{{ word.turkish }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>Правильных ответов подряд: {{ word.correctCount }}/2</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p v-else-if="showRepeatList && wordsToRepeat.length === 0" class="text-h6">Нет слов для повторения.</p>
    </v-card>

    <!-- Блок для финального списка повторений -->
    <v-card v-if="isTestFinished" class="mt-4 pa-4" width="600">
      <h3 class="text-h5 font-weight-bold mb-4">Слова, требующие внимания:</h3>
      <v-list>
        <v-list-item v-for="(word, index) in sortedRepeatWords" :key="index">
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              <span :style="{ color: '#1976D2' }">{{ word.russian }}</span> - 
              <span :style="{ color: '#4CAF50' }">{{ word.turkish }}</span>
            </v-list-item-title>
            <v-list-item-subtitle>Количество повторов: {{ word.repeatCount }}</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p v-if="sortedRepeatWords.length === 0" class="text-h6">Все слова выучены!</p>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useDictionaryStore } from '@/stores/dictionary';

const dictionaryStore = useDictionaryStore();
const currentWord = ref(null);
const showTranslation = ref(false);
const learnedWordsCount = ref(0); // Количество выученных слов
const wordsToRepeat = ref([]); // Слова для повторения
const showRepeatList = ref(false); // Показывать ли список слов для повторения
const isTestFinished = ref(false); // Завершено ли тестирование

// Прогресс в процентах
const progress = computed(() => {
  const totalWords = dictionaryStore.words.length;
  const learned = learnedWordsCount.value;
  return Math.round((learned / totalWords) * 100);
});

// Функция для выбора случайного слова
const getRandomWord = () => {
  let availableWords = dictionaryStore.words.filter(word => !word.learned);

  // Если есть слова для повторения, добавляем их в доступные слова
  if (wordsToRepeat.value.length > 0) {
    availableWords = [...availableWords, ...wordsToRepeat.value];
  }

  if (availableWords.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    const word = availableWords[randomIndex];

    currentWord.value = word;
    showTranslation.value = false;
  } else {
    currentWord.value = null;
    isTestFinished.value = true; // Тестирование завершено
  }
};

// Показать перевод
const showWordTranslation = () => {
  showTranslation.value = true;
};

// Обработка нажатия кнопки "Знаю"
const handleKnow = () => {
  const word = currentWord.value;

  if (wordsToRepeat.value.includes(word)) {
    // Если слово из списка повторения
    word.correctCount = (word.correctCount || 0) + 1;

    // Если слово было правильно ответено дважды подряд, удаляем его из списка повторения
    if (word.correctCount >= 2) {
      wordsToRepeat.value = wordsToRepeat.value.filter(w => w !== word);
      word.learned = true; // Помечаем слово как выученное
      learnedWordsCount.value += 1;
    }
  } else {
    // Если слово из основного словаря
    word.learned = true; // Помечаем слово как выученное
    learnedWordsCount.value += 1;
  }

  getRandomWord();
};

// Обработка нажатия кнопки "Повторить"
const handleRepeat = () => {
  const word = currentWord.value;

  if (!wordsToRepeat.value.includes(word)) {
    // Добавляем слово в список для повторения
    wordsToRepeat.value.push(word);
    word.correctCount = 0; // Обнуляем счетчик правильных ответов
    word.repeatCount = (word.repeatCount || 0) + 1; // Увеличиваем счетчик повторов
  } else {
    // Если слово уже в списке повторения, обнуляем счетчик правильных ответов
    word.correctCount = 0;
    word.repeatCount = (word.repeatCount || 0) + 1; // Увеличиваем счетчик повторов
  }

  getRandomWord();
};

// Функция для сброса статистики и начала теста заново
const startTest = () => {
  dictionaryStore.words.forEach(word => {
    word.learned = false; // Сбрасываем статус выученности
    word.correctCount = 0; // Обнуляем счетчики правильных ответов
    word.repeatCount = 0; // Обнуляем счетчики повторов
  });
  learnedWordsCount.value = 0;
  wordsToRepeat.value = [];
  currentWord.value = null;
  showTranslation.value = false;
  isTestFinished.value = false;
  getRandomWord();
};

// Переключение видимости списка слов для повторения
const toggleRepeatList = () => {
  showRepeatList.value = !showRepeatList.value;
};

// Список слов для повторения, отсортированный по количеству повторов
const sortedRepeatWords = computed(() => {
  return dictionaryStore.words
    .filter(word => word.repeatCount > 0) // Отбираем слова с хотя бы одним повтором
    .sort((a, b) => b.repeatCount - a.repeatCount); // Сортируем по убыванию количества повторов
});
</script>