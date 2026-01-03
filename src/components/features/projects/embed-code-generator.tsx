"use client";

import { useState } from "react";
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
  const [copiedPopup, setCopiedPopup] = useState(false);
  const [copiedInline, setCopiedInline] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  
  // Framework state
  const [selectedPopupFramework, setSelectedPopupFramework] = useState<FrameworkId | null>(null);
  const [copiedPopupFramework, setCopiedPopupFramework] = useState(false);
  const [selectedInlineFramework, setSelectedInlineFramework] = useState<FrameworkId | null>(null);
  const [copiedInlineFramework, setCopiedInlineFramework] = useState(false);

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
    setTimeout(() => setCopiedPopup(false), 2000);
  };

  const handleCopyInline = async () => {
    await navigator.clipboard.writeText(inlineScriptCode);
    setCopiedInline(true);
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
      setTimeout(() => setCopiedPopupFramework(false), 2000);
    } else {
      setCopiedInlineFramework(true);
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

  return (
    <div className="space-y-6">
      {/* Widget Type Selection */}
      <Tabs defaultValue="popup" className="w-full">
        <TabsList className="w-full mb-4">
          <TabsTrigger value="popup" className="flex-1">
            <svg
              className="w-4 h-4 mr-2"
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
          <TabsTrigger value="inline" className="flex-1">
            <svg
              className="w-4 h-4 mr-2"
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
            Inline Form
          </TabsTrigger>
        </TabsList>

        {/* Popup Widget Tab */}
        <TabsContent value="popup" className="space-y-6">
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

                  <div className="text-sm text-slate-600 space-y-2">
                    <p>
                      <strong>Installation:</strong> Paste this code before the
                      closing{" "}
                      <code className="bg-slate-100 px-1 py-0.5 rounded">
                        &lt;/body&gt;
                      </code>{" "}
                      tag on your website.
                    </p>
                    <p>
                      <strong>Note:</strong> The widget will automatically appear
                      based on your configured trigger settings.
                    </p>
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

          <Card>
            <CardHeader>
              <CardTitle>Popup Preview</CardTitle>
              <CardDescription>
                This is how your popup widget will appear to visitors
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-slate-50 flex items-center justify-center min-h-[300px]">
                <div
                  className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                  style={{ backgroundColor: widgetConfig.backgroundColor }}
                >
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: widgetConfig.textColor }}
                    >
                      {widgetConfig.title}
                    </h3>
                    <p
                      className="text-sm mb-4 opacity-80"
                      style={{ color: widgetConfig.textColor }}
                    >
                      {widgetConfig.description}
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
                        style={{ backgroundColor: widgetConfig.primaryColor }}
                        disabled
                      >
                        {widgetConfig.buttonText}
                      </button>
                    </div>
                    {widgetConfig.showBranding && (
                      <p className="text-xs text-center mt-4 opacity-50">
                        Powered by Collecty
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Inline Form Tab */}
        <TabsContent value="inline" className="space-y-6">
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

          <Card>
            <CardHeader>
              <CardTitle>Inline Form Preview</CardTitle>
              <CardDescription>
                This is how your inline form will appear on your website
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-8 bg-slate-50">
                <div
                  className="mx-auto max-w-lg overflow-hidden"
                  style={{
                    backgroundColor: inlineWidgetConfig.backgroundColor,
                    borderRadius: `${inlineWidgetConfig.borderRadius}px`,
                    padding: "24px",
                  }}
                >
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: inlineWidgetConfig.textColor }}
                  >
                    {inlineWidgetConfig.title}
                  </h3>
                  <p
                    className="text-sm mb-4 opacity-70"
                    style={{ color: inlineWidgetConfig.textColor }}
                  >
                    {inlineWidgetConfig.description}
                  </p>
                  <div
                    className={`flex gap-3 ${
                      inlineWidgetConfig.layout === "vertical"
                        ? "flex-col"
                        : "flex-row"
                    }`}
                  >
                    <input
                      type="email"
                      placeholder={inlineWidgetConfig.placeholderText}
                      className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-sm"
                      style={{
                        borderRadius: `${inlineWidgetConfig.borderRadius}px`,
                      }}
                      disabled
                    />
                    <button
                      className={`px-6 py-2.5 text-white text-sm font-semibold ${
                        inlineWidgetConfig.layout === "vertical" ? "w-full" : ""
                      }`}
                      style={{
                        backgroundColor: inlineWidgetConfig.primaryColor,
                        borderRadius: `${inlineWidgetConfig.borderRadius}px`,
                      }}
                      disabled
                    >
                      {inlineWidgetConfig.buttonText}
                    </button>
                  </div>
                  {inlineWidgetConfig.showBranding && (
                    <p
                      className="text-xs text-center mt-4 opacity-40"
                      style={{ color: inlineWidgetConfig.textColor }}
                    >
                      Powered by Collecty
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
