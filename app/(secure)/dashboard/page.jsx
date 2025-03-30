"use client";

import { useUser } from "@clerk/nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar";
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
    <div className="">
      <div className="bg-primary p-6 space-y-6 text-primary-foreground mb-10">
        <div className="flex justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Welcome, {user?.firstName || "User"}!
            </h1>
            {tenant && (
              <p className="text-gray-300">
                Managing: <strong>{tenant.name}</strong>
              </p>
            )}
          </div>
          <div>
            {user?.publicMetadata?.role === "OWNER" ||
              ("SUPER_ADMIN" && (
                <Menubar>
                  <MenubarMenu>
                    <MenubarTrigger>Owner Tools</MenubarTrigger>
                    <MenubarContent>
                      {/* You can add links to manage users, billing, etc. */}
                      <MenubarItem>Invite team members</MenubarItem>
                      <MenubarItem>Manage subscriptions</MenubarItem>
                      <MenubarItem>See audit logs</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                  <MenubarMenu>
                    <MenubarTrigger>Owner Tools</MenubarTrigger>
                    <MenubarContent>
                      {/* You can add links to manage users, billing, etc. */}
                      <MenubarItem>Invite team members</MenubarItem>
                      <MenubarItem>Manage subscriptions</MenubarItem>
                      <MenubarItem>See audit logs</MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                </Menubar>
              ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        <StatCard
          label="Total Revenue"
          value={`$${Number(stats.revenue || 0).toFixed(2)}`}
        />
        <StatCard label="Products" value={stats.products} />
        <StatCard label="Invoices" value={stats.invoices} />
        <StatCard label="Customers" value={stats.customers} />
      </div>
    </div>
  );
}
