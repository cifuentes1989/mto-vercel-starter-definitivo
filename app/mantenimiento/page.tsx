"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";

/** Helpers UI */
const Pill = ({ children }: any) => (
  <span style={{display:"inline-block",borderRadius:999,padding:"2px 8px",border:"1px solid #7dd3fc",background:"#f0f9ff",fontSize:12}}>{children}</span>
);
const H2 = ({ children }: any) => (<h2 style={{ fontSize: 18, fontWeight: 600, margin: "12px 0" }}>{children}</h2>);
const Card = ({ children }: any) => (<div style={{background:"#fff",border:"1px solid #e5e7eb",borderRadius:16,padding:16,boxShadow:"0 1px 3px rgba(0,0,0,.05)"}}>{children}</div>);
const Line = () => (<div style={{ height: 1, background: "#e5e7eb", margin: "12px 0" }} />);
const Field = ({ label, children }: any) => (<label style={{display:"flex",flexDirection:"column",gap:6,fontSize:14,color:"#374151"}}><span>{label}</span>{children}</label>);
const TextInput = (p: any) => (<input {...p} style={{width:"100%",borderRadius:12,border:"1px solid #cbd5e1",padding:"8px 12px",...(p.style||{})}}/>);
const TextArea  = (p: any) => (<textarea {...p} style={{width:"100%",minHeight:80,borderRadius:12,border:"1px solid #cbd5e1",padding:"8px 12px",...(p.style||{})}}/>);
const Select    = (p: any) => (<select {...p} style={{width:"100%",borderRadius:12,border:"1px solid #cbd5e1",padding:"8px 12px",...(p.style||{})}}/>);
const Button = ({ children, onClick, variant }: any) => {
  const bg = variant==="danger"?"#e11d48":variant==="secondary"?"#475569":"#0369a1";
  return <button onClick={onClick} style={{color:"#fff",fontWeight:600,padding:"8px 14px",borderRadius:12,background:bg,border:"none",cursor:"pointer"}}>{children}</button>;
};

// Signature pad
function useSignaturePad() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const pos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.lineWidth = 2; ctx.lineCap = "round";

    const getPos = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const t = e.touches?.[0];
      const cx = t?.clientX ?? e.clientX ?? 0;
      const cy = t?.clientY ?? e.clientY ?? 0;
      return { x: cx - rect.left, y: cy - rect.top };
    };
    const start = (e: any) => { drawing.current = true; pos.current = getPos(e); };
    const move  = (e: any) => {
      if (!drawing.current) return;
      const p = getPos(e);
      ctx.beginPath(); ctx.moveTo(pos.current.x, pos.current.y); ctx.lineTo(p.x, p.y); ctx.stroke();
      pos.current = p;
    };
    const end   = () => (drawing.current = false);

    const o = { passive: false } as any;
    canvas.addEventListener("mousedown", start, o);
    canvas.addEventListener("mousemove", move,  o);
    window.addEventListener("mouseup",   end,   o);
    canvas.addEventListener("touchstart", start, o);
    canvas.addEventListener("touchmove",  move,  o);
    window.addEventListener("touchend",   end,   o);

    return () => {
      canvas.removeEventListener("mousedown", start);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", end);
      canvas.removeEventListener("touchstart", start);
      canvas.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", end);
    };
  }, []);

  const clear = () => {
    const canvas = ref.current; if (!canvas) return;
    const ctx = canvas.getContext("2d")!; ctx.clearRect(0,0,canvas.width,canvas.height);
  };
  const data = () => ref.current?.toDataURL("image/png") || "";
  return { ref, clear, data };
}

type Solicitud = any;

