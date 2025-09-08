// app/api/solicitudes/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

type Params = { params: { id: string } };

// GET /api/solicitudes/:id  -> detalle
export async function GET(_: Request, { params }: Params) {
  try {
    const s = await prisma.solicitud.findUnique({
      where: { id: params.id }, // id es string
    });
    if (!s) return NextResponse.json({ error: "No existe" }, { status: 404 });
    return NextResponse.json(s);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error" }, { status: 500 });
  }
}

// PUT /api/solicitudes/:id  -> actualización general (coordinación / taller / entrega, etc.)
export async function PUT(req: Request, { params }: Params) {
  try {
    const body = await req.json();

    // Permitimos actualizar solo campos conocidos
    const allowed: any = {};
    for (const k of [
      "estado",
      "diagnosticoTaller",
      "decisionCoord",
      "motivoRechazo",
      "inicioReparacion",
      "finReparacion",
      "actividades",
      "repuestos",
      "responsableReparacion",
      "horaSalidaTaller",
      "entregaSat",
      "conductorNombre",
      "unidad",
      "placa",
      "necesidad",
    ]) {
      if (k in body) allowed[k] = body[k];
    }

    const updated = await prisma.solicitud.update({
      where: { id: params.id },
      data: allowed,
    });

    return NextResponse.json(updated);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error" }, { status: 500 });
  }
}
