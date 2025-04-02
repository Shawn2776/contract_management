"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";
import { useTheme } from "next-themes";

const COLORS = ["green", "red", "orange", "blue"]; // Paid, Pending, Draft, Overdue

export default function InvoiceStatusDonut() {
  const [data, setData] = useState([]);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    fetch("/api/dashboard/invoice-status")
      .then((res) => res.json())
      .then(setData);
  }, []);

  const centerLabel = data.find((d) => d.name === "Paid");

  return (
    <div className="w-full max-w-md">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            dataKey="value"
            labelLine={false}
          >
            {data.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <text
            x="50%"
            y="50%"
            textAnchor="middle"
            dominantBaseline="middle"
            style={{
              fill: isDark ? "#ffffff" : "#000000",
              fontSize: "1.25rem",
              fontWeight: "600",
            }}
          >
            {centerLabel?.name} {centerLabel?.percent}%
          </text>
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            content={({ payload }) => (
              <ul className="space-y-1 pl-2">
                {payload.map((entry, index) => (
                  <li key={`item-${index}`} className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 block rounded-full"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span
                      className="text-sm"
                      style={{ color: isDark ? "#ffffff" : "#000000" }}
                    >
                      {entry.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
