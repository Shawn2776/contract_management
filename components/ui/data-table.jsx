"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { IdCard, LayoutList } from "lucide-react";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";

export function DataTable({ columns, data }) {
  const [filter, setFilter] = useState("");
  const [isListView, setIsListView] = useState(true); // New state for list view
  const [isCardView, setIsCardView] = useState(false); // New state for card view

  const filteredData = data.filter((row) =>
    columns.some((col) =>
      String(row[col.accessorKey] || "")
        .toLowerCase()
        .includes(filter.toLowerCase())
    )
  );

  const handleClick = (view) => {
    if (view === "list") {
      setIsListView(true);
      setIsCardView(false);
    } else if (view === "card") {
      setIsCardView(true);
      setIsListView(false);
    }
  };

  return (
    <div className="space-y-4 p-4">
      <div className="flex items-center justify-between space-x-4">
        <Input
          type="text"
          placeholder="Search..."
          className="max-w-sm"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        <div className="flex items-center space-x-2">
          <Button
            onClick={() => handleClick("list")}
            variant={`${isListView ? "default" : "outline"}`}
            className=" hover:cursor-pointer"
          >
            <LayoutList />
          </Button>
          <Button
            onClick={() => handleClick("card")}
            variant={`${isCardView ? "default" : "outline"}`}
            className=" hover:cursor-pointer"
          >
            <IdCard />
          </Button>
        </div>
      </div>

      {isCardView && (
        <div className="grid grid-cols-4 gap-4">
          {data.map((row, rowIndex) => {
            console.log(`🔍 Row ${rowIndex}:`, row);
            return (
              <Card key={row.id || rowIndex} className="w-full">
                <CardHeader>
                  <CardTitle>{row.name}</CardTitle>
                  <CardDescription>{row.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  {columns.map((column) => (
                    <div key={column.accessorKey}>
                      <strong>{column.header}:</strong>{" "}
                      {row[column.accessorKey]}
                    </div>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {isListView && (
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.accessorKey}>
                      {column.header}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((row, rowIndex) => {
                  console.log(`🔍 Row ${rowIndex}:`, row);
                  return (
                    <TableRow key={row.id || rowIndex}>
                      {columns.map((column) => (
                        <TableCell key={column.accessorKey}>
                          {column.cell
                            ? column.cell(row) // ✅ PASS raw row directly
                            : row[column.accessorKey]}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
