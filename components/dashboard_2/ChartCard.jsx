"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const data = [
  { name: "Jan", orders: 120, sold: 80 },
  { name: "Feb", orders: 150, sold: 130 },
  { name: "Mar", orders: 200, sold: 170 },
  { name: "Apr", orders: 170, sold: 140 },
];

export default function ChartCard() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Orders vs Sold</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="orders" stroke="#8884d8" />
            <Line type="monotone" dataKey="sold" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
