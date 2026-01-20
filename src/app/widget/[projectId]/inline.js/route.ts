import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/db";
import { eq } from "drizzle-orm";
import { z } from "zod";

// UUID validation schema
const uuidSchema = z.string().uuid();

// Validate CSS color (hex, rgb, rgba, hsl, hsla, or named colors)
const cssColorRegex =
  /^(#[0-9a-fA-F]{3,8}|rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)|rgba\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*[\d.]+\s*\)|hsl\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*\)|hsla\(\s*\d{1,3}\s*,\s*\d{1,3}%?\s*,\s*\d{1,3}%?\s*,\s*[\d.]+\s*\)|[a-zA-Z]+)$/;

// Valid layout types
const validLayoutTypes = ["horizontal", "vertical"] as const;

// Simple in-memory rate limiter
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(
  identifier: string,
  limit: number = 60,
  windowMs: number = 60000,
): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  // Clean up old entries periodically (every 100th check)
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
  { params }: { params: Promise<{ projectId: string }> },
) {
  const { projectId } = await params;

  // Rate limit by IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(`inline-widget:${ip}`)) {
    return new NextResponse("// Rate limited. Please try again later.", {
      status: 429,
      headers: securityHeaders,
    });
  }

  // Validate projectId is a valid UUID to prevent injection
  const uuidValidation = uuidSchema.safeParse(projectId);
  if (!uuidValidation.success) {
    return new NextResponse("// Invalid project ID", {
      status: 400,
      headers: securityHeaders,
    });
  }

  // Get project and its inline widget config
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!project || !project.isActive) {
    return new NextResponse("// Widget not found or inactive", {
      status: 404,
      headers: securityHeaders,
    });
  }

  const config = project.inlineWidgetConfig as Record<string, unknown>;
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

  // Validate layout type
  const sanitizeLayoutType = (type: unknown): string => {
    const typeStr = String(type || "horizontal").toLowerCase();
    if (
      validLayoutTypes.includes(typeStr as (typeof validLayoutTypes)[number])
    ) {
      return typeStr;
    }
    return "horizontal";
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

  // Escape projectId for safe JavaScript injection (already validated as UUID)
  const safeProjectId = escapeJs(projectId);

  // Generate the inline widget JavaScript with Shadow DOM for isolation
  const widgetScript = `
(function() {
  'use strict';

  const PROJECT_ID = "${safeProjectId}";
  const API_URL = "${escapeJs(appUrl)}/api/v1/subscribe";
  const WIDGET_TITLE = "${title}";
  const WIDGET_DESCRIPTION = "${description}";
  const BUTTON_TEXT = "${buttonText}";
  const SUCCESS_MESSAGE = "${successMessage}";
  const PLACEHOLDER_TEXT = "${placeholderText}";
  const LAYOUT = "${escapeJs(layout)}";

  // HTML encode function to prevent XSS when inserting into innerHTML
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // Styles - scoped within Shadow DOM
  const styles = \`
    :host {
      all: initial;
      display: block;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }
    *, *::before, *::after {
      box-sizing: border-box;
    }
    .collecty-inline-container {
      background: ${backgroundColor};
      border-radius: ${borderRadius}px;
      padding: 24px;
      width: 100%;
    }
    .collecty-inline-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px;
      color: ${textColor};
      line-height: 1.3;
    }
    .collecty-inline-description {
      font-size: 14px;
      color: ${textColor};
      opacity: 0.7;
      margin: 0 0 16px;
      line-height: 1.5;
    }
    .collecty-inline-form {
      display: flex;
      gap: 12px;
      \${LAYOUT === 'vertical' ? 'flex-direction: column;' : 'flex-direction: row; flex-wrap: wrap;'}
    }
    .collecty-inline-input {
      flex: 1;
      min-width: 200px;
      padding: 12px 16px;
      border: 2px solid #e2e8f0;
      border-radius: ${borderRadius}px;
      font-size: 14px;
      font-family: inherit;
      outline: none;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      background: #ffffff;
      color: #1f2937;
    }
    .collecty-inline-input::placeholder {
      color: #9ca3af;
    }
    .collecty-inline-input:focus {
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px ${primaryColor}20;
    }
    .collecty-inline-button {
      background: ${primaryColor};
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: ${borderRadius}px;
      font-size: 14px;
      font-weight: 600;
      font-family: inherit;
      cursor: pointer;
      transition: opacity 0.2s ease, transform 0.2s ease;
      white-space: nowrap;
      \${LAYOUT === 'vertical' ? 'width: 100%;' : ''}
    }
    .collecty-inline-button:hover:not(:disabled) {
      opacity: 0.9;
    }
    .collecty-inline-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    .collecty-inline-button:focus {
      outline: 2px solid ${primaryColor};
      outline-offset: 2px;
    }
    .collecty-inline-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    .collecty-inline-message {
      margin-top: 12px;
      padding: 12px;
      border-radius: ${borderRadius}px;
      font-size: 14px;
      text-align: center;
      line-height: 1.4;
    }
    .collecty-inline-message:empty {
      display: none;
    }
    .collecty-inline-message.success {
      background: #dcfce7;
      color: #166534;
    }
    .collecty-inline-message.error {
      background: #fee2e2;
      color: #991b1b;
    }
    .collecty-inline-branding {
      text-align: center;
      margin-top: 16px;
      font-size: 11px;
      color: ${textColor};
      opacity: 0.4;
    }
    .collecty-inline-branding a {
      color: inherit;
      text-decoration: none;
    }
    .collecty-inline-branding a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      .collecty-inline-form {
        flex-direction: column;
      }
      .collecty-inline-button {
        width: 100%;
      }
    }
  \`;

  // Create widget inside a container element
  function createWidget(container) {
    // Create Shadow DOM for style isolation
    const shadowRoot = container.attachShadow({ mode: 'closed' });

    // Add styles
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);

    // Create widget HTML
    const wrapper = document.createElement('div');
    wrapper.className = 'collecty-inline-container';
    wrapper.innerHTML = 
      '<h3 class="collecty-inline-title">' + escapeHtml(WIDGET_TITLE) + '</h3>' +
      '<p class="collecty-inline-description">' + escapeHtml(WIDGET_DESCRIPTION) + '</p>' +
      '<form class="collecty-inline-form">' +
        '<input type="email" class="collecty-inline-input" placeholder="' + escapeHtml(PLACEHOLDER_TEXT) + '" required autocomplete="email" />' +
        '<button type="submit" class="collecty-inline-button">' + escapeHtml(BUTTON_TEXT) + '</button>' +
      '</form>' +
      '<div class="collecty-inline-message" role="status" aria-live="polite"></div>' +
      ${
        showBranding
          ? `'<p class="collecty-inline-branding">Powered by <a href="${escapeJs(
              appUrl,
            )}" target="_blank" rel="noopener noreferrer">Collecty</a></p>'`
          : `''`
      };

    shadowRoot.appendChild(wrapper);

    // Get form elements
    const form = shadowRoot.querySelector('.collecty-inline-form');
    const input = shadowRoot.querySelector('.collecty-inline-input');
    const button = shadowRoot.querySelector('.collecty-inline-button');
    const messageEl = shadowRoot.querySelector('.collecty-inline-message');

    // Form submission handler
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const email = input.value.trim();
      if (!email) return;

      const originalButtonText = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing...';
      messageEl.className = 'collecty-inline-message';
      messageEl.textContent = '';

      try {
        // Fetch geolocation data from ipapi.co (client-side to avoid rate limits)
        let geoData = null;
        try {
          const geoRes = await fetch('https://ipapi.co/json/');
          if (geoRes.ok) {
            geoData = await geoRes.json();
          }
        } catch (geoErr) {
          // Geolocation fetch failed, continue without it
        }

        // Build metadata object
        const metadata = {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          pageUrl: window.location.href,
          source: 'inline-widget'
        };

        // Add geolocation data if available
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
          messageEl.className = 'collecty-inline-message success';
          messageEl.textContent = SUCCESS_MESSAGE;
          input.value = '';
        } else {
          throw new Error(data.error || 'Something went wrong');
        }
      } catch (error) {
        messageEl.className = 'collecty-inline-message error';
        messageEl.textContent = error.message || 'An error occurred. Please try again.';
      } finally {
        button.disabled = false;
        button.textContent = originalButtonText;
      }
    });
  }

  // Initialize all inline widgets on the page
  function init() {
    const containers = document.querySelectorAll('[data-collecty-inline="' + PROJECT_ID + '"]');
    containers.forEach(function(container) {
      // Skip if already initialized
      if (container.shadowRoot || container.hasAttribute('data-collecty-initialized')) {
        return;
      }
      container.setAttribute('data-collecty-initialized', 'true');
      createWidget(container);
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose public API for manual initialization
  window.collectyInline = window.collectyInline || {};
  window.collectyInline[PROJECT_ID] = {
    init: init,
    create: function(container) {
      if (typeof container === 'string') {
        container = document.querySelector(container);
      }
      if (container && !container.hasAttribute('data-collecty-initialized')) {
        container.setAttribute('data-collecty-initialized', 'true');
        createWidget(container);
      }
    }
  };
})();
`;

  return new NextResponse(widgetScript, {
    status: 200,
    headers: {
      ...securityHeaders,
      "Cache-Control": "no-cache, no-store, must-revalidate", // No caching to ensure config changes are reflected immediately
      "Access-Control-Allow-Origin": "*",
    },
  });
}
