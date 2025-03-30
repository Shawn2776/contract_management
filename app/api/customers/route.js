import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const customers = await prisma.customer.findMany({
    where: {
      createdBy: {
        memberships: {
          some: {
            tenantId,
          },
        },
      },
    },
  });
  return Response.json(customers);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser) {
    return new Response("User not found in database", { status: 404 });
  }

  const tenantId = dbUser.memberships[0]?.tenantId;

  const existing = await prisma.customer.findFirst({
    where: {
      tenantId,
      email: body.email,
    },
  });

  if (existing) {
    return Response.json(existing); // or return 409 if needed
  }

  const customer = await prisma.customer.create({
    data: {
      tenantId,
      name: body.name,
      email: body.email,
      phone: body.phone,
      address: body.address,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return Response.json(customer, { status: 201 });
}
