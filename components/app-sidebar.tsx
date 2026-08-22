"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import { SidebarGroup, SidebarGroupLabel, SidebarMenuButton, SidebarMenuItem, SidebarMenuSubItem, useSidebar } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarMenu
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, SidebarIcon, HomeIcon, CloudIcon, WebhookIcon } from "lucide-react"
import Link from "next/link"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  items: [
    {
      icon: <HomeIcon className="menu-icon" />,
      title: "Home",
      target: "/dashboard"
    },
    {
      icon: <CloudIcon className="menu-icon" />,
      title: "My Air",
      target: "/dashboard/myair"
    },
    {
      icon: <WebhookIcon className="menu-icon" />,
      title: "Integrations",
      target: "/dashboard/integrations"
    },
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();
  return (
    <Sidebar variant="sidebar" collapsible="icon" {...props}>
      <SidebarHeader>
        <span className={`${open ? "block" : "hidden"} px-1 py-1.5 font-sans w-full block font-semibold text-xl select-none cursor-pointer`} >Oxygen <span className="font-light">console</span></span>
        <div className={`w-8 aspect-square flex items-center justify-center rounded-md text-primary-foreground font-sans font-bold bg-primary ${open ? "hidden" : "block"} px-1 py-1.5`} >O<sub>2</sub></div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarMenu>
            {
              data.items.map((item, key) => {
                return (
                  <SidebarMenuItem key={key} >
                    <SidebarMenuButton render={<Link href={item.target} />} >
                      {item.icon}
                      <span className="font-sans" >{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })
            }
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
