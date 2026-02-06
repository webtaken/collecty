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
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import {
  Paintbrush,
  Type,
  Settings2,
  Sparkles,
  Save,
  CheckCircle2,
  LayoutTemplate,
  MessageSquare,
  MonitorSmartphone,
  Palette,
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
      <div className="h-full flex flex-col items-center justify-center p-8 bg-slate-50/50">
        <div className="text-center max-w-sm">
          <div className="bg-white p-4 rounded-full shadow-sm inline-flex mb-6">
            <Sparkles className="h-8 w-8 text-orange-500 fill-orange-100" />
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-2">
            No Widget Selected
          </h3>
          <p className="text-sm text-slate-500">
            Select a widget from the sidebar to start customizing its appearance
            and behavior.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header Section */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-100 bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Customize
            </h2>
            <p className="text-sm text-slate-500">
              Design and configure your widget
            </p>
          </div>
          <Button
            onClick={saveWidget}
            disabled={isSaving || !hasUnsavedChanges}
            size="sm"
            className={cn(
              "font-medium transition-all shadow-sm",
              hasUnsavedChanges
                ? "bg-orange-600 hover:bg-orange-700 text-white w-28"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 w-24",
            )}
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving
              </>
            ) : hasUnsavedChanges ? (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4 mr-2" />
                Saved
              </>
            )}
          </Button>
        </div>

        {/* Embed Type Selector - Custom Segmented Control */}
        <div className="p-1 bg-slate-100/80 rounded-lg flex gap-1">
          <button
            onClick={() => setActiveEmbedType("popup")}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
              activeEmbedType === "popup"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
            )}
          >
            <MessageSquare className="w-4 h-4" />
            Popup
          </button>
          <button
            onClick={() => setActiveEmbedType("inline")}
            className={cn(
              "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
              activeEmbedType === "inline"
                ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
            )}
          >
            <LayoutTemplate className="w-4 h-4" />
            Inline
          </button>
          {leadMagnetEnabled && (
            <button
              onClick={() => setActiveEmbedType("lead-magnet")}
              className={cn(
                "flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2",
                activeEmbedType === "lead-magnet"
                  ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50",
              )}
            >
              <Sparkles className="w-4 h-4" />
              Lead Magnet
            </button>
          )}
        </div>
      </div>

      {/* Scrollable Content Area */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-xl mx-auto w-full">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="w-full bg-slate-50 border border-slate-200 p-1 mb-6">
              <TabsTrigger
                value="content"
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
              >
                <Type className="h-4 w-4 mr-2" />
                Content
              </TabsTrigger>
              <TabsTrigger
                value="colors"
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
              >
                <Palette className="h-4 w-4 mr-2" />
                Appearance
              </TabsTrigger>
              <TabsTrigger
                value="behavior"
                className="flex-1 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-orange-600"
              >
                <Settings2 className="h-4 w-4 mr-2" />
                Behavior
              </TabsTrigger>
            </TabsList>

            <TabsContent
              value="content"
              className="space-y-6 focus:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
            >
              <section className="space-y-4">
                <div className="space-y-3">
                  <Label htmlFor="widget-title" className="text-slate-700">
                    Headline
                  </Label>
                  <Input
                    id="widget-title"
                    value={config.title}
                    onChange={(e) => updateConfig("title", e.target.value)}
                    placeholder="e.g., Join our newsletter"
                    className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <div className="space-y-3">
                  <Label
                    htmlFor="widget-description"
                    className="text-slate-700"
                  >
                    Description
                  </Label>
                  <Textarea
                    id="widget-description"
                    value={config.description}
                    onChange={(e) =>
                      updateConfig("description", e.target.value)
                    }
                    placeholder="e.g., Get weekly insights delivered to your inbox."
                    rows={3}
                    className="resize-none border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>

                <Separator className="bg-slate-100" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <Label htmlFor="button-text" className="text-slate-700">
                      Button Label
                    </Label>
                    <Input
                      id="button-text"
                      value={config.buttonText}
                      onChange={(e) =>
                        updateConfig("buttonText", e.target.value)
                      }
                      placeholder="Subscribe"
                      className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                  </div>
                  <div className="space-y-3">
                    <Label
                      htmlFor="placeholder-text"
                      className="text-slate-700"
                    >
                      Input Placeholder
                    </Label>
                    <Input
                      id="placeholder-text"
                      value={config.placeholderText || ""}
                      onChange={(e) =>
                        updateConfig("placeholderText", e.target.value)
                      }
                      placeholder="email@example.com"
                      className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="success-message" className="text-slate-700">
                    Success Message
                  </Label>
                  <Input
                    id="success-message"
                    value={config.successMessage}
                    onChange={(e) =>
                      updateConfig("successMessage", e.target.value)
                    }
                    placeholder="Thank you for subscribing!"
                    className="border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                  />
                </div>
              </section>

              <section className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50/50 hover:bg-orange-50 rounded-xl border border-orange-100 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-orange-500" />
                      <Label className="text-slate-900 cursor-pointer">
                        Lead Magnet
                      </Label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Offer a downloadable resource upon signup
                    </p>
                  </div>
                  <Switch
                    checked={leadMagnetEnabled}
                    onCheckedChange={setLeadMagnetEnabled}
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-white hover:bg-slate-50 rounded-xl border border-slate-200 transition-colors">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Label className="text-slate-900 cursor-pointer">
                        Collecty Branding
                      </Label>
                    </div>
                    <p className="text-xs text-slate-500">
                      Show "Powered by Collecty" badge
                    </p>
                  </div>
                  <Switch
                    checked={config.showBranding}
                    onCheckedChange={(checked) =>
                      updateConfig("showBranding", checked)
                    }
                    className="data-[state=checked]:bg-orange-500"
                  />
                </div>
              </section>
            </TabsContent>

            <TabsContent
              value="colors"
              className="space-y-8 focus:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
            >
              <section className="space-y-4">
                <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  <Paintbrush className="w-4 h-4 text-slate-500" />
                  Theme Colors
                </h4>
                <div className="grid gap-4">
                  <ColorPicker
                    label="Primary Color"
                    value={config.primaryColor}
                    onChange={(value) => updateConfig("primaryColor", value)}
                    description="Used for buttons and highlights"
                  />
                  <ColorPicker
                    label="Background"
                    value={config.backgroundColor}
                    onChange={(value) => updateConfig("backgroundColor", value)}
                    description="Widget container background"
                  />
                  <ColorPicker
                    label="Text Color"
                    value={config.textColor}
                    onChange={(value) => updateConfig("textColor", value)}
                    description="Body and heading text"
                  />
                </div>
              </section>

              <Separator className="bg-slate-100" />

              <section className="space-y-4">
                <h4 className="text-sm font-medium text-slate-900 flex items-center gap-2">
                  <LayoutTemplate className="w-4 h-4 text-slate-500" />
                  Shape & Form
                </h4>
                <div className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <Label className="text-slate-700">Corner Radius</Label>
                    <span className="text-xs font-mono bg-white px-2 py-1 rounded border border-slate-200 text-slate-500">
                      {config.borderRadius || 8}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="24"
                    value={config.borderRadius || 8}
                    onChange={(e) =>
                      updateConfig("borderRadius", parseInt(e.target.value))
                    }
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>Square</span>
                    <span>Round</span>
                  </div>
                </div>
              </section>
            </TabsContent>

            <TabsContent
              value="behavior"
              className="space-y-6 focus:outline-none animate-in fade-in-50 slide-in-from-bottom-2 duration-300"
            >
              {activeEmbedType === "popup" && (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3">
                    <MonitorSmartphone className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-900">
                        Popup Configuration
                      </h4>
                      <p className="text-xs text-orange-700 mt-1">
                        Control where and when your popup appears to visitors.
                      </p>
                    </div>
                  </div>

                  <div className="grid gap-6">
                    <div className="space-y-3">
                      <Label className="text-slate-700">Screen Position</Label>
                      <Select
                        value={config.position || "center"}
                        onValueChange={(value) =>
                          updateConfig(
                            "position",
                            value as typeof config.position,
                          )
                        }
                      >
                        <SelectTrigger className="border-slate-200 focus:ring-orange-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="center">Center Modal</SelectItem>
                          <SelectItem value="bottom-right">
                            Bottom Right
                          </SelectItem>
                          <SelectItem value="bottom-left">
                            Bottom Left
                          </SelectItem>
                          <SelectItem value="top-right">Top Right</SelectItem>
                          <SelectItem value="top-left">Top Left</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-3">
                      <Label className="text-slate-700">Trigger Event</Label>
                      <Select
                        value={config.triggerType || "delay"}
                        onValueChange={(value) =>
                          updateConfig(
                            "triggerType",
                            value as typeof config.triggerType,
                          )
                        }
                      >
                        <SelectTrigger className="border-slate-200 focus:ring-orange-500/20">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="delay">Time Delay</SelectItem>
                          <SelectItem value="scroll">
                            scroll Percentage
                          </SelectItem>
                          <SelectItem value="exit-intent">
                            Exit Intent
                          </SelectItem>
                          <SelectItem value="click">Manual Click</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(config.triggerType === "delay" ||
                      config.triggerType === "scroll") && (
                      <div className="space-y-3 animate-in fade-in duration-200">
                        <Label className="text-slate-700">
                          {config.triggerType === "delay"
                            ? "Wait Time (seconds)"
                            : "Scroll Depth (%)"}
                        </Label>
                        <div className="relative">
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
                            className="pl-4 border-slate-200 focus:border-orange-500 focus:ring-orange-500/20"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeEmbedType === "inline" && (
                <div className="space-y-6">
                  <div className="p-4 bg-orange-50/50 border border-orange-100 rounded-xl flex gap-3">
                    <LayoutTemplate className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-sm font-medium text-orange-900">
                        Inline Configuration
                      </h4>
                      <p className="text-xs text-orange-700 mt-1">
                        Customize how the embedded form fits into your page
                        content.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-slate-700">Form Layout</Label>
                    <Select
                      value={config.layout || "horizontal"}
                      onValueChange={(value) =>
                        updateConfig("layout", value as typeof config.layout)
                      }
                    >
                      <SelectTrigger className="border-slate-200 focus:ring-orange-500/20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="horizontal">
                          Horizontal (Side-by-side)
                        </SelectItem>
                        <SelectItem value="vertical">
                          Vertical (Stacked)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

// Enhanced Color Picker Component
function ColorPicker({
  label,
  value,
  onChange,
  description,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  description?: string;
}) {
  return (
    <div className="group flex items-center justify-between p-3 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition-all duration-200">
      <div className="space-y-1">
        <Label className="text-slate-700 cursor-pointer">{label}</Label>
        {description && (
          <p className="text-xs text-slate-400 group-hover:text-slate-500 transition-colors">
            {description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative">
          <div
            className="w-10 h-10 rounded-full shadow-sm ring-1 ring-slate-200 ring-offset-2 cursor-pointer overflow-hidden transition-transform hover:scale-105"
            style={{ backgroundColor: value }}
          >
            <input
              type="color"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
            />
          </div>
        </div>
        <div className="relative">
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-mono">
            #
          </span>
          <Input
            value={value.replace("#", "")}
            onChange={(e) => onChange(`#${e.target.value}`)}
            className="w-20 pl-5 h-8 text-xs font-mono uppercase border-slate-200 focus:border-orange-500 focus:ring-0"
            maxLength={6}
          />
        </div>
      </div>
    </div>
  );
}
