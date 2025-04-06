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
import { UserButton, useUser } from "@clerk/nextjs";

export function AppSidebar(props) {
  const pathname = usePathname();
  const { user } = useUser(); // ✅ destructured properly now
  const userInfo = useUserInfo();

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
  ];

  if (userInfo?.role === "OWNER") {
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

      <SidebarFooter className="mt-auto border-t border-border bg-sidebar px-4 py-3 relative overflow-hidden">
        <div className="flex items-center gap-3 relative z-10">
          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                userButtonAvatarBox: "h-9 w-9",
              },
            }}
          />
          <div className="text-sm absolute left-14 top-1 z-0 w-[180px] peer-data-[collapsed=true]/sidebar:opacity-0 peer-data-[collapsed=true]/sidebar:-z-10">
            <p className="font-medium leading-none whitespace-nowrap">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-muted-foreground text-xs truncate">
              {user?.primaryEmailAddress?.emailAddress}
            </p>
          </div>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
