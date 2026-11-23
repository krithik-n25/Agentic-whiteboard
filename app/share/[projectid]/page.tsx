"use client"
import React from 'react'
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';

// Excalidraw uses `window` on import, so render the viewer only in the browser
const ShareViewer = dynamic(
  () => import('@/components/custom/share/ShareViewer'),
  { ssr: false }
);

// Public page: anyone with the link can view a shared board (read only)
function SharePage() {
  const { projectid } = useParams();
  return <ShareViewer projectId={String(projectid)} />
}

export default SharePage
