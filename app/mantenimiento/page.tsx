'use client';

import * as React from 'react';

/** ==== Tipos de UI (ligeros, no los del server) ==== */
type Estado =
  | 'SOLICITUD'
  | 'REVISION_TALLER'
  | 'APROBACION_COORD'
  | 'REPARACION_EN_CURSO'
  | 'ENTREGA'
  | 'COMPLETADA';

type Rol = 'CONDUCTOR' | 'TALLER' | 'COORDINACION';

type Solicitud = {
  id: string;
  createdAt: string;
  updatedAt: string;
  conductorNombre: string;
  unidad: string;
  placa: string;
  necesidad: string;
  estado: Estado;
};

/** ==== Helpers de UI tipados ==== */
const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{
      width: '100%',
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      padding: '8px 10px',
      ...(props.style || {}),
    }}
  />
);

const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea
    {...props}
    style={{
      width: '100%',
      minHeight: 80,
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      padding: '8px 10px',
      ...(props.style || {}),
    }}
  />
);

const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select
    {...props}
    style={{
      width: '100%',
      border: '1px solid #cbd5e1',
      borderRadius: 8,
      padding: '8px 10px',
      ...(props.style || {}),
    }}
  />
);

const Button: React.FC<
  { children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ children, ...rest }) => (
  <button
    {...rest}
    style={{
      background: '#0369a1',
      color: 'white',
      borderRadius: 10,
      fontWeight: 600,
      padding: '8px 14px',
      border: 'none',
      cursor: 'pointer',
      ...(rest.style || {}),
    }}
  >
    {children}
  </button>
);

/** ==== Página ==== */
export default function MantenimientoPage() {
  const [rol, setRol] = React.useState<Rol>('CONDUCTOR');
  const [usuario] = React.useState('Usuario Demo');

  // form creación
  const [conductorNombre, setConductorNombre] = React.useState('');
  const [unidad, setUnidad] = React.useState<'Ambulancia' | 'Movil'>('Ambulancia');
  const [placa, setPlaca] = React.useState('');
  const [necesidad, setNecesidad] = React.useState('');

  const [items, setItems] = React.useState<Solicitud[]>([]);
  const [errMsg, setErrMsg] = React.useState<string>('');

  /** Handlers TIPADOS (evitamos “any”) */
  const onRolChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setRol(e.target.value as Rol);

  const onConductorChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setConductorNombre(e.target.value);

  const onUnidadChange: React.ChangeEventHandler<HTMLSelectElement> = (e) =>
    setUnidad(e.target.value as 'Ambulancia' | 'Movil');

  const onPlacaChange: React.ChangeEventHandler<HTMLInputElement> = (e) =>
    setPlaca(e.target.value.toUpperCase());

  const onNecesidadChange: React.ChangeEventHandler<HTMLTextAreaElement> = (e) =>
    setNecesidad(e.target.value);

  /** Cargar lista */
  async function load() {
    setErrMsg('');
    try {
      const r = await fetch('/api/solicitudes', { cache: 'no-store' });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`GET /api/solicitudes ${r.status}: ${t}`);
      }
      const j: Solicitud[] = await r.json();
      setItems(j);
    } catch (err: any) {
      setErrMsg(String(err?.message ?? err));
    }
  }

  /** Crear solicitud (flujo conductor) */
  async function crear() {
    setErrMsg('');
    try {
      if (!conductorNombre || !placa || !necesidad) {
        alert('Completa nombre, placa y necesidad');
        return;
      }
      const r = await fetch('/api/solicitudes', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          conductorNombre,
          unidad,
          placa,
          necesidad,
          // estado lo define el API por defecto (REVISION_TALLER)
        }),
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`POST /api/solicitudes ${r.status}: ${t}`);
      }
      // limpiar y recargar
      setConductorNombre('');
      setPlaca('');
      setNecesidad('');
      await load();
    } catch (err: any) {
      setErrMsg(String(err?.message ?? err));
    }
  }

  React.useEffect(() => {
    load();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <div
        style={{
          background: '#0c4a6e',
          color: 'white',
          padding: '10px 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div style={{ fontWeight: 700 }}>🛠️ Mantenimiento — Producción (Demo)</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Select value={rol} onChange={onRolChange}>
            <option value="CONDUCTOR">CONDUCTOR</option>
            <option value="TALLER">TALLER</option>
            <option value="COORDINACION">COORDINACION</option>
          </Select>
          <div
            style={{
              background: 'rgba(255,255,255,0.15)',
              padding: '6px 10px',
              borderRadius: 12,
            }}
          >
            {usuario}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 16 }}>
        {/* Mensaje de error si algo falla */}
        {errMsg && (
          <div
            style={{
              background: '#fee2e2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: 10,
              borderRadius: 10,
              marginBottom: 12,
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas',
              whiteSpace: 'pre-wrap',
            }}
          >
            {errMsg}
          </div>
        )}

        {/* Nueva Solicitud */}
        {(rol === 'CONDUCTOR' || rol === 'COORDINACION') && (
          <div
            style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: 16,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div style={{ fontWeight: 700, marginBottom: 8 }}>1) Nueva solicitud</div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 10,
              }}
            >
              <div>
                <div style={{ fontSize: 12, color: '#475569' }}>Nombre Conductor</div>
                <Input value={conductorNombre} onChange={onConductorChange} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#475569' }}>Unidad</div>
                <Select value={unidad} onChange={onUnidadChange}>
                  <option value="Ambulancia">Ambulancia</option>
                  <option value="Movil">Movil</option>
                </Select>
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#475569' }}>Placa</div>
                <Input value={placa} onChange={onPlacaChange} placeholder="ABC123" />
              </div>
              <div />
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ fontSize: 12, color: '#475569' }}>Necesidad / Descripción</div>
                <TextArea value={necesidad} onChange={onNecesidadChange} />
              </div>
            </div>

            <div style={{ marginTop: 10 }}>
              <Button onClick={crear}>Enviar a Taller</Button>
            </div>
          </div>
        )}

        {/* Listado */}
        <div
          style={{
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: 16,
            padding: 16,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ fontWeight: 700 }}>Solicitudes</div>
            <Button onClick={load} style={{ background: '#334155' }}>
              Refrescar
            </Button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', fontSize: 14, borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', color: '#475569' }}>
                  <th style={{ padding: '6px 4px' }}>ID</th>
                  <th>Estado</th>
                  <th>Placa</th>
                  <th>Unidad</th>
                  <th>Conductor</th>
                  <th>Necesidad</th>
                </tr>
              </thead>
              <tbody>
                {items.map((s) => (
                  <tr key={s.id} style={{ borderTop: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '8px 4px' }}>{s.id}</td>
                    <td>{s.estado}</td>
                    <td>{s.placa}</td>
                    <td>{s.unidad}</td>
                    <td>{s.conductorNombre}</td>
                    <td>{s.necesidad}</td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr>
                    <td colSpan={6} style={{ padding: 16, textAlign: 'center', color: '#94a3b8' }}>
                      No hay registros aún
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
