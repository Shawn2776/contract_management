"use client";

import InvoiceStatusDonut from "@/components/charts/InvoiceStatusDonut";
import OrdersVsSoldChart from "@/components/charts/OrdersVsSoldChart";
import { columns } from "@/components/tables/invoice-data-table/columns";
import { InvoiceDataTable } from "@/components/tables/invoice-data-table/InvoiceDataTable";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { useEffect, useState } from "react";

const TestPage = () => {
  const [invoices, setInvoices] = useState([]);

  useEffect(() => {
    fetch("/api/invoices")
      .then((res) => res.json())
      .then((data) => {
        const transformed = data.map((inv) => ({
          id: inv.id,
          status: inv.status,
          number: inv.number,
          amount: formatCurrency(inv.amount),
          customer: inv.customer?.name || "Unknown",
          createdAt: inv.createdAt,
        }));
        setInvoices(transformed);
      });
  }, []);

  return (
    <div className="flex flex-col w-full gap-4 px-2 md:px-4">
      <h2 className="text-2xl font-extrabold">Overview</h2>

      {/* Top Section: Cards + Invoice Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* 3 Summary Cards */}
        <Card className="flex flex-col gap-1 text-center w-full">
          <div className="text-left pl-4">TOTAL</div>
          <div className="text-5xl font-extrabold">$41,910</div>
          <div className="italic">213 Invoices</div>
        </Card>
        <Card className="flex flex-col gap-1 text-center w-full">
          <div className="text-left pl-4">PAID</div>
          <div className="text-5xl font-extrabold">$32,000</div>
          <div className="italic">170 Invoices</div>
        </Card>
        <Card className="flex flex-col gap-1 text-center w-full">
          <div className="text-left pl-4">UNPAID</div>
          <div className="text-5xl font-extrabold">$12,231</div>
          <div className="italic">87 Invoices</div>
        </Card>

        {/* Invoice Status Chart (only bumps to top row on xl+) */}
        <Card className="w-full col-span-1 xl:col-span-1 p-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-xl font-bold">Invoice Status</h3>
            <select className="bg-transparent border rounded p-1">
              <option value="Last 30 Days">Last 30 Days</option>
              <option value="Last Month">Last Month</option>
            </select>
          </div>
          <InvoiceStatusDonut />
        </Card>
      </div>

      {/* Orders vs Sold Chart: Full width unless xl */}
      <Card className="w-full p-4">
        <h3 className="text-xl font-bold mb-2">Orders vs Sold</h3>
        <OrdersVsSoldChart />
      </Card>

      {/* Recent Transactions Table */}
      <div className="w-full">
        <h3 className="text-xl font-bold mb-2">Recent Transactions</h3>
        <InvoiceDataTable columns={columns} data={invoices} />
      </div>
    </div>
  );
};

export default TestPage;

// <div className="flex flex-col gap-2">
//       {/* Top */}
//       <div className="flex flex-col gap-2">
//         {/* Top Left - 4 Cards */}
//         <div className="">
//           <div className="text-right mb-2">
//             <Button variant="outline">See Reports</Button>
//           </div>
//           <div className="grid grid-cols-2 gap-2">
//             {/* Card One */}
//             <Card>
//               <CardContent>
//                 <h3 className="font-extrabold text-xl">Orders</h3>
//                 <p className="text-5xl text-center">1,212</p>
//                 <p className="text-right italic mt-2">Since last month</p>
//               </CardContent>
//             </Card>

//             {/* Card Two */}
//             <Card>
//               <CardContent>
//                 <h3 className="font-extrabold text-xl">Revenue</h3>
//                 <p className="text-5xl text-center">$21,212</p>
//                 <p className="text-right italic mt-2">Since last month</p>
//               </CardContent>
//             </Card>

//             {/* Card Three */}
//             <Card>
//               <CardContent>
//                 <h3 className="font-extrabold text-xl">Avg. Price</h3>
//                 <p className="text-5xl text-center">$21.02</p>
//                 <p className="text-right italic mt-2">Since last month</p>
//               </CardContent>
//             </Card>

//             {/* Card Four */}
//             <Card>
//               <CardContent>
//                 <h3 className="font-extrabold text-xl">Products Sold</h3>
//                 <p className="text-5xl text-center">1,054</p>
//                 <p className="text-right italic mt-2">Since last month</p>
//               </CardContent>
//             </Card>
//           </div>
//         </div>

