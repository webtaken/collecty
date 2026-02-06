"use client";

import { useState } from "react";
import { useWidgetContext } from "./widget-context";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";
import {
  Check,
  Copy,
  Code,
  FileCode,
  ExternalLink,
  Info,
  Sparkles,
} from "lucide-react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  frameworks,
  getFrameworkById,
  generateAIPrompt,
} from "@/lib/frameworks/install-code-generator";

export function WidgetInstallNew() {
  const {
    selectedWidget,
    config,
    activeEmbedType,
    selectedFramework,
    setSelectedFramework,
  } = useWidgetContext();
  const [copiedType, setCopiedType] = useState<string | null>(null);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.dev";
  const widgetId = selectedWidget?.id || "";

  const handleCopy = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleCopyAIPrompt = async () => {
    if (!selectedWidget) return;
    try {
      const prompt = generateAIPrompt(
        framework ? framework.id : "vanilla",
        selectedWidget.id,
        activeEmbedType as any,
        appUrl,
      );
      await handleCopy(prompt, "ai-prompt");
    } catch (err) {
      console.error("Failed to generate prompt", err);
    }
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

  const manualTriggerCode = `<!-- Trigger the popup manually -->
<button onclick="window.collecty('show')">Open Popup</button>

<!-- Or call it from your script -->
<script>
  window.collecty('show');
</script>`;

  if (!selectedWidget) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        <Code className="h-12 w-12 mx-auto mb-4 opacity-20" />
        <p>Select a widget to get the embed code</p>
      </div>
    );
  }

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFrameworks = frameworks.filter((fw) =>
    fw.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Framework-specific code for the selected framework
  const frameworkPopupCode = getFrameworkCode("popup");
  const frameworkInlineCode = getFrameworkCode("inline");

  return (
    <div className="flex h-full">
      {/* Left Sidebar - Frameworks */}
      <div className="w-[280px] flex-shrink-0 border-r border-slate-200 bg-slate-50 flex flex-col h-full overflow-hidden">
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          {/* Widget badge */}
          <div className="flex items-center gap-3 p-2 bg-white rounded-lg border shadow-sm mb-4">
            <div className="h-8 w-8 rounded-md bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
              <FileCode className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p
                className="font-medium truncate text-sm"
                title={selectedWidget.name}
              >
                {selectedWidget.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-mono truncate">
                {selectedWidget.id.slice(0, 8)}...
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Frameworks
              </label>
              {framework && (
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2.5 py-1 rounded-md ring-1 ring-orange-200 shadow-sm">
                  {framework.name}
                </span>
              )}
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search framework..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all placeholder:text-slate-400"
              />
              <svg
                className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Scrollable Framework List */}
        <div className="p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent flex-1">
          <div className="grid grid-cols-3 gap-2">
            {filteredFrameworks.map((fw) => {
              const Icon = fw.icon;
              const isSelected = selectedFramework === fw.id;
              return (
                <button
                  key={fw.id}
                  onClick={() => setSelectedFramework(fw.id)}
                  title={fw.name}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-200 aspect-square",
                    isSelected
                      ? "border-orange-500 bg-white text-orange-700 shadow-md ring-2 ring-orange-500/20 z-10"
                      : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700 hover:shadow-sm",
                  )}
                >
                  <Icon className="w-5 h-5 mb-1" />
                  <span className="text-[8px] uppercase tracking-wider text-center w-full truncate">
                    {fw.name}
                  </span>
                </button>
              );
            })}
            {filteredFrameworks.length === 0 && (
              <div className="col-span-2 text-center py-8 text-muted-foreground text-xs">
                No frameworks found
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground h-8 text-xs"
          >
            <ExternalLink className="h-3 w-3" />
            Documentation
          </Button>
        </div>
      </div>

      {/* Right Content - Instructions */}
      <div className="flex-1 flex flex-col min-w-0 bg-white h-full overflow-hidden">
        {/* Fixed Header */}
        <div className="border-b border-slate-100 shrink-0 bg-white z-20">
          <div className="px-10 py-6 max-w-5xl mx-auto w-full">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Code className="h-5 w-5 text-primary" />
              Install Widget
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Follow the instructions below to add the widget to your website
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent bg-white mb-6">
          <div className="px-10 py-8 max-w-5xl mx-auto space-y-8 w-full">
            {/* Framework specific notice */}
            {framework && (
              <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                <Info className="h-5 w-5 text-orange-600 shrink-0 mt-0.5" />
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

            {/* Wordpress Visual Tutorial */}
            {framework?.id === "wordpress" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  {/* <h3 className="text-sm font-semibold text-slate-900">
                    Visual Guide
                  </h3>
                  <span className="text-xs text-muted-foreground">
                    Step-by-step instructions
                  </span> */}
                </div>
                <div className="w-full px-12">
                  <Carousel className="w-full">
                    <CarouselContent>
                      <CarouselItem>
                        <div className="p-1">
                          <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                            <img
                              src="/images/tutorials/wordpress/step1.png"
                              alt="Step 1: Go to Appearance > Theme File Editor"
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                      <CarouselItem>
                        <div className="p-1">
                          <div className="flex aspect-video items-center justify-center rounded-xl bg-slate-100 border border-slate-200 overflow-hidden relative">
                            <img
                              src="/images/tutorials/wordpress/step2.png"
                              alt="Step 2: Select Theme Footer"
                              className="object-contain w-full h-full"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    </CarouselContent>
                    <CarouselPrevious />
                    <CarouselNext />
                  </Carousel>
                </div>
              </div>
            )}

            {/* AI Prompt Section */}
            {framework?.id !== "wordpress" && (
              <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-slate-950 p-6 shadow-2xl shadow-purple-500/10 mb-8 group">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 via-transparent to-pink-500/5 transition-opacity group-hover:opacity-100 opacity-50" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-purple-500/10 blur-3xl transition-all duration-500 group-hover:bg-purple-500/20" />
                <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-pink-500/10 blur-3xl transition-all duration-500 group-hover:bg-pink-500/20" />

                <div className="relative z-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex gap-5 items-start">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20 ring-1 ring-white/10">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        Ask AI to install
                        <span className="inline-flex items-center rounded-full bg-purple-500/10 px-2 py-0.5 text-xs font-medium text-purple-300 ring-1 ring-inset ring-purple-500/20">
                          Beta
                        </span>
                      </h3>
                      <p className="text-sm text-slate-400 max-w-md leading-relaxed">
                        Copy a detailed prompt optimized for{" "}
                        <span className="text-purple-300 font-medium">
                          Cursor
                        </span>
                        ,{" "}
                        <span className="text-pink-300 font-medium">
                          Windsurf
                        </span>
                        , or{" "}
                        <span className="text-indigo-300 font-medium">
                          Lovable
                        </span>{" "}
                        to let AI handle the setup for you.
                      </p>
                    </div>
                  </div>

                  <Button
                    onClick={handleCopyAIPrompt}
                    className={cn(
                      "shrink-0 gap-2 font-medium transition-all duration-300",
                      copiedType === "ai-prompt"
                        ? "bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                        : "bg-white text-slate-950 hover:bg-slate-100 shadow-lg shadow-white/5 hover:shadow-cyan-500/20 hover:scale-105",
                    )}
                  >
                    {copiedType === "ai-prompt" ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy Prompt
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            <Tabs
              defaultValue={activeEmbedType === "popup" ? "popup" : "inline"}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="popup" className="gap-2">
                  Popup Widget
                </TabsTrigger>
                <TabsTrigger value="inline" className="gap-2">
                  Inline Form
                </TabsTrigger>
              </TabsList>

              <TabsContent value="popup" className="space-y-4 mt-0">
                {/* Show framework-specific code first if framework is selected */}
                {framework && frameworkPopupCode && (
                  <CodeBlock
                    title={`${framework.name} Integration`}
                    description={`Optimized for ${framework.name} - ${framework.fileLocation}`}
                    code={frameworkPopupCode}
                    language={framework.language}
                    onCopy={() =>
                      handleCopy(frameworkPopupCode, "popup-framework")
                    }
                    copied={copiedType === "popup-framework"}
                    highlighted
                  />
                )}

                {/* Manual Trigger Instructions */}
                {(config as any)?.triggerType === "click" && (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-100 rounded-xl">
                      <Info className="h-5 w-5 text-blue-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900">
                          Manual Trigger Active
                        </p>
                        <p className="text-xs text-blue-700 mt-0.5">
                          Since you selected "Manual Click" as the trigger, the
                          popup won't show automatically. You need to trigger it
                          programmatically.
                        </p>
                      </div>
                    </div>

                    <CodeBlock
                      title="Manual Trigger"
                      description="Use this code to trigger the popup when a user clicks a button"
                      code={manualTriggerCode}
                      language="html"
                      onCopy={() =>
                        handleCopy(manualTriggerCode, "manual-trigger")
                      }
                      copied={copiedType === "manual-trigger"}
                      highlighted
                    />
                  </div>
                )}

                {/* Show generic options */}
                <div className={framework ? "opacity-60" : ""}>
                  {framework && (
                    <p className="text-xs text-muted-foreground mb-4 uppercase tracking-wide font-medium">
                      Alternative Options
                    </p>
                  )}
                  <div className="space-y-4">
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

              <TabsContent value="inline" className="space-y-4 mt-0">
                {/* Show framework-specific code first if framework is selected */}
                {framework && frameworkInlineCode && (
                  <CodeBlock
                    title={`${framework.name} Integration`}
                    description={`Optimized for ${framework.name} - ${framework.fileLocation}`}
                    code={frameworkInlineCode}
                    language={framework.language}
                    onCopy={() =>
                      handleCopy(frameworkInlineCode, "inline-framework")
                    }
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
                  <div className="space-y-4">
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
                      onCopy={() =>
                        handleCopy(inlineIframeCode, "inline-iframe")
                      }
                      copied={copiedType === "inline-iframe"}
                    />

                    {!framework && (
                      <CodeBlock
                        title="React / Next.js"
                        description="Create a component for the inline form"
                        code={reactInlineCode}
                        language="tsx"
                        onCopy={() =>
                          handleCopy(reactInlineCode, "inline-react")
                        }
                        copied={copiedType === "inline-react"}
                      />
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
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
        "rounded-lg overflow-hidden border transition-all",
        highlighted
          ? "border-orange-200 bg-orange-50/50"
          : "border-slate-200 bg-white",
      )}
    >
      <div className="flex items-center justify-between px-3 py-2 border-b border-slate-100 bg-slate-50/50">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-xs font-semibold text-slate-700 truncate">
            {title}
          </span>
          {description && (
            <>
              <span className="text-slate-300 text-[10px]">•</span>
              <span
                className="text-[10px] text-slate-500 truncate max-w-[300px]"
                title={description}
              >
                {description}
              </span>
            </>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onCopy}
          className={cn(
            "h-6 px-2 text-[10px] gap-1.5 hover:bg-slate-200/50 text-slate-500",
            copied && "text-green-600 bg-green-50 hover:bg-green-100",
          )}
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              Copied
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div className="relative group">
        <SyntaxHighlighter
          language={language}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: "0.75rem",
            fontSize: "0.75rem",
            lineHeight: "1.4",
            borderRadius: "0",
            background: "#1e1e1e",
          }}
          wrapLines={true}
          wrapLongLines={true}
        >
          {code}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
