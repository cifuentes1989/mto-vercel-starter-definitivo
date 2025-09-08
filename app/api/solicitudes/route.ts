// app/api/solicitudes/route.ts
import { NextResponse } from "next/server";
import { prisma, nextRadicado } from "../../../lib/prisma";

export async function GET() {
  try {
    const data = await prisma.solicitud.findMany({
      orderBy: { id: "desc" },
      take: 100,
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error("GET /api/solicitudes error:", err);
    return NextResponse.json({ error: "Listado falló" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { conductorNombre, unidad, placa, necesidad } = body as {
      conductorNombre: string;
      unidad: string;
      placa: string;
      necesidad: string;
    };

    if (!conductorNombre || !placa || !necesidad) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios" },
        { status: 400 }
      );
    }

    // correlativo simple (evita colisiones en baja concurrencia)
    const last = await prisma.solicitud.findFirst({
      select: { id: true },
      orderBy: { id: "desc" },
    });
    const next = (last?.id ?? 0) + 1;

    const created = await prisma.solicitud.create({
      data: {
        id: next,
        radicado: nextRadicado(next),
        conductorNombre,
        unidad,
        placa,
        necesidad,
        estado: "REVISION_TALLER",
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error("POST /api/solicitudes error:", err);
    return NextResponse.json({ error: "Creación falló" }, { status: 500 });
  }
}
