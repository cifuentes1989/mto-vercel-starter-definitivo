// app/mantenimiento/page.tsx
"use client";
import { useEffect, useState } from "react";

type Solicitud = {
  id: string;
  estado: string;
  placa: string;
  unidad: string;
  conductorNombre: string;
  necesidad: string;
};

export default function Page() {
  const [items, setItems] = useState<Solicitud[]>([]);
  const [form, setForm] = useState({
    conductorNombre: "",
    unidad: "Ambulancia",
    placa: "",
    necesidad: ""
  });

  useEffect(() => {
    fetch("/api/solicitudes").then(r => r.json()).then(setItems);
  }, []);

  async function crear() {
    if (!form.conductorNombre || !form.placa || !form.necesidad) {
      alert("Completa Conductor, Placa y Necesidad");
      return;
    }
    const now = new Date();
    const id = `SM-${now.getFullYear()}${String(now.getMonth()+1).padStart(2,"0")}-${Math.random().toString(36).slice(2,6).toUpperCase()}`;

    const res = await fetch("/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...form })
    });
    if (!res.ok) { alert("Error al crear"); return; }
    const nuevo = await res.json();
    setItems([nuevo, ...items]);
    setForm({ conductorNombre:"", unidad:"Ambulancia", placa:"", necesidad:"" });
  }

  return (
    <main style={{padding:"24px"}}>
      <h1 style={{fontSize:28, marginBottom:16}}>Solicitudes</h1>

      <section style={{border:"1px solid #ddd", borderRadius:8, padding:16, maxWidth:900}}>
        <h3>Nueva solicitud</h3>
        <div style={{display:"grid", gap:8, maxWidth:420}}>
          <input placeholder="Conductor" value={form.conductorNombre}
                 onChange={e=>setForm({...form,conductorNombre:e.target.value})}/>
          <select value={form.unidad} onChange={e=>setForm({...form,unidad:e.target.value})}>
            <option>Ambulancia</option>
            <option>Movil</option>
          </select>
          <input placeholder="Placa" value={form.placa}
                 onChange={e=>setForm({...form,placa:e.target.value.toUpperCase()})}/>
          <input placeholder="Necesidad" value={form.necesidad}
                 onChange={e=>setForm({...form,necesidad:e.target.value})}/>
          <button onClick={crear} style={{padding:"8px 12px"}}>Crear</button>
        </div>
      </section>

      <table style={{marginTop:24, width:"100%", borderCollapse:"collapse"}}>
        <thead>
          <tr style={{textAlign:"left", color:"#666"}}>
            <th style={{padding:"8px 4px"}}>ID</th>
            <th>Estado</th>
            <th>Placa</th>
            <th>Unidad</th>
            <th>Conductor</th>
            <th>Necesidad</th>
          </tr>
        </thead>
        <tbody>
          {items.map(s=>(
            <tr key={s.id} style={{borderTop:"1px solid #eee"}}>
              <td style={{padding:"8px 4px"}}>{s.id}</td>
              <td>{s.estado}</td>
              <td>{s.placa}</td>
              <td>{s.unidad}</td>
              <td>{s.conductorNombre}</td>
              <td>{s.necesidad}</td>
            </tr>
          ))}
          {items.length===0 && (
            <tr><td colSpan={6} style={{padding:24, color:"#999"}}>Sin datos</td></tr>
          )}
        </tbody>
      </table>
    </main>
  );
}
