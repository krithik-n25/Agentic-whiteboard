"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Input } from "@/components/ui/input"
import { Loader2, Plus } from 'lucide-react'
import { toast } from '@/components/ui/toast'
import axios from 'axios'
import { useRouter } from 'next/navigation'


function CreatenewBoardDialog() {

    const [WorkspaceName, setWorkspaceName] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const route=useRouter();

    const handlecreateboard = async () => {
        if (WorkspaceName.trim() === "" || WorkspaceName.length > 30) {
            toast.add({
                title: "Error",
                description: "Workspace Name must be between 1 and 30 characters",
                type: "error"
            })
            return;
        }
        try {
            setLoading(true);
            const projectID = crypto.randomUUID();

            const result = await axios.post('/api/projects', {
                projectName: WorkspaceName,
                projectId: projectID
            })

            console.log(result?.data);
            toast.add({
                title: "New Workspace Created",
                type: "success"
            })
            setWorkspaceName("");
            setOpen(false);
            route.push(`/workspace/${result?.data?.projectId}`)
        } catch (error) {
            console.error("Failed to create board:", error);
            toast.add({
                title: "Error",
                description: "Failed to create board. Please try again.",
                type: "error"
            })
        } finally {
            setLoading(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={<Button />}>
                <Plus /> Create New Board
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle className="text-lg font-bold">Workspace Name</DialogTitle>
                </DialogHeader>
                <div>
                    <label className='text-sm text-gray-500'>Enter Workspace Name</label>
                    <Input
                        placeholder='Workspace'
                        className='mt-2'
                        value={WorkspaceName}
                        onChange={(e) => setWorkspaceName(e.target.value)}
                    />
                </div>
                <DialogFooter>
                    <DialogClose render={<Button variant="outline" />}>
                        Cancel
                    </DialogClose>
                    <Button
                        disabled={WorkspaceName.trim().length === 0 || loading}
                        onClick={handlecreateboard}
                    >
                        {loading && <Loader2 className='animate-spin' />}
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreatenewBoardDialog