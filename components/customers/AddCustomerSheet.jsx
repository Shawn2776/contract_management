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
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.email.trim()) errs.email = "Email is required.";
    if (!form.phone.trim()) errs.phone = "Phone is required.";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create customer.");
      }

      const customer = await res.json();
      onCustomerCreated?.(customer);
      setForm({ name: "", email: "", phone: "", address: "" });
      setOpen(false);
    } catch (err) {
      setErrors({ form: err.message });
    } finally {
      setLoading(false);
    }
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
            <Input name="name" value={form.name} onChange={handleChange} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input name="email" value={form.email} onChange={handleChange} />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone}</p>
            )}
          </div>
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              name="address"
              value={form.address}
              onChange={handleChange}
            />
          </div>
          {errors.form && <p className="text-sm text-red-500">{errors.form}</p>}
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
