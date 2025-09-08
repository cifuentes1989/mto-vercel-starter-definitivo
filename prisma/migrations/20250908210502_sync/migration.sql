/*
  Warnings:

  - A unique constraint covering the columns `[radicado]` on the table `Solicitud` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `radicado` to the `Solicitud` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Solicitud_placa_idx";

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "radicado" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Solicitud_radicado_key" ON "Solicitud"("radicado");
