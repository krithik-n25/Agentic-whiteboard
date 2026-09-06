import { SidebarTrigger } from "@/components/ui/sidebar"
import { UserButton } from "@clerk/nextjs"
import { ThemeToggle } from "./ThemeToggle"
import React from "react"

function AppHeader() {
  return (
    <div className="w-full flex justify-between border-b p-4 items-center">
      
      {/* Left side */}
      <SidebarTrigger />

      {/* Right side */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <UserButton />
      </div>

    </div>
  )
}

export default AppHeader