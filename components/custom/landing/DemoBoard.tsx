"use client"
import React, { useEffect, useRef, useState } from 'react'
import {
  ArrowRight, Circle, Diamond, Download, Hand, MousePointer2, Pencil,
  Play, RotateCcw, Share, Sparkles, Square, Type, Workflow,
} from 'lucide-react'

/**
 * A short animated "video" of the app, made with HTML/SVG (no video file):
 * cursor moves to the AI button, clicks, types a prompt, clicks Generate,
 * and a flowchart draws itself on the board.
 */

export type DemoPhase =
  | 'idle'        // waiting for Play / Enter
  | 'toAI'        // cursor moves to the AI button
  | 'panel'       // AI panel opens
  | 'typing'      // prompt is typed
  | 'toGenerate'  // cursor moves to Generate
  | 'generating'  // "Generating with AI..." on the board
  | 'drawing'     // flowchart draws itself
  | 'done'        // finished, ready to start

const PROMPT = 'User login flow with validation'

// Cursor position (in % of the board) for each phase
const CURSOR: Record<DemoPhase, { x: number; y: number }> = {
  idle: { x: 48, y: 46 },
  toAI: { x: 91, y: 90 },
  panel: { x: 91, y: 90 },
  typing: { x: 91, y: 90 },
  toGenerate: { x: 80, y: 79 },
  generating: { x: 80, y: 79 },
  drawing: { x: 66, y: 30 },
  done: { x: 66, y: 30 },
}

// When each phase starts (ms after Play)
const TIMELINE: [DemoPhase, number][] = [
  ['toAI', 0],
  ['panel', 1100],
  ['typing', 1500],
  ['toGenerate', 2900],
  ['generating', 3900],
  ['drawing', 5100],
  ['done', 8000],
]

const ORDER: DemoPhase[] = ['idle', 'toAI', 'panel', 'typing', 'toGenerate', 'generating', 'drawing', 'done']
const reached = (phase: DemoPhase, step: DemoPhase) => ORDER.indexOf(phase) >= ORDER.indexOf(step)

type Props = {
  phase: DemoPhase
  onPhaseChange: (phase: DemoPhase) => void
  playToken: number // changes every time Play is pressed (restarts the demo)
  onPlay: () => void
  onStart: () => void // "Get started" after the demo
  startLabel: string
}

