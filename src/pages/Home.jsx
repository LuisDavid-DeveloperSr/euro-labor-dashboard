import { useState } from "react";
import Header from "../components/Header";
import SearchForm from "../components/SearchForm";
import ResultCard from "../components/ResultCard";
import TimeSeriesChart from "../components/TimeSeriesChart";
import EuropeMap from "../components/EuropeMap";
import { getUnemployment, getTimeSeries } from "../services/api";

export default function Home() {
  const [selectedCountry, setSelectedCountry] = useState("ES");
  const [selectedYear, setSelectedYear] = useState("2023");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState(null);

  const handleSearch = async (country, year) => {
    try {
      setError(null);
      setResult(null);
      setChartData([]);
      
      setSelectedCountry(country);
      setSelectedYear(year);

      const unemployment = await getUnemployment(country, year);
      setResult(unemployment);

      const series = await getTimeSeries(country);

      if (
        !series ||
        !series.value ||
        !series.dimension ||
        !series.dimension.time ||
        !series.dimension.time.category ||
        !series.dimension.time.category.index
      ) {
        throw new Error("Formato inesperado de datos de series temporales");
      }

      const values = series.value;
      const timeIndex = series.dimension.time.category.index;

      const formattedData = Object.entries(timeIndex)
        .map(([periodo, index]) => ({
          periodo,
          tasa: values[index],
        }))
        .filter(item => item.tasa !== undefined);

      if (formattedData.length === 0) {
        throw new Error("Serie temporal vacía");
      }

      setChartData(formattedData);
    } catch (err) {
      console.error("ERROR EN BÚSQUEDA:", err);
      setError("No se pudieron obtener los datos.");
    }
  };

  const handleMapSelect = (countryCode) => {
    handleSearch(countryCode, selectedYear);
  };

  return (
    <div className="container">
      <Header />

      <EuropeMap 
        selectedCountry={selectedCountry} 
        onSelectCountry={handleMapSelect} 
      />

      <SearchForm 
        country={selectedCountry}
        setCountry={setSelectedCountry}
        year={selectedYear}
        setYear={setSelectedYear}
        onSearch={handleSearch} 
      />

      {error && <p className="error">{error}</p>}
      {result && <ResultCard data={result} />}
      {chartData.length > 0 && <TimeSeriesChart data={chartData} />}
    </div>
  );
}