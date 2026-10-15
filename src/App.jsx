import React, { useState, useEffect } from "react";
import EuropeMap from "./components/EuropeMap";
import SearchForm from "./components/SearchForm";
import TimeSeriesChart from "./components/TimeSeriesChart";
import { getUnemployment, getTimeSeries } from "./services/api";
import "./styles.css";

const COUNTRY_NAMES = {
  ES: "España", FR: "Francia", DE: "Alemania", IT: "Italia", PT: "Portugal",
  NL: "Países Bajos", BE: "Bélgica", AT: "Austria", EL: "Grecia", PL: "Polonia",
  SE: "Suecia", FI: "Finlandia", DK: "Dinamarca", IE: "Irlanda", CZ: "República Checa",
  HU: "Hungría", RO: "Rumanía", BG: "Bulgaria", SK: "Eslovaquia", SI: "Eslovenia",
  EE: "Estonia", LV: "Letonia", LT: "Lituania", HR: "Croacia", CY: "Chipre",
  MT: "Malta", LU: "Luxemburgo", NO: "Noruega", CH: "Suiza", IS: "Islandia"
};

export default function App() {
  const [country, setCountry] = useState("ES");
  const [year, setYear] = useState("2023");
  const [data, setData] = useState(null);
  const [timeSeries, setTimeSeries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [trend, setTrend] = useState({ value: "--", isPositive: true });

  const fetchData = async (selectedCountry, selectedYear) => {
    try {
      setLoading(true);
      setError(null);
      
      const resUnemp = await getUnemployment(selectedCountry, selectedYear);
      const rateVal = resUnemp?.tasa_paro ?? resUnemp?.rate ?? resUnemp?.value ?? "N/D";

      setData({
        country: selectedCountry,
        year: selectedYear,
        rate: rateVal
      });

      const resSeries = await getTimeSeries(selectedCountry);
      if (Array.isArray(resSeries)) {
        setTimeSeries(resSeries);
        
        // Cálculo real de la tendencia anual comparando con el año anterior
        const targetYearNum = parseInt(selectedYear);
        const currentYearData = resSeries.find(item => item.year.startsWith(selectedYear));
        const prevYearData = resSeries.find(item => item.year.startsWith((targetYearNum - 1).toString()));

        if (currentYearData && prevYearData) {
          const diff = (Number(currentYearData.rate) - Number(prevYearData.rate)).toFixed(1);
          setTrend({
            value: `${diff > 0 ? "+" : ""}${diff}%`,
            isPositive: diff <= 0 // Menor paro es positivo para la economía
          });
        } else {
          setTrend({ value: "0.0%", isPositive: true });
        }

      } else {
        setTimeSeries([]);
        setTrend({ value: "--", isPositive: true });
      }

    } catch (err) {
      console.error("Error en la petición:", err);
      setError("No se pudieron obtener los datos de la API para este país.");
      setData(null);
      setTimeSeries([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(country, year);
  }, []);

  const handleSearch = (selectedCountry, selectedYear) => {
    setCountry(selectedCountry);
    setYear(selectedYear);
    fetchData(selectedCountry, selectedYear);
  };

  const currentRate = data?.rate ?? "--";
  const fullName = COUNTRY_NAMES[country] || country;

  return (
    <div className="dashboard-container">
      {/* Sidebar Funcional */}
      <aside className="sidebar">
        <div>
          <div className="logo">
            <div className="logo-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
              </svg>
            </div>
            <h2>EuroLabor</h2>
          </div>
          <nav className="nav-menu">
            <button 
              className={`nav-item ${activeTab === "dashboard" ? "active" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
              Dashboard
            </button>
            <button 
              className={`nav-item ${activeTab === "map" ? "active" : ""}`}
              onClick={() => setActiveTab("map")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/><path d="M2 12h20"/></svg>
              Mapa General
            </button>
            <button 
              className={`nav-item ${activeTab === "history" ? "active" : ""}`}
              onClick={() => setActiveTab("history")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Histórico
            </button>
            <button 
              className={`nav-item ${activeTab === "settings" ? "active" : ""}`}
              onClick={() => setActiveTab("settings")}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
              Configuración
            </button>
          </nav>
        </div>
        <div className="sidebar-footer">
          <p>Fuente: <strong>Eurostat API</strong></p>
          <span>Versión 2.1.0</span>
        </div>
      </aside>

      {/* Contenido Principal condicional según la pestaña activa */}
      <main className="main-content">
        <header className="top-header">
          <div>
            <h1>
              {activeTab === "dashboard" && "Dashboard de Empleo en Europa"}
              {activeTab === "map" && "Vista General de Países"}
              {activeTab === "history" && "Registros Históricos y Series Temporales"}
              {activeTab === "settings" && "Configuración del Sistema"}
            </h1>
            <p>
              {activeTab === "dashboard" && "Análisis macroeconómico y estadísticas oficiales de mercado laboral"}
              {activeTab === "map" && "Exploración cartográfica interactiva de la Unión Europea"}
              {activeTab === "history" && "Consulta detallada de la evolución trimestral de desempleo"}
              {activeTab === "settings" && "Parámetros de conexión y preferencias de visualización"}
            </p>
          </div>
          {/* Indicador de API Modernizado */}
          <div className="api-status-pro">
            <span className="status-dot"></span>
            <span>API Conectada</span>
          </div>
        </header>

        {error && <div className="error-banner">{error}</div>}

        {/* Vista: Dashboard Principal */}
        {activeTab === "dashboard" && (
          <>
            <section className="kpi-grid">
              <div className="kpi-card">
                <span className="kpi-title">Tasa Seleccionada</span>
                <div className="kpi-value">{loading ? "..." : `${currentRate}%`}</div>
                <span className="kpi-subtitle">{fullName} — {year}</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Promedio Unión Europea</span>
                <div className="kpi-value">6.1%</div>
                <span className="kpi-subtitle">Estimación Eurostat 2023</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Tendencia Anual</span>
                <div className={`kpi-value ${trend.isPositive ? "positive" : "warning-text"}`}>
                  {trend.isPositive ? "↓" : "↑"} {trend.value}
                </div>
                <span className="kpi-subtitle">Respecto al año anterior</span>
              </div>

              <div className="kpi-card">
                <span className="kpi-title">Países Monitorizados</span>
                <div className="kpi-value">30</div>
                <span className="kpi-subtitle">Miembros y asociados EU</span>
              </div>
            </section>

            <section className="middle-section">
              <div className="glass-card map-wrapper">
                <div className="card-header">
                  <h2>Geolocalización y Mapa Interactivo</h2>
                  <span className="badge">Selección directa</span>
                </div>
                <EuropeMap 
                  onSelectCountry={(code) => handleSearch(code, year)} 
                  selectedCountry={country} 
                />
              </div>

              <div className="side-panel">
                <div className="glass-card">
                  <div className="card-header">
                    <h2>Filtros de Búsqueda</h2>
                  </div>
                  <SearchForm
                    country={country}
                    setCountry={setCountry}
                    year={year}
                    setYear={setYear}
                    onSearch={handleSearch}
                  />
                </div>

                <div className="glass-card detail-card">
                  <div className="card-header">
                    <h2>Resumen Ejecutivo</h2>
                  </div>
                  <div className="detail-list">
                    <div className="detail-item">
                      <span>País Seleccionado:</span>
                      <strong>{fullName} ({country})</strong>
                    </div>
                    <div className="detail-item">
                      <span>Año Consultado:</span>
                      <strong>{year}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Tasa de Paro:</span>
                      <strong className="highlight-text">{loading ? "Cargando..." : `${currentRate}%`}</strong>
                    </div>
                    <div className="detail-item">
                      <span>Estado en Rango EU:</span>
                      <span className={`tag ${Number(currentRate) > 8 ? "warning" : "success"}`}>
                        {loading ? "--" : (Number(currentRate) > 8 ? "Tasa Alta" : "Tasa Moderada")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="bottom-section">
              <div className="glass-card chart-wrapper">
                <div className="card-header">
                  <h2>Evolución Histórica Trimestral ({fullName})</h2>
                  <span className="badge">Serie LFSQ_URGAN</span>
                </div>
                <div style={{ width: "100%", minHeight: "280px", marginTop: "10px" }}>
                  <TimeSeriesChart data={timeSeries} />
                </div>
              </div>
            </section>
          </>
        )}

        {/* Vista: Mapa General */}
        {activeTab === "map" && (
          <div className="glass-card" style={{ padding: "30px" }}>
            <h2 style={{ marginBottom: "20px" }}>Vista Ampliada del Mapa Europeo</h2>
            <div style={{ height: "550px" }}>
              <EuropeMap 
                onSelectCountry={(code) => handleSearch(code, year)} 
                selectedCountry={country} 
              />
            </div>
          </div>
        )}

        {/* Vista: Histórico */}
        {activeTab === "history" && (
          <div className="glass-card" style={{ padding: "30px" }}>
            <h2 style={{ marginBottom: "20px" }}>Análisis de Series Temporales - {fullName}</h2>
            <div style={{ height: "450px" }}>
              <TimeSeriesChart data={timeSeries} />
            </div>
          </div>
        )}

        {/* Vista: Configuración */}
        {activeTab === "settings" && (
          <div className="glass-card" style={{ padding: "30px", maxWidth: "600px" }}>
            <h2 style={{ marginBottom: "20px" }}>Configuración del Dashboard</h2>
            <div className="detail-list">
              <div className="detail-item">
                <span>Endpoint Eurostat API:</span>
                <strong>https://ec.europa.eu/eurostat/api</strong>
              </div>
              <div className="detail-item">
                <span>Dataset Activo:</span>
                <strong>LFSQ_URGAN (Unemployment rates)</strong>
              </div>
              <div className="detail-item">
                <span>Estado de Sincronización:</span>
                <strong style={{ color: "#4ade80" }}>Óptimo</strong>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}