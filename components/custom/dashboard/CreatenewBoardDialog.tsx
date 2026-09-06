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
import { Plus } from 'lucide-react'
import { toast } from '@/components/ui/toast'


function CreatenewBoardDialog() {

    const [WorkspaceName, setWorkspaceName] = useState("");

    const handlecreateboard = () => {
        if (WorkspaceName.trim() === "" || WorkspaceName.length > 30) {
            toast.add({
                title:"Error",
                description:"Workspace Name must be between 1 and 30 characters",
                type:"error"
            })
            return;
        }
    }

    return (
        <Dialog>
            <DialogTrigger >
                <Button className="w-full gap-2">
                    <Plus /> Create New Board
                </Button>
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
                <DialogClose>
                        <Button variant="outline">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button disabled={WorkspaceName?.length===0}
                    onClick={handlecreateboard}>
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreatenewBoardDialog