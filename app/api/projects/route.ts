import { db,Projects } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {projectName,projectId}=await req.json();

    const user =await currentUser();
    if(!user?.primaryEmailAddress?.emailAddress){
        return NextResponse.json("Unauthorized",{status:401});
    }
    if(!projectId || !projectName){
        return NextResponse.json("Missing required fields",{status:400})
    }

    const result = await db.insert(Projects).values({
        projectId:projectId,
        projectName:projectName??'',
        userEmail:user?.primaryEmailAddress?.emailAddress??''
    }).returning();

    return NextResponse.json(result[0])
}