// index.js
import { PrismaClient } from '@prisma/client';

console.log('RUNNING FILE:', import.meta.url);
console.log('NODE VERSION:', process.version);

const prisma = new PrismaClient();

async function main() {
  // Ver usuarios actuales
  const usuarios = await prisma.user.findMany();
  console.log('Usuarios encontrados:', usuarios);

  // Upsert 1: Juan
  const juan = await prisma.user.upsert({
    where: { email: 'juan@example.com' },
    update: { name: 'Juan Perez' },
    create: { name: 'Juan Perez', email: 'juan@example.com' }
  });
  console.log('Upsert Juan:', juan);

  // Upsert 2: María
  const maria = await prisma.user.upsert({
    where: { email: 'maria@example.com' },
    update: { name: 'María' },
    create: { name: 'María', email: 'maria@example.com' }
  });
  console.log('Upsert María:', maria);
}

main()
  .catch((e) => console.error('Error en main:', e))
  .finally(async () => {
    await prisma.$disconnect();
  });

