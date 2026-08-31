import { SidebarTrigger } from '@/components/ui/sidebar'
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function AppHeader() {
  return (
    <div className='w-full flex justify-between border-b p-4 items-center'>
        <SidebarTrigger/>
        <UserButton/>
    </div>
  )
}

export default AppHeader