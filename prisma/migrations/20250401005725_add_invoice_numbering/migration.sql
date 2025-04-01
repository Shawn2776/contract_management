-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "invoiceCounter" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "invoiceFormat" TEXT,
ADD COLUMN     "invoicePrefix" TEXT;
