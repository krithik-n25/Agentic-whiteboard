"use client"
import React, { useContext, useEffect, useState } from 'react'
import Image from 'next/image'
import axios from 'axios'
import { format } from 'date-fns'
import { useTheme } from 'next-themes'
import { useClerk, useUser } from '@clerk/nextjs'
import { Loader2, LogOut, Monitor, Moon, RotateCcw, Sun, Trash2, UserCog } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Switch } from '@/components/ui/switch'
import { toast } from '@/components/ui/toast'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { UserDetailContext } from '@/context/UserDetailContext'
import { FREE_AI_CREDITS, getNextCreditReset } from '@/lib/plans'
import {
  AUTOSAVE_OPTIONS,
  DEFAULT_SETTINGS,
  updateSettings,
  useSettings,
} from '@/lib/settings'

/* ---------- small pieces ---------- */

function Section({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <section className='rounded-xl border bg-card p-5'>
      <h2 className='text-lg font-semibold'>{title}</h2>
      <p className='mb-4 text-sm text-muted-foreground'>{description}</p>
      <div className='flex flex-col divide-y'>{children}</div>
    </section>
  )
}

function Row({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className='flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between'>
      <div>
        <p className='text-sm font-medium'>{label}</p>
        {hint && <p className='text-xs text-muted-foreground'>{hint}</p>}
      </div>
      <div className='shrink-0'>{children}</div>
    </div>
  )
}

