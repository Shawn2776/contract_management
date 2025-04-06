"use client";

import { ProductForm } from "@/components/dashboard_2/products/ProductForm";
import React from "react";
import { useUser } from "@clerk/nextjs";

const NewProductPage = () => {
  const { isSignedIn, user } = useUser();
  return <ProductForm />;
};

export default NewProductPage;
