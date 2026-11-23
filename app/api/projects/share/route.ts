import { db, Projects } from "@/db";
import { and, eq } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

// Owner turns the view-only link on or off
export async function POST(req: NextRequest) {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    const { projectId, isPublic } = await req.json();
    if (!projectId || typeof isPublic !== "boolean") {
        return NextResponse.json("Missing projectId or isPublic", { status: 400 });
    }

    try {
        // Matching the email too, so only the owner can share
        const result = await db.update(Projects)
            .set({ isPublic })
            .where(and(eq(Projects.projectId, projectId), eq(Projects.userEmail, email)))
            .returning({ isPublic: Projects.isPublic });

        if (result.length === 0) {
            return NextResponse.json("Project not found", { status: 404 });
        }
        return NextResponse.json({ isPublic: result[0].isPublic });
    } catch (err) {
        console.error("Failed to update sharing", err);
        return NextResponse.json("Failed to update sharing", { status: 500 });
    }
}
