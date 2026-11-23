import {db, users} from "@/db"
import {currentUser} from "@clerk/nextjs/server"
import {NextRequest, NextResponse } from "next/server"
import {eq} from "drizzle-orm"
import { refillCreditsIfNewMonth } from "@/lib/credits"

// User row for the context (credits refilled first if a new month started)
const getUserWithCredits = async (clerkId: string) => {
    await refillCreditsIfNewMonth(clerkId)
    const userData = await db.select().from(users).where(eq(users.clerkId, clerkId))
    return userData[0]
}

export async function POST(req:NextRequest) {
    const user = await currentUser()

    // if user already exists?
    if(user) {
        const email = user?.primaryEmailAddress?.emailAddress || null
        const userData = await db.select().from(users).where(eq(users.clerkId, user.id))
        if(userData?.length > 0) {
            return NextResponse.json(await getUserWithCredits(user.id),{status:200})
        }else{
            try {
                await db.insert(users).values({
                    clerkId: user.id,
                    name: user?.firstName as string,
                    email,
                })
                return NextResponse.json(await getUserWithCredits(user.id),{status:201})
            } catch (error: any) {
                // Handle race condition: if another request inserted the user concurrently
                if (error?.code === '23505') { // Unique constraint violation
                    return NextResponse.json(await getUserWithCredits(user.id),{status:200})
                }
                throw error;
            }
        }
    }
    // Not signed in: 401 (not 404), the client only calls this after login anyway
    return NextResponse.json({message:"Unauthorized"},{status:401})

}
