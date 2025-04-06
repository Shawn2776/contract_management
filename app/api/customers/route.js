import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

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

  return NextResponse.json(customers);
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("Missing tenant", { status: 400 });

  const body = await req.json();
  const { name, email, phone, address } = body;

  if (!name || !email || !phone || !address) {
    return new Response("Missing required fields", { status: 400 });
  }

  const customer = await prisma.customer.create({
    data: {
      name,
      email,
      phone,
      address,
      tenantId,
      createdById: dbUser.id,
      updatedById: dbUser.id,
    },
  });

  return NextResponse.json(customer, { status: 201 });
}
