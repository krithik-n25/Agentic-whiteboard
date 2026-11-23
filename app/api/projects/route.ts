import { db,Projects,WhiteBoardContent } from "@/db";
import { and, eq } from "drizzle-orm";
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

export async function GET(req:NextRequest){
    const projectId = req.nextUrl.searchParams.get("projectId");

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if(!email){
        return NextResponse.json("Unauthorized",{status:401});
    }
    if(!projectId){
        return NextResponse.json("Missing projectId",{status:400});
    }

    try{
        // Only the owner (matched by email) can open this project
        const userProject = await db.select().from(Projects).where(
            and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email))
        );
        if(userProject.length === 0){
            return NextResponse.json("Project not found",{status:404});
        }

        const content = await db.select().from(WhiteBoardContent)
            .where(eq(WhiteBoardContent.projectId, projectId));

        // A new project has no saved whiteboard yet
        return NextResponse.json({
            projectName: userProject[0].projectName,
            elements: content[0]?.elements ?? [],
            appState: content[0]?.appState ?? {},
            files: content[0]?.files ?? {},
        });
    }catch(err){
        console.error("Failed to fetch project", err);
        return NextResponse.json("Failed to fetch project",{status:500});
    }
}
