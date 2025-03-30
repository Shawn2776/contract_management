import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: true,
    },
  });

  const tenantId = user.memberships[0]?.tenantId;

  const products = await prisma.product.findMany({
    where: {
      createdBy: {
        memberships: {
          some: { tenantId },
        },
      },
    },
  });

  return Response.json(products);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { name, description, price } = body;

  if (!name || !price) {
    return new Response("Missing name or price", { status: 400 });
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships[0]?.tenantId;

  const product = await prisma.product.create({
    data: {
      name,
      description,
      price,
      tenantId,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return Response.json(product, { status: 201 });
}
