const API_URL = "/api";

export async function getUnemployment(country, year) {
  const res = await fetch(`${API_URL}/unemployment?country=${country}&year=${year}`);
  if (!res.ok) throw new Error("Error al obtener el dato de desempleo");
  return res.json();
}

export async function getTimeSeries(country) {
  const res = await fetch(`${API_URL}/timeseries?country=${country}`);
  if (!res.ok) throw new Error("Error al obtener la serie temporal");
  return res.json();
}