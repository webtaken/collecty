import { CustomerPortal } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import { db, polarCustomers } from "@/db";
import { eq } from "drizzle-orm";

export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  getCustomerId: async (req: NextRequest) => {
    const session = await auth();
    if (!session?.user?.id) {
      throw new Error("Unauthorized");
    }

    const [customer] = await db
      .select()
      .from(polarCustomers)
      .where(eq(polarCustomers.userId, session.user.id))
      .limit(1);

    if (!customer?.polarCustomerId) {
      throw new Error("No Polar customer found");
    }

    return customer.polarCustomerId;
  },
  returnUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
  server: (process.env.POLAR_SERVER as "sandbox" | "production" | undefined) || "sandbox",
});
