"use client"
import React, { useRef, useState } from 'react'
import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";
import axios from 'axios';
import { useParams } from 'next/navigation';
import { toast } from '@/components/ui/toast';

function Whiteboard() {

  const [excalidrawAPI, setExcalidrawAPI] = useState(null);
  const SaveTimerRef = useRef<any>();
  const {projectid} = useParams();

  const HandleCanvas = (elements: readonly any[], appState: any, files: any) => {
    //
    if (SaveTimerRef?.current) {
      clearTimeout(SaveTimerRef.current)
    }

    //Start New 10 sec timer  
    SaveTimerRef.current = setTimeout(() => {
      //Save method 
      SaveCanvasData(elements,appState,files);
      toast.add({
        title:"Canvas Saved Successfully",
        type:'default'
      })
    }, 10000)

    const SaveCanvasData = async (elements: readonly any[], appState: any, files: any) => {
      const result = await  axios.post('/api/whiteboard',{
        elements:elements,
        appState:appState,
        files:files,
        projectId:projectid
      });
    }

  }
  return (

    <div style={{ height: "90vh" }}>


      <Excalidraw
      // @ts-ignore
        excalidrawAPI={(api) => setExcalidrawAPI(api)}
        onChange={HandleCanvas} />

    </div>
  )
}

export default Whiteboard