function DemoBoard({ phase, onPhaseChange, playToken, onPlay, onStart, startLabel }: Props) {
  const [typed, setTyped] = useState(0)
  const [ripple, setRipple] = useState(0) // changes on every "click"
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  // Run the timeline every time Play is pressed
  useEffect(() => {
    if (playToken === 0) return
    timers.current.forEach(clearTimeout)
    setTyped(0)

    // Reduced motion: jump straight to the finished board
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTyped(PROMPT.length)
      onPhaseChange('done')
      return
    }

    timers.current = TIMELINE.map(([step, at]) =>
      setTimeout(() => {
        onPhaseChange(step)
        if (step === 'panel' || step === 'generating') setRipple((r) => r + 1)
      }, at)
    )
    return () => timers.current.forEach(clearTimeout)
  }, [playToken])

  // Typing the prompt, one letter at a time
  useEffect(() => {
    if (phase !== 'typing') return
    const id = setInterval(() => {
      setTyped((t) => {
        if (t >= PROMPT.length) {
          clearInterval(id)
          return t
        }
        return t + 1
      })
    }, 38)
    return () => clearInterval(id)
  }, [phase])

  const cursor = CURSOR[phase]
  const panelOpen = reached(phase, 'panel') && !reached(phase, 'drawing')
  const showDiagram = reached(phase, 'drawing')

  return (
    <div className='relative aspect-[16/10] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-indigo-500/10 select-none dark:border-slate-800 dark:bg-slate-950'>
      {/* Top bar */}
      <div className='flex h-[9%] items-center justify-between border-b border-slate-100 px-[2.5%] dark:border-slate-800'>
        <div className='flex items-center gap-[6px]'>
          <span className='h-2 w-2 rounded-full bg-red-400' />
          <span className='h-2 w-2 rounded-full bg-amber-400' />
          <span className='h-2 w-2 rounded-full bg-green-400' />
          <span className='ml-3 text-[clamp(8px,1.3vw,13px)] font-semibold text-slate-700 dark:text-slate-200'>Product Launch</span>
        </div>
        <div className='flex items-center gap-2 text-[clamp(7px,1.1vw,11px)] text-slate-500'>
          <span className='hidden items-center gap-1 rounded-md border border-slate-200 px-2 py-0.5 sm:flex dark:border-slate-700'><Download className='h-3 w-3' /> Export</span>
          <span className='hidden items-center gap-1 rounded-md bg-slate-900 px-2 py-0.5 text-white sm:flex dark:bg-white dark:text-slate-900'><Share className='h-3 w-3' /> Share</span>
        </div>
      </div>

      {/* Canvas */}
      <div className='demo-dots relative h-[91%]'>
        {/* Left toolbar */}
        <div className='absolute left-[2%] top-1/2 flex -translate-y-1/2 flex-col gap-[6px] rounded-xl border border-slate-200 bg-white/90 p-1.5 shadow-sm dark:border-slate-700 dark:bg-slate-900/90'>
          {[MousePointer2, Hand, Square, Diamond, Circle, ArrowRight, Pencil, Type].map((Icon, i) => (
            <span key={i} className={`flex h-[clamp(14px,2.6vw,26px)] w-[clamp(14px,2.6vw,26px)] items-center justify-center rounded-md ${i === 0 ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300' : 'text-slate-400'}`}>
              <Icon className='h-[60%] w-[60%]' />
            </span>
          ))}
        </div>

        {/* "Generating with AI..." placeholder */}
        {phase === 'generating' && (
          <div className='demo-fade absolute left-[20%] top-[22%] flex h-[42%] w-[46%] items-center justify-center rounded-xl border-2 border-dashed border-indigo-300 bg-indigo-50/60 text-[clamp(8px,1.4vw,14px)] font-medium text-indigo-500 dark:bg-indigo-950/40'>
            <Sparkles className='mr-2 h-4 w-4 animate-pulse' /> Generating with AI...
          </div>
        )}

        {/* Flowchart that draws itself */}
        {showDiagram && <DemoDiagram />}

        {/* AI panel */}
        {panelOpen && (
          <div className='demo-pop absolute bottom-[16%] right-[3%] w-[36%] rounded-xl border border-slate-200 bg-white p-[1.6%] shadow-xl dark:border-slate-700 dark:bg-slate-900'>
            <p className='flex items-center gap-1 text-[clamp(8px,1.3vw,13px)] font-semibold text-slate-800 dark:text-slate-100'>
              <Sparkles className='h-3 w-3 text-indigo-500' /> AI Helper
            </p>
            <div className='mt-[4%] grid grid-cols-2 gap-1'>
              {['Flowchart', 'Mind Map'].map((tool, i) => (
                <span key={tool} className={`flex items-center gap-1 rounded-md border px-1.5 py-1 text-[clamp(6px,1vw,10px)] ${i === 0 ? 'border-indigo-500 text-indigo-600 ring-1 ring-indigo-500 dark:text-indigo-300' : 'border-slate-200 text-slate-500 dark:border-slate-700'}`}>
                  <Workflow className='h-3 w-3' /> {tool}
                </span>
              ))}
            </div>
            <div className='mt-[4%] min-h-[3.2em] rounded-md border border-slate-200 p-1.5 font-mono text-[clamp(6px,1vw,10px)] text-slate-700 dark:border-slate-700 dark:text-slate-200'>
              {PROMPT.slice(0, typed)}
              {phase === 'typing' && <span className='demo-caret'>|</span>}
            </div>
            <span className={`mt-[4%] flex items-center justify-center gap-1 rounded-md py-1 text-[clamp(7px,1.1vw,11px)] font-medium text-white transition ${phase === 'generating' ? 'bg-indigo-700' : 'bg-indigo-500'}`}>
              <Sparkles className='h-3 w-3' /> {phase === 'generating' ? 'Generating...' : 'Generate'}
            </span>
          </div>
        )}

        {/* AI button */}
        <span className={`absolute bottom-[5%] right-[3%] flex items-center gap-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 px-[1.6%] py-[0.8%] text-[clamp(8px,1.3vw,13px)] font-semibold text-white shadow-lg shadow-indigo-500/40 transition ${panelOpen ? 'scale-95' : ''}`}>
          <Sparkles className='h-3 w-3' /> AI
        </span>

        {/* Cursor */}
        {phase !== 'idle' && (
          <div
            className='pointer-events-none absolute z-20 transition-[left,top] duration-[900ms] ease-in-out'
            style={{ left: `${cursor.x}%`, top: `${cursor.y}%` }}
          >
            {/* click ripple: re-mounted (key) on every click */}
            {ripple > 0 && (
              <span key={ripple} className='demo-ripple absolute -left-3 -top-3 h-6 w-6 rounded-full bg-indigo-500/40' />
            )}
            <svg width='20' height='20' viewBox='0 0 24 24' className='relative drop-shadow-md'>
              <path d='M4 2l15 9.5-6.5 1.5L9 20z' fill='#0f172a' stroke='white' strokeWidth='1.5' strokeLinejoin='round' />
            </svg>
          </div>
        )}

        {/* Overlay: play before, start after */}
        {(phase === 'idle' || phase === 'done') && (
          <div className={`absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 ${phase === 'idle' ? 'bg-white/40 backdrop-blur-[2px] dark:bg-slate-950/40' : 'demo-fade bg-transparent'}`}>
            {phase === 'idle' ? (
              <>
                <button
                  type='button'
                  onClick={onPlay}
                  className='group flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white shadow-xl shadow-indigo-500/40 transition hover:scale-105'
                  aria-label='Play demo'
                >
                  <Play className='ml-1 h-7 w-7 fill-white' />
                </button>
                <p className='rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-slate-600 shadow-sm dark:bg-slate-900/90 dark:text-slate-300'>
                  Click or press <kbd className='rounded border px-1 font-mono'>Enter ↵</kbd> to watch
                </p>
              </>
            ) : (
              <div className='absolute bottom-[6%] left-1/2 flex -translate-x-1/2 items-center gap-2'>
                <button
                  type='button'
                  onClick={onStart}
                  className='flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-xl transition hover:scale-105 dark:bg-white dark:text-slate-900'
                >
                  {startLabel} <ArrowRight className='h-4 w-4' />
                  <kbd className='rounded border border-white/30 px-1 font-mono text-[10px] dark:border-slate-300'>Enter ↵</kbd>
                </button>
                <button
                  type='button'
                  onClick={onPlay}
                  className='flex items-center gap-1 rounded-full bg-white/90 px-3 py-2 text-sm text-slate-600 shadow transition hover:text-slate-900 dark:bg-slate-900/90 dark:text-slate-300'
                >
                  <RotateCcw className='h-4 w-4' /> Replay
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

/* The flowchart: every line is drawn (stroke animation), then filled, one after another */
function DemoDiagram() {
  const node = (delay: number) => ({ style: { animationDelay: `${delay}ms` } })
  return (
    <svg viewBox='0 0 600 340' className='absolute left-[12%] top-[8%] h-[80%] w-[62%]'>
      <defs>
        <marker id='demo-arrow' viewBox='0 0 10 10' refX='9' refY='5' markerWidth='7' markerHeight='7' orient='auto-start-reverse'>
          <path d='M0 0L10 5L0 10z' fill='#1e1e1e' />
        </marker>
      </defs>

      {/* Start */}
      <ellipse cx='80' cy='60' rx='62' ry='30' fill='#b2f2bb' className='demo-fill' {...node(250)} />
      <ellipse cx='80' cy='60' rx='62' ry='30' fill='none' stroke='#1e1e1e' strokeWidth='2' pathLength={1} className='demo-draw' {...node(0)} />
      <text x='80' y='65' textAnchor='middle' className='demo-text' {...node(300)}>Start</text>

      <line x1='142' y1='60' x2='208' y2='60' stroke='#1e1e1e' strokeWidth='2' markerEnd='url(#demo-arrow)' pathLength={1} className='demo-draw' {...node(450)} />

      {/* Enter details */}
      <rect x='210' y='30' width='150' height='60' rx='10' fill='#a5d8ff' className='demo-fill' {...node(800)} />
      <rect x='210' y='30' width='150' height='60' rx='10' fill='none' stroke='#1e1e1e' strokeWidth='2' pathLength={1} className='demo-draw' {...node(600)} />
      <text x='285' y='65' textAnchor='middle' className='demo-text' {...node(850)}>Enter email</text>

      <line x1='360' y1='60' x2='420' y2='60' stroke='#1e1e1e' strokeWidth='2' markerEnd='url(#demo-arrow)' pathLength={1} className='demo-draw' {...node(1000)} />

      {/* Valid? */}
      <path d='M490 10 L560 60 L490 110 L420 60 Z' fill='#ffec99' className='demo-fill' {...node(1350)} />
      <path d='M490 10 L560 60 L490 110 L420 60 Z' fill='none' stroke='#1e1e1e' strokeWidth='2' pathLength={1} className='demo-draw' {...node(1150)} />
      <text x='490' y='65' textAnchor='middle' className='demo-text' {...node(1400)}>Valid?</text>

      {/* Yes -> Dashboard */}
      <line x1='490' y1='110' x2='490' y2='208' stroke='#1e1e1e' strokeWidth='2' markerEnd='url(#demo-arrow)' pathLength={1} className='demo-draw' {...node(1550)} />
      <text x='502' y='165' className='demo-label' {...node(1650)}>Yes</text>
      <rect x='420' y='210' width='140' height='60' rx='10' fill='#b2f2bb' className='demo-fill' {...node(1900)} />
      <rect x='420' y='210' width='140' height='60' rx='10' fill='none' stroke='#1e1e1e' strokeWidth='2' pathLength={1} className='demo-draw' {...node(1700)} />
      <text x='490' y='245' textAnchor='middle' className='demo-text' {...node(1950)}>Dashboard</text>

      {/* No -> Show error -> back */}
      <path d='M420 60 L400 60 L400 160 L362 160' fill='none' stroke='#1e1e1e' strokeWidth='2' markerEnd='url(#demo-arrow)' pathLength={1} className='demo-draw' {...node(1550)} />
      <text x='370' y='150' className='demo-label' {...node(1650)}>No</text>
      <rect x='210' y='130' width='150' height='60' rx='10' fill='#ffc9c9' className='demo-fill' {...node(1900)} />
      <rect x='210' y='130' width='150' height='60' rx='10' fill='none' stroke='#1e1e1e' strokeWidth='2' pathLength={1} className='demo-draw' {...node(1700)} />
      <text x='285' y='165' textAnchor='middle' className='demo-text' {...node(1950)}>Show error</text>
      <line x1='285' y1='130' x2='285' y2='93' stroke='#1e1e1e' strokeWidth='2' strokeDasharray='6 5' markerEnd='url(#demo-arrow)' className='demo-fill' {...node(2150)} />
    </svg>
  )
}

export default DemoBoard
