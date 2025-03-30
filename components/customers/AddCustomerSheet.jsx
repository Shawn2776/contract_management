"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddCustomerSheet({ onCustomerCreated }) {
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      const customer = await res.json();
      onCustomerCreated?.(customer);
      setForm({ name: "", email: "", phone: "", address: "" });
      setOpen(false);
    } else {
      alert("Error creating customer");
    }

    setLoading(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button type="button" variant="outline">
          + Add Customer
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Customer</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          <div className="pt-4 flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
