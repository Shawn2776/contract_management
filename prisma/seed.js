import { PrismaClient, InvoiceStatus, PaymentType } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      clerkId: "clerk_admin_001",
      role: "SUPER_ADMIN",
      name: "Admin User",
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: "Test Tenant",
      companyName: "Acme Inc.",
      city: "Testville",
      state: "TS",
      zip: "12345",
      email: "billing@acme.com",
      website: "acme.com",
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  const customer = await prisma.customer.create({
    data: {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-123-4567",
      address: "123 Main St",
      tenantId: tenant.id,
      createdById: user.id,
      updatedById: user.id,
    },
  });

  const invoice = await prisma.invoice.create({
    data: {
      number: "INV-001",
      amount: 250.0,
      status: InvoiceStatus.PAID,
      paymentType: PaymentType.CASH,
      tenantId: tenant.id,
      customerId: customer.id,
      createdById: user.id,
      updatedById: user.id,
      soldByUserId: user.id,
    },
  });

  console.log("🌱 Seed complete. Invoice ID:", invoice.id);
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
