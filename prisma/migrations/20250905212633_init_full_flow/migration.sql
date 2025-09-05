/*
  Warnings:

  - Changed the type of `estado` on the `Solicitud` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('SOLICITUD', 'REVISION_TALLER', 'APROBACION_COORD', 'REPARACION_EN_CURSO', 'ENTREGA', 'COMPLETADA');

-- CreateEnum
CREATE TYPE "DecisionCoord" AS ENUM ('APROBADO', 'RECHAZADO', 'ESPERA');

-- CreateEnum
CREATE TYPE "EntregaSat" AS ENUM ('OK', 'NO_CONFORME');

-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "actividades" TEXT,
ADD COLUMN     "decisionCoord" "DecisionCoord",
ADD COLUMN     "diagnosticoTaller" TEXT,
ADD COLUMN     "entregaSatisfaccion" "EntregaSat",
ADD COLUMN     "finReparacion" TEXT,
ADD COLUMN     "firmaConductor" TEXT,
ADD COLUMN     "firmaCoordAprob" TEXT,
ADD COLUMN     "firmaCoordFinal" TEXT,
ADD COLUMN     "firmaEntregaConductor" TEXT,
ADD COLUMN     "firmaReparacion" TEXT,
ADD COLUMN     "firmaTallerDiag" TEXT,
ADD COLUMN     "horaIngresoTaller" TEXT,
ADD COLUMN     "horaSalidaTaller" TEXT,
ADD COLUMN     "inicioReparacion" TEXT,
ADD COLUMN     "motivoRechazo" TEXT,
ADD COLUMN     "pdfDemoHTML" TEXT,
ADD COLUMN     "repuestos" TEXT,
ADD COLUMN     "responsableReparacion" TEXT,
ALTER COLUMN "updatedAt" DROP DEFAULT,
DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL;
