/*
  Warnings:

  - The values [CANCELED] on the enum `InvoiceStatus` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[tenantId,name]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `addressLine1` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `Business` table without a default value. This is not possible if the table is not empty.
  - Added the required column `zip` to the `Business` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ProductIdentifierType" AS ENUM ('SKU', 'BARCODE', 'QR', 'UPC', 'CUSTOM');

-- AlterEnum
BEGIN;
CREATE TYPE "InvoiceStatus_new" AS ENUM ('DRAFT', 'OPEN', 'PAID', 'PARTIALLY_PAID', 'RETURNED', 'REFUNDED', 'PAID_IN_FULL', 'CANCELLED', 'PENDING', 'UNPAID', 'PARTIALLY_UNPAID', 'PENDING_PAYMENT', 'AWAITING_PAYMENT', 'AWAITING_FULFILLMENT', 'AWAITING_SHIPMENT', 'AWAITING_DELIVERY', 'AWAITING_PICKUP', 'AWAITING_CONFIRMATION', 'AWAITING_APPROVAL', 'AWAITING_REVIEW', 'SENT', 'OVERDUE', 'VOID');
ALTER TABLE "Invoice" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Invoice" ALTER COLUMN "status" TYPE "InvoiceStatus_new" USING ("status"::text::"InvoiceStatus_new");
ALTER TYPE "InvoiceStatus" RENAME TO "InvoiceStatus_old";
ALTER TYPE "InvoiceStatus_new" RENAME TO "InvoiceStatus";
DROP TYPE "InvoiceStatus_old";
ALTER TABLE "Invoice" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropIndex
DROP INDEX "Product_tenantId_idx";

-- AlterTable
ALTER TABLE "Business" ADD COLUMN     "addressLine1" TEXT NOT NULL,
ADD COLUMN     "addressLine2" TEXT,
ADD COLUMN     "businessEmail" TEXT,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isManualEntry" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "zip" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "parentInvoiceId" TEXT;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "barcode" VARCHAR(100),
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "qrCodeUrl" TEXT,
ADD COLUMN     "sku" VARCHAR(50);

-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "defaultTaxRateId" INTEGER,
ADD COLUMN     "deleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "ProductIdentifier" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "type" "ProductIdentifierType" NOT NULL,
    "value" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "ProductIdentifier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" INTEGER,
    "tenantId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" INTEGER NOT NULL,
    "sku" VARCHAR(50) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "variant" TEXT,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(10,2) NOT NULL,
    "totalPrice" DECIMAL(10,2) NOT NULL,
    "imageUrl" TEXT,
    "specs" JSONB,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductIdentifier_productId_idx" ON "ProductIdentifier"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_tenantId_idx" ON "Order"("tenantId");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tenantId_name_key" ON "Product"("tenantId", "name");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_parentInvoiceId_fkey" FOREIGN KEY ("parentInvoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductIdentifier" ADD CONSTRAINT "ProductIdentifier_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tenant" ADD CONSTRAINT "Tenant_defaultTaxRateId_fkey" FOREIGN KEY ("defaultTaxRateId") REFERENCES "TaxRate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
