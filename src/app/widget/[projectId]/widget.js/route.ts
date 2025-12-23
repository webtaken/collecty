import { NextRequest, NextResponse } from "next/server";
import { db, projects } from "@/db";
import { eq } from "drizzle-orm";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  const { projectId } = await params;

  // Get project and its widget config
  const [project] = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId));

  if (!project || !project.isActive) {
    return new NextResponse("// Widget not found or inactive", {
      status: 404,
      headers: {
        "Content-Type": "application/javascript",
      },
    });
  }

  const config = project.widgetConfig as Record<string, unknown>;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  // Helper to safely escape strings for JavaScript injection
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

  // Extract config values with defaults (injected at build time)
  const title = escapeJs(String(config.title || "Subscribe to our newsletter"));
  const description = escapeJs(
    String(
      config.description || "Get the latest updates delivered to your inbox."
    )
  );
  const buttonText = escapeJs(String(config.buttonText || "Subscribe"));
  const successMessage = escapeJs(
    String(config.successMessage || "Thanks for subscribing!")
  );
  const primaryColor = escapeJs(String(config.primaryColor || "#3b82f6"));
  const backgroundColor = escapeJs(String(config.backgroundColor || "#ffffff"));
  const textColor = escapeJs(String(config.textColor || "#1f2937"));
  const showBranding = config.showBranding !== false;
  const triggerType = escapeJs(String(config.triggerType || "delay"));
  const triggerValue = Number(config.triggerValue) || 5;

  // Generate the widget JavaScript with Shadow DOM for complete isolation
  const widgetScript = `
(function() {
  'use strict';

  // Prevent multiple initializations
  if (window.__collectyLoaded) return;
  window.__collectyLoaded = true;

  const PROJECT_ID = "${projectId}";
  const API_URL = "${appUrl}/api/v1/subscribe";
  const WIDGET_TITLE = "${title}";
  const WIDGET_DESCRIPTION = "${description}";
  const BUTTON_TEXT = "${buttonText}";
  const SUCCESS_MESSAGE = "${successMessage}";
  const TRIGGER_TYPE = "${triggerType}";
  const TRIGGER_VALUE = ${triggerValue};

  // Widget state
  let shadowRoot = null;
  let hostElement = null;

  // Styles - scoped within Shadow DOM (completely isolated from host page)
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

  // Create widget using Shadow DOM for complete isolation
  function createWidget() {
    // Create host element
    hostElement = document.createElement('div');
    hostElement.id = 'collecty-widget-host';
    // Position the host element to cover the entire viewport
    hostElement.style.cssText = 'position: fixed; inset: 0; z-index: 2147483647; pointer-events: none;';
    document.body.appendChild(hostElement);

    // Create Shadow DOM (closed mode for extra encapsulation)
    shadowRoot = hostElement.attachShadow({ mode: 'closed' });

    // Add styles to Shadow DOM
    const styleEl = document.createElement('style');
    styleEl.textContent = styles;
    shadowRoot.appendChild(styleEl);

    // Create overlay inside Shadow DOM
    const overlay = document.createElement('div');
    overlay.className = 'collecty-overlay';
    overlay.style.pointerEvents = 'auto';
    overlay.innerHTML = '<div class="collecty-modal" role="dialog" aria-modal="true" aria-labelledby="collecty-title">' +
      '<button class="collecty-close" aria-label="Close dialog" type="button">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
          '<path d="M18 6L6 18M6 6l12 12"/>' +
        '</svg>' +
      '</button>' +
      '<h2 class="collecty-title" id="collecty-title">' + WIDGET_TITLE + '</h2>' +
      '<p class="collecty-description">' + WIDGET_DESCRIPTION + '</p>' +
      '<form class="collecty-form">' +
        '<input type="email" class="collecty-input" placeholder="Enter your email" required autocomplete="email" />' +
        '<button type="submit" class="collecty-button">' + BUTTON_TEXT + '</button>' +
      '</form>' +
      '<div class="collecty-message" role="status" aria-live="polite"></div>' +
      ${
        showBranding
          ? `'<p class="collecty-branding">Powered by <a href="${appUrl}" target="_blank" rel="noopener noreferrer">Collecty</a></p>'`
          : `''`
      } +
    '</div>';

    shadowRoot.appendChild(overlay);

    // Get elements from Shadow DOM
    const form = shadowRoot.querySelector('.collecty-form');
    const input = shadowRoot.querySelector('.collecty-input');
    const button = shadowRoot.querySelector('.collecty-button');
    const messageEl = shadowRoot.querySelector('.collecty-message');
    const closeBtn = shadowRoot.querySelector('.collecty-close');
    const modal = shadowRoot.querySelector('.collecty-modal');

    // Stop event propagation to prevent host page interference
    const stopPropagation = (e) => e.stopPropagation();
    
    // Prevent host page from capturing our events
    modal.addEventListener('click', stopPropagation);
    modal.addEventListener('mousedown', stopPropagation);
    modal.addEventListener('mouseup', stopPropagation);
    modal.addEventListener('keydown', stopPropagation);
    modal.addEventListener('keyup', stopPropagation);
    modal.addEventListener('keypress', stopPropagation);
    input.addEventListener('focus', stopPropagation);
    input.addEventListener('blur', stopPropagation);
    input.addEventListener('input', stopPropagation);

    // Close button handler
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      hideWidget();
    });

    // Click outside to close
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        hideWidget();
      }
    });

    // Escape key to close
    overlay.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        hideWidget();
      }
    });

    // Form submission handler
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
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email,
            projectId: PROJECT_ID,
            metadata: {
              userAgent: navigator.userAgent,
              referrer: document.referrer,
              pageUrl: window.location.href,
            },
          }),
        });

        const data = await response.json();

        if (response.ok) {
          messageEl.className = 'collecty-message success';
          messageEl.textContent = SUCCESS_MESSAGE;
          input.value = '';
          setTimeout(() => hideWidget(), 3000);
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
      // Focus the input for accessibility
      setTimeout(() => {
        const input = shadowRoot.querySelector('.collecty-input');
        if (input) input.focus();
      }, 100);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }
  }

  function hideWidget() {
    if (shadowRoot) {
      const overlay = shadowRoot.querySelector('.collecty-overlay');
      if (overlay) {
        overlay.classList.remove('active');
        hostElement.style.pointerEvents = 'none';
        // Restore body scroll
        document.body.style.overflow = '';
        // Set cookie to prevent showing again for 24 hours
        document.cookie = 'collecty_shown=1;max-age=86400;path=/;SameSite=Lax';
      }
    }
  }

  // Check if widget was already shown
  function hasBeenShown() {
    return document.cookie.includes('collecty_shown=1');
  }

  // Setup trigger based on configuration
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
        // Manual trigger only - user calls collecty('show')
        break;
      default:
        // Default to 5 second delay
        setTimeout(showWidget, 5000);
    }
  }

  // Initialize when DOM is ready
  function init() {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupTrigger);
    } else {
      setupTrigger();
    }
  }

  // Expose public API
  window.collecty = function(action, data) {
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
        // Clear the shown cookie to allow re-showing
        document.cookie = 'collecty_shown=;max-age=0;path=/;SameSite=Lax';
        break;
      default:
        console.warn('Collecty: Unknown action "' + action + '"');
    }
  };

  // Process any queued commands
  if (window.collecty.q && Array.isArray(window.collecty.q)) {
    const queue = window.collecty.q;
    queue.forEach(function(args) {
      window.collecty.apply(null, args);
    });
  }

  // Auto-initialize
  init();
})();
`;

  return new NextResponse(widgetScript, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "public, max-age=3600",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
