"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";

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

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 shadow border space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">INVOICE</h1>
        <span className="text-red-600 font-bold">No. {invoice.number}</span>
      </div>

      {/* Company Info */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold">Your Company Name</h2>
        <p>Address | City, State and Zip Code</p>
        <p>Website | Email</p>
        <p>Office: 000-000-0000 &nbsp; | &nbsp; Cell: 000-000-0000</p>
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-4 text-sm border p-4">
        <div>
          <p>
            <strong>Order Number:</strong> {invoice.number}
          </p>
          <p>
            <strong>Customer Name:</strong> {invoice.customer?.name}
          </p>
          <p>
            <strong>Address:</strong> 123 Main Street
          </p>
          <p>
            <strong>Phone:</strong> (000) 000-0000
          </p>
        </div>
        <div>
          <p>
            <strong>Date:</strong> {format(new Date(invoice.createdAt), "PPP")}
          </p>
          <p>
            <strong>Email:</strong>{" "}
            {invoice.customer?.email || "customer@example.com"}
          </p>
        </div>
      </div>

      {/* Payment Options */}
      <div className="grid grid-cols-8 text-center text-xs border border-t-0">
        {[
          "CASH",
          "CHECK",
          "CHARGE",
          "C.O.D.",
          "ON ACCT.",
          "PAID OUT",
          "MDSE RETD",
          "SOLD BY",
        ].map((label, i) => (
          <div key={i} className="border p-2">
            {label}
          </div>
        ))}
      </div>

      {/* Line Items Table */}
      <table className="w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2 w-1/12">QTY</th>
            <th className="border p-2">DESCRIPTION</th>
            <th className="border p-2 w-1/6">PRICE</th>
            <th className="border p-2 w-1/6">AMOUNT</th>
          </tr>
        </thead>
        <tbody>
          {invoice.InvoiceDetail.map((item, i) => (
            <tr key={i}>
              <td className="border p-2">{item.quantity}</td>
              <td className="border p-2">Product #{item.productId}</td>
              <td className="border p-2">
                {formatCurrency(item.lineTotal / item.quantity)}
              </td>
              <td className="border p-2">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end space-y-1 flex-col items-end pr-2">
        <p>
          <strong>Sales Tax:</strong> Included
        </p>
        <p className="text-lg font-semibold">
          TOTAL: {formatCurrency(invoice.amount)}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center pt-6 text-sm border-t">
        <div>
          <p>
            <strong>Received By:</strong> ____________________
          </p>
        </div>
        <div className="text-right space-y-1">
          <p className="italic">We appreciate your business!</p>
          <p className="font-bold text-lg">Thank you!</p>
        </div>
      </div>
    </div>
  );
}
