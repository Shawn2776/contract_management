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
