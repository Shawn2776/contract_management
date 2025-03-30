"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";

import StatCard from "@/components/stats/StatCard";

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [tenant, setTenant] = useState(null);
  const [stats, setStats] = useState({
    revenue: 0,
    products: 0,
    invoices: 0,
    customers: 0,
  });

  useEffect(() => {
    fetch("/api/tenant")
      .then((res) => res.json())
      .then(setTenant);
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then(setStats);
  }, []);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <StatCard
        label="Total Revenue"
        value={`$${Number(stats.revenue || 0).toFixed(2)}`}
      />
      <StatCard label="Products" value={stats.products} />
      <StatCard label="Invoices" value={stats.invoices} />
      <StatCard label="Customers" value={stats.customers} />
    </>
  );
}
