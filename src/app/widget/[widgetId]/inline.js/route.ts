import { NextRequest, NextResponse } from "next/server";
import { db, widgets, projects, leadMagnets } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import type { WidgetConfigUnified } from "@/db/schema/widgets";
import { renderTiptapToHtml } from "@/lib/tiptap-renderer";
import type { RichTextContent } from "@/db/schema/lead-magnets";

const uuidSchema = z.string().uuid();
const cssColorRegex =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;
const validLayoutTypes = ["horizontal", "vertical"] as const;

const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000,
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

const securityHeaders = {
  "Content-Type": "application/javascript; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ widgetId: string }> },
) {
  const { widgetId } = await params;

  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(`inline-widget:${ip}`)) {
    return new NextResponse("// Rate limited.", {
      status: 429,
      headers: securityHeaders,
    });
  }

  const uuidValidation = uuidSchema.safeParse(widgetId);
  if (!uuidValidation.success) {
    return new NextResponse("// Invalid ID", {
      status: 400,
      headers: securityHeaders,
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
    return new NextResponse("// Widget not found or inactive", {
      status: 404,
      headers: securityHeaders,
    });
  }

  const config = result.widget.config as WidgetConfigUnified;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  const escapeJs = (str: string): string =>
    str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/</g, "\\x3c")
      .replace(/>/g, "\\x3e");

  const sanitizeColor = (color: unknown, defaultColor: string): string => {
    const colorStr = String(color || defaultColor).trim();
    return cssColorRegex.test(colorStr) ? colorStr : defaultColor;
  };

  const sanitizeLayoutType = (type: unknown): string => {
    const typeStr = String(type || "horizontal").toLowerCase();
    return validLayoutTypes.includes(
      typeStr as (typeof validLayoutTypes)[number],
    )
      ? typeStr
      : "horizontal";
  };

  const sanitizeText = (
    text: unknown,
    defaultText: string,
    maxLength: number = 500,
  ): string => escapeJs(String(text || defaultText).slice(0, maxLength));

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
  const layout = sanitizeLayoutType(config.layout);
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

  const safeWidgetId = escapeJs(widgetId);
  const safeProjectId = escapeJs(result.project.id);

  const widgetScript = `
(function() {
  'use strict';
  const WIDGET_ID = "${safeWidgetId}";
  const PROJECT_ID = "${safeProjectId}";
  const API_URL = "${escapeJs(appUrl)}/api/v1/subscribe";
  const WIDGET_TITLE = "${title}";
  const WIDGET_DESCRIPTION = "${description}";
  const BUTTON_TEXT = "${buttonText}";
  const SUCCESS_MESSAGE = "${successMessage}";
  const LEAD_MAGNET_PREVIEW = "${leadMagnetPreview}";
  const LEAD_MAGNET_HTML = "${escapeJs(leadMagnetHtml)}";
  const PLACEHOLDER_TEXT = "${placeholderText}";
  const LAYOUT = "${escapeJs(layout)}";

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  const styles = \`
    :host { all: initial; display: block; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    *, *::before, *::after { box-sizing: border-box; }
    .collecty-inline-container { background: ${backgroundColor}; border-radius: ${borderRadius}px; padding: 24px; width: 100%; }
    .collecty-inline-title { font-size: 18px; font-weight: 700; margin: 0 0 4px; color: ${textColor}; }
    .collecty-inline-description { font-size: 14px; color: ${textColor}; opacity: 0.7; margin: 0 0 16px; }
    .collecty-inline-form { display: flex; gap: 12px; \${LAYOUT === 'vertical' ? 'flex-direction: column;' : 'flex-wrap: wrap;'} }
    .collecty-inline-input { flex: 1; min-width: 200px; padding: 12px 16px; border: 2px solid #e2e8f0; border-radius: ${borderRadius}px; font-size: 14px; outline: none; background: #fff; color: #1f2937; }
    .collecty-inline-input:focus { border-color: ${primaryColor}; box-shadow: 0 0 0 3px ${primaryColor}20; }
    .collecty-inline-button { background: ${primaryColor}; color: white; border: none; padding: 12px 24px; border-radius: ${borderRadius}px; font-size: 14px; font-weight: 600; cursor: pointer; \${LAYOUT === 'vertical' ? 'width: 100%;' : ''} }
    .collecty-inline-button:hover:not(:disabled) { opacity: 0.9; }
    .collecty-inline-button:disabled { opacity: 0.6; cursor: not-allowed; }
    .collecty-inline-message { margin-top: 12px; padding: 12px; border-radius: ${borderRadius}px; font-size: 14px; text-align: center; }
    .collecty-inline-message:empty { display: none; }
    .collecty-inline-message.success { background: #dcfce7; color: #166534; }
    .collecty-inline-message.error { background: #fee2e2; color: #991b1b; }
    .collecty-inline-branding { text-align: center; margin-top: 16px; font-size: 11px; color: ${textColor}; opacity: 0.4; }
    .collecty-inline-branding a { color: inherit; text-decoration: none; }
    @media (max-width: 480px) { .collecty-inline-form { flex-direction: column; } .collecty-inline-button { width: 100%; } }
  \`;

  function createWidget(container) {
    const shadowRoot = container.attachShadow({ mode: 'closed' });
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);

    const wrapper = document.createElement('div');
    wrapper.className = 'collecty-inline-container';
    wrapper.innerHTML = 
      '<h3 class="collecty-inline-title">' + escapeHtml(WIDGET_TITLE) + '</h3>' +
      '<p class="collecty-inline-description">' + escapeHtml(WIDGET_DESCRIPTION) + '</p>' +
      '<form class="collecty-inline-form">' +
        '<input type="email" class="collecty-inline-input" placeholder="' + escapeHtml(PLACEHOLDER_TEXT) + '" required autocomplete="email" />' +
        '<button type="submit" class="collecty-inline-button">' + escapeHtml(BUTTON_TEXT) + '</button>' +
      '</form>' +
      '<div class="collecty-inline-message" role="status"></div>' +
      ${showBranding ? `'<p class="collecty-inline-branding">Powered by <a href="${escapeJs(appUrl)}" target="_blank">Collecty</a></p>'` : `''`};

    shadowRoot.appendChild(wrapper);

    const form = shadowRoot.querySelector('.collecty-inline-form');
    const input = shadowRoot.querySelector('.collecty-inline-input');
    const button = shadowRoot.querySelector('.collecty-inline-button');
    const messageEl = shadowRoot.querySelector('.collecty-inline-message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = input.value.trim();
      if (!email) return;

      const originalButtonText = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing...';
      messageEl.className = 'collecty-inline-message';
      messageEl.textContent = '';

      try {
        let geoData = null;
        try { const geoRes = await fetch('https://ipapi.co/json/'); if (geoRes.ok) geoData = await geoRes.json(); } catch {}

        const metadata = { userAgent: navigator.userAgent, referrer: document.referrer, pageUrl: window.location.href, source: 'inline-widget', widgetId: WIDGET_ID };
        if (geoData) Object.assign(metadata, { ip: geoData.ip, city: geoData.city, region: geoData.region, country: geoData.country_name, countryCode: geoData.country_code, timezone: geoData.timezone, latitude: geoData.latitude, longitude: geoData.longitude, org: geoData.org });

        const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, projectId: PROJECT_ID, metadata }) });
        const data = await response.json();

        if (response.ok) {
          if (LEAD_MAGNET_HTML) {
            const titleEl = wrapper.querySelector('.collecty-inline-title');
            const descEl = wrapper.querySelector('.collecty-inline-description');
            const formEl = wrapper.querySelector('.collecty-inline-form');
            const brandingEl = wrapper.querySelector('.collecty-inline-branding');
            
            if (titleEl) titleEl.textContent = LEAD_MAGNET_PREVIEW || WIDGET_TITLE;
            if (descEl) {
              descEl.innerHTML = LEAD_MAGNET_HTML;
              descEl.style.maxHeight = '300px';
              descEl.style.overflowY = 'auto';
            }
            if (formEl) formEl.style.display = 'none';
            if (messageEl) messageEl.style.display = 'none';
          } else {
            messageEl.className = 'collecty-inline-message success';
            messageEl.textContent = SUCCESS_MESSAGE;
            input.value = '';
          }
        } else throw new Error(data.error || 'Something went wrong');
      } catch (error) {
        messageEl.className = 'collecty-inline-message error';
        messageEl.textContent = error.message || 'An error occurred.';
      } finally {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
    });
  }

  function init() {
    const containers = document.querySelectorAll('[data-collecty-inline="' + WIDGET_ID + '"]');
    containers.forEach(container => {
      if (container.shadowRoot || container.hasAttribute('data-collecty-initialized')) return;
      container.setAttribute('data-collecty-initialized', 'true');
      createWidget(container);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  window.collectyInline = window.collectyInline || {};
  window.collectyInline[WIDGET_ID] = { init, create: (c) => { if (typeof c === 'string') c = document.querySelector(c); if (c && !c.hasAttribute('data-collecty-initialized')) { c.setAttribute('data-collecty-initialized', 'true'); createWidget(c); } } };
})();
`;

  return new NextResponse(widgetScript, {
    status: 200,
    headers: {
      ...securityHeaders,
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
