// Server only: monthly AI credits (see lib/plans.ts)
import { and, eq, sql } from "drizzle-orm";
import { db, users } from "@/db";
import { FREE_AI_CREDITS } from "@/lib/plans";

// True when credits were never refilled or last refilled before this month (UTC)
const isNewMonth = sql`(${users.creditsResetAt} is null or ${users.creditsResetAt} < date_trunc('month', now() at time zone 'utc'))`;

// Credits the user really has right now (a new month means a full refill)
const currentCredits = sql`(case when ${isNewMonth} then ${FREE_AI_CREDITS}::int else coalesce(${users.credits}, 0) end)`;

// Refill credits if a new month started. Used before showing credits in the UI.
export const refillCreditsIfNewMonth = async (clerkId: string) => {
  await db.update(users)
    .set({ credits: FREE_AI_CREDITS, creditsResetAt: sql`now() at time zone 'utc'` })
    .where(and(eq(users.clerkId, clerkId), isNewMonth));
};

/**
 * Takes 1 AI credit. Refill, check and minus happen in one query,
 * so two requests at the same time can never push credits below 0.
 * Returns the credits left, or null when the user has none.
 */
export const spendAICredit = async (clerkId: string) => {
  const result = await db.update(users)
    .set({
      credits: sql`${currentCredits} - 1`,
      creditsResetAt: sql`(case when ${isNewMonth} then now() at time zone 'utc' else ${users.creditsResetAt} end)`,
    })
    .where(and(eq(users.clerkId, clerkId), sql`${currentCredits} > 0`))
    .returning({ credits: users.credits });

  return result.length > 0 ? Number(result[0].credits) : null;
};

// Gives the credit back when the AI call failed (the user got nothing)
export const refundAICredit = async (clerkId: string) => {
  const result = await db.update(users)
    .set({ credits: sql`coalesce(${users.credits}, 0) + 1` })
    .where(eq(users.clerkId, clerkId))
    .returning({ credits: users.credits });

  return Number(result[0]?.credits ?? 0);
};
