"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function InvoiceEditPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params?.id;
  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    if (!invoiceId) return;

    fetch(`/api/invoices/${invoiceId}`)
      .then((res) => res.json())
      .then((data) => {
        setInvoice(data);
        setStatus(data.status);
        setLoading(false);
      });
  }, [invoiceId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch(`/api/invoices/${invoiceId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerId: invoice.customerId,
        status,
        lineItems: invoice.InvoiceDetail.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
          discountId: item.discountId,
          taxId: item.taxId,
        })),
      }),
    });

    if (res.ok) {
      toast.success("Invoice updated!");
      router.push("/dashboard/invoices");
    } else {
      toast.error("Failed to update invoice");
    }
  };

  if (loading) return <div className="p-6">Loading invoice...</div>;

  return (
    <div className="p-6 max-w-xl space-y-4">
      <h1 className="text-xl font-semibold">Edit Invoice #{invoice.number}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Status</Label>
          <Input value={status} onChange={(e) => setStatus(e.target.value)} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </div>
  );
}
