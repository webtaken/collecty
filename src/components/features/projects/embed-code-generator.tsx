"use client";

import { useEffect, useState } from "react";
import type { JSX } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WidgetConfig, InlineWidgetConfig } from "@/db/schema/projects";
import { frameworks, getFrameworkById, type FrameworkId } from "@/lib/frameworks/install-code-generator";
import { cn } from "@/lib/utils";
import { publishGuideEvent } from "@/lib/guide-events";
import { PopupWidgetCustomizer } from "./popup-widget-customizer";
import { InlineWidgetCustomizer } from "./inline-widget-customizer";

type EmbedCodeGeneratorProps = {
  projectId: string;
  widgetConfig: WidgetConfig;
  inlineWidgetConfig: InlineWidgetConfig;
};

export function EmbedCodeGenerator({
  projectId,
  widgetConfig,
  inlineWidgetConfig,
}: EmbedCodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState<"popup" | "inline">("popup");
  const [popupPreviewConfig, setPopupPreviewConfig] = useState(widgetConfig);
  const [inlinePreviewConfig, setInlinePreviewConfig] = useState(inlineWidgetConfig);
  const [copiedPopup, setCopiedPopup] = useState(false);
  const [copiedInline, setCopiedInline] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  
  // Framework state
  const [selectedPopupFramework, setSelectedPopupFramework] = useState<FrameworkId | null>(null);
  const [copiedPopupFramework, setCopiedPopupFramework] = useState(false);
  const [selectedInlineFramework, setSelectedInlineFramework] = useState<FrameworkId | null>(null);
  const [copiedInlineFramework, setCopiedInlineFramework] = useState(false);

  useEffect(() => {
    setPopupPreviewConfig(widgetConfig);
  }, [widgetConfig]);

  useEffect(() => {
    setInlinePreviewConfig(inlineWidgetConfig);
  }, [inlineWidgetConfig]);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  const popupScriptCode = `<!-- Collecty Popup Widget -->
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>`;

  const inlineScriptCode = `<!-- Collecty Inline Form -->
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;

  const inlineHtmlUrl = `${appUrl}/widget/${projectId}/inline.html`;

  const handleCopyPopup = async () => {
    await navigator.clipboard.writeText(popupScriptCode);
    setCopiedPopup(true);
    try { publishGuideEvent("guide:copiedPopup"); } catch {}
    setTimeout(() => setCopiedPopup(false), 2000);
  };

  const handleCopyInline = async () => {
    await navigator.clipboard.writeText(inlineScriptCode);
    setCopiedInline(true);
    try { publishGuideEvent("guide:copiedInline"); } catch {}
    setTimeout(() => setCopiedInline(false), 2000);
  };

  const handleCopyHtml = async () => {
    try {
      const response = await fetch(inlineHtmlUrl);
      const html = await response.text();
      await navigator.clipboard.writeText(html);
      setCopiedHtml(true);
      setTimeout(() => setCopiedHtml(false), 2000);
    } catch {
      window.open(inlineHtmlUrl, "_blank");
    }
  };

  const handleCopyFramework = async (text: string, type: "popup" | "inline") => {
    await navigator.clipboard.writeText(text);
    if (type === "popup") {
      setCopiedPopupFramework(true);
      try { publishGuideEvent("guide:copiedPopup"); } catch {}
      setTimeout(() => setCopiedPopupFramework(false), 2000);
    } else {
      setCopiedInlineFramework(true);
      try { publishGuideEvent("guide:copiedInline"); } catch {}
      setTimeout(() => setCopiedInlineFramework(false), 2000);
    }
  };

  const selectedPopupFrameworkData = selectedPopupFramework ? getFrameworkById(selectedPopupFramework) : null;
  const popupFrameworkCode = selectedPopupFrameworkData
    ? selectedPopupFrameworkData.generateCode(projectId, "popup", appUrl)
    : "";

  const selectedInlineFrameworkData = selectedInlineFramework ? getFrameworkById(selectedInlineFramework) : null;
  const inlineFrameworkCode = selectedInlineFrameworkData
    ? selectedInlineFrameworkData.generateCode(projectId, "inline", appUrl)
    : "";

  const isPopupActive = activeTab === "popup";
  const previewTitle = isPopupActive ? "Popup Preview" : "Inline Form Preview";
  const previewDescription = isPopupActive
    ? "This is how your popup widget will appear to visitors"
    : "This is how your inline form will appear on your website";

  const previewTabButtons: Array<{
    value: "popup" | "inline";
    label: string;
    ariaLabel: string;
    icon: JSX.Element;
    accent: string;
  }> = [
    {
      value: "popup",
      label: "Popup",
      ariaLabel: "Show popup widget preview",
      accent: "from-indigo-500 via-purple-500 to-pink-500",
      icon: (
        <svg
          className="h-5 w-5"
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
      ),
    },
    {
      value: "inline",
      label: "Inline",
      ariaLabel: "Show inline form preview",
      accent: "from-emerald-500 via-teal-500 to-cyan-500",
      icon: (
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="space-y-6" data-guide-target="embed-generator">
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle>{previewTitle}</CardTitle>
              <CardDescription>{previewDescription}</CardDescription>
            </div>
            <div className="flex items-center gap-3">
              {previewTabButtons.map((tab) => {
                const isActive = activeTab === tab.value;
                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setActiveTab(tab.value)}
                    className={cn(
                      "group relative flex flex-col items-center justify-center gap-1 rounded-2xl border-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition",
                      isActive
                        ? cn(
                            "border-transparent text-white shadow-xl",
                            "bg-gradient-to-br",
                            tab.accent
                          )
                        : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                    )}
                    aria-label={tab.ariaLabel}
                  >
                    <span
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full border-2 text-base transition",
                        isActive
                          ? "border-white/50 bg-white/20 text-white"
                          : "border-slate-200 bg-slate-50 text-slate-500"
                      )}
                    >
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isPopupActive ? (
            <div className="border rounded-lg p-8 bg-slate-50 flex items-center justify-center min-h-[300px]">
              <div
                className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: popupPreviewConfig.backgroundColor }}
              >
                <div className="p-6">
                  <h3
                    className="text-xl font-bold mb-2"
                    style={{ color: popupPreviewConfig.textColor }}
                  >
                    {popupPreviewConfig.title}
                  </h3>
                  <p
                    className="text-sm mb-4 opacity-80"
                    style={{ color: popupPreviewConfig.textColor }}
                  >
                    {popupPreviewConfig.description}
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-2 rounded-lg border text-sm"
                      disabled
                    />
                    <button
                      className="px-4 py-2 rounded-lg text-white text-sm font-medium"
                      style={{ backgroundColor: popupPreviewConfig.primaryColor }}
                      disabled
                    >
                      {popupPreviewConfig.buttonText}
                    </button>
                  </div>
                  {popupPreviewConfig.showBranding && (
                    <p className="text-xs text-center mt-4 opacity-50">
                      Powered by Collecty
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg p-8 bg-slate-50">
              <div
                className="mx-auto max-w-lg overflow-hidden"
                style={{
                  backgroundColor: inlinePreviewConfig.backgroundColor,
                  borderRadius: `${inlinePreviewConfig.borderRadius}px`,
                  padding: "24px",
                }}
              >
                <h3
                  className="font-bold text-lg mb-1"
                  style={{ color: inlinePreviewConfig.textColor }}
                >
                  {inlinePreviewConfig.title}
                </h3>
                <p
                  className="text-sm mb-4 opacity-70"
                  style={{ color: inlinePreviewConfig.textColor }}
                >
                  {inlinePreviewConfig.description}
                </p>
                <div
                  className={`flex gap-3 ${
                    inlinePreviewConfig.layout === "vertical" ? "flex-col" : "flex-row"
                  }`}
                >
                  <input
                    type="email"
                    placeholder={inlinePreviewConfig.placeholderText}
                    className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-sm"
                    style={{
                      borderRadius: `${inlinePreviewConfig.borderRadius}px`,
                    }}
                    disabled
                  />
                  <button
                    className={`px-6 py-2.5 text-white text-sm font-semibold ${
                      inlinePreviewConfig.layout === "vertical" ? "w-full" : ""
                    }`}
                    style={{
                      backgroundColor: inlinePreviewConfig.primaryColor,
                      borderRadius: `${inlinePreviewConfig.borderRadius}px`,
                    }}
                    disabled
                  >
                    {inlinePreviewConfig.buttonText}
                  </button>
                </div>
                {inlinePreviewConfig.showBranding && (
                  <p
                    className="text-xs text-center mt-4 opacity-40"
                    style={{ color: inlinePreviewConfig.textColor }}
                  >
                    Powered by Collecty
                  </p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isPopupActive ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Widget Customization</CardTitle>
              <CardDescription>
                Adjust the popup content, colors, and behavior to match your brand.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                <p className="text-sm text-indigo-800">
                  <span className="font-medium">Popup widget</span> appears as an overlay you can trigger by time delay, scroll position, exit intent, or manual activation.
                </p>
              </div>
              <PopupWidgetCustomizer
                projectId={projectId}
                initialConfig={widgetConfig}
                showPreview={false}
                onConfigChange={setPopupPreviewConfig}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Install Popup Widget</CardTitle>
              <CardDescription>
                Add this code to display a popup that can be triggered by time
                delay, scroll, exit intent, or manually
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="script" className="flex-1">
                    Script Tag
                  </TabsTrigger>
                  <TabsTrigger value="frameworks" className="flex-1">
                    Frameworks
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="script" className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    Add this code to your website, ideally before the closing
                    <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                      &lt;/body&gt;
                    </code>{" "}
                    tag.
                  </p>
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                      <code>{popupScriptCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={handleCopyPopup}
                    >
                      {copiedPopup ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                    <h5 className="text-sm font-semibold text-slate-800 mb-2">
                      Need manual control?
                    </h5>
                    <p className="text-xs text-slate-600">
                      Use these helper functions in your scripts:
                    </p>
                    <pre className="mt-3 p-3 bg-white rounded border text-xs text-slate-700">
                      <code>
                        collecty("show"); // Show popup
                        {"\n"}
                        collecty("hide"); // Hide popup
                        {"\n"}
                        collecty("reset"); // Reset popup
                      </code>
                    </pre>
                  </div>
                </TabsContent>

                <TabsContent value="frameworks" className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    Select your framework to see framework-specific installation instructions.
                  </p>
                  
                  {!selectedPopupFramework ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {frameworks.map((framework) => {
                        const Icon = framework.icon;
                        return (
                          <button
                            key={framework.id}
                            onClick={() => setSelectedPopupFramework(framework.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                              "hover:border-indigo-300 hover:bg-indigo-50",
                              "border-slate-200 bg-white"
                            )}
                          >
                            <Icon className="size-5" />
                            <span className="text-xs font-medium text-slate-700 text-center">
                              {framework.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedPopupFramework(null)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <div className="flex items-center gap-2">
                            {selectedPopupFrameworkData && (
                              <>
                                <selectedPopupFrameworkData.icon className="size-5" />
                                <div>
                                  <h5 className="text-sm font-medium text-slate-900">
                                    {selectedPopupFrameworkData.name}
                                  </h5>
                                  <p className="text-xs text-slate-500">
                                    {selectedPopupFrameworkData.fileLocation}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                          <code>{popupFrameworkCode}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyFramework(popupFrameworkCode, "popup")}
                        >
                          {copiedPopupFramework ? (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Copy
                            </span>
                          )}
                        </Button>
                      </div>

                      {selectedPopupFrameworkData && (
                        <p className="text-xs text-slate-500">
                          {selectedPopupFrameworkData.description}
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Widget Customization</CardTitle>
              <CardDescription>
                Fine-tune the inline form’s layout, copy, and colors from right here.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
                <p className="text-sm text-emerald-800">
                  <span className="font-medium">Inline form</span> embeds directly into your page content — ideal for footers, sidebars, or any persistent signup area.
                </p>
              </div>
              <InlineWidgetCustomizer
                projectId={projectId}
                initialConfig={inlineWidgetConfig}
                showPreview={false}
                onConfigChange={setInlinePreviewConfig}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Install Inline Form</CardTitle>
              <CardDescription>
                Embed a form directly into your page - perfect for footers,
                sidebars, or dedicated sections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs defaultValue="script" className="w-full">
                <TabsList className="w-full">
                  <TabsTrigger value="script" className="flex-1">
                    Script Tag
                  </TabsTrigger>
                  <TabsTrigger value="html" className="flex-1">
                    HTML Snippet
                  </TabsTrigger>
                  <TabsTrigger value="frameworks" className="flex-1">
                    Frameworks
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="script" className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    Add this code where you want the form to appear. Best for
                    dynamic sites with automatic style isolation.
                  </p>
                  <div className="relative">
                    <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                      <code>{inlineScriptCode}</code>
                    </pre>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="absolute top-2 right-2"
                      onClick={handleCopyInline}
                    >
                      {copiedInline ? (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4 mr-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="html" className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    Get a self-contained HTML snippet with all styles included.
                    Best for static sites or email builders.
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={() => window.open(inlineHtmlUrl, "_blank")}
                      className="flex items-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      View HTML
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCopyHtml}
                      className="flex items-center gap-2"
                    >
                      {copiedHtml ? (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Copied!
                        </>
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                          Copy HTML
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="frameworks" className="mt-4 space-y-4">
                  <p className="text-sm text-slate-600">
                    Select your framework to see framework-specific installation instructions.
                  </p>
                  
                  {!selectedInlineFramework ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {frameworks.map((framework) => {
                        const Icon = framework.icon;
                        return (
                          <button
                            key={framework.id}
                            onClick={() => setSelectedInlineFramework(framework.id)}
                            className={cn(
                              "flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all",
                              "hover:border-indigo-300 hover:bg-indigo-50",
                              "border-slate-200 bg-white"
                            )}
                          >
                            <Icon className="size-5" />
                            <span className="text-xs font-medium text-slate-700 text-center">
                              {framework.name}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setSelectedInlineFramework(null)}
                            className="text-slate-600 hover:text-slate-900"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 19l-7-7 7-7"
                              />
                            </svg>
                          </button>
                          <div className="flex items-center gap-2">
                            {selectedInlineFrameworkData && (
                              <>
                                <selectedInlineFrameworkData.icon className="size-5" />
                                <div>
                                  <h5 className="text-sm font-medium text-slate-900">
                                    {selectedInlineFrameworkData.name}
                                  </h5>
                                  <p className="text-xs text-slate-500">
                                    {selectedInlineFrameworkData.fileLocation}
                                  </p>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="relative">
                        <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                          <code>{inlineFrameworkCode}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="secondary"
                          className="absolute top-2 right-2"
                          onClick={() => handleCopyFramework(inlineFrameworkCode, "inline")}
                        >
                          {copiedInlineFramework ? (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                              Copied!
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5">
                              <svg
                                className="w-4 h-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                                />
                              </svg>
                              Copy
                            </span>
                          )}
                        </Button>
                      </div>

                      {selectedInlineFrameworkData && (
                        <p className="text-xs text-slate-500">
                          {selectedInlineFrameworkData.description}
                        </p>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
