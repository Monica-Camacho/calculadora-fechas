"use client";

import { useState, useEffect } from "react";
import { calculateDateDifference, formatDateToSpanish } from "@/utils/dateCalculator";

export default function Home() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");
  
  // Soporte para modo oscuro / claro (Default dark mode)
  const [theme, setTheme] = useState("dark");

  // Inicializar estado del lado del cliente
  useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];
    
    const currentYear = today.getFullYear();
    const christmas = new Date(currentYear, 11, 25);
    if (today > christmas) {
      christmas.setFullYear(currentYear + 1);
    }
    const christmasStr = christmas.toISOString().split("T")[0];

    setStartDate(todayStr);
    setEndDate(christmasStr);

    // Cargar historial
    try {
      const storedHistory = localStorage.getItem("date_calc_history");
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (e) {
      console.error("Error al cargar historial:", e);
    }

    // Cargar tema guardado o preferencia de sistema
    try {
      const savedTheme = localStorage.getItem("date_calc_theme");
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setTheme(prefersDark ? "dark" : "light");
      }
    } catch (e) {
      console.error("Error al cargar tema:", e);
    }
  }, []);

  // Recalcular diferencia de fechas automáticamente
  useEffect(() => {
    if (startDate && endDate) {
      handleCalculate(false);
    } else {
      setResult(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const handleCalculate = (saveToHistory = true) => {
    try {
      setError("");
      
      const diff = calculateDateDifference(startDate, endDate);
      if (diff) {
        setResult(diff);

        if (saveToHistory) {
          const newHistoryItem = {
            id: Date.now(),
            startDate,
            endDate,
            resultSummary: formatShortResult(diff),
            timestamp: new Date().toLocaleTimeString("es-ES", { hour: "2-digit", minute: "2-digit" })
          };

          const updatedHistory = [newHistoryItem, ...history.slice(0, 4)];
          setHistory(updatedHistory);
          localStorage.setItem("date_calc_history", JSON.stringify(updatedHistory));
        }
      }
    } catch (err) {
      setError(err.message || "Ocurrió un error al calcular la diferencia.");
      setResult(null);
    }
  };

  const formatShortResult = (diff) => {
    const parts = [];
    if (diff.years > 0) parts.push(`${diff.years} ${diff.years === 1 ? "año" : "años"}`);
    if (diff.months > 0) parts.push(`${diff.months} ${diff.months === 1 ? "mes" : "meses"}`);
    if (diff.days > 0 || parts.length === 0) parts.push(`${diff.days} ${diff.days === 1 ? "día" : "días"}`);
    return parts.join(", ");
  };

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("date_calc_theme", nextTheme);
    } catch (e) {
      console.error("Error al guardar tema:", e);
    }
  };

  // Presets
  const setStartPreset = (preset) => {
    const today = new Date();
    if (preset === "today") {
      setStartDate(today.toISOString().split("T")[0]);
    } else if (preset === "firstOfYear") {
      const first = new Date(today.getFullYear(), 0, 1);
      setStartDate(first.toISOString().split("T")[0]);
    } else if (preset === "firstOfMonth") {
      const first = new Date(today.getFullYear(), today.getMonth(), 1);
      setStartDate(first.toISOString().split("T")[0]);
    }
  };

  const setEndPreset = (preset) => {
    const baseDate = startDate ? new Date(startDate) : new Date();
    
    if (preset === "today") {
      const today = new Date();
      setEndDate(today.toISOString().split("T")[0]);
    } else if (preset === "plus30") {
      const future = new Date(baseDate);
      future.setDate(future.getDate() + 30);
      setEndDate(future.toISOString().split("T")[0]);
    } else if (preset === "plus90") {
      const future = new Date(baseDate);
      future.setDate(future.getDate() + 90);
      setEndDate(future.toISOString().split("T")[0]);
    } else if (preset === "plusYear") {
      const future = new Date(baseDate);
      future.setFullYear(future.getFullYear() + 1);
      setEndDate(future.toISOString().split("T")[0]);
    }
  };

  const loadHistoryItem = (item) => {
    setStartDate(item.startDate);
    setEndDate(item.endDate);
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("date_calc_history");
  };

  const getDayOfWeekName = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return "";
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() + userTimezoneOffset);
    return localDate.toLocaleDateString("es-ES", { weekday: "long" });
  };

  const isDark = theme === "dark";
  
  // Clases condicionales de tema por JS
  const wrapperClass = `min-h-screen flex flex-col justify-between transition-colors duration-500 ${
    isDark
      ? "bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-slate-100"
      : "bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 text-slate-800"
  }`;

  const headerClass = `sticky top-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${
    isDark ? "bg-slate-950/80 border-slate-850" : "bg-white/80 border-slate-200"
  }`;

  const cardClass = `border rounded-3xl p-8 flex flex-col gap-8 transition-colors duration-300 ${
    isDark
      ? "bg-slate-900 border-slate-800 shadow-sm"
      : "bg-white border-slate-200 shadow-sm"
  }`;

  const cardTitleClass = `text-xl font-bold transition-colors ${
    isDark ? "text-slate-100" : "text-slate-900"
  }`;

  const subdomainHighlight = isDark ? "text-cyan-400 font-medium" : "text-indigo-600 font-semibold";

  const inputClass = `h-14 px-5 rounded-2xl text-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 transition-all duration-200 w-full font-mono ${
    isDark 
      ? "bg-slate-950 border-slate-800 text-slate-100 hover:border-cyan-500/50" 
      : "bg-slate-50 border-slate-200 text-slate-900 hover:border-cyan-400"
  }`;

  const presetBtnClass = `rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 min-h-[44px] flex items-center justify-center cursor-pointer ${
    isDark
      ? "bg-slate-800 text-slate-300 hover:bg-cyan-950 hover:text-cyan-300"
      : "bg-slate-100 text-slate-600 hover:bg-cyan-55 hover:text-cyan-750"
  }`;

  const swapBtnClass = `w-12 h-12 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 min-h-[44px] ${
    isDark
      ? "bg-slate-800 text-slate-400 hover:scale-110 hover:bg-cyan-500 hover:text-white"
      : "bg-slate-100 text-slate-500 hover:scale-110 hover:bg-cyan-500 hover:text-white"
  }`;

  const resultMiniCardClass = `rounded-2xl border p-6 text-center flex flex-col justify-center items-center gap-1 transition-colors ${
    isDark ? "bg-slate-950/40 border-slate-800" : "bg-slate-50 border-slate-200"
  }`;

  const resultNumberClass = `text-4xl font-bold font-mono ${
    isDark ? "text-cyan-400" : "text-cyan-500"
  }`;

  const summaryBoxClass = `rounded-2xl p-5 text-sm leading-relaxed border transition-colors ${
    isDark 
      ? "bg-slate-950/40 border-slate-800/80 text-slate-400" 
      : "bg-slate-50 border-slate-200 text-slate-600"
  }`;

  const summarySpanBold = `font-semibold ${
    isDark ? "text-slate-100" : "text-slate-950"
  }`;

  const summarySpanGradient = `font-semibold capitalize ${
    isDark ? "text-cyan-400" : "text-cyan-600"
  }`;

  const eqItemCardClass = `p-5 rounded-2xl border flex flex-col gap-1 shadow-sm transition-colors ${
    isDark ? "bg-slate-950/20 border-slate-800" : "bg-slate-50 border-slate-200"
  }`;

  const eqValClass = `text-3xl font-bold font-mono transition-colors ${
    isDark ? "text-slate-100" : "text-slate-900"
  }`;

  const historyCardClass = `border rounded-3xl p-8 shadow-sm w-full flex flex-col gap-6 transition-colors duration-300 ${
    isDark
      ? "bg-slate-900 border-slate-800"
      : "bg-white border-slate-200"
  }`;

  const historyHeaderClass = `flex justify-between items-center border-b pb-4 transition-colors ${
    isDark ? "border-slate-800" : "border-slate-200"
  }`;

  const historyItemBtnClass = `text-left p-5 rounded-2xl border transition-all cursor-pointer flex flex-col gap-2 group hover:scale-[1.01] hover:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 min-h-[44px] transition-colors ${
    isDark
      ? "bg-slate-950/20 border-slate-800 hover:bg-slate-950/60"
      : "bg-slate-50 border-slate-200 hover:bg-slate-100/50"
  }`;

  const historySummaryText = `font-semibold text-sm truncate w-full ${
    isDark ? "text-cyan-400" : "text-indigo-600"
  }`;

  const footerClass = `border-t py-12 transition-colors duration-350 ${
    isDark ? "border-slate-900 bg-slate-950/40" : "border-slate-200 bg-white/40"
  }`;

  return (
    <div className={wrapperClass}>
      
      {/* NAVBAR */}
      <header className={headerClass}>
        <nav className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between" aria-label="Navegación principal">
          
          {/* Logo / Calendario */}
          <div className="flex items-center gap-2.5 font-bold text-lg select-none">
            <svg className="w-6 h-6 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className={isDark ? "text-slate-100" : "text-slate-900"}>Calculadora de Fechas</span>
          </div>

          {/* Botón cambiar tema */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={toggleTheme}
              className={`w-10 h-10 rounded-full border transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer shadow-sm flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
                isDark
                  ? "bg-slate-900 border-slate-800 text-amber-400 hover:bg-slate-850"
                  : "bg-white border-slate-200 text-indigo-600 hover:bg-slate-50"
              }`}
              aria-label={isDark ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
              title={isDark ? "Modo Claro" : "Modo Oscuro"}
            >
              {isDark ? (
                // Sun Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                </svg>
              ) : (
                // Moon Icon
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>

        </nav>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl w-full mx-auto px-6 lg:px-8 py-12 flex flex-col gap-12 flex-1">
        
        {/* Descripción de la Herramienta (SEO H1 + P) */}
        <section className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent pb-1 select-none">
            Calculadora de Fechas
          </h1>
          <p className={`text-lg transition-colors leading-relaxed ${isDark ? "text-slate-400" : "text-slate-650"}`}>
            Calcula la diferencia exacta entre dos fechas en años, meses, semanas y días. Ideal para conocer edades, aniversarios, periodos de tiempo, plazos y cualquier intervalo entre fechas de manera rápida y precisa.
          </p>
        </section>

        {/* Grid de Dos Columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-12 items-start w-full">
          
          {/* Parámetros del Cálculo */}
          <section className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
              <span className="text-2xl">📅</span>
              <h2 className={cardTitleClass}>Parámetros del cálculo</h2>
            </div>

            <div className="flex flex-col gap-6">
              
              {/* Fecha de Inicio */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="startDate" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Fecha Inicial
                </label>
                <input
                  type="date"
                  id="startDate"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className={inputClass}
                />
                {/* Presets Fecha Inicio */}
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setStartPreset("today")}
                    className={presetBtnClass}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartPreset("firstOfMonth")}
                    className={presetBtnClass}
                  >
                    Inicio de Mes
                  </button>
                  <button
                    type="button"
                    onClick={() => setStartPreset("firstOfYear")}
                    className={presetBtnClass}
                  >
                    Inicio de Año
                  </button>
                </div>
              </div>

              {/* Botón de Intercambiar Fechas */}
              <div className="flex justify-center py-2">
                <button
                  type="button"
                  onClick={() => {
                    const temp = startDate;
                    setStartDate(endDate);
                    setEndDate(temp);
                  }}
                  className={swapBtnClass}
                  title="Intercambiar fechas"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* Fecha de Fin */}
              <div className="flex flex-col gap-2.5">
                <label htmlFor="endDate" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                  Fecha Final
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClass}
                />
                {/* Presets Fecha Fin */}
                <div className="flex flex-wrap gap-2 mt-1">
                  <button
                    type="button"
                    onClick={() => setEndPreset("today")}
                    className={presetBtnClass}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndPreset("plus30")}
                    className={presetBtnClass}
                  >
                    +30 días
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndPreset("plus90")}
                    className={presetBtnClass}
                  >
                    +90 días
                  </button>
                  <button
                    type="button"
                    onClick={() => setEndPreset("plusYear")}
                    className={presetBtnClass}
                  >
                    +1 año
                  </button>
                </div>
              </div>

              {/* Botón Principal (Calcular) */}
              <div className="mt-4">
                <button
                  type="button"
                  onClick={() => handleCalculate(true)}
                  className="h-14 w-full rounded-2xl font-semibold text-lg bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:scale-[1.02] hover:shadow-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 cursor-pointer min-h-[44px] flex items-center justify-center shadow-md shadow-indigo-550/10"
                >
                  ⚡ Guardar en Historial y Calcular
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-sm font-medium">
                  ⚠️ {error}
                </div>
              )}

            </div>
          </section>

          {/* Resultados */}
          <section className={cardClass}>
            <div className="flex items-center gap-3 border-b border-slate-150 dark:border-slate-800 pb-4">
              <span className="text-2xl">📊</span>
              <h2 className={cardTitleClass}>Resultados</h2>
            </div>

            {result ? (
              <div className="flex flex-col gap-8 animate-fade-in">
                
                {/* Indicación de Swap */}
                {result.isNegative && (
                  <div className={`text-xs px-3.5 py-2.5 rounded-xl border ${
                    isDark 
                      ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
                      : "bg-amber-50 border-amber-200 text-amber-850"
                  }`}>
                    💡 Las fechas se ordenaron cronológicamente.
                  </div>
                )}

                {/* Rejilla de Años, Meses, Días */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    Diferencia Detallada
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={resultMiniCardClass}>
                      <div className={resultNumberClass}>{result.years}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500">
                        {result.years === 1 ? "Año" : "Años"}
                      </div>
                    </div>
                    
                    <div className={resultMiniCardClass}>
                      <div className={resultNumberClass}>{result.months}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500">
                        {result.months === 1 ? "Mes" : "Meses"}
                      </div>
                    </div>

                    <div className={resultMiniCardClass}>
                      <div className={resultNumberClass}>{result.days}</div>
                      <div className="text-xs uppercase tracking-wider text-slate-500">
                        {result.days === 1 ? "Día" : "Días"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Resumen en lenguaje natural */}
                <div className={summaryBoxClass}>
                  Desde el <span className={summarySpanGradient}>{getDayOfWeekName(result.formattedFirstDate)}</span>,{" "}
                  <span className="font-semibold">{formatDateToSpanish(result.formattedFirstDate)}</span>
                  <br />
                  hasta el <span className={summarySpanGradient}>{getDayOfWeekName(result.formattedSecondDate)}</span>,{" "}
                  <span className="font-semibold">{formatDateToSpanish(result.formattedSecondDate)}</span>
                  <br />
                  <span className="block mt-2 font-medium">
                    han transcurrido <span className={summarySpanBold}>{result.totalDays.toLocaleString("es-ES")} días</span>, equivalentes a <span className={summarySpanBold}>{formatShortResult(result)}</span>.
                  </span>
                </div>

                {/* Equivalencias con números prominentes */}
                <div>
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500 mb-3">
                    Equivalencias Totales
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className={eqItemCardClass}>
                      <span className="text-sm text-slate-500">Total en días</span>
                      <span className={eqValClass}>
                        {result.totalDays.toLocaleString("es-ES")}
                      </span>
                    </div>

                    <div className={eqItemCardClass}>
                      <span className="text-sm text-slate-500">Total en meses</span>
                      <span className={eqValClass}>
                        {result.totalMonths.toLocaleString("es-ES")}
                      </span>
                    </div>

                    <div className={`${eqItemCardClass} sm:col-span-2`}>
                      <span className="text-sm text-slate-500">Total en semanas</span>
                      <span className={eqValClass}>
                        {result.totalWeeks.toLocaleString("es-ES")} <span className="text-base font-normal text-slate-450">semanas {result.remainingWeeksDays > 0 ? ` y ${result.remainingWeeksDays} días` : ""}</span>
                      </span>
                    </div>

                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/40 text-2xl">
                  ⏳
                </div>
                <p className="text-slate-500 text-base max-w-[240px]">
                  Introduce fechas válidas para comenzar el cálculo.
                </p>
              </div>
            )}
          </section>

        </div>

        {/* Historial Reciente */}
        <section className={historyCardClass}>
          <div className={historyHeaderClass}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <span>⏱️</span> Historial Reciente
            </h2>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-sm text-rose-500 hover:text-rose-600 transition-colors font-semibold cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 rounded px-2 py-1"
              >
                Limpiar Historial
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {history.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => loadHistoryItem(item)}
                  className={historyItemBtnClass}
                >
                  <div className="flex justify-between items-center w-full text-xs text-slate-500 font-mono">
                    <span>{item.startDate} ➔ {item.endDate}</span>
                    <span className="text-slate-400 group-hover:text-slate-500">{item.timestamp}</span>
                  </div>
                  <div className={historySummaryText}>
                    {item.resultSummary}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center text-slate-500 gap-3">
              <span className="text-xl">📋</span>
              <p className="text-sm max-w-md">
                Todavía no has realizado ningún cálculo. Tus cálculos recientes aparecerán aquí.
              </p>
            </div>
          )}
        </section>

      </main>

      {/* FOOTER */}
      <footer className={footerClass}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          
          <div className="text-slate-500 dark:text-slate-400 text-center md:text-left">
            &copy; {new Date().getFullYear()} Calculadora de Fechas Mónica Camacho. Todos los derechos reservados.
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
            <span className="text-slate-500 dark:text-slate-400">¿Necesitas una aplicación web o un proyecto personalizado?</span>
            <a
              href="https://monica-camacho.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full border text-xs font-semibold uppercase tracking-wider transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
                isDark
                  ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:border-cyan-400 hover:bg-cyan-500/20"
                  : "border-indigo-200 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 hover:border-indigo-300"
              }`}
            >
              <span>🚀</span> Visita mi portafolio
            </a>
          </div>

        </div>
      </footer>

    </div>
  );
}
