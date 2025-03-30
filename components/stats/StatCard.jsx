import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";

const StatCard = ({ label, value }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">
          <Link
            href={`${
              label === "Products"
                ? "/dashboard/products"
                : label === "Invoices"
                ? "/dashboard/invoices"
                : label === "Customers"
                ? "/dashboard/customers"
                : "/dashboard"
            }`}
          >
            {value}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default StatCard;
