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
  if (!tenantId) return Response.json([]);

  const taxRates = await prisma.taxRate.findMany({
    where: {
      createdBy: {
        memberships: {
          some: { tenantId },
        },
      },
    },
  });

  return Response.json(taxRates);
}
