// app/api/solicitudes/route.ts
import { NextResponse } from "next/server";
import { prisma, nextRadicado } from "../../../lib/prisma";

// GET /api/solicitudes  -> lista
export async function GET() {
  try {
    const data = await prisma.solicitud.findMany({
      orderBy: { createdAt: "desc" },
      take: 200,
    });
    return NextResponse.json(data);
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error" }, { status: 500 });
  }
}

// POST /api/solicitudes  -> crea una solicitud nueva
// body: { conductorNombre, unidad, placa, necesidad }
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conductorNombre, unidad, placa, necesidad } = body || {};

    if (!conductorNombre || !unidad || !placa || !necesidad) {
      return NextResponse.json(
        { error: "Faltan campos requeridos" },
        { status: 400 }
      );
    }

    // OJO: aquí seteamos id y estado explícitos para evitar TS/Prisma errors.
    const created = await prisma.solicitud.create({
      data: {
        id: nextRadicado(),            // si en tu schema el id ya tiene default(cuid()) puedes quitarlo
        estado: "REVISION_TALLER",     // usamos string literal (debe existir en tu enum Estado)
        conductorNombre,
        unidad,
        placa,
        necesidad,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Error" }, { status: 500 });
  }
}


