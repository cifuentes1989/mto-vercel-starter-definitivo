/*
  Warnings:

  - You are about to drop the column `actividades` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `decisionCoord` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `diagnosticoTaller` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `entregaSatisfaccion` on the `Solicitud` table. All the data in the column will be lost.
  - You are about to drop the column `fechaSolicitud` on the `Solicitud` table. All the data in the column will be lost.
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
  - The `estado` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "actividades",
DROP COLUMN "decisionCoord",
DROP COLUMN "diagnosticoTaller",
DROP COLUMN "entregaSatisfaccion",
DROP COLUMN "fechaSolicitud",
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
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "estado",
ADD COLUMN     "estado" TEXT NOT NULL DEFAULT 'SOLICITUD';

-- DropEnum
DROP TYPE "Estado";
