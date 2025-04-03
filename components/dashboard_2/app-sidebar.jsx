"use client";

import {
  LayoutDashboard,
  Package,
  FileText,
  Users,
  Settings2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useUserInfo } from "@/lib/useUserInfo";

import { usePathname } from "next/navigation";
import { TeamSwitcher } from "./team-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar(props) {
  const pathname = usePathname();
  const user = useUserInfo();
  console.log("Current pathname:", pathname);

  const navItems = [
    {
      title: "Dashboard",
      url: "/dashboard_2",
      icon: LayoutDashboard,
      isActive: pathname === "/dashboard_2",
    },
    {
      title: "Invoices",
      url: "/dashboard_2/invoices",
      icon: FileText,
      isActive: pathname.startsWith("/dashboard_2/invoices"),
    },
    {
      title: "Products",
      url: "/dashboard_2/products",
      icon: Package,
      isActive: pathname.startsWith("/dashboard_2/products"),
    },
    // etc.
  ];

  // Role-based nav
  if (user?.role === "OWNER") {
    navItems.push({
      title: "Team Management",
      url: "/dashboard_2/team",
      icon: Users,
      isActive: pathname.startsWith("/dashboard_2/team"),
    });
  }

  navItems.push({
    title: "Settings",
    url: "/dashboard_2/settings",
    icon: Settings2,
    isActive: pathname.startsWith("/dashboard_2/settings"),
  });

  return (
    <Sidebar collapsible="icon" className="group/sidebar" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
