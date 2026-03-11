import { Checkout } from "@polar-sh/nextjs";
import { NextRequest } from "next/server";

export const GET = Checkout({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  successUrl: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/checkout/success?checkout_id={CHECKOUT_ID}`,
  server: (process.env.POLAR_SERVER as "sandbox" | "production" | undefined) || "sandbox",
});
