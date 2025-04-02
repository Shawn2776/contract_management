"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import InvoiceLayout from "@/components/invoices/InvoiceLayout";

export default function InvoicePage() {
  const { ["invoice-number"]: invoiceId } = useParams();
  const [invoice, setInvoice] = useState(null);

  useEffect(() => {
    if (!invoiceId) return;
    fetch(`/api/invoices/${invoiceId}`)
      .then((res) => res.json())
      .then((data) => setInvoice(data));
  }, [invoiceId]);

  if (!invoice) return <div className="p-6">Loading...</div>;

  return <InvoiceLayout invoice={invoice} />;
}
