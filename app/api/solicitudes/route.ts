// app/api/solicitudes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Genera radicado del tipo SM-YYYYMM-#### (4 dígitos)
function yyyymm(d = new Date()) {
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
}
async function generarRadicado(): Promise<string> {
  const pref = `SM-${yyyymm()}-`;
  // cuenta registros del mes para secuencia simple
  const count = await prisma.solicitud.count({
    where: { id: { startsWith: pref } },
  });
  const seq = String(count + 1).padStart(4, "0");
  return `${pref}${seq}`;
}

export async function GET() {
  const data = await prisma.solicitud.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { conductorNombre, unidad, placa, necesidad, firmaConductor } = body || {};
    if (!conductorNombre || !unidad || !placa || !necesidad) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const id = await generarRadicado();

    const created = await prisma.solicitud.create({
      data: {
        id,
        estado: "REVISION_TALLER",
        conductorNombre,
        unidad,
        placa: String(placa).toUpperCase(),
        necesidad,
        firmaConductor: firmaConductor ?? null,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    console.error("POST /api/solicitudes error", e);
    return NextResponse.json({ error: "Error al crear solicitud" }, { status: 500 });
  }
}










