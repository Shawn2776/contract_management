"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCustomerSheet from "@/components/customers/AddCustomerSheet";
import AddProductSheet from "@/components/products/AddProductSheet";

export default function NewInvoiceForm({
  customers = [],
  products = [],
  discounts = [],
  taxRates = [],
  onSubmit,
  loading,
}) {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [status, setStatus] = useState("Pending");
  const [lineItems, setLineItems] = useState([
    { productId: "", quantity: 1, discountId: "", taxId: "" },
  ]);

  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState(products);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { productId: "", quantity: 1, discountId: "", taxId: "" },
    ]);
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      customerId: selectedCustomer,
      status,
      lineItems,
    });
  };

  useEffect(() => {
    if (Array.isArray(customers) && customers.length) {
      setCustomerList(customers);
    }
  }, [customers]);

  useEffect(() => {
    if (Array.isArray(products) && products.length) {
      setProductList(products);
    }
  }, [products]);

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6"
    >
      <h2 className="text-xl font-semibold mb-4">New Invoice</h2>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="font-medium">Customer</label>
          <AddCustomerSheet
            onCustomerCreated={(newCustomer) => {
              setCustomerList((prev) => [...prev, newCustomer]);
              setSelectedCustomer(String(newCustomer.id));
            }}
          />
        </div>
        <Select
          onValueChange={setSelectedCustomer}
          value={String(selectedCustomer || "")}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select customer" />
          </SelectTrigger>
          <SelectContent>
            {customerList.map((customer) => (
              <SelectItem key={customer.id} value={String(customer.id)}>
                {customer.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-medium">Line Items</h3>
          <AddProductSheet
            onProductCreated={(newProduct) =>
              setProductList((prev) => [...prev, newProduct])
            }
          />
        </div>

        {lineItems.map((item, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-4">
            <Select
              value={item.productId || ""}
              onValueChange={(val) => updateLineItem(idx, "productId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Product" />
              </SelectTrigger>
              <SelectContent>
                {productList.map((product) => (
                  <SelectItem key={product.id} value={String(product.id)}>
                    {product.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              min={1}
              value={item.quantity}
              onChange={(e) =>
                updateLineItem(idx, "quantity", Number(e.target.value))
              }
              placeholder="Qty"
            />

            <Select
              value={item.discountId || ""}
              onValueChange={(val) => updateLineItem(idx, "discountId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Discount" />
              </SelectTrigger>
              <SelectContent>
                {discounts.map((discount) => (
                  <SelectItem key={discount.id} value={String(discount.id)}>
                    {discount.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={item.taxId || ""}
              onValueChange={(val) => updateLineItem(idx, "taxId", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Tax Rate" />
              </SelectTrigger>
              <SelectContent>
                {taxRates.map((tax) => (
                  <SelectItem key={tax.id} value={String(tax.id)}>
                    {tax.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}

        <Button type="button" onClick={addLineItem} variant="secondary">
          + Add Line Item
        </Button>
      </div>

      <div>
        <label className="font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Overdue">Overdue</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="pt-4 text-right">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
