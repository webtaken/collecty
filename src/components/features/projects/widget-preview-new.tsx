"use client";

import { useState } from "react";
import { useWidgetContext } from "./widget-context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WidgetSelector } from "./widget-selector";
import { WidgetInstallNew } from "./widget-install-new";
import { RichTextEditor } from "@/components/features/lead-magnets/rich-text-editor";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code, Sparkles, Gift } from "lucide-react";

export function WidgetPreviewNew() {
  const {
    config,
    activeEmbedType,
    selectedWidget,
    setActiveEmbedType,
    leadMagnetEnabled,
    leadMagnetData,
    updateLeadMagnetData,
  } = useWidgetContext();
  const [isInstallOpen, setIsInstallOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "popup" | "inline" | "lead-magnet"
  >("popup");

  const isPopup = activeEmbedType === "popup";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <WidgetSelector />
          </div>
          <Button
            onClick={() => setIsInstallOpen(true)}
            className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
          >
            <Code className="h-4 w-4" />
            Get Embed Code
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Preview label */}
          <div className="flex items-center gap-2">
            {!selectedWidget && (
              <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                No widget selected
              </span>
            )}
          </div>

          {/* Live preview area */}
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              const tab = value as "popup" | "inline" | "lead-magnet";
              setActiveTab(tab);
              if (tab !== "lead-magnet") {
                setActiveEmbedType(tab);
              }
            }}
          >
            <TabsList>
              <TabsTrigger value="popup">Popup</TabsTrigger>
              <TabsTrigger value="inline">Inline</TabsTrigger>
              {leadMagnetEnabled && (
                <TabsTrigger value="lead-magnet" className="gap-1.5">
                  <Gift className="h-3.5 w-3.5" />
                  Lead Magnet
                </TabsTrigger>
              )}
            </TabsList>
            <TabsContent value="popup">
              {/* Popup Preview */}
              <div className="relative flex items-center justify-center min-h-[280px] p-6">
                <div
                  className={cn(
                    "absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                    "bg-indigo-100 text-indigo-700",
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  Live Preview
                </div>
                <div
                  className="w-full max-w-md rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: config.backgroundColor }}
                >
                  <div className="p-6">
                    <h3
                      className="text-xl font-bold mb-2"
                      style={{ color: config.textColor }}
                    >
                      {config.title}
                    </h3>
                    <p
                      className="text-sm mb-4 opacity-80"
                      style={{ color: config.textColor }}
                    >
                      {config.description}
                    </p>
                    <div className="flex gap-3">
                      <input
                        type="email"
                        placeholder={
                          config.placeholderText || "Enter your email"
                        }
                        className="flex-1 px-4 py-2.5 rounded-lg border-2 border-slate-200 text-sm bg-white"
                        style={{
                          borderRadius: `${config.borderRadius || 8}px`,
                        }}
                        disabled
                      />
                      <button
                        className="px-5 py-2.5 text-white text-sm font-semibold transition-opacity hover:opacity-90"
                        style={{
                          backgroundColor: config.primaryColor,
                          borderRadius: `${config.borderRadius || 8}px`,
                        }}
                        disabled
                      >
                        {config.buttonText}
                      </button>
                    </div>
                    {config.showBranding && (
                      <p className="text-xs text-center mt-4 opacity-40">
                        Powered by Collecty
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="inline">
              <div className="relative p-6 min-h-[200px]">
                <div
                  className={cn(
                    "absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                    "bg-emerald-100 text-emerald-700",
                  )}
                >
                  <Sparkles className="h-3 w-3" />
                  Live Preview
                </div>
                <div
                  className="mx-auto max-w-lg overflow-hidden"
                  style={{
                    backgroundColor: config.backgroundColor,
                    borderRadius: `${config.borderRadius || 8}px`,
                    padding: "24px",
                  }}
                >
                  <h3
                    className="font-bold text-lg mb-1"
                    style={{ color: config.textColor }}
                  >
                    {config.title}
                  </h3>
                  <p
                    className="text-sm mb-4 opacity-70"
                    style={{ color: config.textColor }}
                  >
                    {config.description}
                  </p>
                  <div
                    className={cn(
                      "flex gap-3",
                      config.layout === "vertical"
                        ? "flex-col"
                        : "flex-row flex-wrap",
                    )}
                  >
                    <input
                      type="email"
                      placeholder={config.placeholderText || "Enter your email"}
                      className="flex-1 min-w-[200px] px-4 py-2.5 border-2 border-slate-200 text-sm bg-white"
                      style={{ borderRadius: `${config.borderRadius || 8}px` }}
                      disabled
                    />
                    <button
                      className={cn(
                        "px-6 py-2.5 text-white text-sm font-semibold",
                        config.layout === "vertical" ? "w-full" : "",
                      )}
                      style={{
                        backgroundColor: config.primaryColor,
                        borderRadius: `${config.borderRadius || 8}px`,
                      }}
                      disabled
                    >
                      {config.buttonText}
                    </button>
                  </div>
                  {config.showBranding && (
                    <p
                      className="text-xs text-center mt-4 opacity-40"
                      style={{ color: config.textColor }}
                    >
                      Powered by Collecty
                    </p>
                  )}
                </div>
              </div>
            </TabsContent>
            {leadMagnetEnabled && (
              <TabsContent value="lead-magnet">
                <div className="relative p-6 min-h-[200px]">
                  <div
                    className={cn(
                      "absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium",
                      "bg-purple-100 text-purple-700",
                    )}
                  >
                    <Gift className="h-3 w-3" />
                    Lead Magnet Editor
                  </div>
                  <div className="space-y-4 max-w-lg mx-auto">
                    <div className="space-y-2">
                      <Label htmlFor="lm-preview">Preview Text</Label>
                      <Textarea
                        id="lm-preview"
                        value={leadMagnetData.previewText || ""}
                        onChange={(e) =>
                          updateLeadMagnetData("previewText", e.target.value)
                        }
                        placeholder="A short teaser shown on the widget..."
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Delivery Message</Label>
                      <RichTextEditor
                        content={leadMagnetData.description ?? undefined}
                        onChange={(content) =>
                          updateLeadMagnetData("description", content)
                        }
                        placeholder="Thank you for subscribing! Here's your resource..."
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </CardContent>

      {/* Install Dialog */}
      <Dialog open={isInstallOpen} onOpenChange={setIsInstallOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
          <div className="overflow-y-auto flex-1">
            <WidgetInstallNew />
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
