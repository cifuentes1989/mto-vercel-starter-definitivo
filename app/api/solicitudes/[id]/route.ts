// app/api/solicitudes/[id]/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

type Ctx = { params: { id: string } };

// PUT: actualiza por id
export async function PUT(req: NextRequest, { params }: Ctx) {
  const id = params.id; // es String en el esquema
  const data = await req.json();

  // Evita modificar el id desde el body
  if ('id' in data) delete data.id;

  const updated = await prisma.solicitud.update({
    where: { id },
    data,
  });

  return Response.json(updated);
}

// DELETE: elimina por id
export async function DELETE(_req: NextRequest, { params }: Ctx) {
  const id = params.id;

  await prisma.solicitud.delete({ where: { id } });

  return new Response(null, { status: 204 });
}





