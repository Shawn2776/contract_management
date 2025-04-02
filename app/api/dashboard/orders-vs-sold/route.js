import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { startOfMonth, endOfMonth, eachDayOfInterval, format } from "date-fns";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const month = parseInt(searchParams.get("month")); // 1-indexed
  const year = parseInt(searchParams.get("year"));

  const start = new Date(year, month - 1, 1);
  const end = endOfMonth(start);
  const days = eachDayOfInterval({ start, end });

  const orders = await prisma.invoice.findMany({
    where: {
      createdAt: { gte: start, lte: end },
    },
    include: {
      InvoiceDetail: true,
    },
  });

  const data = days.map((date) => {
    const dayStr = format(date, "yyyy-MM-dd");
    const dayOrders = orders.filter(
      (o) => format(new Date(o.createdAt), "yyyy-MM-dd") === dayStr
    );
    const orderCount = dayOrders.length;
    const soldCount = dayOrders.reduce((total, o) => {
      return total + o.InvoiceDetail.reduce((sum, d) => sum + d.quantity, 0);
    }, 0);

    return {
      day: format(date, "MMM d"),
      orders: orderCount,
      sold: soldCount,
    };
  });

  return NextResponse.json(data);
}
