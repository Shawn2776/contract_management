"use client";

import AppSidebar from "@/components/dashboard/AppSidebar";
import Navbar from "@/components/nav/Navbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import React from "react";

import getFinalSegment from "@/lib/functions/getFinalSegment";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();
  const path = getFinalSegment(pathname);

  return (
    <>
      <Navbar />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <div className="flex flex-1 flex-col gap-4 p-4">
            <div className="flex flex-col gap-5 w-full min-h-screen">
              <h1 className="text-xl font-bold">{path}</h1>
              <hr className="border border-gray-500/50" />
              {children}
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
