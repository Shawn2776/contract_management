// "use client";

// import { usePathname } from "next/navigation";
// import { useUser } from "@clerk/nextjs";
// import { useEffect, useState } from "react";

// import {
//   Menubar,
//   MenubarContent,
//   MenubarItem,
//   MenubarMenu,
//   MenubarTrigger,
// } from "@/components/ui/menubar";
// import { Button } from "@/components/ui/button";
// import Link from "next/link";

// const DashboardLayout = ({ children }) => {
//   const { user, isLoaded } = useUser();
//   const [tenant, setTenant] = useState(null);

//   const pathname = usePathname();

//   const getPageTitle = () => {
//     const segments = pathname.split("/").filter(Boolean);
//     const lastSegment = segments[segments.length - 1] || "";
//     return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
//   };

//   useEffect(() => {
//     fetch("/api/tenant")
//       .then((res) => res.json())
//       .then(setTenant);
//   }, []);

//   const pathTitle = getPageTitle();

//   if (!isLoaded) return <div>Loading...</div>;

//   return (
//     <div className="flex flex-col w-full">
//       <div className="flex justify-between items-center px-10 h-20 bg-primary text-primary-foreground">
//         <div>
//           <h1 className="text-xl font-bold">
//             Welcome, {user?.firstName || "User"}!
//           </h1>
//           {tenant && (
//             <p className="text-sm text-primary-foreground/50">
//               Managing <strong>{tenant.name}</strong>
//             </p>
//           )}
//         </div>
//         <div className="hidden md:flex text-4xl font-extrabold">
//           {pathTitle}
//         </div>
//         <div>
//           <div>
//             {user?.publicMetadata?.role === "OWNER" ||
//               ("SUPER_ADMIN" && (
//                 <Menubar>
//                   <MenubarMenu>
//                     <MenubarTrigger>Owner Tools</MenubarTrigger>
//                     <MenubarContent>
//                       {/* You can add links to manage users, billing, etc. */}
//                       <MenubarItem>Invite team members</MenubarItem>
//                       <MenubarItem>Manage subscriptions</MenubarItem>
//                       <MenubarItem>See audit logs</MenubarItem>
//                     </MenubarContent>
//                   </MenubarMenu>
//                   <MenubarMenu>
//                     <MenubarTrigger>Pages</MenubarTrigger>
//                     <MenubarContent>
//                       {/* You can add links to manage users, billing, etc. */}
//                       <MenubarItem>
//                         <Link href="/dashboard">Home</Link>
//                       </MenubarItem>
//                       <MenubarItem>
//                         <Link href="/dashboard/invoices">Invoices</Link>
//                       </MenubarItem>
//                       <MenubarItem>
//                         <Link href="/dashboard/products">Products</Link>
//                       </MenubarItem>
//                       <MenubarItem>
//                         <Link href="/dashboard/customers">Customers</Link>
//                       </MenubarItem>
//                     </MenubarContent>
//                   </MenubarMenu>
//                 </Menubar>
//               ))}
//           </div>
//         </div>
//       </div>
//       <div className="grid grid-cols-5">
//         <div className="grid col-span-2">&nbsp;</div>
//         <div className="grid col-span-2">{children}</div>
//         <div className="grid col-span-1">&nbsp;</div>
//       </div>
//     </div>
//   );
// };

// export default DashboardLayout;
import AppSidebar from "@/components/dashboard/AppSidebar";
import Navbar from "@/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const DashboardLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
