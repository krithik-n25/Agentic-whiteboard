"use client"
import Image from 'next/image'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Save, Share } from 'lucide-react'

type Props={
    selectedTab:any;
    
}
function WorkspaceHeader({selectedTab}:Props) {
    return (
        <div className='p-3 border-b flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
                <Image src="/logo.svg" alt="logo" width={60} height={59} />
                <h2 className='font-semibold text-lg'>Workspace Name</h2>
            </div>
            {/* Switch theme */}
            <div >
                <Tabs defaultValue="WhiteBoard" onValueChange={(value)=>selectedTab(value)}>
                    <TabsList>
                        <TabsTrigger value="WhiteBoard">WhiteBoard</TabsTrigger>
                        <TabsTrigger value="Docs">Docs</TabsTrigger>
                    </TabsList>
                    
                </Tabs>

            </div>
            {/* Extra swtich */}
            <div className='gap-2 flex'>
                <Button><Save/> Save</Button> 
                <Button variant={'outline'}><Share/> Share</Button>
            </div>
        </div>
    )
}

export default WorkspaceHeader