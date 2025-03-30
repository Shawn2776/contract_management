"use client";

import { usePathname } from "next/navigation";

const DashboardLayout = ({ children }) => {
  const pathname = usePathname();

  const getPageTitle = () => {
    const segments = pathname.split("/").filter(Boolean);
    const lastSegment = segments[segments.length - 1] || "";
    return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
  };

  const pathTitle = getPageTitle();

  return (
    <div className="flex flex-col w-full">
      <div className="w-full h-20 font-bold text-5xl bg-primary text-primary-foreground text-center flex items-center justify-center">
        {pathTitle}
      </div>
      <div className="grid grid-cols-5">
        <div className="grid col-span-2">&nbsp;</div>
        <div className="grid col-span-2">{children}</div>
        <div className="grid col-span-1">&nbsp;</div>
      </div>
    </div>
  );
};

export default DashboardLayout;
