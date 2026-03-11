import { NextRequest, NextResponse } from "next/server";
import { db, subscribers, projects, apiKeys } from "@/db";
import { eq, and } from "drizzle-orm";
import { createHash } from "crypto";
import { z } from "zod";
import { UAParser } from "ua-parser-js";
import type { SubscriberMetadata } from "@/db/schema/subscribers";

const subscribeSchema = z.object({
  email: z.email("Invalid email address"),
  projectId: z.uuid("Invalid project ID"),
  widgetId: z.string().uuid("Invalid widget ID").optional(),
  metadata: z
    .object({
      userAgent: z.string().optional(),
      referrer: z.string().optional(),
      pageUrl: z.string().optional(),
      // Geolocation fields (from client-side ipapi.co call)
      ip: z.string().optional(),
      city: z.string().optional(),
      region: z.string().optional(),
      country: z.string().optional(),
      countryCode: z.string().optional(),
      timezone: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
      org: z.string().optional(),
    })
    .optional(),
});

// CORS headers helper - applied to all responses
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, x-api-key",
};

// Helper to create JSON response with CORS headers
function jsonResponse(data: object, status: number) {
  return NextResponse.json(data, { status, headers: corsHeaders });
}

// Simple in-memory rate limiter (use Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60000
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }

  if (record.count >= limit) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key");

    // Parse request body
    const body = await request.json();
    const validated = subscribeSchema.parse(body);

    // Rate limit by IP + project
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0] : "unknown";
    const rateLimitKey = `${ip}:${validated.projectId}`;

    if (isRateLimited(rateLimitKey)) {
      return jsonResponse(
        { error: "Too many requests. Please try again later." },
        429
      );
    }

    // Verify project exists and is active
    const [project] = await db
      .select()
      .from(projects)
      .where(eq(projects.id, validated.projectId));

    if (!project) {
      return jsonResponse({ error: "Project not found" }, 404);
    }

    if (!project.isActive) {
      return jsonResponse(
        { error: "This form is currently not accepting submissions" },
        403
      );
    }

    // If API key is provided, validate it
    if (apiKey) {
      const keyHash = createHash("sha256").update(apiKey).digest("hex");
      const [validKey] = await db
        .select()
        .from(apiKeys)
        .where(
          and(
            eq(apiKeys.keyHash, keyHash),
            eq(apiKeys.projectId, validated.projectId)
          )
        );

      if (!validKey) {
        return jsonResponse({ error: "Invalid API key" }, 401);
      }

      // Update last used timestamp
      await db
        .update(apiKeys)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiKeys.id, validKey.id));
    }

    // Parse User-Agent header server-side for trusted device/browser/OS info
    const userAgentHeader = request.headers.get("user-agent") || "";
    const parser = new UAParser(userAgentHeader);
    const uaResult = parser.getResult();

    // Build enriched metadata
    const enrichedMetadata: SubscriberMetadata = {
      ...validated.metadata,
      userAgent: userAgentHeader,
      // Parsed User-Agent data (server-side, trusted)
      device: {
        type: uaResult.device.type || "desktop",
        vendor: uaResult.device.vendor,
        model: uaResult.device.model,
      },
      browser: {
        name: uaResult.browser.name,
        version: uaResult.browser.version,
      },
      os: {
        name: uaResult.os.name,
        version: uaResult.os.version,
      },
    };

    // Check for existing subscriber in this project
    const [existingSubscriber] = await db
      .select()
      .from(subscribers)
      .where(
        and(
          eq(subscribers.projectId, validated.projectId),
          eq(subscribers.email, validated.email.toLowerCase())
        )
      );

    if (existingSubscriber) {
      // Upsert: Update existing subscriber with new metadata
      await db
        .update(subscribers)
        .set({ metadata: enrichedMetadata })
        .where(eq(subscribers.id, existingSubscriber.id));

      return jsonResponse(
        { success: true, message: "Subscription updated!" },
        200
      );
    }

    // Insert new subscriber
    await db.insert(subscribers).values({
      projectId: validated.projectId,
      widgetId: validated.widgetId || null,
      email: validated.email.toLowerCase(),
      metadata: enrichedMetadata,
      source: "widget",
    });

    return jsonResponse(
      { success: true, message: "Successfully subscribed!" },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return jsonResponse({ error: error.issues[0].message }, 400);
    }

    console.error("Subscribe error:", error);
    return jsonResponse({ error: "An unexpected error occurred" }, 500);
  }
}

// Handle CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      ...corsHeaders,
      "Access-Control-Max-Age": "86400",
    },
  });
}
