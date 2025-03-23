import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useDictionaryStore = defineStore('dictionary', () => {
  const words = ref([]);

  // Основные методы
  const addWord = (word) => words.value.push(word);
  const removeWord = (index) => words.value.splice(index, 1);
  const sortWords = () => words.value.sort((a, b) => a.turkish.localeCompare(b.turkish));
  const clearDictionary = () => (words.value = []);

  // Работа с файлами
  const saveToFile = (fileName) => {
    const data = JSON.stringify(words.value);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileName}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const loadFromFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const data = JSON.parse(reader.result);
          if (!Array.isArray(data)) { // Исправлено здесь
            throw new Error('Некорректный формат файла');
          }
          words.value = data;
        } catch (error) {
          alert(`Ошибка загрузки: ${error.message}`);
        }
      };
      reader.readAsText(file);
    };
    input.click();
  };

  // Загрузка предустановленных словарей
  const loadPredefinedDictionary = async (name) => {
    try {
      const response = await fetch(`./dictionaries/${name}.json`);
      if (!response.ok) throw new Error('Словарь не найден');

      const data = await response.json();
      if (
        !Array.isArray(data) ||
        !data.every((item) => 'turkish' in item && 'russian' in item)
      ) {
        throw new Error('Некорректный формат словаря');
      }

      words.value = [...words.value, ...data];
      return true;
    } catch (error) {
      console.error('Ошибка загрузки:', error);
      throw error;
    }
  };

  return {
    words,
    addWord,
    removeWord,
    sortWords,
    clearDictionary,
    saveToFile,
    loadFromFile,
    loadPredefinedDictionary,
  };
});