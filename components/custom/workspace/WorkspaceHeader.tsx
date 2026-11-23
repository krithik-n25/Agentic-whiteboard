"use client"
import Image from 'next/image'
import React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import { Check, CircleAlert, Download, Loader2, Save } from 'lucide-react'
import ShareDialog from './ShareDialog'

type Props={
    selectedTab:any;
    activeTab:string; // controlled, so the page can switch tabs (Code -> WhiteBoard)
    onExport:()=>void;
    canExport:boolean;
    projectName:string;
    onSave:()=>void;
    saveStatus:"saved"|"unsaved"|"saving"|"error";
    canSave:boolean;
    projectId:string;
    isPublic:boolean;
    onShareChange:(isPublic:boolean)=>void;
}

// Small text next to the Save button
const STATUS_TEXT = {
    saved: "All changes saved",
    unsaved: "Unsaved changes",
    saving: "Saving...",
    error: "Save failed",
}
function WorkspaceHeader({selectedTab,activeTab,onExport,canExport,projectName,onSave,saveStatus,canSave,projectId,isPublic,onShareChange}:Props) {
    return (
        <div className='p-3 border-b flex items-center justify-between'>
            <div className='flex gap-2 items-center'>
                <Image src="/logo.svg" alt="logo" width={60} height={59} />
                <h2 className='font-semibold text-lg'>{projectName || 'Loading...'}</h2>
            </div>
            {/* Switch theme */}
            <div >
                <Tabs value={activeTab} onValueChange={(value)=>selectedTab(value)}>
                    <TabsList>
                        <TabsTrigger value="WhiteBoard">WhiteBoard</TabsTrigger>
                        <TabsTrigger value="Code">Code</TabsTrigger>
                    </TabsList>
                    
                </Tabs>

            </div>
            {/* Extra swtich */}
            <div className='gap-2 flex items-center'>
                {canSave && (
                    <span className={`hidden md:flex items-center gap-1 text-xs ${saveStatus === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {saveStatus === 'saved' && <Check className='h-3.5 w-3.5'/>}
                        {saveStatus === 'error' && <CircleAlert className='h-3.5 w-3.5'/>}
                        {STATUS_TEXT[saveStatus]}
                    </span>
                )}
                <Button variant={'outline'} onClick={onExport} disabled={!canExport}><Download/> Export</Button>
                <Button onClick={onSave} disabled={!canSave || saveStatus === 'saving'} title='Save now (Ctrl+S)'>
                    {saveStatus === 'saving' ? <Loader2 className='animate-spin'/> : <Save/>} Save
                </Button> 
                {/* Disabled until the project is loaded (and we know if it is shared) */}
                <ShareDialog projectId={projectId} isPublic={isPublic} onChange={onShareChange} disabled={!canSave} />
            </div>
        </div>
    )
}

export default WorkspaceHeader