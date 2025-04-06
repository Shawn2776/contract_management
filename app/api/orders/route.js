// app/api/orders/route.js
import { auth } from "@clerk/nextjs";
import prisma from "@/lib/prisma";

export async function POST(req) {
  const { userId } = auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const {
    customer, // existing customer ID or `null`
    createCustomer, // object with { name, email, phone, address } if creating new
    anonymous, // true or false
    items, // [{ productId, quantity, unitPrice, variant }]
    tenantId,
  } = body;

  let customerId = customer;

  // If anonymous
  if (anonymous) {
    const anon = await prisma.customer.create({
      data: {
        name: "Anonymous",
        email: `anon-${Date.now()}@anon.local`,
        phone: "",
        address: "N/A",
        tenantId,
        createdById: userId,
        updatedById: userId,
      },
    });
    customerId = anon.id;
  }

  // If new customer
  if (createCustomer) {
    const newCustomer = await prisma.customer.create({
      data: {
        ...createCustomer,
        tenantId,
        createdById: userId,
        updatedById: userId,
      },
    });
    customerId = newCustomer.id;
  }

  // Create order
  const order = await prisma.order.create({
    data: {
      customerId,
      tenantId,
      items: {
        create: items.map((item) => ({
          productId: item.productId,
          sku: item.sku,
          name: item.name,
          description: item.description,
          variant: item.variant,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.unitPrice * item.quantity,
          imageUrl: item.imageUrl,
          specs: item.specs,
        })),
      },
    },
    include: {
      items: true,
    },
  });

  return Response.json(order);
}
