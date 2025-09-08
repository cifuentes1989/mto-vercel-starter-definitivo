// app/api/solicitudes/route.ts
import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../lib/prisma";
import { Estado, Prisma } from "@prisma/client";

// Genera un radicado único simple tipo "SM-YYYYMM-XXXXXX"
function nextRadicado(): string {
  const d = new Date();
  const ym = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}`;
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `SM-${ym}-${rand}`;
}

// GET /api/solicitudes  -> lista todas
export async function GET() {
  try {
    const data = await prisma.solicitud.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(data);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Listado falló" }, { status: 500 });
  }
}

// POST /api/solicitudes -> crea una nueva (con id String)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const data: Prisma.SolicitudCreateInput = {
      id: nextRadicado(), // <- OBLIGATORIO porque el id es String @id
      conductorNombre: String(body.conductorNombre ?? ""),
      unidad: String(body.unidad ?? ""),
      placa: String(body.placa ?? "").toUpperCase(),
      necesidad: String(body.necesidad ?? ""),
      estado: (body.estado as Estado) ?? "REVISION_TALLER",
    };

    const created = await prisma.solicitud.create({ data });
    return NextResponse.json(created, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Creación falló" }, { status: 500 });
  }
}
