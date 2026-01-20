"use client";

import { useWidgetGenerator } from "./widget-generator-context";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { JSX } from "react";
import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { WidgetInstall } from "./widget-install";

export function WidgetPreview() {
    const { activeTab, setActiveTab, popupConfig, inlineConfig } = useWidgetGenerator();
    const [isInstallOpen, setIsInstallOpen] = useState(false);

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
                label: "Popup Widget",
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
                label: "Inline Form",
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
        <Card>
            <CardHeader>
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>{previewTitle}</CardTitle>
                            <CardDescription>{previewDescription}</CardDescription>
                        </div>
                        <Button
                            onClick={() => setIsInstallOpen(true)}
                            variant="default"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
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
                                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                                />
                            </svg>
                            Widget Installation
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex gap-2">
                    {/* Vertical tabs on the left */}
                    <div className="flex flex-col gap-2">
                        {previewTabButtons.map((tab) => {
                            const isActive = activeTab === tab.value;
                            return (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setActiveTab(tab.value)}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 rounded-xl border-2 px-4 py-3 text-xs font-semibold uppercase tracking-wide transition min-w-[80px] h-1/2 wrap-text",
                                        isActive
                                            ? cn(
                                                "border-transparent text-white shadow-lg",
                                                "bg-gradient-to-br",
                                                tab.accent
                                            )
                                            : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                                    )}
                                    aria-label={tab.ariaLabel}
                                >
                                    <span
                                        className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm transition",
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

                    {/* Preview content */}
                    <div className="flex-1">
                        {isPopupActive ? (
                            <div className="border rounded-lg p-4 bg-slate-50 flex items-center justify-center min-h-[180px]">
                                <div
                                    className="w-full max-w-md rounded-xl shadow-2xl overflow-hidden"
                                    style={{ backgroundColor: popupConfig.backgroundColor }}
                                >
                                    <div className="p-6">
                                        <h3
                                            className="text-xl font-bold mb-2"
                                            style={{ color: popupConfig.textColor }}
                                        >
                                            {popupConfig.title}
                                        </h3>
                                        <p
                                            className="text-sm mb-4 opacity-80"
                                            style={{ color: popupConfig.textColor }}
                                        >
                                            {popupConfig.description}
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
                                                style={{ backgroundColor: popupConfig.primaryColor }}
                                                disabled
                                            >
                                                {popupConfig.buttonText}
                                            </button>
                                        </div>
                                        {popupConfig.showBranding && (
                                            <p className="text-xs text-center mt-4 opacity-50">
                                                Powered by Collecty
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="border rounded-lg p-4 bg-slate-50 min-h-[180px]">
                                <div
                                    className="mx-auto max-w-lg overflow-hidden"
                                    style={{
                                        backgroundColor: inlineConfig.backgroundColor,
                                        borderRadius: `${inlineConfig.borderRadius}px`,
                                        padding: "24px",
                                    }}
                                >
                                    <h3
                                        className="font-bold text-lg mb-1"
                                        style={{ color: inlineConfig.textColor }}
                                    >
                                        {inlineConfig.title}
                                    </h3>
                                    <p
                                        className="text-sm mb-4 opacity-70"
                                        style={{ color: inlineConfig.textColor }}
                                    >
                                        {inlineConfig.description}
                                    </p>
                                    <div
                                        className={`flex gap-3 ${inlineConfig.layout === "vertical" ? "flex-col" : "flex-row"
                                            }`}
                                    >
                                        <input
                                            type="email"
                                            placeholder={inlineConfig.placeholderText}
                                            className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-sm"
                                            style={{
                                                borderRadius: `${inlineConfig.borderRadius}px`,
                                            }}
                                            disabled
                                        />
                                        <button
                                            className={`px-6 py-2.5 text-white text-sm font-semibold ${inlineConfig.layout === "vertical" ? "w-full" : ""
                                                }`}
                                            style={{
                                                backgroundColor: inlineConfig.primaryColor,
                                                borderRadius: `${inlineConfig.borderRadius}px`,
                                            }}
                                            disabled
                                        >
                                            {inlineConfig.buttonText}
                                        </button>
                                    </div>
                                    {inlineConfig.showBranding && (
                                        <p
                                            className="text-xs text-center mt-4 opacity-40"
                                            style={{ color: inlineConfig.textColor }}
                                        >
                                            Powered by Collecty
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>

            <Dialog open={isInstallOpen} onOpenChange={setIsInstallOpen}>
                <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
                    <div className="overflow-y-auto flex-1">
                        <WidgetInstall />
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
