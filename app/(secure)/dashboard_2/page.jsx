import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      {/* Stat cards, charts, etc. */}
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="rounded-xl bg-muted/50 p-4">Card 1</div>
        <div className="rounded-xl bg-muted/50 p-4">Card 2</div>
        <div className="rounded-xl bg-muted/50 p-4">Card 3</div>
      </div>

      <div className="min-h-[300px] rounded-xl bg-muted/50 p-4">
        {/* Chart or data block */}
        Dashboard chart goes here
      </div>
    </div>
  );
}
