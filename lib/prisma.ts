
// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

declare global {
  // evita crear múltiples instancias en dev (hot reload)
  // @ts-ignore
  var _prisma: PrismaClient | undefined;
}

export const prisma: PrismaClient =
  // @ts-ignore
  global._prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  // @ts-ignore
  global._prisma = prisma;
}

// Genera un radicado como SM-YYYYMM-0001
function yyyymm(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}${m}`;
}

export function nextRadicado() {
  // Si quieres que sea secuencial por mes desde la BD, cámbialo por un contador real.
  // Para la demo/local, usamos timestamp para evitar colisión.
  const seq = String(Date.now()).slice(-4);
  return `SM-${yyyymm()}-${seq}`;
}



