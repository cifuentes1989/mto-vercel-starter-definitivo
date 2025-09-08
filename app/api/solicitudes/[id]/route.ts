
// app/api/solicitudes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { Estado, Prisma } from "@prisma/client";

// GET /api/solicitudes/:id
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // string
  if (!id) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  try {
    const s = await prisma.solicitud.findUnique({ where: { id } });
    if (!s) return NextResponse.json({ error: "No existe" }, { status: 404 });
    return NextResponse.json(s);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Consulta falló" }, { status: 500 });
  }
}

// PUT /api/solicitudes/:id
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // string
  if (!id) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  try {
    const body = await req.json();

    const data: Prisma.SolicitudUpdateInput = {};
    if (body.conductorNombre !== undefined) data.conductorNombre = String(body.conductorNombre);
    if (body.unidad !== undefined) data.unidad = String(body.unidad);
    if (body.placa !== undefined) data.placa = String(body.placa).toUpperCase();
    if (body.necesidad !== undefined) data.necesidad = String(body.necesidad);
    if (body.estado !== undefined) data.estado = body.estado as Estado;

    const updated = await prisma.solicitud.update({ where: { id }, data });
    return NextResponse.json(updated);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Actualización falló" }, { status: 500 });
  }
}

// DELETE /api/solicitudes/:id
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id; // string
  if (!id) return NextResponse.json({ error: "id inválido" }, { status: 400 });

  try {
    await prisma.solicitud.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Eliminación falló" }, { status: 500 });
  }
}
