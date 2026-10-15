import React from "react";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

const EUROSTAT_COUNTRIES = {
  "724": "ES", // España
  "250": "FR", // Francia
  "276": "DE", // Alemania
  "380": "IT", // Italia
  "620": "PT", // Portugal
  "528": "NL", // Países Bajos
  "056": "BE", // Bélgica
  "040": "AT", // Austria
  "300": "EL", // Grecia
  "616": "PL", // Polonia
  "752": "SE", // Suecia
  "246": "FI", // Finlandia
  "208": "DK", // Dinamarca
  "372": "IE", // Irlanda
  "203": "CZ", // Chequia
  "348": "HU", // Hungría
  "642": "RO", // Rumanía
  "100": "BG", // Bulgaria
  "703": "SK", // Eslovaquia
  "705": "SI", // Eslovenia
  "233": "EE", // Estonia
  "428": "LV", // Letonia
  "440": "LT", // Lituania
  "191": "HR", // Croacia
  "196": "CY", // Chipre
  "470": "MT", // Malta
  "442": "LU", // Luxemburgo
  "578": "NO", // Noruega
  "756": "CH", // Suiza
  "352": "IS"  // Islandia
};

export default function EuropeMap({ onSelectCountry, selectedCountry }) {
  return (
    <div className="chart-container" style={{ textAlign: "center" }}>
      <h2 className="estadic">Selecciona un país en el mapa</h2>
      <div style={{ width: "100%", height: "420px", overflow: "hidden", background: "#f8fafc" }}>
        <ComposableMap
          projection="geoMercator"
          // Centrado exacto en [10, 48] con escala de 520 para que quede simétrico
          projectionConfig={{ center: [10, 80], scale: 520 }}
          style={{ width: "100%", height: "100%" }}
        >
          <ZoomableGroup center={[10, 48]} zoom={1} maxZoom={4}>
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const countryCode = EUROSTAT_COUNTRIES[geo.id];
                  const isSupported = Boolean(countryCode);
                  const isSelected = countryCode === selectedCountry;

                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      onClick={() => {
                        if (isSupported) onSelectCountry(countryCode);
                      }}
                      style={{
                        default: {
                          fill: isSelected ? "#1d4ed8" : isSupported ? "#93c5fd" : "#e2e8f0",
                          outline: "none",
                          stroke: "#ffffff",
                          strokeWidth: 0.6,
                          cursor: isSupported ? "pointer" : "default"
                        },
                        hover: {
                          fill: isSupported ? "#2563eb" : "#cbd5e1",
                          outline: "none",
                          cursor: isSupported ? "pointer" : "not-allowed"
                        },
                        pressed: { fill: "#1e40af", outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
      </div>
    </div>
  );
}