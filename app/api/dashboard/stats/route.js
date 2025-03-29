import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const clerkUser = await currentUser();
  if (!clerkUser) return new Response("Unauthorized", { status: 401 });

  const user = await prisma.user.findUnique({
    where: { clerkId: clerkUser.id },
    include: {
      memberships: { include: { tenant: true } },
    },
  });

  const tenantId = user?.memberships[0]?.tenantId;

  const [products, invoices, customers] = await Promise.all([
    prisma.product.count(),
    prisma.invoice.count(),
    prisma.customer.count(),
  ]);

  const revenueResult = await prisma.invoice.aggregate({
    _sum: { amount: true },
  });

  return Response.json({
    revenue: revenueResult._sum.amount || 0,
    products,
    invoices,
    customers,
  });
}
