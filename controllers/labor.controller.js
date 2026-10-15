import {
  fetchUnemploymentData,
  fetchTimeSeriesData
} from "../services/labor.service.js";

// Desempleo puntual por país y año
export const getUnemployment = async (req, res) => {
  try {
    const { country, year } = req.query;

    if (!country || !year) {
      return res.status(400).json({
        error: "Parámetros 'country' y 'year' son obligatorios"
      });
    }

    const data = await fetchUnemploymentData({ country, year });
    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo datos de desempleo"
    });
  }
};

// Serie temporal completa
export const getTimeSeries = async (req, res) => {
  try {
    const { country } = req.query;

    if (!country) {
      return res.status(400).json({
        error: "Parámetro 'country' es obligatorio"
      });
    }

    const data = await fetchTimeSeriesData({ country });
    res.json(data);

  } catch (error) {
    res.status(500).json({
      error: "Error obteniendo serie temporal"
    });
  }
};

export function getCountries(req, res) {
  res.json([
    { code: "AT", name: "Austria" },
    { code: "BE", name: "Bélgica" },
    { code: "BG", name: "Bulgaria" },
    { code: "HR", name: "Croacia" },
    { code: "CY", name: "Chipre" },
    { code: "CZ", name: "República Checa" },
    { code: "DK", name: "Dinamarca" },
    { code: "EE", name: "Estonia" },
    { code: "FI", name: "Finlandia" },
    { code: "FR", name: "Francia" },
    { code: "DE", name: "Alemania" },
    { code: "GR", name: "Grecia" },
    { code: "HU", name: "Hungría" },
    { code: "IE", name: "Irlanda" },
    { code: "IT", name: "Italia" },
    { code: "LV", name: "Letonia" },
    { code: "LT", name: "Lituania" },
    { code: "LU", name: "Luxemburgo" },
    { code: "MT", name: "Malta" },
    { code: "NL", name: "Países Bajos" },
    { code: "PL", name: "Polonia" },
    { code: "PT", name: "Portugal" },
    { code: "RO", name: "Rumanía" },
    { code: "SK", name: "Eslovaquia" },
    { code: "SI", name: "Eslovenia" },
    { code: "ES", name: "España" },
    { code: "SE", name: "Suecia" }
  ]);
}