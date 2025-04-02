import { currentUser } from "@clerk/nextjs/server";
import { prismaWithUser } from "@/lib/prisma/withAudit";
import prisma from "@/lib/prisma"; // base client, no middleware

export async function POST(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    return new Response("User not found in DB", { status: 404 });
  }

  const body = await req.json();

  const prismaWithContext = prismaWithUser(dbUser.id);

  // ✅ Create Tenant and include email + website if present
  const tenant = await prismaWithContext.tenant.create({
    data: {
      name: body.legalBusinessName,
      email: body.businessEmail,
      website: body.businessWebsite,
      memberships: {
        create: {
          userId: dbUser.id,
          role: "OWNER",
        },
      },
    },
  });

  // Create Business
  const business = await prismaWithContext.business.create({
    data: {
      ...body,
      tenantId: tenant.id,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return new Response(JSON.stringify(business), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
