/*
  Warnings:

  - The `estado` column on the `Solicitud` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Estado" AS ENUM ('SOLICITUD', 'REVISION_TALLER', 'APROBACION_COORD', 'REPARACION_EN_CURSO', 'ENTREGA', 'COMPLETADA');

-- AlterTable
ALTER TABLE "Solicitud" DROP COLUMN "estado",
ADD COLUMN     "estado" "Estado" NOT NULL DEFAULT 'SOLICITUD';
