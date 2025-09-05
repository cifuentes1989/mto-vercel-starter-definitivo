// app/api/solicitudes/route.ts
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET: lista últimas 100 solicitudes
export async function GET() {
  const data = await prisma.solicitud.findMany({
    orderBy: { createdAt: 'desc' }, // ahora sí existe
    take: 100,
  });
  return Response.json(data);
}

// POST: crea solicitud
export async function POST(req: NextRequest) {
  const { conductorNombre, unidad, placa, necesidad } = await req.json();

  if (!conductorNombre || !placa || !necesidad) {
    return Response.json(
      { error: 'conductorNombre, placa y necesidad son obligatorios' },
      { status: 400 }
    );
  }

  const nueva = await prisma.solicitud.create({
    data: {
      // id NO se envía: lo genera @default(cuid())
      conductorNombre,
      unidad,
      placa,
      necesidad,
      estado: 'SOLICITUD',
    },
  });

  return Response.json(nueva, { status: 201 });
}










