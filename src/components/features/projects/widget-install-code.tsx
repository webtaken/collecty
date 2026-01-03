"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { frameworks, getFrameworkById, type FrameworkId } from "@/lib/frameworks/install-code-generator";

type WidgetInstallCodeProps = {
  projectId: string;
  widgetType: "popup" | "inline";
};

export function WidgetInstallCode({
  projectId,
  widgetType,
}: WidgetInstallCodeProps) {
  const [copiedScript, setCopiedScript] = useState(false);
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [selectedFramework, setSelectedFramework] = useState<FrameworkId | null>(null);
  const [copiedFramework, setCopiedFramework] = useState(false);
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  const popupScript = `<!-- Collecty Popup Widget -->
<script>
  (function(c,o,l,e,t,y){
    c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
    var s=o.createElement('script');s.async=1;s.src=l;
    o.head.appendChild(s);
  })(window,document,'${appUrl}/widget/${projectId}/widget.js');
</script>`;

  const inlineScript = `<!-- Collecty Inline Widget (Script) -->
<div data-collecty-inline="${projectId}"></div>
<script src="${appUrl}/widget/${projectId}/inline.js" async></script>`;

  const inlineHtmlUrl = `${appUrl}/widget/${projectId}/inline.html`;

  const copyToClipboard = async (text: string, type: "script" | "html" | "framework") => {
    try {
      await navigator.clipboard.writeText(text);
      if (type === "script") {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } else if (type === "html") {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedFramework(true);
        setTimeout(() => setCopiedFramework(false), 2000);
      }
    } catch {
      // Fallback for older browsers
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      if (type === "script") {
        setCopiedScript(true);
        setTimeout(() => setCopiedScript(false), 2000);
      } else if (type === "html") {
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
      } else {
        setCopiedFramework(true);
        setTimeout(() => setCopiedFramework(false), 2000);
      }
    }
  };

  const selectedFrameworkData = selectedFramework ? getFrameworkById(selectedFramework) : null;
  const frameworkCode = selectedFrameworkData
    ? selectedFrameworkData.generateCode(projectId, widgetType, appUrl)
    : "";

  if (widgetType === "popup") {
    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-slate-900 mb-2">
            Installation Code
          </h4>
          <p className="text-sm text-slate-600 mb-3">
            Choose your preferred installation method for the popup widget.
          </p>
        </div>

        <Tabs defaultValue="script" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="script" className="flex-1">
              Script Tag
            </TabsTrigger>
            <TabsTrigger value="frameworks" className="flex-1">
              Frameworks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="script" className="mt-4 space-y-3">
            <p className="text-sm text-slate-600">
              Add this script to your website, ideally before the closing{" "}
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-xs">
                &lt;/body&gt;
              </code>{" "}
              tag.
            </p>
            <div className="relative">
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{popupScript}</code>
              </pre>
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={() => copyToClipboard(popupScript, "script")}
              >
                {copiedScript ? (
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
            <div className="text-sm text-slate-500">
              <p className="font-medium mb-1">Manual Control (Optional)</p>
              <p>You can manually show/hide the popup using JavaScript:</p>
              <pre className="bg-slate-100 p-2 rounded mt-2 text-xs">
                <code>{`collecty('show'); // Show popup\ncollecty('hide'); // Hide popup\ncollecty('reset'); // Reset (allow re-showing)`}</code>
              </pre>
            </div>
          </TabsContent>

          <TabsContent value="frameworks" className="mt-4 space-y-4">
            <p className="text-sm text-slate-600">
              Select your framework to see framework-specific installation instructions.
            </p>
            
            {!selectedFramework ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {frameworks.map((framework) => {
                  const Icon = framework.icon;
                  return (
                    <button
                      key={framework.id}
                      onClick={() => setSelectedFramework(framework.id)}
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
                      onClick={() => setSelectedFramework(null)}
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
                      {selectedFrameworkData && (
                        <>
                          <selectedFrameworkData.icon className="size-5" />
                          <div>
                            <h5 className="text-sm font-medium text-slate-900">
                              {selectedFrameworkData.name}
                            </h5>
                            <p className="text-xs text-slate-500">
                              {selectedFrameworkData.fileLocation}
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="relative">
                  <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                    <code>{frameworkCode}</code>
                  </pre>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute top-2 right-2"
                    onClick={() => copyToClipboard(frameworkCode, "framework")}
                  >
                    {copiedFramework ? (
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

                {selectedFrameworkData && (
                  <p className="text-xs text-slate-500">
                    {selectedFrameworkData.description}
                  </p>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-slate-900 mb-2">
          Installation Options
        </h4>
        <p className="text-sm text-slate-600 mb-3">
          Choose your preferred installation method for the inline form.
        </p>
      </div>

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

        <TabsContent value="script" className="mt-4 space-y-3">
          <p className="text-sm text-slate-600">
            Add this code where you want the form to appear. Best for dynamic
            sites or when you want automatic style isolation.
          </p>
          <div className="relative">
            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
              <code>{inlineScript}</code>
            </pre>
            <Button
              size="sm"
              variant="secondary"
              className="absolute top-2 right-2"
              onClick={() => copyToClipboard(inlineScript, "script")}
            >
              {copiedScript ? (
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
        </TabsContent>

        <TabsContent value="html" className="mt-4 space-y-3">
          <p className="text-sm text-slate-600">
            Get a self-contained HTML snippet with embedded styles. Best for
            static sites, email builders, or when you need full control.
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
              View HTML Snippet
            </Button>
            <Button
              variant="secondary"
              onClick={async () => {
                try {
                  const response = await fetch(inlineHtmlUrl);
                  const html = await response.text();
                  await copyToClipboard(html, "html");
                } catch {
                  window.open(inlineHtmlUrl, "_blank");
                }
              }}
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
          <p className="text-xs text-slate-500">
            The HTML snippet includes all styles inline, making it portable and
            independent from external resources.
          </p>
        </TabsContent>

        <TabsContent value="frameworks" className="mt-4 space-y-4">
          <p className="text-sm text-slate-600">
            Select your framework to see framework-specific installation instructions.
          </p>
          
          {!selectedFramework ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {frameworks.map((framework) => {
                const Icon = framework.icon;
                return (
                  <button
                    key={framework.id}
                    onClick={() => setSelectedFramework(framework.id)}
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
                    onClick={() => setSelectedFramework(null)}
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
                    {selectedFrameworkData && (
                      <>
                        <selectedFrameworkData.icon  className="text-slate-700" />
                        <div>
                          <h5 className="text-sm font-medium text-slate-900">
                            {selectedFrameworkData.name}
                          </h5>
                          <p className="text-xs text-slate-500">
                            {selectedFrameworkData.fileLocation}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative">
                <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg text-sm overflow-x-auto">
                  <code>{frameworkCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(frameworkCode, "framework")}
                >
                  {copiedFramework ? (
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

              {selectedFrameworkData && (
                <p className="text-xs text-slate-500">
                  {selectedFrameworkData.description}
                </p>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
