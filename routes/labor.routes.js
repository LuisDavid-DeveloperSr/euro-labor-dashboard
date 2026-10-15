import express from "express";
import {
  getUnemployment,
  getTimeSeries,
  getCountries
} from "../controllers/labor.controller.js";

const router = express.Router();

// Ruta de prueba
router.get("/", (req, res) => {
  res.json({ message: "Rutas de labor funcionando" });
});

// GET /api/unemployment?country=ES&year=2023
router.get("/unemployment", getUnemployment);

// GET /api/timeseries?country=ES
// labor.routes.js
router.get("/timeseries", getTimeSeries);

// GET /api/countries
router.get("/countries", getCountries);


export default router;