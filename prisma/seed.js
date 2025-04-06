const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  // Upsert Demo User
  const user = await prisma.user.upsert({
    where: { clerkId: "user_2v0NiIkLu9beKrEXqihaQXF3581" },
    update: {},
    create: {
      clerkId: "user_2v0NiIkLu9beKrEXqihaQXF3581",
      email: "demo@example.com",
      name: "Demo User",
      role: "SUPER_ADMIN",
    },
  });

  // Upsert Demo Tenant
  let tenant = await prisma.tenant.findFirst({
    where: { name: "Demo Tenant" },
  });
  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        name: "Demo Tenant",
        companyName: "Demo Company",
        invoicePrefix: "INV",
        invoiceCounter: 1,
        isInvoiceSetup: true,
      },
    });
  }

  // Ensure Demo User is member of Demo Tenant
  const membership = await prisma.tenantMembership.findFirst({
    where: { tenantId: tenant.id, userId: user.id },
  });

  if (!membership) {
    await prisma.tenantMembership.create({
      data: {
        tenantId: tenant.id,
        userId: user.id,
        role: "OWNER",
      },
    });
  }

  // Create default tax rate if missing
  let defaultTaxRate = await prisma.taxRate.findFirst({
    where: { name: "Standard", createdById: user.id },
  });

  if (!defaultTaxRate) {
    defaultTaxRate = await prisma.taxRate.create({
      data: {
        name: "Standard",
        rate: 6.5,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }

  if (tenant.defaultTaxRateId !== defaultTaxRate.id) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: { defaultTaxRateId: defaultTaxRate.id },
    });
  }

  // Seed Customers
  const customers = [
    {
      name: "Alice Johnson",
      email: "alice@example.com",
      phone: "555-101-0001",
      address: "100 Main St",
    },
    {
      name: "Bob Smith",
      email: "bob@example.com",
      phone: "555-101-0002",
      address: "101 Main St",
    },
    {
      name: "Charlie Brown",
      email: "charlie@example.com",
      phone: "555-101-0003",
      address: "102 Main St",
    },
    {
      name: "Diana Prince",
      email: "diana@example.com",
      phone: "555-101-0004",
      address: "103 Main St",
    },
    {
      name: "Ethan Hunt",
      email: "ethan@example.com",
      phone: "555-101-0005",
      address: "104 Main St",
    },
    {
      name: "Fiona Apple",
      email: "fiona@example.com",
      phone: "555-101-0006",
      address: "105 Main St",
    },
    {
      name: "George Michael",
      email: "george@example.com",
      phone: "555-101-0007",
      address: "106 Main St",
    },
    {
      name: "Hannah Montana",
      email: "hannah@example.com",
      phone: "555-101-0008",
      address: "107 Main St",
    },
    {
      name: "Ivan Drago",
      email: "ivan@example.com",
      phone: "555-101-0009",
      address: "108 Main St",
    },
    {
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555-101-0010",
      address: "109 Main St",
    },
  ];

  for (const customer of customers) {
    await prisma.customer.upsert({
      where: {
        tenantId_email: {
          tenantId: tenant.id,
          email: customer.email,
        },
      },
      update: {},
      create: {
        ...customer,
        tenantId: tenant.id,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }

  // Seed Products
  const products = [
    { name: "Widget A", price: 10.99 },
    { name: "Widget B", price: 12.99 },
    { name: "Widget C", price: 9.49 },
    { name: "Gadget A", price: 14.99 },
    { name: "Gadget B", price: 11.89 },
    { name: "Tool A", price: 19.99 },
    { name: "Tool B", price: 21.5 },
    { name: "Device A", price: 24.75 },
    { name: "Device B", price: 29.99 },
    { name: "Item A", price: 8.99 },
    { name: "Item B", price: 6.49 },
    { name: "Item C", price: 7.89 },
    { name: "Accessory A", price: 5.99 },
    { name: "Accessory B", price: 4.99 },
    { name: "Accessory C", price: 3.49 },
    { name: "Bundle A", price: 39.99 },
    { name: "Bundle B", price: 49.99 },
    { name: "Package A", price: 59.99 },
    { name: "Package B", price: 69.99 },
    { name: "Premium Package", price: 89.99 },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: {
        tenantId_name: {
          tenantId: tenant.id,
          name: product.name,
        },
      },
      update: {},
      create: {
        ...product,
        tenantId: tenant.id,
        createdById: user.id,
        updatedById: user.id,
      },
    });
  }

  console.log(
    "🌱 Seeded demo user, tenant, tax rate, customers, and products."
  );
}

main()
  .catch((err) => {
    console.error("❌ Seed error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
