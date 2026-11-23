import { db, Projects, WhiteBoardContent } from "@/db";
import { and, eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";

// Public, no login: a shared board, read only.
// Only when the owner turned sharing on and the board is not archived.
export async function GET(req: NextRequest) {
    const projectId = req.nextUrl.searchParams.get("projectId");
    if (!projectId) {
        return NextResponse.json("Missing projectId", { status: 400 });
    }

    try {
        const project = await db.select({ projectName: Projects.projectName })
            .from(Projects)
            .where(and(
                eq(Projects.projectId, projectId),
                eq(Projects.isPublic, true),
                eq(Projects.isDeleted, false),
            ));

        // Same answer for "does not exist" and "not shared", so nothing leaks
        if (project.length === 0) {
            return NextResponse.json("This board is not shared", { status: 404 });
        }

        const content = await db.select({
            elements: WhiteBoardContent.elements,
            appState: WhiteBoardContent.appState,
            files: WhiteBoardContent.files,
        }).from(WhiteBoardContent).where(eq(WhiteBoardContent.projectId, projectId));

        // Never send the owner's email or other project fields
        return NextResponse.json({
            projectName: project[0].projectName,
            elements: content[0]?.elements ?? [],
            appState: content[0]?.appState ?? {},
            files: content[0]?.files ?? {},
        });
    } catch (err) {
        console.error("Failed to load shared board", err);
        return NextResponse.json("Failed to load shared board", { status: 500 });
    }
}
