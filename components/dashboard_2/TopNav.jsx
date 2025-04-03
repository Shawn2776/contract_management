"use client";

import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

function toTitle(str) {
  return str.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
}

export default function TopNav() {
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean).slice(1); // skip the root (usually dashboard_2)

  const basePath = `/${pathname.split("/")[1]}`; // e.g. "/dashboard_2"

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 border-b bg-background shadow-sm">
      <div className="flex items-center gap-2 flex-1">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mr-2 h-5" />

        <Breadcrumb className="text-sm leading-none">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href={basePath}>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>

            {segments.map((segment, index) => {
              const href = `${basePath}/${segments
                .slice(0, index + 1)
                .join("/")}`;
              const isLast = index === segments.length - 1;

              return (
                <span key={href} className="flex items-center">
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    {isLast ? (
                      <BreadcrumbPage className="capitalize">
                        {toTitle(segment)}
                      </BreadcrumbPage>
                    ) : (
                      <BreadcrumbLink href={href} className="capitalize">
                        {toTitle(segment)}
                      </BreadcrumbLink>
                    )}
                  </BreadcrumbItem>
                </span>
              );
            })}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <UserButton afterSignOutUrl="/sign-in" />
    </header>
  );
}
