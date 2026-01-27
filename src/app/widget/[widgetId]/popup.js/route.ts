import { NextRequest, NextResponse } from "next/server";
import { db, widgets, projects, leadMagnets } from "@/db";
import { eq, and } from "drizzle-orm";
import { z } from "zod";
import type { WidgetConfigUnified } from "@/db/schema/widgets";
import { renderTiptapToHtml } from "@/lib/tiptap-renderer";
import type { RichTextContent } from "@/db/schema/lead-magnets";

// UUID validation schema
const uuidSchema = z.string().uuid();

// Validate CSS color
const cssColorRegex =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

// Valid trigger types
const validTriggerTypes = ["delay", "scroll", "exit-intent", "click"] as const;

// Simple in-memory rate limiter
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
      if (now > value.resetTime) {
        rateLimitMap.delete(key);
      }
    }
  }

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

// Security headers for the widget script
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

  // Rate limit by IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(`widget:${ip}`)) {
    return new NextResponse("// Rate limited. Please try again later.", {
      status: 429,
      headers: securityHeaders,
    });
  }

  // Validate ID is a valid UUID
  const uuidValidation = uuidSchema.safeParse(widgetId);
  if (!uuidValidation.success) {
    return new NextResponse("// Invalid ID", {
      status: 400,
      headers: securityHeaders,
    });
  }

  // First, try to find a widget with this ID
  let result = await db
    .select({
      widget: widgets,
      project: projects,
      leadMagnet: leadMagnets,
    })
    .from(widgets)
    .innerJoin(projects, eq(widgets.projectId, projects.id))
    .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
    .where(eq(widgets.id, widgetId))
    .then((rows) => rows[0]);

  // If not found as widget, try to find it as a projectId (backward compatibility)
  if (!result) {
    // Check if this is a project ID and get its default widget
    const projectResult = await db
      .select({
        widget: widgets,
        project: projects,
        leadMagnet: leadMagnets,
      })
      .from(widgets)
      .innerJoin(projects, eq(widgets.projectId, projects.id))
      .leftJoin(leadMagnets, eq(widgets.leadMagnetId, leadMagnets.id))
      .where(and(eq(widgets.projectId, widgetId), eq(widgets.isDefault, true)))
      .then((rows) => rows[0]);

    if (!projectResult) {
      // Fallback: get any widget for this project
      const anyWidgetResult = await db
        .select({
          widget: widgets,
          project: projects,
          leadMagnet: leadMagnets,
        })
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

  // Helper to safely escape strings for JavaScript string literals
  const escapeJs = (str: string): string => {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/\t/g, "\\t")
      .replace(/</g, "\\x3c")
      .replace(/>/g, "\\x3e")
      .replace(/\u2028/g, "\\u2028")
      .replace(/\u2029/g, "\\u2029");
  };

  // Validate and sanitize color values
  const sanitizeColor = (color: unknown, defaultColor: string): string => {
    const colorStr = String(color || defaultColor).trim();
    if (cssColorRegex.test(colorStr)) {
      return colorStr;
    }
    return defaultColor;
  };

  // Validate trigger type
  const sanitizeTriggerType = (type: unknown): string => {
    const typeStr = String(type || "delay").toLowerCase();
    if (
      validTriggerTypes.includes(typeStr as (typeof validTriggerTypes)[number])
    ) {
      return typeStr;
    }
    return "delay";
  };

  // Sanitize text input with length limits
  const sanitizeText = (
    text: unknown,
    defaultText: string,
    maxLength: number = 500,
  ): string => {
    const textStr = String(text || defaultText).slice(0, maxLength);
    return escapeJs(textStr);
  };

  // Extract and validate config values with defaults
  const title = sanitizeText(config.title, "Subscribe to our newsletter", 200);
  const description = sanitizeText(
    config.description,
    "Get the latest updates delivered to your inbox.",
    500,
  );
  const buttonText = sanitizeText(config.buttonText, "Subscribe", 50);
  const successMessage = sanitizeText(
    config.successMessage,
    "Thanks for subscribing!",
    200,
  );
  const primaryColor = sanitizeColor(config.primaryColor, "#3b82f6");
  const backgroundColor = sanitizeColor(config.backgroundColor, "#ffffff");
  const textColor = sanitizeColor(config.textColor, "#1f2937");
  const showBranding = config.showBranding !== false;
  const triggerType = sanitizeTriggerType(config.triggerType);
  const triggerValue = Math.max(
    0,
    Math.min(Number(config.triggerValue) || 5, 3600),
  );

  // Prepare lead magnet data if available
  const leadMagnetPreview = result.leadMagnet?.previewText
    ? sanitizeText(result.leadMagnet.previewText, "", 500)
    : "";
  const leadMagnetHtml = result.leadMagnet?.description
    ? renderTiptapToHtml(result.leadMagnet.description as RichTextContent)
    : "";

  // Use widgetId for tracking
  const safeWidgetId = escapeJs(widgetId);
  const safeProjectId = escapeJs(result.project.id);

  // Generate the widget JavaScript
  const widgetScript = `
(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.__collectyLoaded_${safeWidgetId.replace(/-/g, "_")}) return;
  window.__collectyLoaded_${safeWidgetId.replace(/-/g, "_")} = true;

  const WIDGET_ID = "${safeWidgetId}";
  const PROJECT_ID = "${safeProjectId}";
  const API_URL = "${escapeJs(appUrl)}/api/v1/subscribe";
  const WIDGET_TITLE = "${title}";
  const WIDGET_DESCRIPTION = "${description}";
  const BUTTON_TEXT = "${buttonText}";
  const SUCCESS_MESSAGE = "${successMessage}";
  const LEAD_MAGNET_PREVIEW = "${leadMagnetPreview}";
  const LEAD_MAGNET_HTML = "${escapeJs(leadMagnetHtml)}";
  const TRIGGER_TYPE = "${escapeJs(triggerType)}";
  const TRIGGER_VALUE = ${triggerValue};

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  let shadowRoot = null;
  let hostElement = null;

  const styles = \`
    :host {
      all: initial;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .collecty-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2147483647;
      opacity: 0;
      visibility: hidden;
      transition: opacity 0.3s ease, visibility 0.3s ease;
      font-family: inherit;
    }
    .collecty-overlay.active {
      opacity: 1;
      visibility: visible;
    }
    .collecty-modal {
      background: ${backgroundColor};
      border-radius: 16px;
      padding: 32px;
      max-width: 420px;
      width: 90%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transform: scale(0.9) translateY(20px);
      transition: transform 0.3s ease;
      position: relative;
    }
    .collecty-overlay.active .collecty-modal {
      transform: scale(1) translateY(0);
    }
    .collecty-close {
      position: absolute;
      top: 12px;
      right: 12px;
      background: none;
      border: none;
      cursor: pointer;
      padding: 8px;
      color: ${textColor};
      opacity: 0.5;
      transition: opacity 0.2s ease;
      line-height: 1;
    }
    .collecty-close:hover {
      opacity: 1;
    }
    .collecty-close:focus {
      outline: 2px solid ${primaryColor};
      outline-offset: 2px;
    }
    .collecty-title {
      font-size: 24px;
      font-weight: 700;
      margin: 0 0 8px;
      color: ${textColor};
      line-height: 1.2;
    }
    .collecty-description {
      font-size: 14px;
      color: ${textColor};
      opacity: 0.7;
      margin: 0 0 24px;
      line-height: 1.5;
    }
    .collecty-form {
      display: flex;
      gap: 12px;
    }
    .collecty-input {
      flex: 1;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: 8px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background: #ffffff;
      color: #1f2937;
    }
    .collecty-input::placeholder {
      color: #9ca3af;
    }
    .collecty-input:focus {
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px ${primaryColor}20;
    }
    .collecty-button {
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 8px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.2s ease;
      white-space: nowrap;
    }
    .collecty-button:hover:not(:disabled) {
      opacity: 0.9;
    }
    .collecty-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .collecty-button:focus {
      outline: 2px solid ${primaryColor};
      outline-offset: 2px;
    }
    .collecty-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .collecty-message {
      margin-top: 16px;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
      text-align: center;
      line-height: 1.4;
    }
    .collecty-message:empty {
      display: none;
    }
    .collecty-message.success {
      background: #dcfce7;
      color: #166534;
    }
    .collecty-message.error {
      background: #fee2e2;
      color: #991b1b;
    }
    .collecty-branding {
      text-align: center;
      margin-top: 20px;
      font-size: 11px;
      color: ${textColor};
      opacity: 0.4;
    }
    .collecty-branding a {
      color: inherit;
      text-decoration: none;
    }
    .collecty-branding a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .collecty-form {
        flex-direction: column;
      }
      .collecty-modal {
        padding: 24px;
        margin: 16px;
      }
    }
  \`;

  function createWidget() {
    hostElement = document.createElement('div');
    hostElement.id = 'collecty-widget-host-' + WIDGET_ID;
    hostElement.style.cssText = 'position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
    document.body.appendChild(hostElement);

    shadowRoot = hostElement.attachShadow({ mode: 'closed' });

    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);

    const overlay = document.createElement('div');
    overlay.className = 'collecty-overlay';
    overlay.style.pointerEvents = 'auto';
    overlay.innerHTML = '<div class="collecty-modal" role="dialog" aria-modal="true" aria-labelledby="collecty-title">' +
      '<button class="collecty-close" aria-label="Close dialog" type="button">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M18 6L6 18M6 6l12 12"/>' +
        '</svg>' +
      '</button>' +
      '<h2 class="collecty-title" id="collecty-title">' + escapeHtml(WIDGET_TITLE) + '</h2>' +
      '<p class="collecty-description">' + escapeHtml(WIDGET_DESCRIPTION) + '</p>' +
      '<form class="collecty-form">' +
        '<input type="email" class="collecty-input" placeholder="Enter your email" required autocomplete="email" />' +
        '<button type="submit" class="collecty-button">' + escapeHtml(BUTTON_TEXT) + '</button>' +
      '</form>' +
      '<div class="collecty-message" role="status" aria-live="polite"></div>' +
      ${
        showBranding
          ? `'<p class="collecty-branding">Powered by <a href="${escapeJs(
              appUrl,
            )}" target="_blank" rel="noopener noreferrer">Collecty</a></p>'`
          : `''`
      } +
    '</div>';

    shadowRoot.appendChild(overlay);

    const form = shadowRoot.querySelector('.collecty-form');
    const input = shadowRoot.querySelector('.collecty-input');
    const button = shadowRoot.querySelector('.collecty-button');
    const messageEl = shadowRoot.querySelector('.collecty-message');
    const closeBtn = shadowRoot.querySelector('.collecty-close');
    const modal = shadowRoot.querySelector('.collecty-modal');

    const stopPropagation = (e) => e.stopPropagation();
    
    modal.addEventListener('click', stopPropagation);
    modal.addEventListener('mousedown', stopPropagation);
    modal.addEventListener('mouseup', stopPropagation);
    modal.addEventListener('keydown', stopPropagation);
    modal.addEventListener('keyup', stopPropagation);
    modal.addEventListener('keypress', stopPropagation);
    input.addEventListener('focus', stopPropagation);
    input.addEventListener('blur', stopPropagation);
    input.addEventListener('input', stopPropagation);

    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideWidget(false);
    });

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideWidget(false);
      }
    });

    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        hideWidget(false);
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const email = input.value.trim();
      if (!email) return;

      const originalButtonText = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing...';
      messageEl.className = 'collecty-message';
      messageEl.textContent = '';

      try {
        let geoData = null;
        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            geoData = await geoRes.json();
          }
        } catch (geoErr) {}

        const metadata = {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          pageUrl: window.location.href,
          source: 'popup-widget',
          widgetId: WIDGET_ID
        };

        if (geoData) {
          metadata.ip = geoData.ip;
          metadata.city = geoData.city;
          metadata.region = geoData.region;
          metadata.country = geoData.country_name;
          metadata.countryCode = geoData.country_code;
          metadata.timezone = geoData.timezone;
          metadata.latitude = geoData.latitude;
          metadata.longitude = geoData.longitude;
          metadata.org = geoData.org;
        }

        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            projectId: PROJECT_ID,
            metadata: metadata,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          if (LEAD_MAGNET_HTML) {
            const titleEl = modal.querySelector('.collecty-title');
            const descEl = modal.querySelector('.collecty-description');
            const formEl = modal.querySelector('.collecty-form');
            
            if (titleEl) titleEl.textContent = LEAD_MAGNET_PREVIEW || WIDGET_TITLE;
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
            setTimeout(() => hideWidget(true), 2000);
          }
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (error) {
        messageEl.className = 'collecty-message error';
        messageEl.textContent = error.message || 'An error occurred. Please try again.';
      } finally {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
    });

    return overlay;
  }

  function showWidget() {
    if (!shadowRoot) {
      createWidget();
    }
    const overlay = shadowRoot.querySelector('.collecty-overlay');
    if (overlay) {
      overlay.classList.add('active');
      hostElement.style.pointerEvents = 'auto';
      setTimeout(() => {
        const input = shadowRoot.querySelector('.collecty-input');
        if (input) input.focus();
      }, 100);
      document.body.style.overflow = 'hidden';
    }
  }

  function hideWidget(setCookie = true) {
    if (shadowRoot) {
      const overlay = shadowRoot.querySelector('.collecty-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        hostElement.style.pointerEvents = 'none';
        document.body.style.overflow = '';
        if (setCookie) {
          document.cookie = 'collecty_' + WIDGET_ID + '=1;max-age=86400;path=/;SameSite=Lax';
        }
      }
    }
  }

  function hasBeenShown() {
    return document.cookie.includes('collecty_' + WIDGET_ID + '=1');
  }

  function setupTrigger() {
    if (hasBeenShown()) return;

    switch (TRIGGER_TYPE) {
      case 'delay':
        setTimeout(showWidget, TRIGGER_VALUE * 1000);
        break;
      case 'scroll':
        const handleScroll = () => {
          const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (scrollHeight <= 0) return;
          const scrollPercent = (window.scrollY / scrollHeight) * 100;
          if (scrollPercent >= TRIGGER_VALUE) {
            showWidget();
            window.removeEventListener('scroll', handleScroll, { passive: true });
          }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        break;
      case 'exit-intent':
        const handleMouseLeave = (e) => {
          if (e.clientY <= 0) {
            showWidget();
            document.removeEventListener('mouseleave', handleMouseLeave);
          }
        };
        document.addEventListener('mouseleave', handleMouseLeave);
        break;
      case 'click':
        break;
      default:
        setTimeout(showWidget, 5000);
    }
  }

  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupTrigger);
    } else {
      setupTrigger();
    }
  }

  window.collecty = window.collecty || function(action, data) {
    switch (action) {
      case 'show':
        showWidget();
        break;
      case 'hide':
        hideWidget();
        break;
      case 'init':
        init();
        break;
      case 'reset':
        document.cookie = 'collecty_' + WIDGET_ID + '=;max-age=0;path=/;SameSite=Lax';
        break;
      default:
        console.warn('Collecty: Unknown action "' + action + '"');
    }
  };

  if (window.collecty.q && Array.isArray(window.collecty.q)) {
    const queue = window.collecty.q;
    queue.forEach(function(args) {
      window.collecty.apply(null, args);
    });
  }

  init();
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
