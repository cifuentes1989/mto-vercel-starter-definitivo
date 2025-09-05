// app/api/solicitudes/[id]/route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const body = await request.json();
  const updated = await prisma.solicitud.update({ where: { id }, data: body });
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  await prisma.solicitud.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}



