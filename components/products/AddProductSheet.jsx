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

export default function AddProductSheet({ onProductCreated }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    price: "",
    sku: "",
    barcode: "",
    description: "",
    imageUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Product name is required.";
    if (!form.price || isNaN(Number(form.price)))
      errs.price = "Valid price is required.";
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
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Failed to create product.");
      }

      const product = await res.json();
      onProductCreated?.(product);
      setForm({
        name: "",
        price: "",
        sku: "",
        barcode: "",
        description: "",
        imageUrl: "",
      });
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
          + Add Product
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px]">
        <SheetHeader>
          <SheetTitle>Add New Product</SheetTitle>
        </SheetHeader>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input name="name" value={form.name} onChange={handleChange} />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name}</p>
            )}
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              name="price"
              type="number"
              step="0.01"
              value={form.price}
              onChange={handleChange}
            />
            {errors.price && (
              <p className="text-sm text-red-500">{errors.price}</p>
            )}
          </div>
          <div>
            <Label htmlFor="sku">SKU</Label>
            <Input name="sku" value={form.sku} onChange={handleChange} />
          </div>
          <div>
            <Label htmlFor="barcode">Barcode</Label>
            <Input
              name="barcode"
              value={form.barcode}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              name="imageUrl"
              value={form.imageUrl}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              name="description"
              value={form.description}
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
