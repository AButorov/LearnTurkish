<template>
    <v-container>
      <h2 class="text-h4 font-weight-bold mb-4">Работа со словарём</h2>
  
      <!-- Группа кнопок управления -->
      <v-card class="pa-4 mb-4">
        <v-row>
          <v-col cols="12" sm="6" md="3">
            <v-btn @click="sortDictionary" color="secondary" block>Сортировать</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn @click="confirmClearDictionary" color="error" block>Очистить</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn @click="saveDictionary" color="success" block>Сохранить</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-btn @click="loadDictionary" color="info" block>Загрузить</v-btn>
          </v-col>
        </v-row>
      </v-card>
  
      <!-- Поиск по словарю -->
      <v-card class="pa-4 mb-4">
        <v-text-field
          v-model="searchQuery"
          label="Поиск по словарю"
          prepend-inner-icon="mdi-magnify"
          clearable
        ></v-text-field>
      </v-card>
  
      <!-- Форма добавления слова -->
      <v-card class="pa-4 mb-4">
        <v-form @submit.prevent="addWord">
          <v-row>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newWord.turkish" label="Турецкое слово" required></v-text-field>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field v-model="newWord.russian" label="Перевод" required></v-text-field>
            </v-col>
          </v-row>
          <v-btn type="submit" color="primary" block>Добавить</v-btn>
        </v-form>
      </v-card>
  
      <!-- Список слов в несколько столбцов -->
      <v-card class="pa-4">
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="3" v-for="(word, index) in filteredWords" :key="index">
            <v-card class="pa-3 mb-3">
              <v-card-text class="d-flex justify-space-between align-center">
                <div>
                  <!-- Увеличенный шрифт и выделение цветом -->
                  <p class="text-h6" :style="{ color: '#1976D2' }">{{ word.turkish }}</p>
                  <p class="text-h6" :style="{ color: '#4CAF50' }">{{ word.russian }}</p>
                </div>
                <v-btn @click="removeWord(index)" color="error" icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { useDictionaryStore } from '@/stores/dictionary';
  
  const dictionaryStore = useDictionaryStore();
  const newWord = ref({ turkish: '', russian: '' });
  const searchQuery = ref('');
  
  // Фильтрация слов по поисковому запросу
  const filteredWords = computed(() => {
    if (!searchQuery.value) return dictionaryStore.words;
    const query = searchQuery.value.toLowerCase();
    return dictionaryStore.words.filter(
      (word) =>
        word.turkish.toLowerCase().includes(query) ||
        word.russian.toLowerCase().includes(query)
    );
  });
  
  // Добавление слова
  const addWord = () => {
    if (newWord.value.turkish && newWord.value.russian) {
      dictionaryStore.addWord(newWord.value);
      newWord.value = { turkish: '', russian: '' };
    }
  };
  
  // Удаление слова
  const removeWord = (index) => dictionaryStore.removeWord(index);
  
  // Сортировка словаря по алфавиту
  const sortDictionary = () => {
    dictionaryStore.sortWords();
  };
  
  // Очистка словаря с подтверждением
  const confirmClearDictionary = () => {
    if (confirm('Вы уверены, что хотите очистить словарь? Это действие нельзя отменить.')) {
      dictionaryStore.clearDictionary();
    }
  };
  
  // Сохранение словаря с выбором имени файла
  const saveDictionary = () => {
    const fileName = prompt('Введите имя файла для сохранения (без расширения):', 'dictionary');
    if (fileName) {
      dictionaryStore.saveToFile(fileName);
    }
  };
  
  // Загрузка словаря
  const loadDictionary = () => dictionaryStore.loadFromFile();
  </script>
  
  <style scoped>
  /* Стили для карточек слов */
  .v-card {
    transition: transform 0.2s;
  }
  
  .v-card:hover {
    transform: scale(1.02);
  }
  </style>