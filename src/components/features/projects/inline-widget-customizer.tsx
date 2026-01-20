"use client";

import { useEffect, useState, useTransition } from "react";
import { updateInlineWidgetConfigAction } from "@/actions/projects";
import { publishGuideEvent } from "@/lib/guide-events";
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
import type { InlineWidgetConfig } from "@/db/schema/projects";

type InlineWidgetCustomizerProps = {
  projectId: string;
  initialConfig: InlineWidgetConfig;
  onConfigChange?: (config: InlineWidgetConfig) => void;
  showPreview?: boolean;
};

export function InlineWidgetCustomizer({
  projectId,
  initialConfig,
  onConfigChange,
  showPreview = true,
}: InlineWidgetCustomizerProps) {
  const [config, setConfig] = useState<InlineWidgetConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setConfig(initialConfig);
  }, [initialConfig]);

  const handleChange = <K extends keyof InlineWidgetConfig>(
    key: K,
    value: InlineWidgetConfig[K],
  ) => {
    const next = { ...config, [key]: value };
    setConfig(next);
    onConfigChange?.(next);
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateInlineWidgetConfigAction(projectId, config);
      setSaved(true);
      publishGuideEvent("guide:customizedWidget");
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-6" data-guide-target="widget-customizer">
      {/* Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Content</h4>

        <div className="space-y-2">
          <Label htmlFor="inline-title">Title</Label>
          <Input
            id="inline-title"
            value={config.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-description">Description</Label>
          <Textarea
            id="inline-description"
            value={config.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inline-buttonText">Button Text</Label>
            <Input
              id="inline-buttonText"
              value={config.buttonText}
              onChange={(e) => handleChange("buttonText", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="inline-placeholderText">Placeholder Text</Label>
            <Input
              id="inline-placeholderText"
              value={config.placeholderText}
              onChange={(e) => handleChange("placeholderText", e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="inline-successMessage">Success Message</Label>
          <Input
            id="inline-successMessage"
            value={config.successMessage}
            onChange={(e) => handleChange("successMessage", e.target.value)}
          />
        </div>
      </div>

      {/* Colors */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Colors</h4>

        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inline-primaryColor">Primary</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="inline-primaryColor"
                value={config.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => handleChange("primaryColor", e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inline-backgroundColor">Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="inline-backgroundColor"
                value={config.backgroundColor}
                onChange={(e) =>
                  handleChange("backgroundColor", e.target.value)
                }
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) =>
                  handleChange("backgroundColor", e.target.value)
                }
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inline-textColor">Text</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="inline-textColor"
                value={config.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={config.textColor}
                onChange={(e) => handleChange("textColor", e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Layout & Style */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Layout & Style</h4>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="inline-layout">Layout</Label>
            <Select
              value={config.layout}
              onValueChange={(value) =>
                handleChange("layout", value as InlineWidgetConfig["layout"])
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="horizontal">
                  Horizontal (Side by side)
                </SelectItem>
                <SelectItem value="vertical">Vertical (Stacked)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="inline-borderRadius">Border Radius (px)</Label>
            <Input
              id="inline-borderRadius"
              type="number"
              min={0}
              max={32}
              value={config.borderRadius}
              onChange={(e) =>
                handleChange("borderRadius", parseInt(e.target.value) || 0)
              }
            />
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-slate-900">Preview</h4>
          <div className="border rounded-lg p-4 bg-slate-50">
            <div
              className="mx-auto max-w-lg overflow-hidden"
              style={{
                backgroundColor: config.backgroundColor,
                borderRadius: `${config.borderRadius}px`,
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
                className={`flex gap-3 ${
                  config.layout === "vertical" ? "flex-col" : "flex-row"
                }`}
              >
                <input
                  type="email"
                  placeholder={config.placeholderText}
                  className="flex-1 px-4 py-2.5 border-2 border-slate-200 text-sm"
                  style={{ borderRadius: `${config.borderRadius}px` }}
                  disabled
                />
                <button
                  className={`px-6 py-2.5 text-white text-sm font-semibold ${
                    config.layout === "vertical" ? "w-full" : ""
                  }`}
                  style={{
                    backgroundColor: config.primaryColor,
                    borderRadius: `${config.borderRadius}px`,
                  }}
                  disabled
                >
                  {config.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Saving..." : saved ? "Saved!" : "Save Widget Settings"}
      </Button>
    </div>
  );
}
