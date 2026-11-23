import { db,Projects,WhiteBoardContent } from "@/db";
import { and, desc, eq, sql } from "drizzle-orm";
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
    // ?archived=true gives the archive page list, otherwise the dashboard list
    const archived = req.nextUrl.searchParams.get("archived") === "true";
    // ?shared=true gives "Shared by me": boards with the view-only link on
    const shared = req.nextUrl.searchParams.get("shared") === "true";

    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if(!email){
        return NextResponse.json("Unauthorized",{status:401});
    }
    // No projectId: list of this user's projects (dashboard or archive page)
    if(!projectId){
        try{
            const projectList = await db.select({
                id: Projects.id,
                projectId: Projects.projectId,
                projectName: Projects.projectName,
                previewImage: WhiteBoardContent.previewImage,
                isPublic: Projects.isPublic,
                // Projects.updatedAt is never changed, the whiteboard save time is the real "edited"
                // mapWith: parse like a timestamp column (UTC), not as a raw string without timezone
                updatedAt: sql<Date>`coalesce(${WhiteBoardContent.updatedAt}, ${Projects.createdAt})`
                    .mapWith(Projects.createdAt),
            })
            .from(Projects)
            // left join: a new project has no whiteboard row yet but should still show up
            .leftJoin(WhiteBoardContent, eq(Projects.projectId, WhiteBoardContent.projectId))
            .where(and(
                eq(Projects.userEmail, email),
                eq(Projects.isDeleted, archived),
                shared ? eq(Projects.isPublic, true) : undefined,
            ))
            .orderBy(desc(sql`coalesce(${WhiteBoardContent.updatedAt}, ${Projects.createdAt})`));

            return NextResponse.json(projectList);
        }catch(err){
            console.error("Failed to fetch project list", err);
            return NextResponse.json("Failed to fetch project list",{status:500});
        }
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
            isPublic: userProject[0].isPublic,
            elements: content[0]?.elements ?? [],
            appState: content[0]?.appState ?? {},
            files: content[0]?.files ?? {},
        });
    }catch(err){
        console.error("Failed to fetch project", err);
        return NextResponse.json("Failed to fetch project",{status:500});
    }
}

// Archive (archived: true) or restore (archived: false). Nothing is removed.
export async function PATCH(req:NextRequest){
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if(!email){
        return NextResponse.json("Unauthorized",{status:401});
    }

    const {projectId, archived} = await req.json();
    if(!projectId || typeof archived !== "boolean"){
        return NextResponse.json("Missing projectId or archived",{status:400});
    }

    try{
        // Matching the email too, so a user can only change their own project
        const result = await db.update(Projects)
            .set({isDeleted:archived})
            .where(and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email)))
            .returning({projectId: Projects.projectId});

        if(result.length === 0){
            return NextResponse.json("Project not found",{status:404});
        }
        return NextResponse.json({message: archived ? "Project archived" : "Project restored"});
    }catch(err){
        console.error("Failed to update archive state", err);
        return NextResponse.json("Failed to update project",{status:500});
    }
}

// Permanent delete: removes the project and its saved whiteboard
export async function DELETE(req:NextRequest){
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if(!email){
        return NextResponse.json("Unauthorized",{status:401});
    }

    const {projectId} = await req.json();
    if(!projectId){
        return NextResponse.json("Missing projectId",{status:400});
    }

    try{
        // Only the owner can delete
        const userProject = await db.select({projectId: Projects.projectId}).from(Projects).where(
            and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email))
        );
        if(userProject.length === 0){
            return NextResponse.json("Project not found",{status:404});
        }

        // Whiteboard row references the project, so it goes first.
        // batch runs both in one transaction (neon-http has no db.transaction).
        await db.batch([
            db.delete(WhiteBoardContent).where(eq(WhiteBoardContent.projectId, projectId)),
            db.delete(Projects).where(and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email))),
        ]);

        return NextResponse.json({message:"Project deleted"});
    }catch(err){
        console.error("Failed to delete project", err);
        return NextResponse.json("Failed to delete project",{status:500});
    }
}
