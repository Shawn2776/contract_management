import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  const counts = await prisma.invoice.groupBy({
    by: ["status"],
    _count: true,
  });

  const statusMap = {
    PAID: "Paid",
    PENDING: "Pending",
    DRAFT: "Draft",
    OVERDUE: "Overdue",
  };

  const total = counts.reduce((sum, s) => sum + s._count, 0);

  const data = counts.map((entry) => ({
    name: statusMap[entry.status] || entry.status,
    value: entry._count,
    percent: ((entry._count / total) * 100).toFixed(0),
  }));

  return NextResponse.json(data);
}
