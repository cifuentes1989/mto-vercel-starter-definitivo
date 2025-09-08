// app/mantenimiento/page.tsx
"use client";

import React, { useEffect, useMemo, useState } from "react";

/** ==== Tipos ========================================================= */
type Estado =
  | "SOLICITUD"
  | "REVISION_TALLER"
  | "APROBACION_COORD"
  | "REPARACION_EN_CURSO"
  | "ENTREGA"
  | "COMPLETADA";

type Rol = "CONDUCTOR" | "TALLER" | "COORDINACION" | "ADMIN";

interface Solicitud {
  id: number;
  radicado: string;
  conductorNombre: string;
  unidad: string;
  placa: string;
  necesidad: string;
  estado: Estado;
  createdAt: string;
  updatedAt: string;
}

/** ==== UI Helpers ==================================================== */
function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={`card ${className ?? ""}`}>{children}</div>;
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      <span style={{ fontSize: 14, color: "#475569" }}>{label}</span>
      {children}
    </label>
  );
}

function Input(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return <input {...props} className={`input ${props.className ?? ""}`} />;
}

function Textarea(
  props: React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >
) {
  return <textarea {...props} className={`textarea ${props.className ?? ""}`} />;
}

function Select(
  props: React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  >
) {
  return <select {...props} className={`select ${props.className ?? ""}`} />;
}

function Button({
  children,
  variant,
  ...rest
}: {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger";
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base = "btn";
  const cls =
    variant === "secondary"
      ? "btn btn-secondary"
      : variant === "danger"
      ? "btn btn-danger"
      : base;
  return (
    <button {...rest} className={cls}>
      {children}
    </button>
  );
}

/** ==== Página ======================================================== */
export default function Page() {
  const [rol, setRol] = useState<Rol>("CONDUCTOR");
  const [usuario] = useState<string>("Usuario Demo");

  const [items, setItems] = useState<Solicitud[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  // formulario
  const [conductorNombre, setConductorNombre] = useState("");
  const [unidad, setUnidad] = useState("Ambulancia");
  const [placa, setPlaca] = useState("ABC123");
  const [necesidad, setNecesidad] = useState("");

  /** Cargar lista */
  async function cargar() {
    setErrorMsg("");
    setLoading(true);
    try {
      const r = await fetch("/api/solicitudes", { cache: "no-store" });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`GET /api/solicitudes ${r.status}: ${txt}`);
      }
      const data = (await r.json()) as Solicitud[];
      setItems(data);
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "Fallo al listar");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  /** Crear */
  async function crear() {
    setErrorMsg("");
    if (!conductorNombre || !placa || !necesidad) {
      setErrorMsg("Completa: Conductor, Placa y Necesidad");
      return;
    }
    try {
      const r = await fetch("/api/solicitudes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conductorNombre,
          unidad,
          placa,
          necesidad,
        }),
      });
      if (!r.ok) {
        const txt = await r.text();
        throw new Error(`POST /api/solicitudes ${r.status}: ${txt}`);
      }
      setConductorNombre("");
      setPlaca("ABC123");
      setNecesidad("");
      await cargar();
      // cambio de rol para continuar flujo demo
      setRol("TALLER");
    } catch (e: any) {
      console.error(e);
      setErrorMsg(e?.message || "Fallo al crear");
    }
  }

  /** Bandeja por rol (demo) */
  const pendientes = useMemo(() => {
    const mapa: Record<Rol, Estado[]> = {
      CONDUCTOR: ["SOLICITUD", "ENTREGA"],
      TALLER: ["REVISION_TALLER", "REPARACION_EN_CURSO"],
      COORDINACION: ["APROBACION_COORD", "ENTREGA"],
      ADMIN: [
        "SOLICITUD",
        "REVISION_TALLER",
        "APROBACION_COORD",
        "REPARACION_EN_CURSO",
        "ENTREGA",
        "COMPLETADA",
      ],
    };
    return items.filter((x) => mapa[rol].includes(x.estado));
  }, [items, rol]);

  return (
    <>
      {/* Topbar */}
      <div className="topbar">
        <div>🛠️ Mantenimiento — Producción (Demo)</div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Select
            value={rol}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setRol(e.target.value as Rol)
            }
          >
            <option value="CONDUCTOR">CONDUCTOR</option>
            <option value="TALLER">TALLER</option>
            <option value="COORDINACION">COORDINACION</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
          <span className="badge">{usuario}</span>
        </div>
      </div>

      <div className="container">
        {errorMsg && (
          <div
            style={{
              background: "#fee2e2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "8px 12px",
              borderRadius: 12,
              marginBottom: 12,
              fontSize: 14,
            }}
          >
            {errorMsg}
          </div>
        )}

        {/* Nueva Solicitud */}
        {(rol === "CONDUCTOR" || rol === "ADMIN") && (
          <Card>
            <div style={{ fontWeight: 600, marginBottom: 8 }}>
              1) Nueva solicitud
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <Field label="Nombre Conductor">
                <Input
                  value={conductorNombre}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setConductorNombre(e.target.value)
                  }
                />
              </Field>
              <Field label="Unidad">
                <Select
                  value={unidad}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setUnidad(e.target.value)
                  }
                >
                  <option>Ambulancia</option>
                  <option>Movil</option>
                </Select>
              </Field>
              <Field label="Placa">
                <Input
                  value={placa}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setPlaca(e.target.value.toUpperCase())
                  }
                />
              </Field>
              <div />
              <Field label="Necesidad / Descripción">
                <Textarea
                  value={necesidad}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNecesidad(e.target.value)
                  }
                />
              </Field>
            </div>

            <div style={{ marginTop: 12 }}>
              <Button onClick={crear}>Enviar a Taller</Button>
            </div>
          </Card>
        )}

        {/* Tabla */}
        <Card style={{ marginTop: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontWeight: 600 }}>Solicitudes</div>
            <Button variant="secondary" onClick={cargar} disabled={loading}>
              {loading ? "Cargando..." : "Refrescar"}
            </Button>
          </div>

          <table className="table" style={{ marginTop: 8 }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Radicado</th>
                <th>Estado</th>
                <th>Placa</th>
                <th>Unidad</th>
                <th>Conductor</th>
                <th>Necesidad</th>
              </tr>
            </thead>
            <tbody>
              {pendientes.map((s) => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td>{s.radicado}</td>
                  <td>
                    <span className="badge">{s.estado}</span>
                  </td>
                  <td>{s.placa}</td>
                  <td>{s.unidad}</td>
                  <td>{s.conductorNombre}</td>
                  <td>{s.necesidad}</td>
                </tr>
              ))}
              {pendientes.length === 0 && (
                <tr>
                  <td colSpan={7} style={{ textAlign: "center", color: "#94a3b8" }}>
                    No hay registros aún
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
