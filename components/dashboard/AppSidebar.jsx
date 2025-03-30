"use client";

import React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "../ui/sidebar";
import { TeamSwitcher } from "./TeamSwitcher";

import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

const data = {
  teams: [
    {
      name: "Demo Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
  ],
};

const AppSidebar = ({ ...props }) => {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-primary text-primary-foreground">
        <TeamSwitcher teams={data.teams} className="mt-2" />
      </SidebarHeader>
      <SidebarContent className="bg-primary text-primary-foreground flex flex-col items-center md:items-start md:pl-5"></SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
};

export default AppSidebar;
