"use client";

import { useWidgetContext } from "./widget-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center text-muted-foreground">
            <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>Select a widget to customize</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Customize Widget
            </CardTitle>
            <CardDescription className="mt-1">
              Adjust content, colors, and behavior
            </CardDescription>
          </div>
          <Button
            onClick={saveWidget}
            disabled={isSaving || !hasUnsavedChanges}
            className={cn(
              "gap-2 transition-all",
              hasUnsavedChanges
                ? "bg-primary hover:bg-primary/90"
                : "bg-emerald-500 hover:bg-emerald-600",
            )}
          >
            {isSaving ? (
              <>
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Saved
              </>
            )}
          </Button>
        </div>

        {/* Embed Type Toggle */}
        <div className="flex gap-2 mt-4">
          <button
            onClick={() => setActiveEmbedType("popup")}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border-2 transition-all",
              "flex items-center justify-center gap-2 font-medium text-sm",
              activeEmbedType === "popup"
                ? "border-primary bg-primary/5 text-primary"
                : "border-slate-200 text-slate-500 hover:border-slate-300",
            )}
          >
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
            Popup Preview
          </button>
          <button
            onClick={() => setActiveEmbedType("inline")}
            className={cn(
              "flex-1 px-4 py-3 rounded-xl border-2 transition-all",
              "flex items-center justify-center gap-2 font-medium text-sm",
              activeEmbedType === "inline"
                ? "border-emerald-500 bg-emerald-50 text-emerald-600"
                : "border-slate-200 text-slate-500 hover:border-slate-300",
            )}
          >
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
                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6z"
              />
            </svg>
            Inline Preview
          </button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 overflow-y-auto max-h-[calc(100vh-200px)]">
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

            <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
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
                <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg">
                  <p className="text-sm text-indigo-800">
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
                <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-lg">
                  <p className="text-sm text-emerald-800">
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
      </CardContent>
    </Card>
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
