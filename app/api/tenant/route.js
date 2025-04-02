// app/api/tenant/route.js
import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: {
        include: { tenant: true },
      },
    },
  });

  const tenant = dbUser?.memberships[0]?.tenant;

  return new Response(JSON.stringify(tenant ?? {}), {
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
  });

  if (!dbUser) return new Response("User not found", { status: 404 });

  const body = await req.json();

  const {
    legalBusinessName,
    doingBusinessAs,
    ein,
    businessState,
    onlineStatus,
    onlineLink,
    addressLine1,
    addressLine2,
    city,
    zip,
    zipPlus4,
    isUspsValidated,
  } = body;

  try {
    const newTenant = await prisma.tenant.create({
      data: {
        name: legalBusinessName,
        invoicePrefix: "INV",
        invoiceFormat: "{prefix}-{year}-{counter}",
        companyName: legalBusinessName,
        addressLine1,
        addressLine2,
        city,
        state: businessState,
        zip,
        zipPlus4,
        isUspsValidated: !!isUspsValidated,
      },
    });

    // Create tenant membership
    await prisma.tenantMembership.create({
      data: {
        tenantId: newTenant.id,
        userId: dbUser.id,
        role: "OWNER",
      },
    });

    return new Response(JSON.stringify(newTenant), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Error creating tenant", { status: 500 });
  }
}
