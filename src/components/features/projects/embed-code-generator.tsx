"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { WidgetConfig } from "@/db/schema/projects";

type EmbedCodeGeneratorProps = {
  projectId: string;
  widgetConfig: WidgetConfig;
};

export function EmbedCodeGenerator({ projectId, widgetConfig }: EmbedCodeGeneratorProps) {
  const [copied, setCopied] = useState(false);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";

  const scriptCode = `<!-- Collecty Email Collection Widget -->
<script>
  (function(w,d,s,o,f,js,fjs){
    w['CollectyWidget']=o;w[o]=w[o]||function(){(w[o].q=w[o].q||[]).push(arguments)};
    js=d.createElement(s),fjs=d.getElementsByTagName(s)[0];
    js.id=o;js.src=f;js.async=1;fjs.parentNode.insertBefore(js,fjs);
  }(window,document,'script','collecty','${appUrl}/widget/${projectId}/widget.js'));
  collecty('init', '${projectId}');
</script>`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Install Widget</CardTitle>
          <CardDescription>
            Add this code snippet to your website to display the email collection popup
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="script">
            <TabsList>
              <TabsTrigger value="script">Script Tag</TabsTrigger>
              <TabsTrigger value="npm">NPM Package</TabsTrigger>
            </TabsList>

            <TabsContent value="script" className="space-y-4">
              <div className="relative">
                <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                  <code>{scriptCode}</code>
                </pre>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2"
                  onClick={handleCopy}
                >
                  {copied ? (
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
                  <strong>Installation:</strong> Paste this code before the closing{" "}
                  <code className="bg-slate-100 px-1 py-0.5 rounded">&lt;/body&gt;</code>{" "}
                  tag on your website.
                </p>
                <p>
                  <strong>Note:</strong> The widget will automatically appear based on
                  your configured trigger settings.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="npm" className="space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border">
                <p className="text-sm text-slate-600">
                  NPM package coming soon! For now, use the script tag installation method.
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Widget Preview</CardTitle>
          <CardDescription>
            This is how your widget will appear to visitors
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
    </div>
  );
}

