import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { db, Projects, WhiteBoardContent } from "@/db"

export async function POST(request:NextRequest){
  const {projectId,elements, files, appState, previewImage } = await request.json();
  const user = await currentUser()
  const email = user?.primaryEmailAddress?.emailAddress

  if(!user || !email){
    return NextResponse.json({message:"Unauthorized",success:false},{status:401})
  }
  if(!projectId){
    return NextResponse.json({message:"Project Information Is missing",success:false},{status:400})
  }

  try{
    // Only the owner (matched by email, like GET /api/projects) can save this board
    const userProject = await db.select({projectId: Projects.projectId}).from(Projects).where(
      and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email))
    );
    if(userProject.length === 0){
      return NextResponse.json({message:"Project not found",success:false},{status:404})
    }

    const result = await db.insert(WhiteBoardContent).values({
      projectId:projectId,
      elements:elements,
      files:files,
      appState:appState,
      previewImage:previewImage ?? null
    }).onConflictDoUpdate({
      target:WhiteBoardContent.projectId,
      set:{
        elements:elements,
        files:files,
        appState:appState,
        previewImage:previewImage ?? null,
        updatedAt:new Date()
      }
    });

    return NextResponse.json({message:"Whiteboard saved successfully",success:true,result},{status:200})
  }catch(err){
    console.error("Failed to save whiteboard", err)
    return NextResponse.json({message:"Whiteboard not saved",success:false},{status:500})
  }
}
