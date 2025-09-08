// app/api/solicitudes/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await prisma.solicitud.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/solicitudes/[id] error:", err);
    return NextResponse.json({ error: "Actualización falló" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: "id inválido" }, { status: 400 });
    }

    await prisma.solicitud.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("DELETE /api/solicitudes/[id] error:", err);
    return NextResponse.json({ error: "Eliminación falló" }, { status: 500 });
  }
}
