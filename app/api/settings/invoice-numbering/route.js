import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

function generatePreview({ prefix, format, counter }) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const paddedCounter = String(counter || 1).padStart(4, "0");

  const safeFormat = format || "{prefix}-{counter}";

  return safeFormat
    .replace("{prefix}", prefix || "INV")
    .replace("{year}", year)
    .replace("{month}", month)
    .replace("{counter}", paddedCounter);
}

export async function GET(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("No tenant found", { status: 400 });

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: {
      invoicePrefix: true,
      invoiceFormat: true,
      invoiceCounter: true,
      isInvoiceSetup: true,
    },
  });

  const preview = generatePreview({
    prefix: tenant.invoicePrefix,
    format: tenant.invoiceFormat,
    counter: tenant.invoiceCounter,
  });

  return Response.json({ ...tenant, preview });
}

export async function POST(req) {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  const tenantId = dbUser?.memberships?.[0]?.tenantId;
  if (!tenantId) return new Response("No tenant found", { status: 400 });

  const body = await req.json();
  const { prefix, format, counter, isInvoiceSetup } = body;

  if (!format?.includes("{counter}")) {
    return new Response("Format must include {counter}", { status: 400 });
  }

  await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      invoicePrefix: prefix,
      invoiceFormat: format,
      invoiceCounter: counter,
      isInvoiceSetup: isInvoiceSetup ?? true,
    },
  });

  await prisma.auditLog.create({
    data: {
      userId: dbUser.id,
      action: "UPDATE",
      table: "Tenant",
      recordId: tenantId,
      data: {
        invoicePrefix: prefix,
        invoiceFormat: format,
        invoiceCounter: counter,
      },
    },
  });

  const preview = generatePreview({ prefix, format, counter });

  return Response.json({ preview }, { status: 200 });
}
