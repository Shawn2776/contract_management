"use client";

import { useEffect, useState } from "react";
import NewInvoiceForm from "@/components/forms/new-invoice/NewInvoiceForm";
import { useRouter } from "next/navigation";

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [taxRates, setTaxRates] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          customersRes,
          productsRes,
          discountsRes,
          taxRatesRes,
          statusRes,
        ] = await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
          fetch("/api/discounts"),
          fetch("/api/tax-rates"),
          fetch("/api/enums/invoice-status"),
        ]);

        const checkAndParse = async (res) => {
          if (!res.ok) {
            const errText = await res.text();
            console.error("Fetch error:", res.status, errText);
            throw new Error(
              `Failed to fetch from ${res.url || "unknown"}: ${res.status}`
            );
          }
          const text = await res.text();
          return text ? JSON.parse(text) : [];
        };

        const [
          customersData,
          productsData,
          discountsData,
          taxRatesData,
          statusesData,
        ] = await Promise.all([
          checkAndParse(customersRes),
          checkAndParse(productsRes),
          checkAndParse(discountsRes),
          checkAndParse(taxRatesRes),
          checkAndParse(statusRes),
        ]);

        setCustomers(customersData);
        setProducts(productsData);
        setDiscounts(discountsData);
        setTaxRates(taxRatesData);
        setStatuses(statusesData);
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };

    fetchData();
  }, []);

  const handleCreateInvoice = async (data) => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/dashboard/invoices");
    } else {
      alert("Failed to create invoice");
    }
  };

  return (
    <NewInvoiceForm
      customers={customers}
      products={products}
      discounts={discounts}
      taxRates={taxRates}
      statuses={statuses}
      onSubmit={handleCreateInvoice}
    />
  );
}
