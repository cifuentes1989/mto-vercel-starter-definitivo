/*
  Warnings:

  - The primary key for the `Solicitud` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `actividades` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `decisionCoord` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosticoTaller` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `entregaSatisfaccion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `finReparacion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaConductor` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaCoordAprob` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaCoordFinal` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaEntregaConductor` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaReparacion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `firmaTallerDiag` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `horaIngresoTaller` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `horaSalidaTaller` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `inicioReparacion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `motivoRechazo` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `pdfDemoHTML` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `repuestos` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `responsableReparacion` on the `Solicitud` table. All the data in the column will be lost.
  - The `id` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `estado` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_pkey",
DROP COLUMN "actividades",
DROP COLUMN "decisionCoord",
DROP COLUMN "diagnosticoTaller",
DROP COLUMN "entregaSatisfaccion",
DROP COLUMN "finReparacion",
DROP COLUMN "firmaConductor",
DROP COLUMN "firmaCoordAprob",
DROP COLUMN "firmaCoordFinal",
DROP COLUMN "firmaEntregaConductor",
DROP COLUMN "firmaReparacion",
DROP COLUMN "firmaTallerDiag",
DROP COLUMN "horaIngresoTaller",
DROP COLUMN "horaSalidaTaller",
DROP COLUMN "inicioReparacion",
DROP COLUMN "motivoRechazo",
DROP COLUMN "pdfDemoHTML",
DROP COLUMN "repuestos",
DROP COLUMN "responsableReparacion",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "estado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'SOLICITUD',
ADD CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id");

-- DropEnum
DROP TYPE "DecisionCoord";

-- DropEnum
DROP TYPE "EntregaSat";

-- DropEnum
DROP TYPE "Estado";

-- CreateIndex
CREATE INDEX "Solicitud_placa_idx" ON "Solicitud"("placa");
