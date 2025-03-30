/*
  Warnings:

  - A unique constraint covering the columns `[tenantId,email]` on the table `Customer` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `tenantId` to the `Customer` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "tenantId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Customer_tenantId_email_key" ON "Customer"("tenantId", "email");

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
