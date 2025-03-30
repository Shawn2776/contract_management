"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);

  function formatPhone(phone) {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
    return match ? `(${match[1]}) ${match[2]}-${match[3]}` : phone;
  }

  useEffect(() => {
    fetch("/api/customers")
      .then((res) => res.json())
      .then(setCustomers);
  }, []);

  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-2 gap-4">
        {customers.map((customer) => (
          <Card key={customer.id} className="rounded-none shadow-lg">
            <CardHeader>
              <CardTitle>{customer.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <span className="font-bold">Email:</span>
                <span>{customer.email}</span>
              </p>
              <p>
                <span className="font-bold">Phone:</span>
                <span>{formatPhone(customer.phone)}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
