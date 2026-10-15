export default function ResultCard({ data }) {
  return (
    <div className="card section result-card">
      <h2>Resultado</h2>
      <p><strong>País:</strong> {data.pais}</p>
      <p><strong>Año:</strong> {data.año}</p>
      <p><strong>Tasa de paro:</strong> {data.tasa_paro}%</p>
    </div>
  );
}