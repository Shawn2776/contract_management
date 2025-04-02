"use client";

import { useEffect, useState } from "react";

const useFinalSegment = (path) => {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const parts = path.split("/").filter(Boolean);
    const lastPart = parts[parts.length - 1];

    // Handle /dashboard/invoices/[invoiceId]
    if (parts.includes("invoices") && lastPart && parts.length > 2) {
      const fetchInvoice = async () => {
        try {
          const res = await fetch(`/api/invoices/${lastPart}`);
          if (!res.ok) throw new Error("Not found");

          const invoice = await res.json();
          setLabel(`Invoice ${invoice.number || lastPart}`);
        } catch (err) {
          console.error("Failed to load invoice", err);
          setLabel("Invoice");
        }
      };
      fetchInvoice();
    } else {
      // Default to capitalizing last path segment
      const formatted =
        lastPart.charAt(0).toUpperCase() + lastPart.slice(1).toLowerCase();
      setLabel(formatted);
    }
  }, [path]);

  return label;
};

export default useFinalSegment;
