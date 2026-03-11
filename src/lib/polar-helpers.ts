import { db, polarSubscriptions } from "@/db";
import { eq, and, or } from "drizzle-orm";

export async function hasActiveSubscription(userId: string) {
  const subscriptions = await db
    .select()
    .from(polarSubscriptions)
    .where(
      and(
        eq(polarSubscriptions.userId, userId),
        or(
          eq(polarSubscriptions.status, "active"),
          eq(polarSubscriptions.status, "past_due")
        )
      )
    )
    .limit(1);

  return subscriptions.length > 0;
}

export async function getUserSubscriptions(userId: string) {
  return await db
    .select()
    .from(polarSubscriptions)
    .where(eq(polarSubscriptions.userId, userId));
}

export async function getActiveSubscriptions(userId: string) {
  return await db
    .select()
    .from(polarSubscriptions)
    .where(
      and(
        eq(polarSubscriptions.userId, userId),
        or(
          eq(polarSubscriptions.status, "active"),
          eq(polarSubscriptions.status, "past_due")
        )
      )
    );
}
