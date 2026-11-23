import { db, Projects, WhiteBoardContent } from "@/db";
import { and, eq, inArray } from "drizzle-orm";
import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Settings > Data: permanently delete every archived board of this user
export async function DELETE() {
    const user = await currentUser();
    const email = user?.primaryEmailAddress?.emailAddress;
    if (!email) {
        return NextResponse.json("Unauthorized", { status: 401 });
    }

    try {
        const archived = await db.select({ projectId: Projects.projectId })
            .from(Projects)
            .where(and(eq(Projects.userEmail, email), eq(Projects.isDeleted, true)));

        const ids = archived.map((p) => p.projectId);
        if (ids.length === 0) {
            return NextResponse.json({ deleted: 0 });
        }

        // Whiteboard rows reference the projects, so they go first. One transaction.
        await db.batch([
            db.delete(WhiteBoardContent).where(inArray(WhiteBoardContent.projectId, ids)),
            db.delete(Projects).where(and(
                inArray(Projects.projectId, ids),
                eq(Projects.userEmail, email),
                eq(Projects.isDeleted, true),
            )),
        ]);

        return NextResponse.json({ deleted: ids.length });
    } catch (err) {
        console.error("Failed to delete archived boards", err);
        return NextResponse.json("Failed to delete archived boards", { status: 500 });
    }
}
