"use client"
import React, { useState } from 'react'
import dynamic from 'next/dynamic';
import WorkspaceHeader from '@/components/custom/workspace/WorkspaceHeader'
import SmartDocx from '@/components/custom/workspace/SmartDocx';

// Excalidraw uses `window` on import, so render the whiteboard only in the browser
const Whiteboard = dynamic(
  () => import('@/components/custom/workspace/Whiteboard'),
  { ssr: false }
);

function workspace() {
  const [activeTab, setActiveTab] = useState("WhiteBoard");
  return (
    <div className=" h-screen">
      <WorkspaceHeader selectedTab={(value: string) => setActiveTab(value)} />

      {activeTab == 'WhiteBoard'
        ? <Whiteboard />
        : <SmartDocx />
      }
    </div>
  )
}

export default workspace