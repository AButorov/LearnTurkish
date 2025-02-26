<template>
    <v-container>
      <h2 class="text-h4 font-weight-bold mb-4">Тренировка с числами</h2>
      <v-card class="pa-4">
        <v-row>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="min"
              label="Минимум"
              type="number"
              :rules="minRules"
              @input="validateMin"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model="max"
              label="Максимум"
              type="number"
              :rules="maxRules"
              @input="validateMax"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-btn @click="handleButtonClick" :color="buttonColor" block class="mb-4">
          {{ buttonText }}
        </v-btn>
        <v-card v-if="number !== null" class="pa-4 text-center">
          <!-- Увеличиваем шрифт числа и добавляем цвет -->
          <v-card-title class="text-h3" :style="{ color: '#1976D2' }">{{ formatNumber(number) }}</v-card-title>
          <!-- Увеличиваем шрифт расшифровки и добавляем другой цвет -->
          <v-card-text v-if="showTranslation" class="text-h4" :style="{ color: '#4CAF50' }">
            {{ numberInTurkish }}
          </v-card-text>
        </v-card>
      </v-card>
    </v-container>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  import { convertToTurkish } from '@/utils/numberConverter';
  
  const min = ref(0);
  const max = ref(100);
  const number = ref(null);
  const numberInTurkish = ref('');
  const showTranslation = ref(false);
  
  // Состояние кнопки
  const isGenerated = ref(false);
  
  // Текст кнопки
  const buttonText = computed(() => {
    return isGenerated.value ? 'Показать' : 'Сгенерировать число';
  });
  
  // Цвет кнопки
  const buttonColor = computed(() => {
    return isGenerated.value ? 'success' : 'primary';
  });
  
  // Правила валидации для минимального значения
  const minRules = [
    (value) => !!value || 'Поле обязательно для заполнения',
    (value) => !isNaN(value) || 'Введите число',
    (value) => value <= max.value || 'Минимум не может быть больше максимума',
  ];
  
  // Правила валидации для максимального значения
  const maxRules = [
    (value) => !!value || 'Поле обязательно для заполнения',
    (value) => !isNaN(value) || 'Введите число',
    (value) => value >= min.value || 'Максимум не может быть меньше минимума',
  ];
  
  // Валидация минимального значения
  const validateMin = () => {
    if (min.value > max.value) {
      min.value = max.value; // Автоматически корректируем минимум, если он больше максимума
    }
  };
  
  // Валидация максимального значения
  const validateMax = () => {
    if (max.value < min.value) {
      max.value = min.value; // Автоматически корректируем максимум, если он меньше минимума
    }
  };
  
  // Генерация числа
  const generateNumber = () => {
    const minVal = parseInt(min.value, 10);
    const maxVal = parseInt(max.value, 10);
  
    // Генерация случайного числа в диапазоне [minVal, maxVal]
    const num = Math.floor(Math.random() * (maxVal - minVal + 1)) + minVal;
    number.value = num;
    numberInTurkish.value = convertToTurkish(num);
    showTranslation.value = false; // Скрываем перевод
    isGenerated.value = true; // Переключаем состояние кнопки
  };
  
  // Показать перевод
  const showNumberTranslation = () => {
    showTranslation.value = true;
    isGenerated.value = false; // Переключаем состояние кнопки
  };
  
  // Обработка нажатия кнопки
  const handleButtonClick = () => {
    if (isGenerated.value) {
      showNumberTranslation(); // Показываем перевод
    } else {
      generateNumber(); // Генерируем новое число
    }
  };
  
  // Форматирование числа с разделителями разрядов
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  };
  </script>