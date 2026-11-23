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
import Link from "next/link";
import { Archive, FileIcon, LayoutGrid, Settings, Sparkle, UserRound } from "lucide-react";
import { usePathname } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/nextjs";
import CreatenewBoardDialog from "./CreatenewBoardDialog";
import { useContext } from "react";
import { UserDetailContext } from "@/context/UserDetailContext";
import { Skeleton } from "@/components/ui/skeleton";
import { FREE_AI_CREDITS, getNextCreditReset } from "@/lib/plans";
import { format } from "date-fns";



export function AppSidebar() {
  
  const path=usePathname();
  const {user}=useUser();
  const { userDetails } = useContext(UserDetailContext);

  // Number() because the value comes from JSON
  const aiCredits = Number(userDetails?.credits ?? 0);

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
          <CreatenewBoardDialog/>
          
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>My Board</SidebarGroupLabel>
          {/* Exact match, so "All File" is not highlighted on /dashboard/archive */}
          <SidebarMenuButton className="p-5 text-md font-semibold" isActive={path === '/dashboard'} render={<Link href="/dashboard" />}>
            <LayoutGrid/>
            <span>All File</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 text-md mt-2 font-semibold" isActive={path.includes('dashboard/shared-files')}>
            <UserRound/>
            <span>Shared</span>
          </SidebarMenuButton>
          <SidebarMenuButton className="p-5 text-md mt-2 font-semibold" isActive={path.includes('dashboard/archive')} render={<Link href="/dashboard/archive" />}>
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
        <CreatenewBoardDialog/>
          <div className="p-4 my-3 border rounded-md">
            {!userDetails ? (
              <Skeleton className="h-12 w-full" />
            ) : (
              <>
                <div>
                  <h2 className="text-sm flex justify-between">
                    AI credits left<span>{aiCredits} / {FREE_AI_CREDITS}</span>
                  </h2>
                  <Progress value={(aiCredits / FREE_AI_CREDITS) * 100} className="h-2 mt-2"/>
                  <p className="text-xs text-muted-foreground mt-1">
                    Resets on {format(getNextCreditReset(), "d MMM")}
                  </p>
                </div>
              </>
            )}
          </div>
         <div className="flex items-center gap-2 p-4 border rounded-xl">
            {user?.imageUrl && <Image src={user.imageUrl} alt="upgrade" width={40} height={40} className="rounded-full"/>}
         <h2>{user?.firstName} {user?.lastName}</h2>

         </div>
      </SidebarFooter>
    </Sidebar>
  );
}