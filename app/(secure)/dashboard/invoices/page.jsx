"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("/api/invoices")
      .then((res) => res.json())
      .then(setInvoices);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-3xl font-bold">Invoices</h1>
      <div className="grid gap-4">
        {invoices.map((invoice) => (
          <Card key={invoice.id}>
            <CardHeader>
              <CardTitle>Invoice #{invoice.id}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: {invoice.status}</p>
              <p>Amount: ${invoice.amount}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
