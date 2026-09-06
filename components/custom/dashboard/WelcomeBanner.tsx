"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { Sparkles, ArrowRight } from "lucide-react"
import CreatenewBoardDialog from "./CreatenewBoardDialog"

function WelcomeBanner() {
  const { user } = useUser()

  return (
    <div>
      <div className=" relative rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/70 via-white to-purple-50/80 p-8 dark:border-blue-900/40 dark:from-blue-950/30 dark:via-background dark:to-purple-950/30">

        {/* Small heading */}
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400">
          <Sparkles className="h-5 w-5" />
          <span>Your creative workspace</span>
        </div>

        {/* Main heading */}
        <h2 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-purple-600/80 to-blue-500 bg-clip-text text-transparent">
            {user?.firstName || user?.fullName}
          </span>
          <span className="ml-1">👋</span>
        </h2>

        {/* Description */}
        <p className="mt-3 text-base text-slate-600 dark:text-slate-300">
          Turn your ideas into diagrams, notes and visuals on an infinite canvas.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex items-center gap-3">
          <CreatenewBoardDialog/>

          <Button
            variant="outline"
            className="h-11 rounded-xl border-slate-200 bg-white px-5 text-base font-medium text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-background dark:text-white"
          >
            <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
            Ask AI
          </Button>
        </div>
        <div className="absolute right-8 top-1/2 hidden -translate-y-1/2 lg:block">

          {/* Browser Window */}
          <div className="h-[160px] w-[260px] rounded-2xl border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/50">

            {/* Window dots */}
            <div className="mb-2 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-red-400" />
              <span className="h-2 w-2 rounded-full bg-yellow-400" />
              <span className="h-2 w-2 rounded-full bg-green-400" />
            </div>

            <div>
              <p className="h-px w-full bg-gray-300 mb-5"></p>
            </div>

            {/* Top pills */}
            <div className="flex items-center justify-center gap-2">
              
              <div className="-rotate-5 h-9 mr-3 mb-2 rounded-lg bg-yellow-100 px-3 py-2 text-[9px] font-medium text-slate-700">
                New Idea ✨
              </div>

              <div className="rotate-5 h-9 mb-2 rounded-lg bg-purple-100 px-3 py-2 text-[9px] font-medium text-slate-700">
                AI Brainstorm
              </div>

            </div>

            {/* Bottom pill */}
            <div className="mt-3 flex justify-center">
              <div className="h-9 w-30 rounded-lg bg-blue-50 px-4 py-1.5 text-[8px] font-medium text-slate-600">
                Design → Build → Ship
              </div>
            </div>  

          </div>
        </div>  
      </div>
    </div>
  )
}

export default WelcomeBanner