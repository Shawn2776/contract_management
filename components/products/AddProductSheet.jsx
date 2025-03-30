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
import AddProductForm from "./AddProductForm";

export default function AddProductSheet({ onProductCreated }) {
  const [open, setOpen] = useState(false);

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
        <div className="mt-6">
          <AddProductForm
            onProductCreated={onProductCreated}
            onClose={() => setOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
