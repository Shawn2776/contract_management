import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

const invoiceSchema = z.object({
  customerId: z.number(),
  status: z.string(),
  lineItems: z.array(
    z.object({
      productId: z.number(),
      quantity: z.number().min(1),
      discountId: z.number().optional(),
      taxId: z.number().optional(),
    })
  ),
});

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
  const { customerId, status, lineItems } = body;

  if (!customerId || !lineItems?.length) {
    return new Response("Missing required fields", { status: 400 });
  }

  const details = await Promise.all(
    lineItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(item.productId) },
      });

      if (!product) {
        throw new Error(`Product not found: ${item.productId}`);
      }

      let lineTotal = product.price * item.quantity;

      if (item.discountId) {
        const discount = await prisma.discount.findUnique({
          where: { id: parseInt(item.discountId) },
        });
        if (discount) {
          lineTotal = lineTotal * ((100 - discount.discountValue) / 100);
        }
      }

      if (item.taxId) {
        const tax = await prisma.taxRate.findUnique({
          where: { id: parseInt(item.taxId) },
        });
        if (tax) {
          lineTotal = lineTotal * ((100 + tax.rate) / 100);
        }
      }

      return {
        productId: parseInt(item.productId),
        quantity: item.quantity,
        ...(item.discountId &&
          item.discountId !== "" && {
            discountId: parseInt(item.discountId),
          }),
        ...(item.taxId &&
          item.taxId !== "" && {
            taxId: parseInt(item.taxId),
          }),
        lineTotal: lineTotal.toFixed(2),
      };
    })
  );

  const invoice = await prisma.invoice.create({
    data: {
      customerId: parseInt(customerId),
      amount: details.reduce(
        (sum, item) => sum + parseFloat(item.lineTotal),
        0
      ),
      status,
      createdById: dbUser.id,
      updatedById: dbUser.id,
      InvoiceDetail: {
        create: lineItems.map((item) => ({
          productId: parseInt(item.productId),
          quantity: item.quantity,
          ...(item.discountId &&
            item.discountId !== "" && {
              discountId: parseInt(item.discountId),
            }),
          ...(item.taxId &&
            item.taxId !== "" && {
              taxId: parseInt(item.taxId),
            }),
          lineTotal: 0, // optionally calculate based on price * qty
        })),
      },
    },
  });

  return Response.json(invoice, { status: 201 });
}
