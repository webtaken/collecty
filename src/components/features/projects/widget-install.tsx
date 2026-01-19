"use client";

import { useWidgetGenerator } from "./widget-generator-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFrameworkById, generateInstallCode } from "@/lib/frameworks/install-code-generator";
import { cn } from "@/lib/utils";
import { publishGuideEvent } from "@/lib/guide-events";
import { useState, useMemo } from "react";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle } from "lucide-react";

export function WidgetInstall() {
    const {
        projectId,
        activeTab,
        selectedPopupFramework,
        selectedInlineFramework
    } = useWidgetGenerator();

    // Copy states
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedHtml, setCopiedHtml] = useState(false);

    const isPopupActive = activeTab === "popup";
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://collecty.app";
    const inlineHtmlUrl = `${appUrl}/widget/${projectId}/inline.html`;

    // Determine current framework (default to vanilla)
    const currentFrameworkId = isPopupActive
        ? (selectedPopupFramework || "vanilla")
        : (selectedInlineFramework || "vanilla");

    const frameworkData = getFrameworkById(currentFrameworkId);

    // Generate code
    const generatedCode = useMemo(() => {
        return generateInstallCode(currentFrameworkId, projectId, activeTab, appUrl);
    }, [currentFrameworkId, projectId, activeTab, appUrl]);

    const handleCopyCode = async () => {
        await navigator.clipboard.writeText(generatedCode);
        setCopiedCode(true);
        try {
            publishGuideEvent(isPopupActive ? "guide:copiedPopup" : "guide:copiedInline");
        } catch { }
        setTimeout(() => setCopiedCode(false), 2000);
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

    const renderCodeBlock = (code: string, copied: boolean, onCopy: () => void) => (
        <div className="relative">
            <pre className="p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
                <code>{code}</code>
            </pre>
            <Button
                size="sm"
                variant="secondary"
                className="absolute top-2 right-2"
                onClick={onCopy}
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
    );

    return (
        <div className="space-y-6">
            <div className="mb-4">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-lg font-semibold">
                                Install {isPopupActive ? "Popup Widget" : "Inline Form"}
                                {frameworkData && ` for ${frameworkData.name}`}
                            </h3>
                            {isPopupActive && (
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-slate-400 hover:text-slate-600"
                                        >
                                            <HelpCircle className="h-5 w-5" />
                                            <span className="sr-only">Manual control help</span>
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" align="start">
                                        <div className="space-y-3">
                                            <h4 className="font-medium text-slate-900">
                                                Manual Widget Control
                                            </h4>
                                            <p className="text-xs text-slate-600">
                                                Use these helper functions to control the widget programmatically:
                                            </p>
                                            <pre className="p-3 bg-slate-100 rounded border border-slate-200 text-xs font-mono text-slate-700">
                                                <code>
                                                    collecty("show"); // Show popup{"\n"}
                                                    collecty("hide"); // Hide popup{"\n"}
                                                    collecty("reset"); // Reset popup
                                                </code>
                                            </pre>
                                        </div>
                                    </PopoverContent>
                                </Popover>
                            )}
                        </div>

                        <p className="text-sm text-slate-600">
                            {frameworkData?.description || "Get your installation code below."}
                        </p>
                    </div>
                </div>
            </div>

            {currentFrameworkId === "vanilla" ? (
                /* Vanilla: Show Script Tag Tab (plus HTML for Inline) */
                <Tabs defaultValue="script" className="w-full">
                    <TabsList className="w-full">
                        <TabsTrigger value="script" className="flex-1">
                            Script Tag
                        </TabsTrigger>
                        {!isPopupActive && (
                            <TabsTrigger value="html" className="flex-1">
                                HTML Snippet
                            </TabsTrigger>
                        )}
                    </TabsList>

                    <TabsContent value="script" className="mt-4 space-y-4">
                        <p className="text-sm text-slate-600">
                            {isPopupActive
                                ? "Add this code to your website's <head> or before the closing </body> tag."
                                : "Add this code where you want the form to appear. Best for dynamic sites with automatic style isolation."
                            }
                        </p>
                        {renderCodeBlock(generatedCode, copiedCode, handleCopyCode)}
                    </TabsContent>

                    {!isPopupActive && (
                        <TabsContent value="html" className="mt-4 space-y-4">
                            <p className="text-sm text-slate-600">
                                Get a self-contained HTML snippet with all styles included.
                                Best for static sites or email builders.
                            </p>
                            <div className="flex items-center gap-3 mb-4">
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
                                    {copiedHtml ? "Copied!" : "Copy HTML"}
                                </Button>
                            </div>
                        </TabsContent>
                    )}
                </Tabs>
            ) : (
                /* Standard View (Frameworks) */
                <div className="space-y-4">
                    <p className="text-sm text-slate-600">
                        {frameworkData?.fileLocation ? (
                            <>Place this code in <strong>{frameworkData.fileLocation}</strong></>
                        ) : (
                            "Copy and paste the code below into your project."
                        )}
                    </p>
                    {renderCodeBlock(generatedCode, copiedCode, handleCopyCode)}
                </div>
            )}
        </div>
    );
}
