"use client";

import { useState, useTransition } from "react";
import { updateWidgetConfigAction } from "@/actions/projects";
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
import type { WidgetConfig } from "@/db/schema/projects";

type WidgetCustomizerProps = {
  projectId: string;
  initialConfig: WidgetConfig;
};

export function WidgetCustomizer({ projectId, initialConfig }: WidgetCustomizerProps) {
  const [config, setConfig] = useState<WidgetConfig>(initialConfig);
  const [isPending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  const handleChange = <K extends keyof WidgetConfig>(
    key: K,
    value: WidgetConfig[K]
  ) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    startTransition(async () => {
      await updateWidgetConfigAction(projectId, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    });
  };

  return (
    <div className="space-y-6">
      {/* Content */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Content</h4>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={config.title}
            onChange={(e) => handleChange("title", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={config.description}
            onChange={(e) => handleChange("description", e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="buttonText">Button Text</Label>
          <Input
            id="buttonText"
            value={config.buttonText}
            onChange={(e) => handleChange("buttonText", e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="successMessage">Success Message</Label>
          <Input
            id="successMessage"
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
            <Label htmlFor="primaryColor">Primary</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="primaryColor"
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
            <Label htmlFor="backgroundColor">Background</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="backgroundColor"
                value={config.backgroundColor}
                onChange={(e) => handleChange("backgroundColor", e.target.value)}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={config.backgroundColor}
                onChange={(e) => handleChange("backgroundColor", e.target.value)}
                className="flex-1 font-mono text-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="textColor">Text</Label>
            <div className="flex gap-2">
              <input
                type="color"
                id="textColor"
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

      {/* Behavior */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Behavior</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="position">Position</Label>
            <Select
              value={config.position}
              onValueChange={(value) => handleChange("position", value as WidgetConfig["position"])}
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
            <Label htmlFor="triggerType">Trigger</Label>
            <Select
              value={config.triggerType}
              onValueChange={(value) => handleChange("triggerType", value as WidgetConfig["triggerType"])}
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
        </div>

        {(config.triggerType === "delay" || config.triggerType === "scroll") && (
          <div className="space-y-2">
            <Label htmlFor="triggerValue">
              {config.triggerType === "delay" ? "Delay (seconds)" : "Scroll Percentage"}
            </Label>
            <Input
              id="triggerValue"
              type="number"
              min={0}
              max={config.triggerType === "scroll" ? 100 : undefined}
              value={config.triggerValue}
              onChange={(e) => handleChange("triggerValue", parseInt(e.target.value) || 0)}
            />
          </div>
        )}
      </div>

      {/* Preview */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-slate-900">Preview</h4>
        <div className="border rounded-lg p-4 bg-slate-50">
          <div
            className="mx-auto max-w-sm rounded-lg shadow-lg overflow-hidden"
            style={{ backgroundColor: config.backgroundColor }}
          >
            <div className="p-4">
              <h3
                className="font-bold mb-1"
                style={{ color: config.textColor }}
              >
                {config.title}
              </h3>
              <p
                className="text-sm mb-3 opacity-80"
                style={{ color: config.textColor }}
              >
                {config.description}
              </p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 px-3 py-1.5 rounded border text-sm"
                  disabled
                />
                <button
                  className="px-3 py-1.5 rounded text-white text-sm font-medium"
                  style={{ backgroundColor: config.primaryColor }}
                  disabled
                >
                  {config.buttonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Button onClick={handleSave} disabled={isPending} className="w-full">
        {isPending ? "Saving..." : saved ? "Saved!" : "Save Widget Settings"}
      </Button>
    </div>
  );
}

