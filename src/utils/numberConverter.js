export function convertToTurkish(number) {
    const units = ['', 'bir', 'iki', 'üç', 'dört', 'beş', 'altı', 'yedi', 'sekiz', 'dokuz'];
    const tens = ['', 'on', 'yirmi', 'otuz', 'kırk', 'elli', 'altmış', 'yetmiş', 'seksen', 'doksan'];
    const scales = ['', 'bin', 'milyon', 'milyar', 'trilyon'];
  
    if (number === 0) return 'sıfır';
  
    // Разбиваем число на группы по три цифры
    const numStr = number.toString();
    const numLength = numStr.length;
    let result = '';
  
    for (let i = 0; i < numLength; i += 3) {
      const chunkStart = Math.max(0, numLength - i - 3);
      const chunkEnd = numLength - i;
      const chunk = numStr.slice(chunkStart, chunkEnd);
  
      const chunkNumber = parseInt(chunk, 10);
      if (chunkNumber === 0) continue;
  
      const scaleIndex = Math.floor(i / 3);
      const scale = scales[scaleIndex];
  
      let chunkResult = '';
  
      // Обрабатываем сотни
      if (chunkNumber >= 100) {
        const hundred = Math.floor(chunkNumber / 100);
        chunkResult += (hundred === 1 ? 'yüz' : units[hundred] + ' yüz');
        chunkResult += ' ';
      }
  
      // Обрабатываем десятки и единицы
      const remainder = chunkNumber % 100;
      if (remainder > 0) {
        if (remainder < 10) {
          chunkResult += units[remainder];
        } else {
          const ten = Math.floor(remainder / 10);
          const unit = remainder % 10;
          chunkResult += tens[ten];
          if (unit > 0) {
            chunkResult += ' ' + units[unit];
          }
        }
      }
  
      // Добавляем масштаб (тысячи, миллионы и т.д.)
      if (scaleIndex > 0) {
        // Исключение: если число 1000, не добавляем "bir"
        if (chunkNumber === 1 && scaleIndex === 1) {
          chunkResult = scale;
        } else {
          chunkResult += ' ' + scale;
        }
      }
  
      result = chunkResult + ' ' + result;
    }
  
    return result.trim();
  }