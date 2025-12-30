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
  windowMs: number = 60000
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

// Security headers
const securityHeaders = {
  "Content-Type": "text/html; charset=utf-8",
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Rate limit by IP
  const forwarded = request.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  if (isRateLimited(`inline-html:${ip}`)) {
    return new NextResponse("<!-- Rate limited. Please try again later. -->", {
      status: 429,
      headers: securityHeaders,
    });
  }

  // Validate projectId is a valid UUID
  const uuidValidation = uuidSchema.safeParse(projectId);
  if (!uuidValidation.success) {
    return new NextResponse("<!-- Invalid project ID -->", {
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
    return new NextResponse("<!-- Widget not found or inactive -->", {
      status: 404,
      headers: securityHeaders,
    });
  }

  const config = project.inlineWidgetConfig as Record<string, unknown>;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  // Helper to safely escape strings for HTML
  const escapeHtml = (str: string): string => {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  };

  // Helper to safely escape strings for JavaScript
  const escapeJs = (str: string): string => {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r")
      .replace(/</g, "\\x3c")
      .replace(/>/g, "\\x3e");
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
    maxLength: number = 500
  ): string => {
    return String(text || defaultText).slice(0, maxLength);
  };

  // Extract and validate config values
  const title = sanitizeText(config.title, "Subscribe to our newsletter", 200);
  const description = sanitizeText(
    config.description,
    "Get the latest updates delivered to your inbox.",
    500
  );
  const buttonText = sanitizeText(config.buttonText, "Subscribe", 50);
  const successMessage = sanitizeText(
    config.successMessage,
    "Thanks for subscribing!",
    200
  );
  const placeholderText = sanitizeText(
    config.placeholderText,
    "Enter your email",
    100
  );
  const primaryColor = sanitizeColor(config.primaryColor, "#6366f1");
  const backgroundColor = sanitizeColor(config.backgroundColor, "#f8fafc");
  const textColor = sanitizeColor(config.textColor, "#1f2937");
  const showBranding = config.showBranding !== false;
  const layout = sanitizeLayoutType(config.layout);
  const borderRadius = Math.max(
    0,
    Math.min(Number(config.borderRadius) || 8, 32)
  );

  const isVertical = layout === "vertical";

  // Generate self-contained HTML snippet
  const htmlSnippet = `<!-- Collecty Inline Email Form -->
<div class="collecty-inline-widget" id="collecty-${projectId}">
  <style>
    #collecty-${projectId} {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      box-sizing: border-box;
    }
    #collecty-${projectId} *, #collecty-${projectId} *::before, #collecty-${projectId} *::after {
      box-sizing: border-box;
    }
    #collecty-${projectId} .collecty-container {
      background: ${backgroundColor};
      border-radius: ${borderRadius}px;
      padding: 24px;
      width: 100%;
      max-width: 480px;
      margin: 0 auto;
      text-align: center;
    }
    #collecty-${projectId} .collecty-title {
      font-size: 18px;
      font-weight: 700;
      margin: 0 0 4px;
      color: ${textColor};
      line-height: 1.3;
    }
    #collecty-${projectId} .collecty-description {
      font-size: 14px;
      color: ${textColor};
      opacity: 0.7;
      margin: 0 0 16px;
      line-height: 1.5;
    }
    #collecty-${projectId} .collecty-form {
      display: flex;
      gap: 12px;
      justify-content: center;
      ${
        isVertical
          ? "flex-direction: column; align-items: stretch;"
          : "flex-direction: row; flex-wrap: wrap; align-items: center;"
      }
    }
    #collecty-${projectId} .collecty-input {
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
      text-align: left;
    }
    #collecty-${projectId} .collecty-input::placeholder {
      color: #9ca3af;
    }
    #collecty-${projectId} .collecty-input:focus {
      border-color: ${primaryColor};
      box-shadow: 0 0 0 3px ${primaryColor}20;
    }
    #collecty-${projectId} .collecty-button {
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
      ${isVertical ? "width: 100%;" : ""}
    }
    #collecty-${projectId} .collecty-button:hover:not(:disabled) {
      opacity: 0.9;
    }
    #collecty-${projectId} .collecty-button:active:not(:disabled) {
      transform: scale(0.98);
    }
    #collecty-${projectId} .collecty-button:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    #collecty-${projectId} .collecty-message {
      margin-top: 12px;
      padding: 12px;
      border-radius: ${borderRadius}px;
      font-size: 14px;
      text-align: center;
      line-height: 1.4;
      display: none;
    }
    #collecty-${projectId} .collecty-message.visible {
      display: block;
    }
    #collecty-${projectId} .collecty-message.success {
      background: #dcfce7;
      color: #166534;
    }
    #collecty-${projectId} .collecty-message.error {
      background: #fee2e2;
      color: #991b1b;
    }
    #collecty-${projectId} .collecty-branding {
      text-align: center;
      margin-top: 16px;
      font-size: 11px;
      color: ${textColor};
      opacity: 0.4;
    }
    #collecty-${projectId} .collecty-branding a {
      color: inherit;
      text-decoration: none;
    }
    #collecty-${projectId} .collecty-branding a:hover {
      text-decoration: underline;
    }
    @media (max-width: 480px) {
      #collecty-${projectId} .collecty-form {
        flex-direction: column;
      }
      #collecty-${projectId} .collecty-button {
        width: 100%;
      }
    }
  </style>
  <div class="collecty-container">
    <h3 class="collecty-title">${escapeHtml(title)}</h3>
    <p class="collecty-description">${escapeHtml(description)}</p>
    <form class="collecty-form" onsubmit="return collectySubmit_${projectId.replace(
      /-/g,
      "_"
    )}(event)">
      <input type="email" class="collecty-input" placeholder="${escapeHtml(
        placeholderText
      )}" required autocomplete="email" />
      <button type="submit" class="collecty-button">${escapeHtml(
        buttonText
      )}</button>
    </form>
    <div class="collecty-message" role="status" aria-live="polite"></div>
    ${
      showBranding
        ? `<p class="collecty-branding">Powered by <a href="${escapeHtml(
            appUrl
          )}" target="_blank" rel="noopener noreferrer">Collecty</a></p>`
        : ""
    }
  </div>
  <script>
    function collectySubmit_${projectId.replace(/-/g, "_")}(e) {
      e.preventDefault();
      var form = e.target;
      var container = document.getElementById('collecty-${projectId}');
      var input = form.querySelector('.collecty-input');
      var button = form.querySelector('.collecty-button');
      var messageEl = container.querySelector('.collecty-message');
      var email = input.value.trim();
      if (!email) return false;
      
      var originalText = button.textContent;
      button.disabled = true;
      button.textContent = 'Subscribing...';
      messageEl.className = 'collecty-message';
      messageEl.textContent = '';
      
      // Fetch geolocation data from ipapi.co (client-side to avoid rate limits)
      var geoPromise = fetch('https://ipapi.co/json/')
        .then(function(res) { return res.ok ? res.json() : null; })
        .catch(function() { return null; });
      
      geoPromise.then(function(geoData) {
        var metadata = {
          userAgent: navigator.userAgent,
          referrer: document.referrer,
          pageUrl: window.location.href,
          source: 'inline-html'
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
        
        return fetch('${escapeJs(appUrl)}/api/v1/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            projectId: '${escapeJs(projectId)}',
            metadata: metadata
          })
        });
      })
      .then(function(response) {
        return response.json().then(function(data) {
          return { ok: response.ok, data: data };
        });
      })
      .then(function(result) {
        if (result.ok) {
          messageEl.className = 'collecty-message success visible';
          messageEl.textContent = '${escapeJs(successMessage)}';
          input.value = '';
        } else {
          throw new Error(result.data.error || 'Something went wrong');
        }
      })
      .catch(function(error) {
        messageEl.className = 'collecty-message error visible';
        messageEl.textContent = error.message || 'An error occurred. Please try again.';
      })
      .finally(function() {
        button.disabled = false;
        button.textContent = originalText;
      });
      
      return false;
    }
  </script>
</div>
<!-- End Collecty Inline Email Form -->`;

  return new NextResponse(htmlSnippet, {
    status: 200,
    headers: {
      ...securityHeaders,
      "Cache-Control": "public, max-age=300, stale-while-revalidate=60",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
