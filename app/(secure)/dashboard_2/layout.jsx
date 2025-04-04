"use client";

import { AppSidebar } from "@/components/dashboard_2/app-sidebar";
import TopNav from "@/components/dashboard_2/TopNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

import getFinalSegment from "@/lib/functions/getFinalSegment";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const path = getFinalSegment(pathname);

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <TopNav />
          <div className="flex flex-col gap-5 ">
            <h1 className="text-xl font-bold">{path}</h1>
          </div>
          <div className="px-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
