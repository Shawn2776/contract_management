"use client";

import * as React from "react";
import { ChevronsUpDown, Plus } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function TeamSwitcher() {
  const [teams, setTeams] = React.useState([]);
  const [currentTeam, setCurrentTeam] = React.useState(null);
  const { isMobile } = useSidebar();

  React.useEffect(() => {
    async function loadTeams() {
      const res = await fetch("/api/tenant");
      const data = await res.json();
      setTeams(data);
      setCurrentTeam(data[0]);
    }

    loadTeams();
  }, []);

  const handleSwitch = (team) => {
    setCurrentTeam(team);
    const baseDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || "rental.com";
    window.location.href = `https://${team.slug}.${baseDomain}`;
  };

  if (!currentTeam) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group/sidebar">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              {/* Icon block (always visible) */}
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground uppercase text-sm font-bold">
                {currentTeam.name[0]}
              </div>

              {/* Team name & role — only show when not collapsed */}
              <div className="ml-2 grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]/sidebar:hidden">
                <span className="truncate font-semibold">
                  {currentTeam.name}
                </span>
                <span className="truncate text-xs">{currentTeam.role}</span>
              </div>

              {/* Chevron — hidden when collapsed */}
              <ChevronsUpDown className="ml-auto group-data-[collapsible=icon]/sidebar:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Your Tenants
            </DropdownMenuLabel>
            {teams.map((team) => (
              <DropdownMenuItem
                key={team.id}
                onClick={() => handleSwitch(team)}
              >
                {team.name}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Plus className="mr-2" />
              Add new tenant
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
