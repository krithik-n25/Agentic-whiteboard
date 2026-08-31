"use client"
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs'
import { Sparkle } from 'lucide-react';
import React from 'react'

function WelcomeBanner() {
  const { user } = useUser();
  return (
    <div>
      <div className="border border-blue-100 rounded-2xl p-8  bg-gradient-to-br from-blue-100/40 to-purple-100/90 dark:from-blue-950/30 dark:to-violet-950/30">
        <h2 className='text-3xl font-bold text-brand dark:text-white'>Welcome {user?.fullName}</h2>
        <p className='text-text mt-2'>Bring Idea to Life with AI</p>
        <div className="mt-5 flex items-center gap-4 mt-4">
          <Button className="bg-blue-600 hover:bg-blue-800">+ Create New Board</Button>
          <Button variant="outline" className="dark:text-white"><Sparkle/> Create with AI</Button>
          
        </div>
      </div>
    </div>
  )
}

export default WelcomeBanner