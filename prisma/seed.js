// prisma/seed.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  const mockClerkId = "user_2v0NiIkLu9beKrEXqihaQXF3581";

  const user = await prisma.user.upsert({
    where: { clerkId: mockClerkId },
    update: {},
    create: {
      clerkId: mockClerkId,
      email: "demo@example.com",
      name: "Demo Admin",
      role: "SUPER_ADMIN",
    },
  });

  const tenant = await prisma.tenant.create({
    data: {
      name: "Demo Tenant",
      memberships: {
        create: {
          userId: user.id,
          role: "OWNER",
        },
      },
    },
  });

  await prisma.business.create({
    data: {
      tenantId: tenant.id,
      createdById: user.id,
      updatedById: user.id,
      businessType: "llc",
      businessCategory: "professional",
      businessSubcategory: "consulting",
      legalBusinessName: "Demo Company LLC",
      doingBusinessAs: "DemoCo",
      ein: "12-3456789",
      businessState: "Idaho",
      onlineStatus: "online",
      onlineLink: "https://example.com",
    },
  });
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
