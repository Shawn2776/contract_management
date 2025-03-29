import { currentUser } from "@clerk/nextjs/server";
import { prismaWithUser } from "@/lib/prisma/withAudit";
import prisma from "@/lib/prisma"; // The base client

export async function POST(req) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return new Response("Unauthorized", { status: 401 });
  }

  // 🔍 Look up internal User.id by Clerk ID
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
  });

  if (!dbUser) {
    return new Response("User not found in DB", { status: 404 });
  }

  // 🧠 Use audit-logging-aware Prisma instance
  const prismaWithContext = prismaWithUser(dbUser.id);

  const body = await req.json();

  // Create business
  const business = await prismaWithContext.business.create({
    data: {
      ...body,
      tenantId: body.tenantId, // Or auto-create if needed
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return new Response(JSON.stringify(business), {
    status: 201,
    headers: { "Content-Type": "application/json" },
  });
}
