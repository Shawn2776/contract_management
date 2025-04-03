import { AppSidebar } from "@/components/dashboard_2/app-sidebar";
import TopNav from "@/components/dashboard_2/TopNav";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col flex-1 min-h-screen">
          <TopNav />
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
