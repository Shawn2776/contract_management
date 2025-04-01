-- CreateTable
CREATE TABLE "InvoiceVersion" (
    "id" SERIAL NOT NULL,
    "invoiceId" INTEGER NOT NULL,
    "number" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "modifiedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "modifiedBy" TEXT NOT NULL,

    CONSTRAINT "InvoiceVersion_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "InvoiceVersion" ADD CONSTRAINT "InvoiceVersion_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
