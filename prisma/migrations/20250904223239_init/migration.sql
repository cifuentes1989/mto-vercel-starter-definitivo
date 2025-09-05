/*
  Warnings:

  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('SOLICITUD', 'REVISION_TALLER', 'APROBACION_COORD', 'REPARACION_EN_CURSO', 'ENTREGA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "DecisionCoord" AS ENUM ('APROBADO', 'RECHAZADO', 'ESPERA');

-- CreateEnum
CREATE TYPE "EntregaSat" AS ENUM ('OK', 'NO_CONFORME');

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "estado" "Estado" NOT NULL,
    "conductorNombre" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,
    "placa" VARCHAR(20) NOT NULL,
    "necesidad" TEXT NOT NULL,
    "firmaConductor" TEXT,
    "horaIngresoTaller" VARCHAR(40),
    "diagnosticoTaller" TEXT,
    "firmaTallerDiag" TEXT,
    "decisionCoord" "DecisionCoord",
    "motivoRechazo" TEXT,
    "firmaCoordAprob" TEXT,
    "inicioReparacion" VARCHAR(40),
    "finReparacion" VARCHAR(40),
    "actividades" TEXT,
    "repuestos" TEXT,
    "responsableReparacion" TEXT,
    "horaSalidaTaller" VARCHAR(40),
    "firmaReparacion" TEXT,
    "entregaSatisfaccion" "EntregaSat",
    "firmaEntregaConductor" TEXT,
    "firmaCoordFinal" TEXT,
    "pdfDemoHTML" TEXT,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Hist" (
    "id" SERIAL NOT NULL,
    "solicitudId" TEXT NOT NULL,
    "ts" TIMESTAMP(3) NOT NULL,
    "evento" TEXT NOT NULL,
    "actor" TEXT NOT NULL,

    CONSTRAINT "Hist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Hist_solicitudId_idx" ON "Hist"("solicitudId");

-- AddForeignKey
ALTER TABLE "Hist" ADD CONSTRAINT "Hist_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE CASCADE ON UPDATE CASCADE;
