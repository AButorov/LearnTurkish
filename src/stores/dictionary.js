import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDictionaryStore = defineStore('dictionary', () => {
  const words = ref([]);

  // Добавление слова
  const addWord = (word) => {
    words.value.push(word);
  };

  // Удаление слова
  const removeWord = (index) => {
    words.value.splice(index, 1);
  };

  // Сортировка слов по алфавиту (по турецкому слову)
  const sortWords = () => {
    words.value.sort((a, b) => a.turkish.localeCompare(b.turkish));
  };

  // Очистка словаря
  const clearDictionary = () => {
    words.value = [];
  };

  // Сохранение словаря в файл
  const saveToFile = (fileName = 'dictionary') => {
    const data = JSON.stringify(words.value);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Загрузка словаря из файла
  const loadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        words.value = JSON.parse(reader.result);
      };
      reader.readAsText(file);
    };
    input.click();
  };

  return {
    words,
    addWord,
    removeWord,
    sortWords,
    clearDictionary,
    saveToFile,
    loadFromFile,
  };
});