export default function Page(){
  const [rol, setRol] = useState("CONDUCTOR");
  const [usuario, setUsuario] = useState("Usuario Demo");
  const [items, setItems] = useState<Solicitud[]>([]);
  const [selId, setSelId] = useState("");

  const selected = useMemo(()=> items.find(s=>s.id===selId) || null, [items, selId]);

  async function load() {
    const r = await fetch("/api/solicitudes", { cache: "no-store" });
    const j = await r.json();
    setItems(j);
  }
  useEffect(()=>{ load(); }, []);

  const pendientes = useMemo(()=>{
    const f: Record<string, string[]> = {
      CONDUCTOR: ["ENTREGA", "SOLICITUD"],
      TALLER: ["REVISION_TALLER", "REPARACION_EN_CURSO"],
      COORDINACION: ["APROBACION_COORD", "ENTREGA"],
      ADMIN: ["SOLICITUD","REVISION_TALLER","APROBACION_COORD","REPARACION_EN_CURSO","ENTREGA","COMPLETADA"]
    };
    return items.filter(it=>f[rol].includes(it.estado));
  }, [items, rol]);

  // crear
  const cPad = useSignaturePad();
  const [cNombre, setCNombre] = useState("");
  const [cUnidad, setCUnidad] = useState("Ambulancia");
  const [cPlaca, setCPlaca] = useState("");
  const [cNec, setCNec] = useState("");

  async function crearSolicitud(){
    if(!cNombre || !cPlaca || !cNec) { alert("Completa nombre, placa y necesidad"); return; }
    const r = await fetch("/api/solicitudes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        conductorNombre: cNombre,
        unidad: cUnidad,
        placa: cPlaca.toUpperCase(),
        necesidad: cNec,
        firmaConductor: cPad.data(),
      }),
    });
    if(!r.ok){ alert("Error al crear"); return; }
    await load();
    setCNombre(""); setCPlaca(""); setCNec(""); cPad.clear();
    setRol("TALLER");
  }

  // taller diag
  const tPadDiag = useSignaturePad();
  const [tIngreso, setTIngreso] = useState("");
  const [tDiag, setTDiag] = useState("");

  async function tallerEnviarAprobacion(){
    if(!selected) return;
    if(selected.estado!=="REVISION_TALLER"){ alert("No está en REVISION_TALLER"); return; }
    const r = await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "taller_diag",
        horaIngresoTaller: tIngreso || new Date().toISOString(),
        diagnosticoTaller: tDiag,
        firmaTallerDiag: tPadDiag.data(),
      }),
    });
    if(!r.ok){ alert("Error"); return; }
    await load(); setRol("COORDINACION");
    setTIngreso(""); setTDiag(""); tPadDiag.clear();
  }

  // coord decision
  const cPadAprob = useSignaturePad();
  const cPadFinal = useSignaturePad();
  const [cDecision, setCDecision] = useState("APROBADO");
  const [cMotivo, setCMotivo] = useState("");

  async function coordGuardarDecision(){
    if(!selected) return;
    if(selected.estado!=="APROBACION_COORD"){ alert("No está en APROBACION_COORD"); return; }
    const r = await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "coord_decision",
        decisionCoord: cDecision,
        motivoRechazo: cMotivo || null,
        firmaCoordAprob: cPadAprob.data(),
      }),
    });
    if(!r.ok){ alert("Error"); return; }
    await load();
    setCMotivo(""); cPadAprob.clear();
  }

  // taller cierre
  const tPadRep = useSignaturePad();
  const [tIni, setTIni] = useState("");
  const [tFin, setTFin] = useState("");
  const [tResp, setTResp] = useState("");
  const [tAct, setTAct] = useState("");
  const [tRep, setTRep] = useState("");
  const [tSalida, setTSalida] = useState("");

  async function tallerFinalizarReparacion(){
    if(!selected) return;
    if(selected.estado!=="REPARACION_EN_CURSO"){ alert("No está en REPARACION_EN_CURSO"); return; }
    if(!tFin || !tResp){ alert("Completa Fin y Responsable"); return; }
    const r = await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "taller_cerrar",
        inicioReparacion: tIni || null,
        finReparacion: tFin,
        actividades: tAct || null,
        repuestos: tRep || null,
        responsableReparacion: tResp,
        horaSalidaTaller: tSalida || new Date().toISOString(),
        firmaReparacion: tPadRep.data(),
      }),
    });
    if(!r.ok){ alert("Error"); return; }
    await load(); setRol("CONDUCTOR");
    tPadRep.clear();
  }

  // entrega
  const ePad = useSignaturePad();
  const [eSat, setESat] = useState("OK");

  async function entregaFirmar(){
    if(!selected) return;
    if(selected.estado!=="ENTREGA"){ alert("No está en ENTREGA"); return; }
    const r = await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        accion: "entrega_firmar",
        entregaSatisfaccion: eSat,
        firmaEntregaConductor: ePad.data(),
      }),
    });
    if(!r.ok){ alert("Error"); return; }
    await load(); setRol("COORDINACION");
    ePad.clear();
  }

  // coord cierre (PDF demo)
  function plantillaHTML(d: any, firmaCoordFinal: string, tipoCierre: string){
    const esc=(s:string)=> (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
    const img=(u?:string)=> u?`<img src="${u}" style="max-height:80px"/>`:"";
    return `<!doctype html><html><head><meta charset="utf-8"/><style>
    body{font-family:Arial;margin:24px;color:#111}h1{font-size:18px;margin:0 0 6px}
    table{width:100%;border-collapse:collapse;margin:8px 0}
    td,th{border:1px solid #ccc;padding:6px;font-size:12px;vertical-align:top}.sec{background:#f2f7ff;font-weight:bold}
    </style></head><body>
    <h1>Solicitud de Mantenimiento – ${d.id}</h1>
    <table>
      <tr><th class="sec" colspan="2">Datos</th></tr>
      <tr><td>Conductor</td><td>${esc(d.conductorNombre)}</td></tr>
      <tr><td>Unidad/Placa</td><td>${esc(d.unidad)} · ${esc(d.placa)}</td></tr>
      <tr><td>Necesidad</td><td>${esc(d.necesidad||"")}</td></tr>
      <tr><td>Firma Conductor</td><td>${img(d.firmaConductor)}</td></tr>
      <tr><th class="sec" colspan="2">Taller</th></tr>
      <tr><td>Ingreso</td><td>${esc(d.horaIngresoTaller||"")}</td></tr>
      <tr><td>Diagnóstico</td><td>${esc(d.diagnosticoTaller||"")}</td></tr>
      <tr><td>Firma Diag</td><td>${img(d.firmaTallerDiag)}</td></tr>
      <tr><th class="sec" colspan="2">Coord</th></tr>
      <tr><td>Decisión</td><td>${esc(d.decisionCoord||"")}</td></tr>
      <tr><td>Motivo</td><td>${esc(d.motivoRechazo||"")}</td></tr>
      <tr><td>Firma</td><td>${img(d.firmaCoordAprob)}</td></tr>
      <tr><th class="sec" colspan="2">Reparación</th></tr>
      <tr><td>Inicio/Fin</td><td>${esc(d.inicioReparacion||"")} → ${esc(d.finReparacion||"")}</td></tr>
      <tr><td>Actividades</td><td>${esc(d.actividades||"")}</td></tr>
      <tr><td>Repuestos</td><td>${esc(d.repuestos||"")}</td></tr>
      <tr><td>Responsable</td><td>${esc(d.responsableReparacion||"")}</td></tr>
      <tr><td>Salida Taller</td><td>${esc(d.horaSalidaTaller||"")}</td></tr>
      <tr><td>Firma Reparación</td><td>${img(d.firmaReparacion)}</td></tr>
      <tr><th class="sec" colspan="2">Entrega</th></tr>
      <tr><td>Satisfacción</td><td>${esc(d.entregaSatisfaccion||"")}</td></tr>
      <tr><td>Firma Entrega</td><td>${img(d.firmaEntregaConductor)}</td></tr>
      <tr><th class="sec" colspan="2">Cierre</th></tr>
      <tr><td>Firma Final</td><td>${img(firmaCoordFinal||d.firmaCoordFinal)}</td></tr>
    </table>
    <script>window.onload=()=>window.print()</script></body></html>`;
  }
  function abrirVentanaPDF(html: string){
    const w = window.open("", "_blank"); if(w){ w.document.open(); w.document.write(html); w.document.close(); }
  }

  async function coordFinalizar(){
    if(!selected) return;
    if(selected.estado!=="ENTREGA"){ alert("No está en ENTREGA"); return; }
    const html = plantillaHTML(selected, cPadFinal.data(), "Cierre normal");
    const r = await fetch(`/api/solicitudes/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accion: "coord_cerrar", firmaCoordFinal: cPadFinal.data(), pdfDemoHTML: html }),
    });
    if(!r.ok){ alert("Error"); return; }
    await load();
    cPadFinal.clear();
    abrirVentanaPDF(html);
  }

  const porEstado = (es:string)=> items.filter(i=>i.estado===es);

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>
      <div style={{ background: "#075985", color: "#fff", padding: 12, display: "flex", justifyContent: "space-between" }}>
        <div style={{ fontWeight: 600 }}>🛠️ Mantenimiento — Producción</div>
        <div style={{ display: "flex", gap: 8 }}>
          <Select value={rol} onChange={e=>setRol(e.target.value)}>
            <option value="CONDUCTOR">CONDUCTOR</option>
            <option value="TALLER">TALLER</option>
            <option value="COORDINACION">COORDINACION</option>
            <option value="ADMIN">ADMIN</option>
          </Select>
          <TextInput value={usuario} onChange={e=>setUsuario(e.target.value)} style={{ width: 220 }} placeholder="Tu nombre"/>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: 16, display: "grid", gridTemplateColumns: "1fr 2fr", gap: 16 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {(rol==="CONDUCTOR"||rol==="ADMIN") && (
            <Card>
              <H2>1) Nueva Solicitud (Conductor)</H2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Nombre Conductor"><TextInput value={cNombre} onChange={e=>setCNombre(e.target.value)} /></Field>
                <Field label="Unidad"><Select value={cUnidad} onChange={e=>setCUnidad(e.target.value)}><option>Ambulancia</option><option>Movil</option></Select></Field>
                <Field label="Placa"><TextInput value={cPlaca} onChange={e=>setCPlaca(e.target.value.toUpperCase())} placeholder="ABC123"/></Field>
                <div />
                <Field label="Necesidad / Descripción"><TextArea value={cNec} onChange={e=>setCNec(e.target.value)} /></Field>
              </div>
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Conductor</div>
                <canvas ref={cPad.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                  <Button variant="secondary" onClick={cPad.clear}>Limpiar</Button>
                  <Button onClick={crearSolicitud}>Enviar a Taller</Button>
                </div>
              </div>
            </Card>
          )}

          <Card>
            <H2>Bandeja</H2>
            <div style={{ fontSize: 13, color: "#475569", marginBottom: 8 }}>Rol actual: <Pill>{rol}</Pill></div>
            <Select value={selId} onChange={e=>setSelId(e.target.value)}>
              <option value="">— Selecciona ID —</option>
              {pendientes.map(it=> (<option key={it.id} value={it.id}>{`${it.id} · ${it.placa} · ${it.estado}`}</option>))}
            </Select>
          </Card>

          <Card>
            <H2>Estado global</H2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 14 }}>
              <div><Pill>SOLICITUD</Pill> {porEstado("SOLICITUD").length}</div>
              <div><Pill>REVISION_TALLER</Pill> {porEstado("REVISION_TALLER").length}</div>
              <div><Pill>APROBACION_COORD</Pill> {porEstado("APROBACION_COORD").length}</div>
              <div><Pill>REPARACION_EN_CURSO</Pill> {porEstado("REPARACION_EN_CURSO").length}</div>
              <div><Pill>ENTREGA</Pill> {porEstado("ENTREGA").length}</div>
              <div><Pill>COMPLETADA</Pill> {porEstado("COMPLETADA").length}</div>
            </div>
          </Card>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card>
            <H2>Detalle</H2>
            {!selected && <div style={{ color: "#64748b" }}>Selecciona un ID de tu bandeja para operar.</div>}
            {selected && (
              <div>
                <div style={{ display: "flex", gap: 8, flexWrap:"wrap", fontSize: 14, marginBottom: 8 }}>
                  <Pill>ID {selected.id}</Pill>
                  <Pill>Estado {selected.estado}</Pill>
                  <span style={{ color: "#475569" }}>Placa <b>{selected.placa}</b> • Unidad {selected.unidad}</span>
                </div>
                <Line/>

                {selected.estado==="REVISION_TALLER" && (rol==="TALLER"||rol==="ADMIN") && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 13, color: "#475569" }}>Diagnóstico de Taller</div>
                    <Field label="Hora Ingreso (ISO)"><TextInput value={tIngreso} onChange={e=>setTIngreso(e.target.value)} /></Field>
                    <Field label="Diagnóstico"><TextArea value={tDiag} onChange={e=>setTDiag(e.target.value)} /></Field>
                    <div>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Taller</div>
                      <canvas ref={tPadDiag.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={tPadDiag.clear}>Limpiar</Button>
                        <Button onClick={tallerEnviarAprobacion}>Enviar a Coordinación</Button>
                      </div>
                    </div>
                  </div>
                )}

                {selected.estado==="APROBACION_COORD" && (rol==="COORDINACION"||rol==="ADMIN") && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ fontSize: 13 }}>Diagnóstico recibido: <b>{selected.diagnosticoTaller||"(vacío)"}</b></div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Field label="Decisión"><Select value={cDecision} onChange={e=>setCDecision(e.target.value)}><option>APROBADO</option><option>RECHAZADO</option><option>ESPERA</option></Select></Field>
                      <Field label="Motivo (si aplica)"><TextInput value={cMotivo} onChange={e=>setCMotivo(e.target.value)} /></Field>
                    </div>
                    <div>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Coordinación</div>
                      <canvas ref={cPadAprob.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={cPadAprob.clear}>Limpiar</Button>
                        <Button onClick={coordGuardarDecision}>Guardar decisión</Button>
                      </div>
                    </div>
                  </div>
                )}

                {selected.estado==="REPARACION_EN_CURSO" && (rol==="TALLER"||rol==="ADMIN") && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <Field label="Inicio Reparación (ISO)"><TextInput value={tIni} onChange={e=>setTIni(e.target.value)} /></Field>
                      <Field label="Fin Reparación (ISO)"><TextInput value={tFin} onChange={e=>setTFin(e.target.value)} /></Field>
                      <Field label="Responsable"><TextInput value={tResp} onChange={e=>setTResp(e.target.value)} /></Field>
                      <Field label="Hora Salida Taller (ISO)"><TextInput value={tSalida} onChange={e=>setTSalida(e.target.value)} /></Field>
                    </div>
                    <Field label="Actividades"><TextArea value={tAct} onChange={e=>setTAct(e.target.value)} /></Field>
                    <Field label="Repuestos"><TextArea value={tRep} onChange={e=>setTRep(e.target.value)} /></Field>
                    <div>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Taller (reparación)</div>
                      <canvas ref={tPadRep.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={tPadRep.clear}>Limpiar</Button>
                        <Button onClick={tallerFinalizarReparacion}>Pasar a Entrega</Button>
                      </div>
                    </div>
                  </div>
                )}

                {selected.estado==="ENTREGA" && (rol==="CONDUCTOR"||rol==="ADMIN"||rol==="COORDINACION") && (
                  <div style={{ display: "grid", gap: 8 }}>
                    <Field label="Conformidad">
                      <Select value={eSat} onChange={e=>setESat(e.target.value)}><option>OK</option><option>NO_CONFORME</option></Select>
                    </Field>
                    <div>
                      <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Conductor (entrega)</div>
                      <canvas ref={ePad.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                        <Button variant="secondary" onClick={ePad.clear}>Limpiar</Button>
                        <Button onClick={entregaFirmar}>Firmar recepción</Button>
                      </div>
                    </div>
                    {(rol==="COORDINACION"||rol==="ADMIN") && (
                      <div style={{ marginTop: 8, padding: 12, border: "1px solid #e5e7eb", borderRadius: 12, background: "#f8fafc" }}>
                        <div style={{ fontWeight: 600, marginBottom: 6 }}>Cierre (Coordinación)</div>
                        <div style={{ fontSize: 13, marginBottom: 6 }}>Firma Coordinación final</div>
                        <canvas ref={cPadFinal.ref} width={520} height={120} style={{ background: "#fff", border: "1px solid #cbd5e1", borderRadius: 12, width: "100%" }}/>
                        <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
                          <Button variant="secondary" onClick={cPadFinal.clear}>Limpiar</Button>
                          <Button onClick={coordFinalizar}>Finalizar y generar PDF (demo)</Button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {selected.estado==="COMPLETADA" && (
                  <div style={{ color: "#065f46" }}>
                    Proceso completado. {selected.pdfDemoHTML && (
                      <Button variant="secondary" onClick={()=>{ const w=window.open("","_blank"); if(w){w.document.open(); w.document.write(selected.pdfDemoHTML); w.document.close();}}}>Ver PDF (demo)</Button>
                    )}
                  </div>
                )}
              </div>
            )}
          </Card>

          <Card>
            <H2>Registros</H2>
            <table width="100%" cellPadding={8} style={{ borderCollapse: "collapse", fontSize: 14 }}>
              <thead style={{ color: "#64748b" }}>
                <tr><th align="left">ID</th><th align="left">Fecha</th><th align="left">Placa</th><th align="left">Unidad</th><th align="left">Estado</th><th/></tr>
              </thead>
              <tbody>
                {items.map(s=> (
                  <tr key={s.id} style={{ borderTop: "1px solid #e5e7eb" }}>
                    <td>{s.id}</td>
                    <td>{new Date(s.createdAt).toLocaleString()}</td>
                    <td>{s.placa}</td>
                    <td>{s.unidad}</td>
                    <td><Pill>{s.estado}</Pill></td>
                    <td align="right">
                      <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                        {s.pdfDemoHTML && <Button variant="secondary" onClick={()=>{ const w=window.open("","_blank"); if(w){w.document.open(); w.document.write(s.pdfDemoHTML); w.document.close();}}}>PDF</Button>}
                        <Button variant="secondary" onClick={()=>{setSelId(s.id); window.scrollTo({top:0, behavior:"smooth"})}}>Abrir</Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {items.length===0 && (<tr><td colSpan={6} align="center" style={{ color: "#94a3b8", padding: 24 }}>No hay registros aún</td></tr>)}
              </tbody>
            </table>
          </Card>
        </div>
      </div>
    </div>
  );
}

