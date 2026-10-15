import React from "react";

const COUNTRIES = [
  { code: "ES", name: "España" },
  { code: "FR", name: "Francia" },
  { code: "DE", name: "Alemania" },
  { code: "IT", name: "Italia" },
  { code: "PT", name: "Portugal" },
  { code: "NL", name: "Países Bajos" },
  { code: "BE", name: "Bélgica" },
  { code: "AT", name: "Austria" },
  { code: "EL", name: "Grecia" },
  { code: "PL", name: "Polonia" },
  { code: "SE", name: "Suecia" },
  { code: "FI", name: "Finlandia" },
  { code: "DK", name: "Dinamarca" },
  { code: "IE", name: "Irlanda" },
  { code: "CZ", name: "Chequia" },
  { code: "HU", name: "Hungría" },
  { code: "RO", name: "Rumanía" },
  { code: "BG", name: "Bulgaria" },
  { code: "SK", name: "Eslovaquia" },
  { code: "SI", name: "Eslovenia" },
  { code: "EE", name: "Estonia" },
  { code: "LV", name: "Letonia" },
  { code: "LT", name: "Lituania" },
  { code: "HR", name: "Croacia" },
  { code: "CY", name: "Chipre" },
  { code: "MT", name: "Malta" },
  { code: "LU", name: "Luxemburgo" },
  { code: "NO", name: "Noruega" },
  { code: "CH", name: "Suiza" },
  { code: "IS", name: "Islandia" }
];

export default function SearchForm({ country, setCountry, year, setYear, onSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(country, year);
  };

  return (
    <form className="form-modern" onSubmit={handleSubmit}>
      <div className="form-group-modern">
        <label>País</label>
        <select 
          value={country} 
          onChange={(e) => setCountry(e.target.value)}
          className="input-styled"
        >
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code} style={{ background: "#0f172a", color: "#fff" }}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group-modern">
        <label>Año</label>
        <input
          type="number"
          min="2000"
          max="2025"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="input-styled"
        />
      </div>

      <button type="submit" className="btn-styled">Buscar</button>
    </form>
  );
}