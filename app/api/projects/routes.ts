import { db,Projects } from "@/db";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req:NextRequest){
    const {project_name,project_id}=await req.json();

    const user =await currentUser();

    if(!project_id || !project_name){
        return NextResponse.json("Missing required fields",{status:400})
    }

    const result = await db.insert(Projects).values({
        projectId:project_id,
        projectName:project_name??'',
        userEmail:user?.primaryEmailAddress?.emailAddress??'',
    }).returning();

    return NextResponse.json(result[0])
}