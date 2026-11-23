"use client"
import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import {
  ArrowRight, Code2, Download, Lock, MousePointerClick, Share2, Sparkles, Wand2,
} from 'lucide-react'
import { ThemeToggle } from '@/components/custom/dashboard/ThemeToggle'
import DemoBoard, { type DemoPhase } from './DemoBoard'

const FEATURES = [
  { icon: Wand2, title: 'AI diagrams', text: 'Describe a flowchart, mind map or wireframe. AI draws it on your board.' },
  { icon: Code2, title: 'Code to flowchart', text: 'Paste code with loops and conditions. See how it really runs, step by step.' },
  { icon: MousePointerClick, title: 'Floating toolbar', text: 'Select anything to change colors, fonts and layers right where you work.' },
  { icon: Share2, title: 'View-only links', text: 'Share a board with one link. Viewers can look, not change.' },
  { icon: Download, title: 'Autosave and export', text: 'Every change is saved. Export a clean PNG when you need it.' },
  { icon: Lock, title: 'Private by default', text: 'Your boards are yours. Sign in to open them, share only what you choose.' },
]

function LandingPage() {
  const router = useRouter()
  const { isLoaded, isSignedIn } = useUser()
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const [playToken, setPlayToken] = useState(0)

  // Signed in: straight to the dashboard. Otherwise the (locked) Clerk sign-in page.
  const entryUrl = isLoaded && isSignedIn ? '/dashboard' : '/sign-in'
  const startLabel = isLoaded && isSignedIn ? 'Open dashboard' : 'Get started'

  const play = () => setPlayToken((t) => t + 1)
  const start = () => router.push(entryUrl)

  // Enter: play the demo first, then (when it is done) go to sign in
  const keyRef = useRef({ phase, play, start })
  keyRef.current = { phase, play, start }
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' || e.repeat) return
      const target = e.target as HTMLElement
      // Let Enter work normally on links / buttons / inputs
      if (target.closest('a, button, input, textarea, select')) return
      e.preventDefault()
      const { phase, play, start } = keyRef.current
      if (phase === 'idle') play()
      else if (phase === 'done') start()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <main className='min-h-screen overflow-x-hidden bg-gradient-to-b from-indigo-50/60 via-background to-background text-foreground dark:from-indigo-950/30'>
      {/* Nav */}
      <header className='mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6'>
        <Link href='/' className='flex items-center gap-2'>
          <Image src='/logo.svg' alt='SafedBoard' width={36} height={36} />
          <span className='text-lg font-bold'>SafedBoard</span>
        </Link>
        <div className='flex items-center gap-2'>
          <ThemeToggle />
          {isLoaded && isSignedIn ? (
            <Link href='/dashboard' className='rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90'>
              Dashboard
            </Link>
          ) : (
            <>
              <Link href='/sign-in' className='hidden rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground transition hover:text-foreground sm:block'>
                Sign in
              </Link>
              <Link href='/sign-up' className='rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90'>
                Sign up
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className='mx-auto max-w-6xl px-4 pt-10 text-center sm:px-6 sm:pt-16'>
        <p className='landing-up mx-auto mb-5 flex w-fit items-center gap-2 rounded-full border border-indigo-200 bg-white/70 px-3 py-1 text-xs font-medium text-indigo-600 dark:border-indigo-900 dark:bg-indigo-950/40 dark:text-indigo-300'>
          <Sparkles className='h-3.5 w-3.5' /> AI whiteboard for your ideas
        </p>
        <h1 className='landing-up mx-auto max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl' style={{ animationDelay: '80ms' }}>
          Sketch the idea.{' '}
          <span className='bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent'>
            Let AI draw the rest.
          </span>
        </h1>
        <p className='landing-up mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg' style={{ animationDelay: '160ms' }}>
          A whiteboard that turns a sentence into a flowchart and your code into a diagram you can read. Draw, explain and share in one place.
        </p>
        <div className='landing-up mt-8 flex flex-wrap items-center justify-center gap-3' style={{ animationDelay: '240ms' }}>
          <Link href={entryUrl} className='flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:scale-[1.03]'>
            {startLabel} <ArrowRight className='h-4 w-4' />
          </Link>
          <button
            type='button'
            onClick={() => {
              document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              play()
            }}
            className='rounded-xl border bg-background/70 px-6 py-3 text-sm font-semibold transition hover:bg-muted'
          >
            Watch demo
          </button>
        </div>
        <p className='landing-up mt-4 text-xs text-muted-foreground' style={{ animationDelay: '320ms' }}>
          Press <kbd className='rounded border bg-background px-1.5 py-0.5 font-mono'>Enter ↵</kbd> to play the demo
          {phase === 'done' ? ', then again to start' : ''}
        </p>
      </section>

      {/* Demo "video" */}
      <section id='demo' className='landing-up mx-auto mt-12 max-w-5xl px-4 sm:px-6' style={{ animationDelay: '400ms' }}>
        <div className='rounded-3xl bg-gradient-to-br from-indigo-200/60 via-transparent to-purple-200/60 p-2 sm:p-3 dark:from-indigo-900/40 dark:to-purple-900/40'>
          <DemoBoard
            phase={phase}
            onPhaseChange={setPhase}
            playToken={playToken}
            onPlay={play}
            onStart={start}
            startLabel={startLabel}
          />
        </div>
      </section>

      {/* Features */}
      <section className='mx-auto max-w-6xl px-4 py-20 sm:px-6'>
        <h2 className='text-center text-2xl font-bold sm:text-3xl'>Everything on one board</h2>
        <p className='mx-auto mt-2 max-w-xl text-center text-muted-foreground'>
          From a rough idea to a diagram your team understands.
        </p>
        <div className='mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className='rounded-2xl border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-md'>
              <div className='mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300'>
                <Icon className='h-5 w-5' />
              </div>
              <h3 className='font-semibold'>{title}</h3>
              <p className='mt-1 text-sm text-muted-foreground'>{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final call to action */}
      <section className='mx-auto max-w-6xl px-4 pb-20 sm:px-6'>
        <div className='rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 p-8 text-center text-white sm:p-12'>
          <h2 className='text-2xl font-bold sm:text-3xl'>Your next idea starts on a blank board</h2>
          <p className='mx-auto mt-2 max-w-lg text-white/80'>10 free AI credits every month. No card needed.</p>
          <Link href={entryUrl} className='mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-indigo-600 transition hover:scale-[1.03]'>
            {startLabel} <ArrowRight className='h-4 w-4' />
          </Link>
        </div>
      </section>

      <footer className='border-t py-6 text-center text-xs text-muted-foreground'>
        © {new Date().getFullYear()} SafedBoard
      </footer>
    </main>
  )
}

export default LandingPage
