"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AddProductForm({ onProductCreated, onClose }) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.stopPropagation();
    e.preventDefault();
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
      }),
    });

    if (res.ok) {
      const product = await res.json();
      onProductCreated?.(product);
      onClose?.();
      setForm({ name: "", description: "", price: "" });
    } else {
      alert("Error creating product");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input name="name" value={form.name} onChange={handleChange} required />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Input
          name="description"
          value={form.description}
          onChange={handleChange}
        />
      </div>
      <div>
        <Label htmlFor="price">Price</Label>
        <Input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>
      <div className="pt-4 flex justify-end">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
