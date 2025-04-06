"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";
import { useUser } from "@clerk/nextjs";

export function ProductForm({ tenantId, onSuccess }) {
  const { isSignedIn, user } = useUser();
  const { register, handleSubmit, reset } = useForm();
  const [previewUrl, setPreviewUrl] = useState(null);

  if (!isSignedIn) {
    return <p>Loading authentication...</p>; // or a spinner
  }

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    if (!isSignedIn || !user?.id) {
      toast.error("Please wait for Clerk to finish loading.");
      return;
    }

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: JSON.stringify({ ...data, tenantId }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const msg = await res.text();
        console.error("❌ API error:", res.status, msg);
        toast.error(`Error: ${res.status}`);
        return;
      }

      const product = await res.json();
      toast.success("Product created!");
      reset();
      setPreviewUrl(null);
      onSuccess?.(product);
    } catch (err) {
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input id="name" {...register("name", { required: true })} />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            {...register("price", { required: true })}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <Label htmlFor="sku">SKU</Label>
          <Input id="sku" {...register("sku")} />
        </div>
        <div>
          <Label htmlFor="barcode">Barcode</Label>
          <Input id="barcode" {...register("barcode")} />
        </div>
        <div>
          <Label htmlFor="qrCodeUrl">QR Code URL</Label>
          <Input id="qrCodeUrl" {...register("qrCodeUrl")} />
        </div>
      </div>

      <div>
        <Label htmlFor="variant">Variant</Label>
        <Input
          id="variant"
          placeholder="e.g. Color: Red, Size: M"
          {...register("variant")}
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" {...register("description")} />
      </div>

      <div>
        <Label htmlFor="specs">Specifications (JSON)</Label>
        <Textarea id="specs" {...register("specs")} />
      </div>

      <div>
        <Label htmlFor="image">Image</Label>
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Preview"
            className="w-24 h-24 rounded object-cover mt-2"
          />
        )}
      </div>

      <Button type="submit">Create Product</Button>
    </form>
  );
}
