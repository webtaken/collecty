"use client";

import { useState } from "react";
import { useWidgetContext } from "./widget-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Check, Copy, Code, FileCode, ExternalLink, Info } from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  frameworks,
  getFrameworkById,
  type FrameworkId,
} from "@/lib/frameworks/install-code-generator";

export function WidgetInstallNew() {
  const { selectedWidget, activeEmbedType, selectedFramework, setSelectedFramework } =
    useWidgetContext();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.dev";
  const widgetId = selectedWidget?.id || "";

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  // Get selected framework info
  const framework = selectedFramework
    ? getFrameworkById(selectedFramework)
    : null;

  // Generate framework-specific code if a framework is selected
  const getFrameworkCode = (widgetType: "popup" | "inline") => {
    if (framework) {
      return framework.generateCode(widgetId, widgetType, appUrl);
    }
    return null;
  };

  // Fallback generic embed codes
  const popupScriptCode = `<!-- Collecty Popup Widget -->
<script src="${appUrl}/widget/${widgetId}/popup.js" async></script>`;

  const inlineScriptCode = `<!-- Collecty Inline Widget -->
<div data-collecty-inline="${widgetId}"></div>
<script src="${appUrl}/widget/${widgetId}/inline.js" async></script>`;

  const inlineIframeCode = `<!-- Collecty Inline Widget (iframe) -->
<iframe
  src="${appUrl}/widget/${widgetId}/inline.html"
  style="width: 100%; border: none; min-height: 200px;"
  title="Subscribe Form"
></iframe>`;

  const reactPopupCode = `// Add to your component

import { useEffect } from 'react';

export function CollectyWidget() {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${widgetId}/popup.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return null;
}

// Then use: <CollectyWidget />`;

  const reactInlineCode = `// Add to your component

import { useEffect, useRef } from 'react';

export function CollectyInlineWidget() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${appUrl}/widget/${widgetId}/inline.js';
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  return <div ref={containerRef} data-collecty-inline="${widgetId}" />;
}`;

  if (!selectedWidget) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>Select a widget to get the embed code</p>
      </div>
    );
  }

  // Framework-specific code for the selected framework
  const frameworkPopupCode = getFrameworkCode("popup");
  const frameworkInlineCode = getFrameworkCode("inline");

  return (
    <div className="space-y-6 p-1">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" />
          Install Widget
        </h2>
        <p className="text-muted-foreground mt-1">
          Copy the code snippet and add it to your website
        </p>
      </div>

      {/* Framework Selector */}
      <div className="space-y-4">
        <h3 className="text-sm font-medium text-slate-900">Select your Framework</h3>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
          {frameworks.map((fw) => {
            const Icon = fw.icon;
            const isSelected = selectedFramework === fw.id;
            return (
              <button
                key={fw.id}
                onClick={() => setSelectedFramework(fw.id)}
                className={cn(
                  "flex flex-col items-center justify-center p-3 rounded-lg border transition-all duration-200",
                  isSelected
                    ? "border-orange-500 bg-orange-50 text-orange-700 ring-2 ring-orange-500/20"
                    : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <Icon className="w-6 h-6 mb-2" />
                <span className="text-[10px] font-medium uppercase tracking-wider text-center w-full truncate">
                  {fw.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Widget badge */}
      <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-white rounded-xl border">
        <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
          <FileCode className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <p className="font-medium">{selectedWidget.name}</p>
          <p className="text-xs text-muted-foreground font-mono">
            ID: {selectedWidget.id.slice(0, 8)}...
          </p>
        </div>
        {framework && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-lg">
            <framework.icon className="h-4 w-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">
              {framework.name}
            </span>
          </div>
        )}
      </div>

      {/* Framework-specific instructions notice */}
      {framework && (
        <div className="flex items-start gap-3 p-4 bg-orange-50 border border-orange-100 rounded-xl">
          <Info className="h-5 w-5 text-orange-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-orange-900">
              {framework.name} Installation Instructions
            </p>
            <p className="text-xs text-orange-700 mt-0.5">
              {framework.description} • Add to{" "}
              <code className="bg-orange-100 px-1 rounded">
                {framework.fileLocation}
              </code>
            </p>
          </div>
        </div>
      )}

      <Tabs
        defaultValue={activeEmbedType === "popup" ? "popup" : "inline"}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="popup" className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
              />
            </svg>
            Popup Widget
          </TabsTrigger>
          <TabsTrigger value="inline" className="gap-2">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5z"
              />
            </svg>
            Inline Form
          </TabsTrigger>
        </TabsList>

        <TabsContent value="popup" className="space-y-6 mt-6">
          {/* Show framework-specific code first if framework is selected */}
          {framework && frameworkPopupCode && (
            <CodeBlock
              title={`${framework.name} Integration`}
              description={`Optimized for ${framework.name} - ${framework.fileLocation}`}
              code={frameworkPopupCode}
              language={framework.language}
              onCopy={() => handleCopy(frameworkPopupCode, "popup-framework")}
              copied={copiedType === "popup-framework"}
              highlighted
            />
          )}

          {/* Show generic options */}
          <div className={framework ? "opacity-60" : ""}>
            {framework && (
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide font-medium">
                Alternative Options
              </p>
            )}
            <div className="space-y-6">
              <CodeBlock
                title="HTML Script Tag"
                description="Add this before your closing </body> tag"
                code={popupScriptCode}
                language="html"
                onCopy={() => handleCopy(popupScriptCode, "popup-html")}
                copied={copiedType === "popup-html"}
              />

              {!framework && (
                <CodeBlock
                  title="React / Next.js"
                  description="Create a component and import it in your app"
                  code={reactPopupCode}
                  language="tsx"
                  onCopy={() => handleCopy(reactPopupCode, "popup-react")}
                  copied={copiedType === "popup-react"}
                />
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inline" className="space-y-6 mt-6">
          {/* Show framework-specific code first if framework is selected */}
          {framework && frameworkInlineCode && (
            <CodeBlock
              title={`${framework.name} Integration`}
              description={`Optimized for ${framework.name} - ${framework.fileLocation}`}
              code={frameworkInlineCode}
              language={framework.language}
              onCopy={() => handleCopy(frameworkInlineCode, "inline-framework")}
              copied={copiedType === "inline-framework"}
              highlighted
            />
          )}

          {/* Show generic options */}
          <div className={framework ? "opacity-60" : ""}>
            {framework && (
              <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide font-medium">
                Alternative Options
              </p>
            )}
            <div className="space-y-6">
              <CodeBlock
                title="HTML Script Tag"
                description="Add the container where you want the form, plus the script"
                code={inlineScriptCode}
                language="html"
                onCopy={() => handleCopy(inlineScriptCode, "inline-html")}
                copied={copiedType === "inline-html"}
              />

              <CodeBlock
                title="iFrame Embed"
                description="Use an iframe if you prefer complete isolation"
                code={inlineIframeCode}
                language="html"
                onCopy={() => handleCopy(inlineIframeCode, "inline-iframe")}
                copied={copiedType === "inline-iframe"}
              />

              {!framework && (
                <CodeBlock
                  title="React / Next.js"
                  description="Create a component for the inline form"
                  code={reactInlineCode}
                  language="tsx"
                  onCopy={() => handleCopy(reactInlineCode, "inline-react")}
                  copied={copiedType === "inline-react"}
                />
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Help link */}
      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
        <span className="text-sm text-muted-foreground">
          Need help with installation?
        </span>
        <Button variant="ghost" size="sm" className="gap-2">
          View Documentation
          <ExternalLink className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

// Code block component
function CodeBlock({
  title,
  description,
  code,
  language,
  onCopy,
  copied,
  highlighted = false,
}: {
  title: string;
  description: string;
  code: string;
  language: string;
  onCopy: () => void;
  copied: boolean;
  highlighted?: boolean;
}) {
  return (
    <div
      className={cn(
        "space-y-2 p-4 rounded-xl transition-all",
        highlighted
          ? "bg-gradient-to-r from-orange-50 to-amber-50 border-2 border-orange-200"
          : "bg-white",
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <h3 className={cn("font-medium", highlighted && "text-orange-900")}>
            {title}
          </h3>
          <p
            className={cn(
              "text-xs",
              highlighted ? "text-orange-700" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className={cn(
            "gap-2 transition-all",
            copied && "bg-orange-50 border-orange-200 text-orange-700",
          )}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div
        className={cn(
          "rounded-lg overflow-hidden",
          highlighted ? "border-2 border-orange-300" : "border",
        )}
      >
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "1rem",
            fontSize: "0.8rem",
            borderRadius: "0.5rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
