// 🛠️ One-time script to restore InvoiceDetail from backup-like logic

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function restoreInvoiceDetails() {
  const invoices = await prisma.invoice.findMany({
    include: {
      customer: true,
    },
  });

  for (const invoice of invoices) {
    try {
      // Find products or assign one default for simplicity
      const products = await prisma.product.findMany({
        where: { tenantId: invoice.tenantId },
        take: 1,
      });

      if (products.length === 0) {
        console.warn(`⚠️ Skipping invoice ${invoice.id} — no products found`);
        continue;
      }

      const product = products[0];

      await prisma.invoiceDetail.create({
        data: {
          invoiceId: invoice.id,
          productId: product.id,
          quantity: 1,
          lineTotal: product.price,
        },
      });
    } catch (err) {
      console.error(`❌ Failed to restore invoice ${invoice.id}:`, err.message);
    }
  }

  await prisma.$disconnect();
}

restoreInvoiceDetails().catch((err) => {
  console.error("Script failed:", err);
  process.exit(1);
});
