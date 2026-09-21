"use client"
import React, { useState } from 'react'
import WorkspaceHeader from '@/components/custom/workspace/WorkspaceHeader'
import Whiteboard from '@/components/custom/workspace/Whiteboard';
import SmartDocx from '@/components/custom/workspace/SmartDocx';

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