import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

export default function TimeSeriesChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "50px 0", color: "#64748b", fontSize: "0.9rem" }}>
        Cargando histórico o sin datos disponibles para este país.
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 15, right: 25, left: -15, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
          <XAxis dataKey="year" stroke="#94a3b8" fontSize={12} tickLine={false} />
          <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} domain={['auto', 'auto']} />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: "#0f172a", 
              borderColor: "rgba(255, 255, 255, 0.1)", 
              borderRadius: "10px", 
              color: "#fff",
              boxShadow: "0 4px 20px rgba(0,0,0,0.5)"
            }} 
            formatter={(value) => [`${value}%`, "Tasa de Paro"]}
            labelFormatter={(label) => `Año: ${label}`}
          />
          <Line 
            type="monotone" 
            dataKey="rate" 
            stroke="#38bdf8" 
            strokeWidth={3} 
            dot={{ fill: "#38bdf8", strokeWidth: 2, r: 4 }} 
            activeDot={{ r: 6, fill: "#2563eb" }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}