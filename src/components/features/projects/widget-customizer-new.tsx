"use client";

import { useWidgetContext } from "./widget-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Paintbrush,
  Type,
  Settings2,
  Sparkles,
  Save,
  CheckCircle2,
} from "lucide-react";

export function WidgetCustomizerNew() {
  const {
    config,
    updateConfig,
    saveWidget,
    isSaving,
    hasUnsavedChanges,
    selectedWidget,
    activeEmbedType,
    setActiveEmbedType,
    leadMagnetEnabled,
    setLeadMagnetEnabled,
  } = useWidgetContext();

  if (!selectedWidget) {
    return (
      <div className="h-full border rounded-lg bg-white">
        <div className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Select a widget to customize</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="flex-shrink-0 p-4 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800">
              Customize Widget
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Adjust content, colors, and behavior
            </p>
          </div>
          <Button
            onClick={saveWidget}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
            className={cn(
              "gap-2 transition-all",
              hasUnsavedChanges
                ? "bg-orange-600 hover:bg-orange-700 text-white shadow-sm"
                : "bg-emerald-500 hover:bg-emerald-600",
            )}
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="sr-only">Saving...</span>
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="h-3.5 w-3.5" />
                Save
              </>
            ) : (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                Saved
              </>
            )}
          </Button>
        </div>

        {/* Embed Type Toggle */}
        <div className="flex gap-2 p-1 bg-slate-100 rounded-lg">
          <button
            onClick={() => setActiveEmbedType("popup")}
            className={cn(
              "flex-1 px-3 py-2 rounded-md transition-all text-xs font-medium flex items-center justify-center gap-2",
              activeEmbedType === "popup"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Popup
          </button>
          <button
            onClick={() => setActiveEmbedType("inline")}
            className={cn(
              "flex-1 px-3 py-2 rounded-md transition-all text-xs font-medium flex items-center justify-center gap-2",
              activeEmbedType === "inline"
                ? "bg-white text-orange-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            )}
          >
            Inline
          </button>

          {leadMagnetEnabled && (
            <button
              onClick={() => setActiveEmbedType("lead-magnet")}
              className={cn(
                "flex-1 px-3 py-2 rounded-md transition-all text-xs font-medium flex items-center justify-center gap-2",
                activeEmbedType === "lead-magnet"
                  ? "bg-white text-orange-600 shadow-sm"
                  : "text-slate-500 hover:text-slate-700"
              )}
            >
              Lead Magnet
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4">
            <TabsTrigger value="content" className="gap-2">
              <Type className="h-4 w-4" />
              Content
            </TabsTrigger>
            <TabsTrigger value="colors" className="gap-2">
              <Paintbrush className="h-4 w-4" />
              Colors
            </TabsTrigger>
            <TabsTrigger value="behavior" className="gap-2">
              <Settings2 className="h-4 w-4" />
              Behavior
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4 mt-0">
            <div className="space-y-2">
              <Label htmlFor="widget-title">Title</Label>
              <Input
                id="widget-title"
                value={config.title}
                onChange={(e) => updateConfig("title", e.target.value)}
                placeholder="Subscribe to our newsletter"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="widget-description">Description</Label>
              <Textarea
                id="widget-description"
                value={config.description}
                onChange={(e) => updateConfig("description", e.target.value)}
                placeholder="Get the latest updates..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="button-text">Button Text</Label>
                <Input
                  id="button-text"
                  value={config.buttonText}
                  onChange={(e) => updateConfig("buttonText", e.target.value)}
                  placeholder="Subscribe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="placeholder-text">Placeholder</Label>
                <Input
                  id="placeholder-text"
                  value={config.placeholderText || ""}
                  onChange={(e) =>
                    updateConfig("placeholderText", e.target.value)
                  }
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="success-message">Success Message</Label>
              <Input
                id="success-message"
                value={config.successMessage}
                onChange={(e) => updateConfig("successMessage", e.target.value)}
                placeholder="Thanks for subscribing!"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div>
                <Label>Enable Lead Magnet</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Offer a resource in exchange for subscription
                </p>
              </div>
              <Switch
                checked={leadMagnetEnabled}
                onCheckedChange={setLeadMagnetEnabled}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <Label>Show Branding</Label>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Display "Powered by Collecty"
                </p>
              </div>
              <Switch
                checked={config.showBranding}
                onCheckedChange={(checked) =>
                  updateConfig("showBranding", checked)
                }
              />
            </div>
          </TabsContent>

          <TabsContent value="colors" className="space-y-4 mt-0">
            <div className="grid grid-cols-1 gap-4">
              <ColorPicker
                label="Primary Color"
                value={config.primaryColor}
                onChange={(value) => updateConfig("primaryColor", value)}
              />
              <ColorPicker
                label="Background Color"
                value={config.backgroundColor}
                onChange={(value) => updateConfig("backgroundColor", value)}
              />
              <ColorPicker
                label="Text Color"
                value={config.textColor}
                onChange={(value) => updateConfig("textColor", value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Border Radius</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="0"
                  max="24"
                  value={config.borderRadius || 8}
                  onChange={(e) =>
                    updateConfig("borderRadius", parseInt(e.target.value))
                  }
                  className="flex-1 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <span className="text-sm font-mono text-muted-foreground w-12 text-right">
                  {config.borderRadius || 8}px
                </span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4 mt-0">
            {/* Popup-specific settings - only show when popup is active */}
            {activeEmbedType === "popup" && (
              <>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <span className="font-medium">Popup settings</span> control
                    how and when the modal appears
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Position</Label>
                  <Select
                    value={config.position || "center"}
                    onValueChange={(value) =>
                      updateConfig("position", value as typeof config.position)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center">Center</SelectItem>
                      <SelectItem value="bottom-right">Bottom Right</SelectItem>
                      <SelectItem value="bottom-left">Bottom Left</SelectItem>
                      <SelectItem value="top-right">Top Right</SelectItem>
                      <SelectItem value="top-left">Top Left</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Trigger Type</Label>
                  <Select
                    value={config.triggerType || "delay"}
                    onValueChange={(value) =>
                      updateConfig(
                        "triggerType",
                        value as typeof config.triggerType,
                      )
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="delay">Time Delay</SelectItem>
                      <SelectItem value="scroll">Scroll Percentage</SelectItem>
                      <SelectItem value="exit-intent">Exit Intent</SelectItem>
                      <SelectItem value="click">Manual Click</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {(config.triggerType === "delay" ||
                  config.triggerType === "scroll") && (
                    <div className="space-y-2">
                      <Label>
                        {config.triggerType === "delay"
                          ? "Delay (seconds)"
                          : "Scroll Percentage"}
                      </Label>
                      <Input
                        type="number"
                        min={0}
                        max={config.triggerType === "scroll" ? 100 : 3600}
                        value={config.triggerValue || 3}
                        onChange={(e) =>
                          updateConfig(
                            "triggerValue",
                            parseInt(e.target.value) || 0,
                          )
                        }
                      />
                    </div>
                  )}
              </>
            )}

            {/* Inline-specific settings */}
            {activeEmbedType === "inline" && (
              <>
                <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
                  <p className="text-sm text-orange-800">
                    <span className="font-medium">Inline settings</span> control
                    the form layout
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Layout</Label>
                  <Select
                    value={config.layout || "horizontal"}
                    onValueChange={(value) =>
                      updateConfig("layout", value as typeof config.layout)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="horizontal">Horizontal</SelectItem>
                      <SelectItem value="vertical">Vertical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div >
  );
}

// Color picker component
function ColorPicker({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex gap-3 items-center">
        <div
          className="relative h-12 w-12 rounded-xl overflow-hidden border-2 border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-shadow"
          style={{ backgroundColor: value }}
        >
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 font-mono text-sm uppercase"
          maxLength={7}
        />
      </div>
    </div>
  );
}
