"use client"
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Check, CircleAlert, Download, Loader2, MoreHorizontal, Save, Share } from 'lucide-react'
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
    // Logo -> dashboard. The page saves unsaved changes first (and may cancel the navigation).
    onLogoClick:(e:React.MouseEvent<HTMLAnchorElement>)=>void;
    leaving:boolean; // saving before going to the dashboard
}

// Small text next to the Save button
const STATUS_TEXT = {
    saved: "All changes saved",
    unsaved: "Unsaved changes",
    saving: "Saving...",
    error: "Save failed",
}
// Pill-style tab switch (overrides only for this header, components/ui/tabs.tsx stays as is)
const PILL_LIST = 'h-8 rounded-full border border-border bg-muted/60 p-0.5 backdrop-blur-sm'
const PILL_TRIGGER = 'h-full rounded-full px-3 text-sm transition-colors duration-200 data-active:bg-background data-active:shadow-sm dark:data-active:bg-input/40 dark:data-active:border-transparent'

function WorkspaceHeader({selectedTab,activeTab,onExport,canExport,projectName,onSave,saveStatus,canSave,projectId,isPublic,onShareChange,onLogoClick,leaving}:Props) {
    // Share dialog state lives here, outside the menu, so the menu closing does not unmount it
    const [shareOpen, setShareOpen] = useState(false)

    return (
        <div className='p-2 md:p-3 border-b flex items-center justify-between gap-2'>
            <div className='flex flex-1 min-w-0 gap-2 items-center'>
                {/* A real link: keyboard (Tab + Enter), tap on mobile, Ctrl+click for a new tab */}
                <Tooltip>
                    <TooltipTrigger
                        render={
                            <Link
                                href="/dashboard"
                                onClick={onLogoClick}
                                aria-label="Back to dashboard"
                                aria-busy={leaving}
                                className={`shrink-0 cursor-pointer rounded-md outline-none focus-visible:ring-2 focus-visible:ring-ring ${leaving ? 'opacity-60' : ''}`}
                            />
                        }
                    >
                        <Image src="/logo.svg" alt="" width={60} height={59} className='w-9 h-auto md:w-[60px]' />
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                        {leaving ? 'Saving...' : 'Back to dashboard'}
                    </TooltipContent>
                </Tooltip>
                <h2 className='min-w-0 truncate font-semibold text-base md:text-lg' title={projectName}>{projectName || 'Loading...'}</h2>
            </div>
            {/* Switch theme */}
            <div className='shrink-0'>
                <Tabs value={activeTab} onValueChange={(value)=>selectedTab(value)}>
                    <TabsList className={PILL_LIST}>
                        <TabsTrigger value="WhiteBoard" className={PILL_TRIGGER}>WhiteBoard</TabsTrigger>
                        <TabsTrigger value="Code" className={PILL_TRIGGER}>Code</TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
            {/* Save status, Save, and the "more" menu (Export, Share) */}
            <div className='flex flex-1 justify-end gap-2 items-center'>
                {canSave && (
                    <span className={`hidden md:flex items-center gap-1 text-xs ${saveStatus === 'error' ? 'text-red-500' : 'text-muted-foreground'}`}>
                        {saveStatus === 'saved' && <Check className='h-3.5 w-3.5'/>}
                        {saveStatus === 'error' && <CircleAlert className='h-3.5 w-3.5'/>}
                        {STATUS_TEXT[saveStatus]}
                    </span>
                )}
                <Button onClick={onSave} disabled={!canSave || saveStatus === 'saving'} title='Save now (Ctrl+S)'>
                    {saveStatus === 'saving' ? <Loader2 className='animate-spin'/> : <Save/>} <span className='hidden sm:inline'>Save</span>
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant={'outline'} size={'icon'} aria-label='More options' />}>
                        <MoreHorizontal/>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align='end' className='w-44'>
                        <DropdownMenuItem onClick={onExport} disabled={!canExport}>
                            <Download/> Export as PNG
                        </DropdownMenuItem>
                        {/* Disabled until the project is loaded (and we know if it is shared) */}
                        <DropdownMenuItem onClick={()=>setShareOpen(true)} disabled={!canSave}>
                            <Share/> Share
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
                {/* Sibling of the menu, not inside it */}
                <ShareDialog projectId={projectId} isPublic={isPublic} onChange={onShareChange} open={shareOpen} onOpenChange={setShareOpen} />
            </div>
        </div>
    )
}

export default WorkspaceHeader