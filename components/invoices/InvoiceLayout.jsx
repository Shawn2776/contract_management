"use client";

import { format } from "date-fns";
import { formatCurrency } from "@/lib/formatCurrency";
import { Mail, Globe } from "lucide-react";
import PaymentTypeGrid from "./PaymentTypeGrid";

export default function InvoiceLayout({ invoice }) {
  if (!invoice) return <div className="p-6">Loading...</div>;

  const tenant = invoice.tenant || {};
  const customer = invoice.customer || {};

  return (
    <div className="max-w-4xl mx-auto bg-white text-black p-8 shadow border space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-3xl font-bold">INVOICE</h1>
        <span className="text-red-600 font-bold">No. {invoice.number}</span>
      </div>

      {/* Company Info */}
      <div className="text-center space-y-1">
        <h2 className="text-xl font-semibold">
          {tenant?.companyName || tenant?.name}
        </h2>

        {(tenant?.addressLine1 ||
          tenant?.city ||
          tenant?.state ||
          tenant?.zip) && (
          <p>
            {[tenant?.addressLine1, tenant?.addressLine2]
              .filter(Boolean)
              .join(", ")}
            {" | "}
            {[tenant?.city, tenant?.state, tenant?.zip]
              .filter(Boolean)
              .join(", ")}
          </p>
        )}

        {(tenant?.website || tenant?.email) && (
          <div className="flex justify-center items-center gap-4 text-sm text-gray-700">
            {tenant?.website && (
              <a
                href={`https://${tenant.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:underline"
              >
                <Globe size={16} />
                {tenant.website}
              </a>
            )}
            {tenant?.email && (
              <span className="flex items-center gap-1">
                <Mail size={16} />
                {tenant.email}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Invoice Meta */}
      <div className="grid grid-cols-2 gap-4 text-sm border p-4">
        <div>
          <p>
            <strong>Order Number:</strong> {invoice.number}
          </p>
          {customer.name && (
            <p>
              <strong>Customer Name:</strong> {customer.name}
            </p>
          )}
          {customer.address && (
            <p>
              <strong>Address:</strong> {customer.address}
            </p>
          )}
          {customer.phone && (
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
          )}
        </div>
        <div>
          <p>
            <strong>Date:</strong> {format(new Date(invoice.createdAt), "PPP")}
          </p>
          {customer.email && (
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
          )}
        </div>
      </div>

      {/* Payment Options */}
      <PaymentTypeGrid selected={invoice.paymentType} />

      {/* Line Items */}
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
              <td className="border p-2">
                {item.Product?.name || `Product #${item.productId}`}
              </td>
              <td className="border p-2">
                {formatCurrency(item.lineTotal / item.quantity)}
              </td>
              <td className="border p-2">{formatCurrency(item.lineTotal)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end flex-col items-end pr-2 space-y-1">
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
