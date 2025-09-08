// app/mantenimiento/page.tsx
"use client";

import React, { useEffect, useState } from "react";

type Rol = "CONDUCTOR" | "TALLER" | "COORDINACION" | "ADMIN";

type Solicitud = {
  id: string;
  createdAt: string;
  updatedAt: string;
  estado: string;
  conductorNombre: string;
  unidad: string;
  placa: string;
  necesidad: string;
  diagnosticoTaller?: string | null;
  decisionCoord?: string | null;
  motivoRechazo?: string | null;
  inicioReparacion?: string | null;
  finReparacion?: string | null;
  actividades?: string | null;
  repuestos?: string | null;
  responsableReparacion?: string | null;
  horaSalidaTaller?: string | null;
  entregaSat?: string | null;
};

export default function Page() {
  const [rol, setRol] = useState<Rol>("CONDUCTOR");
  const [items, setItems] = useState<Solicitud[]>([]);
  const [error, setError] = useState<string>("");

  // formulario “Nueva”
  const [conductorNombre, setConductorNombre] = useState("");
  const [unidad, setUnidad] = useState("Ambulancia");
  const [placa, setPlaca] = useState("");
  const [necesidad, setNecesidad] = useState("");

  async function load() {
    setError("");
    try {
      const r = await fetch("/api/solicitudes", { cache: "no-store" });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`GET /api/solicitudes ${r.status}: ${txt}`);
      }
      const j: Solicitud[] = await r.json();
      setItems(j);
    } catch (e: any) {
      setError(e.message ?? String(e));
      setItems([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function crear() {
    setError("");
    try {
      const r = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conductorNombre, unidad, placa, necesidad }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j?.error || "Error al crear");
      setConductorNombre("");
      setPlaca("");
      setNecesidad("");
      await load();
    } catch (e: any) {
      setError(e.message ?? String(e));
    }
  }

  return (
    <div style={{ padding: 16, maxWidth: 1100, margin: "0 auto" }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>
        Mantenimiento — Producción (Demo)
      </h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div>Usuario Demo</div>
        <select
          value={rol}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setRol(e.target.value as Rol)
          }
          style={{ padding: 6, borderRadius: 8 }}
        >
          <option value="CONDUCTOR">CONDUCTOR</option>
          <option value="TALLER">TALLER</option>
          <option value="COORDINACION">COORDINACION</option>
          <option value="ADMIN">ADMIN</option>
        </select>
      </div>

      {error && (
        <div style={{ marginTop: 8, color: "#b91c1c" }}>
          {error}
        </div>
      )}

      <hr style={{ margin: "16px 0" }} />

      <h2 style={{ fontSize: 18, fontWeight: 700 }}>1) Nueva solicitud</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 8,
          maxWidth: 600,
        }}
      >
        <input
          placeholder="Nombre Conductor"
          value={conductorNombre}
          onChange={(e) => setConductorNombre(e.target.value)}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <select
          value={unidad}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
            setUnidad(e.target.value)
          }
          style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
        >
          <option>Ambulancia</option>
          <option>Movil</option>
        </select>

        <input
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value.toUpperCase())}
          style={{ padding: 8, borderRadius: 8, border: "1px solid #e5e7eb" }}
        />
        <textarea
          placeholder="Necesidad / Descripción"
          value={necesidad}
          onChange={(e) => setNecesidad(e.target.value)}
          style={{
            gridColumn: "1 / span 2",
            padding: 8,
            minHeight: 80,
            borderRadius: 8,
            border: "1px solid #e5e7eb",
          }}
        />
        <button
          onClick={crear}
          style={{
            gridColumn: "1 / span 2",
            padding: 10,
            borderRadius: 8,
            background: "#0369a1",
            color: "white",
            fontWeight: 600,
          }}
        >
          Enviar a Taller
        </button>
      </div>

      <hr style={{ margin: "16px 0" }} />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2 style={{ fontSize: 18, fontWeight: 700 }}>Solicitudes</h2>
        <button
          onClick={load}
          style={{
            padding: "6px 12px",
            borderRadius: 8,
            background: "#111827",
            color: "white",
          }}
        >
          Refrescar
        </button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ color: "#6b7280", textAlign: "left" }}>
            <th style={{ padding: "8px 0" }}>ID</th>
            <th>Estado</th>
            <th>Placa</th>
            <th>Unidad</th>
            <th>Conductor</th>
            <th>Necesidad</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "16px 0", color: "#9ca3af" }}>
                No hay registros aún
              </td>
            </tr>
          ) : (
            items.map((s) => (
              <tr key={s.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                <td style={{ padding: "8px 0" }}>{s.id}</td>
                <td>{s.estado}</td>
                <td>{s.placa}</td>
                <td>{s.unidad}</td>
                <td>{s.conductorNombre}</td>
                <td>{s.necesidad}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
