/*
  Warnings:

  - The primary key for the `Solicitud` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `pdfDemoHTML` on the `Solicitud` table. All the data in the column will be lost.
  - The `id` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `horaIngresoTaller` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `inicioReparacion` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `finReparacion` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `horaSalidaTaller` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Hist` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Hist" DROP CONSTRAINT "Hist_solicitudId_fkey";

-- AlterTable
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "pdfDemoHTML",
ADD COLUMN     "fechaSolicitud" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "historial" JSONB NOT NULL DEFAULT '[]',
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "placa" SET DATA TYPE TEXT,
DROP COLUMN "horaIngresoTaller",
ADD COLUMN     "horaIngresoTaller" TIMESTAMP(3),
DROP COLUMN "inicioReparacion",
ADD COLUMN     "inicioReparacion" TIMESTAMP(3),
DROP COLUMN "finReparacion",
ADD COLUMN     "finReparacion" TIMESTAMP(3),
DROP COLUMN "horaSalidaTaller",
ADD COLUMN     "horaSalidaTaller" TIMESTAMP(3),
ADD CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Hist";
