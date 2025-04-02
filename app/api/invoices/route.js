import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const invoiceSchema = z.object({
  customerId: z.union([z.string(), z.number()]).transform(Number),
  status: z.string(),
  lineItems: z.array(
    z.object({
      productId: z.union([z.string(), z.number()]).transform(Number),
      quantity: z.number().min(1),
      discountId: z
        .union([z.string(), z.number()])
        .nullable()
        .transform((val) => (val ? Number(val) : null)),
      taxId: z
        .union([z.string(), z.number()])
        .nullable()
        .transform((val) => (val ? Number(val) : null)),
    })
  ),
});

async function getUpdatedTenantCounter(tenant) {
  const currentYear = new Date().getFullYear();

  if (tenant.autoResetYearly && tenant.lastResetYear !== currentYear) {
    await prisma.tenant.update({
      where: { id: tenant.id },
      data: {
        invoiceCounter: 1,
        lastResetYear: currentYear,
      },
    });
    tenant.invoiceCounter = 1;
    tenant.lastResetYear = currentYear;
  }

  return tenant.invoiceCounter;
}

export async function GET() {
  const user = await currentUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { memberships: true },
  });

  if (!dbUser)
    return new Response("User not found in database", { status: 404 });

  const tenantId = dbUser.memberships[0]?.tenantId;

  const invoices = await prisma.invoice.findMany({
    where: {
      createdBy: {
        memberships: {
          some: { tenantId },
        },
      },
      deleted: false,
    },
    include: { customer: true },
  });

  return Response.json(invoices);
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
  const parsed = invoiceSchema.safeParse(body);
  if (!parsed.success) {
    return new Response("Validation error", { status: 400 });
  }

  const { customerId, status, lineItems } = parsed.data;

  const tenant = await prisma.tenant.findUnique({ where: { id: tenantId } });
  tenant.invoiceCounter = await getUpdatedTenantCounter(tenant);

  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const counter = String(tenant.invoiceCounter).padStart(4, "0");

  const format = tenant.invoiceFormat || "{prefix}-{counter}";
  const invoiceNumber = format
    .replace("{prefix}", tenant.invoicePrefix || "INV")
    .replace("{year}", year)
    .replace("{month}", month)
    .replace("{counter}", counter);

  const details = await Promise.all(
    lineItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });
      if (!product) throw new Error("Product not found");

      let lineTotal = product.price * item.quantity;

      if (item.discountId) {
        const discount = await prisma.discount.findUnique({
          where: { id: item.discountId },
        });
        if (discount) {
          lineTotal *= (100 - discount.discountValue) / 100;
        }
      }

      if (item.taxId) {
        const tax = await prisma.taxRate.findUnique({
          where: { id: item.taxId },
        });
        if (tax) {
          lineTotal *= (100 + tax.rate) / 100;
        }
      }

      return {
        productId: item.productId,
        quantity: item.quantity,
        discountId: item.discountId,
        taxId: item.taxId,
        lineTotal: Number(lineTotal.toFixed(2)),
      };
    })
  );

  const totalAmount = details.reduce((sum, item) => sum + item.lineTotal, 0);

  const invoice = await prisma.invoice.create({
    data: {
      customerId,
      amount: totalAmount,
      status,
      createdById: dbUser.id,
      updatedById: dbUser.id,
      number: invoiceNumber,
      InvoiceDetail: {
        create: details,
      },
    },
  });

  await prisma.tenant.update({
    where: { id: tenantId },
    data: { invoiceCounter: { increment: 1 } },
  });

  return Response.json(invoice, { status: 201 });
}
