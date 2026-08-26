import {db, users} from "@/db"
import {currentUser} from "@clerk/nextjs/server"
import {NextRequest, NextResponse } from "next/server"
import {eq} from "drizzle-orm"
export async function POST(req:NextRequest) {
    const user = await currentUser()

    // if user already exists?
    if(user) {
        const userData = await db.select().from(users).where(eq(users.clerkId, user.id))
        if(userData?.length > 0) {
            return NextResponse.json(userData[0],{status:200})
        }else{
            try {
                const result = await db.insert(users).values({
                    clerkId: user.id,
                    name: user?.firstName as string,
                    email: user?.primaryEmailAddress?.emailAddress || null,
                }).returning()
                return NextResponse.json(result[0],{status:201})
            } catch (error: any) {
                // Handle race condition: if another request inserted the user concurrently
                if (error?.code === '23505') { // Unique constraint violation
                    const userData = await db.select().from(users).where(eq(users.clerkId, user.id))
                    if(userData?.length > 0) {
                        return NextResponse.json(userData[0],{status:200})
                    }
                }
                throw error;
            }
        }
    }
    return NextResponse.json({message:"User not found"},{status:404})

}