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
