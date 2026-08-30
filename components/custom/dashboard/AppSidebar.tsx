"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Archive, FileIcon, LayoutGrid, Settings, Sparkle, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";


export function AppSidebar() {
  
  const path=usePathname();
  const {user}=useUser();

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.svg"
            alt="SafedBoard"
            width={42}
            height={42}
            className="shrink-0"
          />

          <h2 className="text-xl font-bold text-sidebar-foreground">
            SafedBoard
          </h2>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup className="px-4">
          <Button
            // variant="ghost"
            className="text-md font-semibold w-full justify-start text-sidebar-foreground"  
          >
            + Create New Board
          </Button>
          
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Board</SidebarGroupLabel>
          <SidebarMenuButton className="p-5 text-md font-semibold" isActive={path.includes('dashboard')}>
            <LayoutGrid/>
            <span>All File</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 text-md mt-2 font-semibold" isActive={path.includes('dashboard/shared-files')}>
            <UserRound/>
            <span>Shared</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 text-md mt-2 font-semibold" isActive={path.includes('dashboard/archive')}>
            <Archive/>
            <span>Archived</span>
          </SidebarMenuButton>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Other</SidebarGroupLabel>
          <SidebarMenuButton className="p-5 text-md font-semibold" isActive={path.includes('ai')}>
            <Sparkle/>
            <span>AI-Assistents</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 text-md mt-2 font-semibold" isActive={path.includes('settings')}>
            <Settings/>
            <span>Settings</span>
          </SidebarMenuButton>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Button
            // variant="ghost"
            className="text-md  font-semibold w-full justify-start text-sidebar-foreground"
          >
            + Create New Board
          </Button>
          <div className="p-4 my-3 border rounded-md">
             <h2 className="text-sm flex justify-between mb-1">2 file created<span>total 3</span></h2>
             <Progress value={62} className="h-2 mt-3"/>
          </div>
         <div className="flex items-center gap-2 p-4 border rounded-xl">
            {user?.imageUrl && <Image src={user.imageUrl} alt="upgrade" width={40} height={40} className="rounded-full"/>}
         <h2>{user?.firstName} {user?.lastName}</h2>

         </div>
      </SidebarFooter>
    </Sidebar>
  );
}