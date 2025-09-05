// app/api/solicitudes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Accion =
  | "taller_diag"
  | "coord_decision"
  | "taller_cerrar"
  | "entrega_firmar"
  | "coord_cerrar";

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const s = await prisma.solicitud.findUnique({ where: { id: params.id } });
  if (!s) return NextResponse.json({ error: "No existe" }, { status: 404 });
  return NextResponse.json(s);
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;
  const body = await req.json();
  const accion: Accion = body?.accion;

  try {
    switch (accion) {
      case "taller_diag": {
        // requiere diagnostico y firma
        const { horaIngresoTaller, diagnosticoTaller, firmaTallerDiag } = body || {};
        if (!diagnosticoTaller) {
          return NextResponse.json({ error: "diagnosticoTaller requerido" }, { status: 400 });
        }
        const upd = await prisma.solicitud.update({
          where: { id },
          data: {
            horaIngresoTaller: horaIngresoTaller ?? new Date().toISOString(),
            diagnosticoTaller,
            firmaTallerDiag: firmaTallerDiag ?? null,
            estado: "APROBACION_COORD",
          },
        });
        return NextResponse.json(upd);
      }

      case "coord_decision": {
        const { decisionCoord, motivoRechazo, firmaCoordAprob } = body || {};
        if (!["APROBADO", "RECHAZADO", "ESPERA"].includes(decisionCoord || "")) {
          return NextResponse.json({ error: "decisionCoord inválida" }, { status: 400 });
        }
        const nuevoEstado =
          decisionCoord === "APROBADO"
            ? "REPARACION_EN_CURSO"
            : decisionCoord === "RECHAZADO"
            ? "COMPLETADA"
            : "APROBACION_COORD";
        const upd = await prisma.solicitud.update({
          where: { id },
          data: {
            decisionCoord,
            motivoRechazo: motivoRechazo ?? null,
            firmaCoordAprob: firmaCoordAprob ?? null,
            estado: nuevoEstado,
          },
        });
        return NextResponse.json(upd);
      }

      case "taller_cerrar": {
        const {
          inicioReparacion,
          finReparacion,
          actividades,
          repuestos,
          responsableReparacion,
          horaSalidaTaller,
          firmaReparacion,
        } = body || {};
        if (!finReparacion || !responsableReparacion) {
          return NextResponse.json({ error: "finReparacion y responsableReparacion requeridos" }, { status: 400 });
        }
        const upd = await prisma.solicitud.update({
          where: { id },
          data: {
            inicioReparacion: inicioReparacion ?? null,
            finReparacion,
            actividades: actividades ?? null,
            repuestos: repuestos ?? null,
            responsableReparacion,
            horaSalidaTaller: horaSalidaTaller ?? new Date().toISOString(),
            firmaReparacion: firmaReparacion ?? null,
            estado: "ENTREGA",
          },
        });
        return NextResponse.json(upd);
      }

      case "entrega_firmar": {
        const { entregaSatisfaccion, firmaEntregaConductor } = body || {};
        if (!["OK", "NO_CONFORME"].includes(entregaSatisfaccion || "")) {
          return NextResponse.json({ error: "entregaSatisfaccion inválida" }, { status: 400 });
        }
        const upd = await prisma.solicitud.update({
          where: { id },
          data: {
            entregaSatisfaccion,
            firmaEntregaConductor: firmaEntregaConductor ?? null,
          },
        });
        return NextResponse.json(upd);
      }

      case "coord_cerrar": {
        const { firmaCoordFinal, pdfDemoHTML } = body || {};
        const upd = await prisma.solicitud.update({
          where: { id },
          data: {
            firmaCoordFinal: firmaCoordFinal ?? null,
            pdfDemoHTML: pdfDemoHTML ?? null,
            estado: "COMPLETADA",
          },
        });
        return NextResponse.json(upd);
      }

      default:
        return NextResponse.json({ error: "Acción no soportada" }, { status: 400 });
    }
  } catch (e: any) {
    console.error("PATCH /api/solicitudes/[id] error", e);
    return NextResponse.json({ error: "Error en actualización" }, { status: 500 });
  }
}






