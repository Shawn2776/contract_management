export async function GET() {
  const enumValues = [
    "DRAFT",
    "OPEN",
    "PAID",
    "PARTIALLY_PAID",
    "RETURNED",
    "REFUNDED",
    "PAID_IN_FULL",
    "CANCELLED",
    "PENDING",
    "UNPAID",
    "PARTIALLY_UNPAID",
    "PENDING_PAYMENT",
    "AWAITING_PAYMENT",
    "AWAITING_FULFILLMENT",
    "AWAITING_SHIPMENT",
    "AWAITING_DELIVERY",
    "AWAITING_PICKUP",
    "AWAITING_CONFIRMATION",
    "AWAITING_APPROVAL",
    "AWAITING_REVIEW",
    "SENT",
    "OVERDUE",
    "VOID",
  ];

  return Response.json(enumValues);
}
