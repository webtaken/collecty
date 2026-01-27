import { NextRequest, NextResponse } from "next/server";
import { db, widgets, projects, leadMagnets } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import type { WidgetConfigUnified } from "@/db/schema/widgets";
import { renderTiptapToHtml } from "@/lib/tiptap-renderer";
import type { RichTextContent } from "@/db/schema/lead-magnets";

const uuidSchema = z.string().uuid();
const cssColorRegex =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
  identifier: string,
  limit = 60,
  windowMs = 60000,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);
  if (Math.random() < 0.01) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetTime) rateLimitMap.delete(key);
    }
  }
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs });
    return false;
  }
  if (record.count >= limit) return true;
  record.count++;
  return false;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> },
) {
  const { widgetId } = await params;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(`inline-html:${ip}`)) {
    return new NextResponse("<!-- Rate limited -->", {
      status: 429,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const uuidValidation = uuidSchema.safeParse(widgetId);
  if (!uuidValidation.success) {
    return new NextResponse("<!-- Invalid ID -->", {
      status: 400,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  // First, try to find a widget with this ID
  let result = await db
    .select({ widget: widgets, project: projects, leadMagnet: leadMagnets })
    .from(widgets)
    .innerJoin(projects, eq(widgets.projectId, projects.id))
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(eq(widgets.id, widgetId))
    .then((rows) => rows[0]);

  // If not found as widget, try to find it as a projectId (backward compatibility)
  if (!result) {
    const projectResult = await db
      .select({ widget: widgets, project: projects, leadMagnet: leadMagnets })
      .from(widgets)
      .innerJoin(projects, eq(widgets.projectId, projects.id))
      .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
      .where(and(eq(widgets.projectId, widgetId), eq(widgets.isDefault, true)))
      .then((rows) => rows[0]);

    if (!projectResult) {
      const anyWidgetResult = await db
        .select({ widget: widgets, project: projects, leadMagnet: leadMagnets })
        .from(widgets)
        .innerJoin(projects, eq(widgets.projectId, projects.id))
        .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
        .where(eq(widgets.projectId, widgetId))
        .limit(1)
        .then((rows) => rows[0]);

      result = anyWidgetResult;
    } else {
      result = projectResult;
    }
  }

  if (!result || !result.widget.isActive || !result.project.isActive) {
    return new NextResponse("<!-- Widget not found or inactive -->", {
      status: 404,
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  }

  const config = result.widget.config as WidgetConfigUnified;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  const escapeHtml = (str: string): string =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

  const sanitizeColor = (color: unknown, defaultColor: string): string => {
    const colorStr = String(color || defaultColor).trim();
    return cssColorRegex.test(colorStr) ? colorStr : defaultColor;
  };

  const sanitizeText = (
    text: unknown,
    defaultText: string,
    maxLength = 500,
  ): string => escapeHtml(String(text || defaultText).slice(0, maxLength));

  const title = sanitizeText(config.title, "Subscribe to our newsletter", 200);
  const description = sanitizeText(
    config.description,
    "Get the latest updates.",
    500,
  );
  const buttonText = sanitizeText(config.buttonText, "Subscribe", 50);
  const successMessage = sanitizeText(
    config.successMessage,
    "Thanks for subscribing!",
    200,
  );
  const placeholderText = sanitizeText(
    config.placeholderText,
    "Enter your email",
    100,
  );
  const primaryColor = sanitizeColor(config.primaryColor, "#6366f1");
  const backgroundColor = sanitizeColor(config.backgroundColor, "#f8fafc");
  const textColor = sanitizeColor(config.textColor, "#1f2937");
  const showBranding = config.showBranding !== false;
  const layout = config.layout === "vertical" ? "vertical" : "horizontal";
  const borderRadius = Math.max(
    0,
    Math.min(Number(config.borderRadius) || 8, 32),
  );

  // Prepare lead magnet data if available
  const leadMagnetPreview = result.leadMagnet?.previewText
    ? sanitizeText(result.leadMagnet.previewText, "", 500)
    : "";
  const leadMagnetHtml = result.leadMagnet?.description
    ? renderTiptapToHtml(result.leadMagnet.description as RichTextContent)
    : "";

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: transparent; }
    .collecty-container { background: ${backgroundColor}; border-radius: ${borderRadius}px; padding: 24px; }
    .collecty-title { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: ${textColor}; }
    .collecty-description { font-size: 14px; color: ${textColor}; opacity: 0.7; margin: 0 0 16px; }
    .collecty-form { display: flex; gap: 12px; ${layout === "vertical" ? "flex-direction: column;" : "flex-wrap: wrap;"} }
    .collecty-input { flex: 1; min-width: 200px; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: ${borderRadius}px; font-size: 14px; outline: none; background: #fff; color: #1f2937; font-family: inherit; }
    .collecty-input:focus { border-color: ${primaryColor}; box-shadow: 0 0 0 3px ${primaryColor}20; }
    .collecty-button { background: ${primaryColor}; color: white; border: none; padding: 12px 24px; border-radius: ${borderRadius}px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: inherit; ${layout === "vertical" ? "width: 100%;" : ""} }
    .collecty-button:hover:not(:disabled) { opacity: 0.9; }
    .collecty-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .collecty-message { margin-top: 12px; padding: 12px; border-radius: ${borderRadius}px; font-size: 14px; text-align: center; display: none; }
    .collecty-message.success { display: block; background: #dcfce7; color: #166534; }
    .collecty-message.error { display: block; background: #fee2e2; color: #991b1b; }
    .collecty-branding { text-align: center; margin-top: 16px; font-size: 11px; color: ${textColor}; opacity: 0.4; }
    .collecty-branding a { color: inherit; text-decoration: none; }
    @media (max-width: 480px) { .collecty-form { flex-direction: column; } .collecty-button { width: 100%; } }
  </style>
</head>
<body>
  <div class="collecty-container">
    <h3 class="collecty-title">${title}</h3>
    <p class="collecty-description">${description}</p>
    <form class="collecty-form" id="collecty-form">
      <input type="email" class="collecty-input" id="collecty-email" placeholder="${placeholderText}" required autocomplete="email" />
      <button type="submit" class="collecty-button" id="collecty-button">${buttonText}</button>
    </form>
    <div class="collecty-message" id="collecty-message"></div>
    ${showBranding ? `<p class="collecty-branding">Powered by <a href="${escapeHtml(appUrl)}" target="_blank">Collecty</a></p>` : ""}
  </div>
  <script>
    (function() {
      const form = document.getElementById('collecty-form');
      const input = document.getElementById('collecty-email');
      const button = document.getElementById('collecty-button');
      const messageEl = document.getElementById('collecty-message');
      const API_URL = "${escapeHtml(appUrl)}/api/v1/subscribe";
      const PROJECT_ID = "${escapeHtml(result.project.id)}";
      const WIDGET_ID = "${escapeHtml(widgetId)}";
      const SUCCESS_MESSAGE = "${successMessage}";
      const LEAD_MAGNET_PREVIEW = "${leadMagnetPreview}";
      const LEAD_MAGNET_HTML = \`${leadMagnetHtml}\`;

      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = input.value.trim();
        if (!email) return;

        const originalText = button.textContent;
        button.disabled = true;
        button.textContent = 'Subscribing...';
        messageEl.className = 'collecty-message';

        try {
          let geoData = null;
          try { const r = await fetch('https://ipapi.co/json/'); if (r.ok) geoData = await r.json(); } catch {}

          const metadata = { userAgent: navigator.userAgent, referrer: document.referrer, pageUrl: window.location.href, source: 'inline-iframe', widgetId: WIDGET_ID };
          if (geoData) Object.assign(metadata, { ip: geoData.ip, city: geoData.city, region: geoData.region, country: geoData.country_name, countryCode: geoData.country_code, timezone: geoData.timezone });

          const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, projectId: PROJECT_ID, metadata }) });
          const data = await response.json();

          if (response.ok) {
            if (LEAD_MAGNET_HTML) {
               const container = document.querySelector('.collecty-container');
               const titleEl = document.querySelector('.collecty-title');
               const descEl = document.querySelector('.collecty-description');
               const formEl = document.getElementById('collecty-form');
               const brandingEl = document.querySelector('.collecty-branding');
               
               if (titleEl) titleEl.textContent = LEAD_MAGNET_PREVIEW || "${title}";
               if (descEl) {
                 descEl.innerHTML = LEAD_MAGNET_HTML;
                 descEl.style.maxHeight = '300px';
                 descEl.style.overflowY = 'auto';
               }
               if (formEl) formEl.style.display = 'none';
               if (messageEl) messageEl.style.display = 'none';
            } else {
              messageEl.className = 'collecty-message success';
              messageEl.textContent = SUCCESS_MESSAGE;
              input.value = '';
            }
          } else throw new Error(data.error || 'Something went wrong');
        } catch (error) {
          messageEl.className = 'collecty-message error';
          messageEl.textContent = error.message || 'An error occurred.';
        } finally {
          button.disabled = false;
          button.textContent = originalText;
        }
      });
    })();
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
