<template>
  <v-container>
    <h2 class="text-h4 font-weight-bold mb-4">Работа со словарём</h2>

    <!-- Блок предустановленных словарей -->
    <v-card class="pa-4 mb-4">
      <h3 class="text-h6 mb-3">Готовые словари</h3>
      <v-row dense>
        <v-col v-for="dict in predefinedDictionaries" :key="dict.name" cols="12" sm="6" md="4">
          <v-card class="pa-2">
            <v-card-title class="text-subtitle-1">{{ dict.title }}</v-card-title>
            <v-card-subtitle>{{ dict.description }}</v-card-subtitle>
            <v-card-actions>
              <v-btn 
                @click="loadPredefinedDict(dict.name)"
                color="primary"
                variant="tonal"
                block
                :loading="loadingStates[dict.name]"
                :disabled="loadingStates[dict.name]"
              >
                <template #loader>
                  <v-progress-circular indeterminate size="24"></v-progress-circular>
                </template>
                Загрузить
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-card>

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

    <!-- Список слов -->
    <v-card class="pa-4">
      <v-row>
        <v-col cols="12" sm="6" md="4" lg="3" v-for="(word, index) in filteredWords" :key="index">
          <v-card class="pa-3 mb-3">
            <v-card-text class="d-flex justify-space-between align-center">
              <div>
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
import { ref, computed, reactive } from 'vue';
import { useDictionaryStore } from '@/stores/dictionary';

const dictionaryStore = useDictionaryStore();
const newWord = ref({ turkish: '', russian: '' });
const searchQuery = ref('');
const loadingStates = reactive({});

const predefinedDictionaries = ref([
  {
    name: 'basic-words',
    title: 'Базовые слова',
    description: '100 основных повседневных слов'
  },
  {
    name: 'travel-phrases',
    title: 'Фразы для путешествий',
    description: 'Полезные выражения для туристов'
  },
  {
    name: 'food',
    title: 'Еда и напитки',
    description: 'Названия блюд и продуктов'
  },
  {
    name: 'calendar-time-phrases',
    title: 'Календарь и время',
    description: 'Названия времен года, месяцев, дней недели, времени'
  }
]);

const filteredWords = computed(() => {
  if (!searchQuery.value) return dictionaryStore.words;
  const query = searchQuery.value.toLowerCase();
  return dictionaryStore.words.filter(
    word => word.turkish.toLowerCase().includes(query) || 
            word.russian.toLowerCase().includes(query)
  );
});

const addWord = () => {
  if (newWord.value.turkish && newWord.value.russian) {
    dictionaryStore.addWord(newWord.value);
    newWord.value = { turkish: '', russian: '' };
  }
};

const loadPredefinedDict = async (name) => {
  if (!confirm(`Добавить словарь "${name}" к текущему?`)) return;
  
  try {
    loadingStates[name] = true;
    await dictionaryStore.loadPredefinedDictionary(name);
    alert('Словарь успешно добавлен!');
  } catch (error) {
    alert(`Ошибка: ${error.message}`);
  } finally {
    loadingStates[name] = false;
  }
};

const removeWord = (index) => dictionaryStore.removeWord(index);
const sortDictionary = () => dictionaryStore.sortWords();

const confirmClearDictionary = () => {
  if (confirm('Вы уверены, что хотите очистить словарь?')) {
    dictionaryStore.clearDictionary();
  }
};

const saveDictionary = () => {
  const fileName = prompt('Имя файла для сохранения:', 'dictionary');
  if (fileName) dictionaryStore.saveToFile(fileName);
};

const loadDictionary = () => dictionaryStore.loadFromFile();
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
}
.v-card:hover {
  transform: scale(1.02);
}
.v-card__title {
  color: #1976D2;
  font-weight: 500;
}
.v-card__subtitle {
  font-size: 0.85em;
  opacity: 0.8;
}
.v-progress-circular {
  color: white !important;
}
</style>