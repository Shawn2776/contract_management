/*
  Warnings:

  - The `status` column on the `Invoice` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[number]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'PARTIALLY_PAID', 'RETURNED', 'CANCELED');

-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('CASH', 'CHECK', 'CHARGE', 'COD', 'ON_ACCOUNT', 'PAID_OUT', 'RETURNED');

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "paymentType" "PaymentType",
ADD COLUMN     "soldByUserId" TEXT,
ADD COLUMN     "tenantId" TEXT NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "InvoiceStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "email" TEXT,
ADD COLUMN     "website" TEXT;

-- AlterTable
ALTER TABLE "ZipCache" ADD COLUMN     "city" TEXT NOT NULL DEFAULT 'test',
ADD COLUMN     "lat" DOUBLE PRECISION,
ADD COLUMN     "lng" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "ZipCity" ADD COLUMN     "state" TEXT NOT NULL DEFAULT 'state';

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_number_key" ON "Invoice"("number");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_soldByUserId_fkey" FOREIGN KEY ("soldByUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
