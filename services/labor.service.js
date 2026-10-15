import axios from "axios";

// Desempleo para un año concreto
export async function fetchUnemploymentData({ country, year }) {
  const url =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/LFSQ_URGAN";

  const params = {
    freq: "Q",
    unit: "PC",
    sex: "T",
    age: "Y20-64",
    citizen: "TOTAL",
    geo: country,
    time: `${year}-Q4`
  };

  const response = await axios.get(url, { params });

  const values = response.data.value;
  const lastValue = values ? Object.values(values)[0] : null;

  return {
    pais: country,
    año: year,
    tasa_paro: lastValue !== undefined && lastValue !== null ? Number(lastValue).toFixed(1) : "N/D"
  };
}

// Serie temporal completa transformada a array plano para el gráfico
export async function fetchTimeSeriesData({ country }) {
  const url =
    "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/LFSQ_URGAN";

  const params = {
    freq: "Q",
    unit: "PC",
    sex: "T",
    age: "Y20-64",
    citizen: "TOTAL",
    geo: country
  };

  const response = await axios.get(url, { params });
  const data = response.data;

  if (!data || !data.value || !data.dimension) {
    return [];
  }

  // Extraemos los índices del tiempo y los valores del JSON-stat de Eurostat
  const timeIndices = data.dimension.time.category.index;
  const values = data.value;
  
  const results = [];
  for (const [timeKey, position] of Object.entries(timeIndices)) {
    // Tomamos por ejemplo los datos anuales o del último trimestre (ej: terminados en Q4 o años limpios)
    if (values[position] !== undefined) {
      results.push({
        year: timeKey,
        rate: Number(values[position])
      });
    }
  }

  // Ordenamos cronológicamente
  results.sort((a, b) => a.year.localeCompare(b.year));
  return results;
}