"use client";

import { useEffect, useState } from "react";
import { ProductDataTable } from "@/components/tables/product-data-table/ProductDataTable";
import { columns } from "@/components/tables/product-data-table/columns";
import { formatCurrency } from "@/lib/formatCurrency";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("📦 Raw Products from API:", data);

        const transformed = data.map((prod) => ({
          id: prod.id,
          name: prod.name,
          price: prod.price, // raw
          sku: prod.sku || "N/A",
          barcode: prod.barcode || "N/A",
          createdAt: prod.createdAt,
        }));

        console.log("✅ Transformed products:", transformed);
        setProducts(transformed);
      });
  }, []);

  return <ProductDataTable columns={columns} data={products} />;
}
