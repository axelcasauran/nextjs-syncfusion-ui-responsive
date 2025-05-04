/*
  Warnings:

  - Made the column `serviceId` on table `ServiceDetail` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ServiceDetail" DROP CONSTRAINT "ServiceDetail_serviceId_fkey";

-- AlterTable
ALTER TABLE "ServiceDetail" ALTER COLUMN "serviceId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ServiceDetail" ADD CONSTRAINT "ServiceDetail_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
