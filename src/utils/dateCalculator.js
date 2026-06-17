/**
 * Calcula la diferencia entre dos fechas en distintos formatos:
 * - Años, meses y días exactos.
 * - Total de días.
 * - Semanas y días restantes.
 * - Total de meses aproximados/exactos.
 *
 * @param {string|Date} startDateInput - Fecha inicial.
 * @param {string|Date} endDateInput - Fecha final.
 * @returns {Object|null} Objeto con los resultados de la diferencia o null si faltan fechas.
 */
export function calculateDateDifference(startDateInput, endDateInput) {
  if (!startDateInput || !endDateInput) return null;

  const start = new Date(startDateInput);
  const end = new Date(endDateInput);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Alguna de las fechas ingresadas no es válida.");
  }

  // Determinar el orden cronológico
  let isNegative = false;
  let firstDate = start;
  let secondDate = end;

  if (start > end) {
    firstDate = end;
    secondDate = start;
    isNegative = true;
  }

  // Extraer componentes individuales
  const startYear = firstDate.getFullYear();
  const startMonth = firstDate.getMonth(); // 0-11
  const startDay = firstDate.getDate();

  const endYear = secondDate.getFullYear();
  const endMonth = secondDate.getMonth();
  const endDay = secondDate.getDate();

  // Diferencia base
  let years = endYear - startYear;
  let months = endMonth - startMonth;
  let days = endDay - startDay;

  // Ajustar si los días son negativos
  if (days < 0) {
    // Obtener el último día del mes anterior al de la segunda fecha
    // pasando 0 como día obtenemos el último día del mes previo
    const previousMonth = new Date(secondDate.getFullYear(), secondDate.getMonth(), 0);
    days += previousMonth.getDate();
    months--;
  }

  // Ajustar si los meses son negativos
  if (months < 0) {
    months += 12;
    years--;
  }

  // Calcular totales absolutos
  // Usar UTC para evitar problemas con cambios de horario de verano (DST)
  const utc1 = Date.UTC(firstDate.getFullYear(), firstDate.getMonth(), firstDate.getDate());
  const utc2 = Date.UTC(secondDate.getFullYear(), secondDate.getMonth(), secondDate.getDate());
  const diffTime = Math.abs(utc2 - utc1);
  
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  const remainingWeeksDays = totalDays % 7;
  
  // Total de meses acumulados
  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth);

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    remainingWeeksDays,
    totalMonths,
    isNegative,
    formattedFirstDate: firstDate.toISOString().split("T")[0],
    formattedSecondDate: secondDate.toISOString().split("T")[0]
  };
}

/**
 * Formatea una fecha en una cadena legible en español.
 * 
 * @param {string|Date} dateInput 
 * @returns {string} Fecha formateada (Ej: 17 de junio de 2026)
 */
export function formatDateToSpanish(dateInput) {
  if (!dateInput) return "";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "";
  
  // Ajustar zona horaria local para evitar corrimientos por desfase UTC
  const userTimezoneOffset = date.getTimezoneOffset() * 60000;
  const localDate = new Date(date.getTime() + userTimezoneOffset);

  return localDate.toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
}
