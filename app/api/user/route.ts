import {db, users} from "@/db"
import {currentUser} from "@clerk/nextjs/server"
import {NextRequest, NextResponse } from "next/server"
import {eq} from "drizzle-orm"
export async function POST(req:NextRequest) {
    const user = await currentUser()

    // if user already exists?
    if(user) {
        //@ts-ignore
        const userData = await db.select().from(users).where(eq(user.primaryEmailAddress?.emailAddress, 
            users.email))
        if(userData?.length > 0) {
            return NextResponse.json(userData[0],{status:200})
        }else{
            const result = await db.insert(users).values({
                name: user?.firstName as string,
                email: user?.primaryEmailAddress?.emailAddress as string,
            }).returning()
                return NextResponse.json(result[0],{status:201})
        }
    }
    return NextResponse.json({message:"User not found"},{status:404})

}