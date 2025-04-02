"use client";

import { useEffect, useState } from "react";
import NewInvoiceForm from "@/components/forms/new-invoice/NewInvoiceForm";
import { useRouter } from "next/navigation";

export default function NewInvoicePage() {
  const [customers, setCustomers] = useState([]);
  const [products, setProducts] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [taxRates, setTaxRates] = useState([]);

  const router = useRouter();

  const handleCreateInvoice = async (data) => {
    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      // Redirect or show success
      router.push("/dashboard/invoices");
    } else {
      alert("Failed to create invoice");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const [customersRes, productsRes, discountsRes, taxRatesRes] =
        await Promise.all([
          fetch("/api/customers"),
          fetch("/api/products"),
          fetch("/api/discounts"),
          fetch("/api/tax-rates"),
        ]);

      const [customersData, productsData, discountsData, taxRatesData] =
        await Promise.all([
          customersRes.json(),
          productsRes.json(),
          discountsRes.json(),
          taxRatesRes.json(),
        ]);

      setCustomers(customersData);
      setProducts(productsData);
      setDiscounts(discountsData);
      setTaxRates(taxRatesData);
    };

    fetchData();
  }, []);

  return (
    <NewInvoiceForm
      customers={customers}
      products={products}
      discounts={discounts}
      taxRates={taxRates}
      onSubmit={handleCreateInvoice}
    />
  );
}
