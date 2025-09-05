/*
  Warnings:

  - The primary key for the `Solicitud` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `historial` on the `Solicitud` table. All the data in the column will be lost.
  - The `decisionCoord` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `entregaSatisfaccion` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Solicitud" DROP CONSTRAINT "Solicitud_pkey",
DROP COLUMN "historial",
ADD COLUMN     "pdfDemoHTML" TEXT,
ALTER COLUMN "estado" SET DEFAULT 'SOLICITUD',
DROP COLUMN "decisionCoord",
ADD COLUMN     "decisionCoord" TEXT,
DROP COLUMN "entregaSatisfaccion",
ADD COLUMN     "entregaSatisfaccion" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "horaIngresoTaller" SET DATA TYPE TEXT,
ALTER COLUMN "inicioReparacion" SET DATA TYPE TEXT,
ALTER COLUMN "finReparacion" SET DATA TYPE TEXT,
ALTER COLUMN "horaSalidaTaller" SET DATA TYPE TEXT,
ADD CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Solicitud_id_seq";

-- DropEnum
DROP TYPE "DecisionCoord";

-- DropEnum
DROP TYPE "EntregaSat";
