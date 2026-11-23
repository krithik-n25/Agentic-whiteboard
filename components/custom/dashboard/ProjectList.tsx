"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { Archive, ArchiveRestore, Loader2, PenTool, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CreatenewBoardDialog from './CreatenewBoardDialog';

type Project = {
  id: number;
  projectId: string;
  projectName: string;
  previewImage: string | null;
  updatedAt: string;
}

type Props = {
  // true on the archive page: shows archived boards with a Restore button
  archived?: boolean;
}

function ProjectList({ archived = false }: Props) {

  const [ProjectList, setProjectList] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  // Project waiting for the user to confirm the delete
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [deleting, setDeleting] = useState(false);
  // Card being archived / restored, so its button can show a spinner
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    GetProjectList();
  }, []);

  const GetProjectList = async () => {
    try {
      const result = await axios.get('/api/projects', { params: archived ? { archived: true } : {} });
      setProjectList(result.data);
    } catch (error) {
      console.error("Failed to load projects", error);
      toast.add({ title: "Could not load your boards", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Permanent delete, only after the user confirms in the dialog
  const HandleDeleteProject = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await axios.delete('/api/projects', { data: { projectId: deleteTarget.projectId } });
      toast.add({ title: "Board deleted", type: "success" });
      setDeleteTarget(null);
      GetProjectList();
    } catch (error) {
      console.error("Failed to delete project", error);
      toast.add({ title: "Could not delete board", type: "error" });
    } finally {
      setDeleting(false);
    }
  };

  // Archive / restore happens right away, no dialog (it can be undone)
  const HandleArchiveToggle = async (project: Project) => {
    // On the archive page the button restores, on the dashboard it archives
    const archive = !archived;
    try {
      setArchivingId(project.projectId);
      await axios.patch('/api/projects', { projectId: project.projectId, archived: archive });
      toast.add(archive
        ? { title: "Board archived", description: `"${project.projectName}" moved to archive`, type: "success" }
        : { title: "Board restored", description: `"${project.projectName}" is back on your dashboard`, type: "success" });
      GetProjectList();
    } catch (error) {
      console.error("Failed to update archive state", error);
      toast.add({ title: archive ? "Could not archive board" : "Could not restore board", type: "error" });
    } finally {
      setArchivingId(null);
    }
  };

  // Skeleton while loading, so the empty state does not flash first
  if (loading) {
    return (
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-10'>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} className='aspect-[4/3] rounded-xl' />
        ))}
      </div>
    );
  }

  return (
    <div>
      {ProjectList.length === 0 && archived ? (
        <div className='flex flex-col items-center gap-2 mt-8 border-2 rounded-xl p-10 text-center'>
          <Archive className='h-10 w-10 text-muted-foreground' />
          <h1 className='text-2xl font-bold'>No archived boards</h1>
          <p className='text-muted-foreground'>Boards you archive will show up here.</p>
        </div>
      ) : ProjectList.length === 0 ? (
        <div className='flex flex-col items-center p-10 gap-4 mt-8 border-2 rounded-xl p-10'>
          <Image src="/image.png" alt="Folder Image" width={50} height={50} />
          <div className='text-center'>
            <h1 className='text-2xl font-bold'>No Board Found</h1>
            <p className='text-muted-foreground mb-2'>Create Your First board, start planning!</p>
            <CreatenewBoardDialog />
          </div>
        </div>
      ) :
        <div className='mt-10'>
          <h2 className='text-2xl font-bold'>{archived ? 'Archived Boards' : 'Your Boards'}</h2>
          <p className='text-muted-foreground'>
            {archived
              ? 'Restore a board to bring it back to your dashboard.'
              : 'Create, organize and continue working on your ideas.'}
          </p>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-3'>
            {ProjectList.map((project) => (
              <div
                key={project.projectId}
                onClick={() => router.push(`/workspace/${project.projectId}`)}
                className='group cursor-pointer overflow-hidden rounded-xl border bg-card transition hover:shadow-md hover:border-primary/40'
              >
                {/* Preview: base64 data URL, so a plain img (next/image cannot optimize it) */}
                <div className='aspect-video border-b bg-muted'>
                  {project.previewImage ? (
                    <img
                      src={project.previewImage}
                      alt={project.projectName}
                      className='h-full w-full object-cover'
                    />
                  ) : (
                    <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                      <PenTool className='h-8 w-8' />
                    </div>
                  )}
                </div>

                <div className='flex items-end justify-between gap-2 p-3'>
                  <div className='min-w-0'>
                    <h2 className='truncate font-medium'>{project.projectName}</h2>
                    <p className='text-xs text-muted-foreground'>
                      Edited {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}
                    </p>
                  </div>
                  {/* stopPropagation: these buttons should not open the workspace */}
                  <div className='flex shrink-0 items-center'>
                    <Button
                      variant='ghost'
                      size='icon'
                      title={archived ? 'Restore' : 'Archive'}
                      disabled={archivingId === project.projectId}
                      className='text-muted-foreground hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-950/40'
                      onClick={(e) => {
                        e.stopPropagation();
                        HandleArchiveToggle(project);
                      }}
                    >
                      {archivingId === project.projectId
                        ? <Loader2 className='h-4 w-4 animate-spin' />
                        : archived
                          ? <ArchiveRestore className='h-4 w-4' />
                          : <Archive className='h-4 w-4' />}
                    </Button>
                    <Button
                      variant='ghost'
                      size='icon'
                      title='Delete'
                      className='text-muted-foreground hover:text-destructive'
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteTarget(project);
                      }}
                    >
                      <Trash2 className='h-4 w-4' />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => { if (!open && !deleting) setDeleteTarget(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this board?</AlertDialogTitle>
            <AlertDialogDescription>
              "{deleteTarget?.projectName}" and its whiteboard will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' disabled={deleting} onClick={HandleDeleteProject}>
              {deleting && <Loader2 className='animate-spin' />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default ProjectList
