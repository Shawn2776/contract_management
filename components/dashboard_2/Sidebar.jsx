"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  FileText,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
} from "lucide-react";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard_2/products", label: "Products", icon: Package },
  { href: "/dashboard_2/invoices", label: "Invoices", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleCollapse = () => setCollapsed(!collapsed);

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="sm:hidden p-4 fixed top-2 left-2 z-50 bg-white border rounded"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Mobile backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 sm:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed z-50 inset-y-0 left-0 bg-background border-r transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        )}
      >
        {/* Collapse/Expand toggle */}
        <div className="flex justify-end sm:justify-center p-2">
          <button
            onClick={toggleCollapse}
            className="hidden sm:block p-1 hover:bg-muted rounded"
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={() => setMobileOpen(false)}
            className="sm:hidden p-1"
          >
            <X />
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-2 mt-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors",
                pathname === link.href
                  ? "bg-muted text-primary"
                  : "text-muted-foreground hover:bg-muted",
                collapsed ? "justify-center" : ""
              )}
              onClick={() => setMobileOpen(false)}
            >
              <link.icon className="w-5 h-5" />
              {!collapsed && <span>{link.label}</span>}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
