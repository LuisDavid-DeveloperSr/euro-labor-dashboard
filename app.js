import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import laborRoutes from "./routes/labor.routes.js"; // Asegúrate de que la ruta a tu carpeta de rutas sea correcta

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Ruta raíz de prueba de la API
app.get("/api", (req, res) => {
  res.json({
    message: "Labor Stats API funcionando correctamente"
  });
});

// Rutas de la API
app.use("/api", laborRoutes);

// Servir el frontend compilado de React
app.use(express.static(path.join(__dirname, "public")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

export default app;