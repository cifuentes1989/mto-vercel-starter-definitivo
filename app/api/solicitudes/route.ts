// app/api/solicitudes/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const data = await prisma.solicitud.findMany({
    orderBy: { fechaSolicitud: "desc" }
  });
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const body = await request.json();
  if (!body?.id || !body?.conductorNombre || !body?.placa || !body?.necesidad) {
    return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
  }
  const created = await prisma.solicitud.create({
    data: {
      id: body.id,
      conductorNombre: body.conductorNombre,
      unidad: body.unidad ?? "Ambulancia",
      placa: body.placa.toUpperCase(),
      necesidad: body.necesidad,
      estado: "REVISION_TALLER",
      firmaConductor: body.firmaConductor ?? null
    }
  });
  return NextResponse.json(created, { status: 201 });
}