//         {/* Top Middle */}
//         {/* <div>Top Middle - Summary Chart (Orders vs Sold)</div> */}
//         <OrdersVsSoldChart />

//         {/* Top Right */}
//         <div>Top Right - Pending Transactions List</div>
//       </div>

//       {/* Middle */}
//       <div>
//         {/* Middle Left - Recent Transactions Table */}
//         <div>
//           <div>
//             <h2>Recent Transactions</h2>
//             <Button>View All</Button>
//           </div>
//           <InvoiceDataTable columns={columns} data={invoices} />
//         </div>

//         {/* Middle Right - Budget Chart */}
//         <div>Middle Right - Budget Chart</div>
//       </div>

//       {/* Bottom */}
//       <div>Bottom</div>
//     </div>

// return (
//   <div className="md:flex w-full md:flex-col md:gap-4 grid grid-cols-1 gap-2">
//     {/* Top */}
//     <div className="md:flex w-full md:justify-between md:gap-4">
//       {/* Top Left - 4 Cards */}
//       <div className="w-full md:max-w-1/3">
//         <div className="text-right mb-2">
//           <Button variant="outline">See Reports</Button>
//         </div>
//         <div className="grid grid-cols-2 gap-1">
//           {/* Card One */}
//           <Card className="shadow-md bg-gradient-to-r from-blue-600/20 to-red-600/20 border-none p-1 rounded-md">
//             <CardContent>
//               <h3 className="font-bold text-blue-600 text-lg">Orders</h3>
//               <p className="font-bold text-center text-3xl">1,212</p>
//               <p className="text-right text-sm italic mt-2">
//                 Since last month
//               </p>
//             </CardContent>
//           </Card>

//           {/* Card Two */}
//           <Card className=" shadow-md bg-gradient-to-r from-red-600/20 to-blue-600/20 border-none p-1 rounded-md">
//             <CardContent>
//               <h3 className="font-bold text-blue-600 text-lg">Revenue</h3>
//               <p className="font-bold text-center text-3xl">$21,212</p>
//               <p className="text-right text-sm italic mt-2">
//                 Since last month
//               </p>
//             </CardContent>
//           </Card>

//           {/* Card Three */}
//           <Card className=" shadow-md bg-gradient-to-r from-blue-600/20 to-red-600/20 border-none p-1 rounded-md">
//             <CardContent className="flex flex-col gap-1">
//               <h3 className="font-bold text-blue-600 text-lg">Avg. Price</h3>
//               <p className="text-3xl font-bold text-center">$21.02</p>
//               <p className="text-right text-sm italic mt-2">
//                 Since last month
//               </p>
//             </CardContent>
//           </Card>

//           {/* Card Four */}
//           <Card className=" shadow-md bg-gradient-to-r from-red-600/20 to-blue-600/20 border-none p-1 rounded-md">
//             <CardContent>
//               <h3 className="font-bold text-blue-600 text-lg">
//                 Products Sold
//               </h3>
//               <p className="font-bold text-3xl text-center">1,054</p>
//               <p className="text-right text-sm italic mt-2">
//                 Since last month
//               </p>
//             </CardContent>
//           </Card>
//         </div>
//       </div>

//       {/* Top Middle */}
//       <div className="w-full md:max-w-1/3 bg-primary text-primary-foreground p-1 shadow-md rounded-md">
//         Top Middle - Summary Chart (Orders vs Sold)
//       </div>

//       {/* Top Right */}
//       <div className="w-full md:max-w-1/3 bg-primary text-primary-foreground p-1 shadow-md rounded-md">
//         Top Right - Pending Transactions List
//       </div>
//     </div>

//     {/* Middle */}
//     <div className="w-full flex justify-between gap-4">
//       {/* Middle Left - Recent Transactions Table */}
//       <div className="w-full max-w-2/3 bg-primary text-primary-foreground p-1 shadow-md rounded-md">
//         <div className="flex justify-between p-2">
//           <h2 className="font-semibold text-xl">Recent Transactions</h2>
//           <Button>View All</Button>
//         </div>
//         <InvoiceDataTable columns={columns} data={invoices} />
//       </div>

//       {/* Middle Right - Budget Chart */}
//       <div className="w-full max-w-1/3 bg-primary text-primary-foreground rounded-md p-4 shadow-md">
//         Middle Right - Budget Chart
//       </div>
//     </div>

//     {/* Bottom */}
//     <div>Bottom</div>
//   </div>
// );
