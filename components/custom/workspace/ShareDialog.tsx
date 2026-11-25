"use client"
import React, { useState } from 'react'
import axios from 'axios'
import { Check, Copy, Globe, Loader2, Lock } from 'lucide-react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'

type Props = {
    projectId: string;
    isPublic: boolean;
    onChange: (isPublic: boolean) => void;
    // Controlled: the header's "more" menu opens it. The dialog lives outside the menu,
    // so closing the menu does not unmount it.
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

// Share dialog: turn the view-only link on / off and copy it
function ShareDialog({ projectId, isPublic, onChange, open, onOpenChange }: Props) {
    const [updating, setUpdating] = useState(false);
    const [copied, setCopied] = useState(false);

    const shareUrl = typeof window !== 'undefined'
        ? `${window.location.origin}/share/${projectId}`
        : '';

    const toggleSharing = async (next: boolean) => {
        try {
            setUpdating(true);
            const result = await axios.post('/api/projects/share', { projectId, isPublic: next });
            onChange(result.data.isPublic);
            toast.add(next
                ? { title: "Link sharing on", description: "Anyone with the link can view this board.", type: "success" }
                : { title: "Link sharing off", description: "The link does not work anymore.", type: "success" });
        } catch (error) {
            console.error("Failed to update sharing", error);
            toast.add({ title: "Could not change sharing", type: "error" });
        } finally {
            setUpdating(false);
        }
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.add({ title: "Link copied", type: "success" });
        } catch {
            toast.add({ title: "Could not copy", description: "Select the link and copy it.", type: "error" });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Share board</DialogTitle>
                    <DialogDescription>
                        People with the link can view the board, but cannot change it. No login needed.
                    </DialogDescription>
                </DialogHeader>

                <div className='flex items-center justify-between gap-3 rounded-lg border p-3'>
                    <div className='flex items-center gap-3'>
                        <div className={`rounded-full p-2 ${isPublic ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {isPublic ? <Globe className='h-4 w-4' /> : <Lock className='h-4 w-4' />}
                        </div>
                        <div>
                            <p className='text-sm font-medium'>
                                {isPublic ? 'Anyone with the link can view' : 'Only you'}
                            </p>
                            <p className='text-xs text-muted-foreground'>
                                {isPublic ? 'Viewers see the last saved version.' : 'Turn on to get a view-only link.'}
                            </p>
                        </div>
                    </div>
                    {updating
                        ? <Loader2 className='h-4 w-4 animate-spin' />
                        : <Switch checked={isPublic} onCheckedChange={toggleSharing} />}
                </div>

                {isPublic && (
                    <div className='flex gap-2'>
                        <Input readOnly value={shareUrl} onFocus={(e) => e.target.select()} />
                        <Button onClick={copyLink} className='shrink-0'>
                            {copied ? <Check /> : <Copy />} {copied ? 'Copied' : 'Copy'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    )
}

export default ShareDialog
