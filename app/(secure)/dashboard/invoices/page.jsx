"use client";

import { useEffect, useState } from "react";
import { InvoiceDataTable } from "@/components/tables/invoice-data-table/InvoiceDataTable";
import { columns } from "@/components/tables/invoice-data-table/columns";
import { formatCurrency } from "@/lib/formatCurrency";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((inv) => ({
          id: inv.id,
          status: inv.status,
          amount: formatCurrency(inv.amount),
          customer: inv.customer?.name || "Unknown",
          createdAt: inv.createdAt,
        }));
        setInvoices(transformed);
      });
  }, []);

  return <InvoiceDataTable columns={columns} data={invoices} />;
}
