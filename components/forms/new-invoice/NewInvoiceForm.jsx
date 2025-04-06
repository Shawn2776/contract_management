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
  statuses = [],
  onSubmit,
  loading,
}) {
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [lineItems, setLineItems] = useState([
    { productId: "", quantity: 1, discountId: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [customerList, setCustomerList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [isTaxExempt, setIsTaxExempt] = useState(false);
  const [taxExemptId, setTaxExemptId] = useState("");
  const [taxRate, setTaxRate] = useState("");

  useEffect(() => {
    setCustomerList(customers);
  }, [customers]);

  useEffect(() => {
    setProductList(products);
  }, [products]);

  const addLineItem = () => {
    setLineItems([
      ...lineItems,
      { productId: "", quantity: 1, discountId: "" },
    ]);
  };

  const updateLineItem = (index, field, value) => {
    const updated = [...lineItems];
    updated[index][field] = value;
    setLineItems(updated);
  };

  const validate = () => {
    const newErrors = {};
    if (!selectedCustomer) newErrors.customer = "Customer is required.";
    if (
      lineItems.length === 0 ||
      lineItems.some((item) => !item.productId || item.quantity < 1)
    ) {
      newErrors.lineItems = "At least one valid line item is required.";
    }
    if (!status) newErrors.status = "Status is required.";
    if (!isTaxExempt && !taxRate) newErrors.taxRate = "Tax rate is required.";
    if (isTaxExempt && !taxExemptId)
      newErrors.taxExemptId = "Tax exemption ID is required.";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    onSubmit({
      customerId: selectedCustomer,
      status,
      lineItems,
      taxRateId: isTaxExempt ? null : taxRate,
      taxExempt: isTaxExempt,
      taxExemptId: isTaxExempt ? taxExemptId : null,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-4xl mx-auto p-8 bg-muted/50 shadow-lg rounded-xl"
    >
      <h2 className="text-2xl font-semibold mb-6">New Invoice</h2>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="font-medium">Customer</label>
          <AddCustomerSheet
            onCustomerCreated={(newCustomer) => {
              setCustomerList((prev) => [...prev, newCustomer]);
              setSelectedCustomer(String(newCustomer.id));
            }}
          />
        </div>
        <Select onValueChange={setSelectedCustomer} value={selectedCustomer}>
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
        {errors.customer && (
          <p className="text-red-500 text-sm mt-1">{errors.customer}</p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Line Items</h3>
          <AddProductSheet
            onProductCreated={(newProduct) =>
              setProductList((prev) => [...prev, newProduct])
            }
          />
        </div>

        {lineItems.map((item, idx) => (
          <div key={idx} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
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
          </div>
        ))}

        {errors.lineItems && (
          <p className="text-red-500 text-sm mt-1">{errors.lineItems}</p>
        )}

        <Button type="button" onClick={addLineItem} variant="secondary">
          + Add Line Item
        </Button>
      </div>

      {/* Tax Section */}
      <div className="space-y-4 border-t pt-6">
        <label className="text-lg font-medium">Tax Options</label>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={isTaxExempt}
            onChange={(e) => setIsTaxExempt(e.target.checked)}
            id="taxExempt"
            className="size-4"
          />
          <label htmlFor="taxExempt">Invoice is tax-exempt</label>
        </div>

        {isTaxExempt ? (
          <div>
            <label className="text-sm font-medium">Tax Exemption ID</label>
            <Input
              placeholder="Exemption Certificate or Business Tax ID"
              value={taxExemptId}
              onChange={(e) => setTaxExemptId(e.target.value)}
              required
            />
            {errors.taxExemptId && (
              <p className="text-red-500 text-sm mt-1">{errors.taxExemptId}</p>
            )}
          </div>
        ) : (
          <div>
            <label className="text-sm font-medium">Apply Tax Rate</label>
            <Select value={taxRate} onValueChange={setTaxRate}>
              <SelectTrigger>
                <SelectValue placeholder="Select tax rate" />
              </SelectTrigger>
              <SelectContent>
                {taxRates.map((tax) => (
                  <SelectItem key={tax.id} value={String(tax.id)}>
                    {tax.name} ({tax.rate}%)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.taxRate && (
              <p className="text-red-500 text-sm mt-1">{errors.taxRate}</p>
            )}
          </div>
        )}
      </div>

      {/* Status */}
      <div>
        <label className="font-medium">Status</label>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s
                  .replace(/_/g, " ")
                  .toLowerCase()
                  .replace(/^\w/, (c) => c.toUpperCase())}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-red-500 text-sm mt-1">{errors.status}</p>
        )}
      </div>

      <div className="pt-6 text-right">
        <Button type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Invoice"}
        </Button>
      </div>
    </form>
  );
}
