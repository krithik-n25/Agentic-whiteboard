import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import {currentUser } from "@clerk/nextjs/server";
import {db, WhiteBoardContent} from "@/db"

export async function POST(request:NextRequest){
  const {projectId,elements, files, appState } = await request.json();
  const user = await currentUser()
  
  if(!user){
    return NextResponse.json({message:"Unauthorized",success:false},{status:401})
  }
  try{
  if(projectId){    
    const result = await db.insert(WhiteBoardContent).values({
      projectId:projectId,
      elements:elements,
      files:files,
      appState:appState
    }).onConflictDoUpdate({
      target:WhiteBoardContent.projectId,
      set:{
        elements:elements,
        files:files,
        appState:appState,
        updatedAt:new Date()
      }
    });

      return NextResponse.json({message:"Whiteboard saved successfully",success:true,result},{status:200})
    }
  }catch(err){
    return NextResponse.json({message:"Whiteboard not saved",success:false,err},{status:500})
  }

  return NextResponse.json({message:"Project Information Is missing",success:false},{status:400})
}