// Row of buttons, one is selected
function Segmented<T extends string | number>({
  options,
  value,
  onChange,
}: {
  options: { label: React.ReactNode; value: T; style?: React.CSSProperties }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className='inline-flex flex-wrap gap-1 rounded-lg bg-muted p-1'>
      {options.map((option) => (
        <button
          key={String(option.value)}
          type='button'
          style={option.style}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition ${
            value === option.value
              ? 'bg-background font-medium shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  )
}

/* ---------- page ---------- */

function SettingsPage() {
  const settings = useSettings()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const { user } = useUser()
  const { openUserProfile, signOut } = useClerk()
  const { userDetails } = useContext(UserDetailContext)

  const [archivedCount, setArchivedCount] = useState<number | null>(null)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // next-themes knows the theme only in the browser
  useEffect(() => setMounted(true), [])

  useEffect(() => {
    loadArchivedCount()
  }, [])

  const loadArchivedCount = async () => {
    try {
      const result = await axios.get('/api/projects', { params: { archived: true } })
      setArchivedCount(result.data.length)
    } catch {
      setArchivedCount(null)
    }
  }

  const deleteAllArchived = async () => {
    try {
      setDeleting(true)
      const result = await axios.delete('/api/projects/archived')
      toast.add({ title: `${result.data.deleted} archived boards deleted`, type: 'success' })
      setConfirmDelete(false)
      setArchivedCount(0)
    } catch (error) {
      console.error('Failed to delete archived boards', error)
      toast.add({ title: 'Could not delete archived boards', type: 'error' })
    } finally {
      setDeleting(false)
    }
  }

  const resetSettings = () => {
    updateSettings(DEFAULT_SETTINGS)
    setTheme('light')
    toast.add({ title: 'Settings reset to default', type: 'success' })
  }

  const aiCredits = Number(userDetails?.credits ?? 0)

  return (
    <div className='mx-auto flex max-w-3xl flex-col gap-6 pb-10'>
      <div>
        <h1 className='text-2xl font-bold'>Settings</h1>
        <p className='text-muted-foreground'>Saved in this browser. Changes apply right away.</p>
      </div>

      {/* Appearance */}
      <Section title='Appearance' description='How the app looks.'>
        <Row label='Theme'>
          {mounted && (
            <Segmented
              value={theme ?? 'light'}
              onChange={setTheme}
              options={[
                { value: 'light', label: <><Sun className='h-4 w-4' /> Light</> },
                { value: 'dark', label: <><Moon className='h-4 w-4' /> Dark</> },
                { value: 'system', label: <><Monitor className='h-4 w-4' /> System</> },
              ]}
            />
          )}
        </Row>
        <Row label='Text size' hint='Makes the whole app smaller or bigger.'>
          <Segmented
            value={settings.textSize}
            onChange={(textSize) => updateSettings({ textSize })}
            options={[
              { value: 'sm', label: 'Small' },
              { value: 'md', label: 'Default' },
              { value: 'lg', label: 'Large' },
              { value: 'xl', label: 'Extra large' },
            ]}
          />
        </Row>
        <Row label='Font' hint='Font of the app (not the whiteboard).'>
          <Segmented
            value={settings.font}
            onChange={(font) => updateSettings({ font })}
            options={[
              { value: 'inter', label: 'Inter', style: { fontFamily: 'var(--font-inter)' } },
              { value: 'poppins', label: 'Poppins', style: { fontFamily: 'var(--font-poppins)' } },
              { value: 'nunito', label: 'Nunito', style: { fontFamily: 'var(--font-nunito)' } },
              { value: 'system', label: 'System', style: { fontFamily: 'system-ui' } },
            ]}
          />
        </Row>
      </Section>

      {/* Whiteboard */}
      <Section title='Whiteboard' description='Applied when you open a board.'>
        <Row label='Grid' hint='Show a grid on the canvas. Shapes snap to it.'>
          <Switch checked={settings.grid} onCheckedChange={(grid) => updateSettings({ grid })} />
        </Row>
        <Row label='Default text font' hint='Font for new text you add on the board.'>
          <Segmented
            value={settings.canvasFont}
            onChange={(canvasFont) => updateSettings({ canvasFont })}
            options={[
              { value: 'hand', label: 'Hand-drawn' },
              { value: 'normal', label: 'Normal' },
              { value: 'code', label: 'Code' },
            ]}
          />
        </Row>
        <Row label='Autosave' hint='How long after your last change the board saves.'>
          <Segmented
            value={settings.autosaveSeconds}
            onChange={(autosaveSeconds) => updateSettings({ autosaveSeconds })}
            options={AUTOSAVE_OPTIONS.map((seconds) => ({ value: seconds, label: `${seconds} sec` }))}
          />
        </Row>
      </Section>

      {/* Account + AI credits */}
      <Section title='Account' description='Your profile and AI usage.'>
        <Row label='Profile'>
          <div className='flex items-center gap-3'>
            {user?.imageUrl && (
              <Image src={user.imageUrl} alt='Profile' width={40} height={40} className='rounded-full' />
            )}
            <div className='text-right sm:text-left'>
              <p className='text-sm font-medium'>{user?.fullName || user?.firstName}</p>
              <p className='text-xs text-muted-foreground'>{user?.primaryEmailAddress?.emailAddress}</p>
            </div>
          </div>
        </Row>
        <Row label='AI credits' hint={`1 credit per AI diagram or code flowchart. Resets on ${format(getNextCreditReset(), 'd MMM')}.`}>
          <div className='w-48'>
            <p className='mb-1 text-right text-sm'>{aiCredits} / {FREE_AI_CREDITS} left</p>
            <Progress value={(aiCredits / FREE_AI_CREDITS) * 100} className='h-2' />
          </div>
        </Row>
        <Row label='Manage account' hint='Name, photo, email, password and connected accounts.'>
          <div className='flex gap-2'>
            <Button variant='outline' onClick={() => openUserProfile()}>
              <UserCog /> Manage
            </Button>
            <Button variant='outline' onClick={() => signOut({ redirectUrl: '/' })}>
              <LogOut /> Sign out
            </Button>
          </div>
        </Row>
      </Section>

      {/* Data */}
      <Section title='Data' description='Clean up your boards and settings.'>
        <Row
          label='Delete all archived boards'
          hint={archivedCount === null ? 'Permanently deletes every archived board.' : `${archivedCount} archived boards. This cannot be undone.`}
        >
          <Button
            variant='destructive'
            disabled={!archivedCount}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 /> Delete all
          </Button>
        </Row>
        <Row label='Reset settings' hint='Back to the default theme, size, font and whiteboard options.'>
          <Button variant='outline' onClick={resetSettings}>
            <RotateCcw /> Reset
          </Button>
        </Row>
      </Section>

      <AlertDialog open={confirmDelete} onOpenChange={(open) => { if (!deleting) setConfirmDelete(open) }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete {archivedCount} archived boards?</AlertDialogTitle>
            <AlertDialogDescription>
              They and their whiteboards will be permanently deleted. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant='destructive' disabled={deleting} onClick={deleteAllArchived}>
              {deleting && <Loader2 className='animate-spin' />}
              Delete all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default SettingsPage
