"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PopupWidgetCustomizer } from "./popup-widget-customizer";
import { InlineWidgetCustomizer } from "./inline-widget-customizer";
import { WidgetInstallCode } from "./widget-install-code";
import type { WidgetConfig, InlineWidgetConfig } from "@/db/schema/projects";

type WidgetCustomizerProps = {
  projectId: string;
  initialConfig: WidgetConfig;
  initialInlineConfig: InlineWidgetConfig;
};

export function WidgetCustomizer({
  projectId,
  initialConfig,
  initialInlineConfig,
}: WidgetCustomizerProps) {
  return (
    <Tabs defaultValue="popup" className="w-full">
      <TabsList className="w-full mb-6">
        <TabsTrigger value="popup" className="flex-1">
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
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          Popup Widget
        </TabsTrigger>
        <TabsTrigger value="inline" className="flex-1">
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
              d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
            />
          </svg>
          Inline Form
        </TabsTrigger>
      </TabsList>

      <TabsContent value="popup" className="space-y-6">
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4 mb-4">
          <p className="text-sm text-indigo-800">
            <span className="font-medium">Popup widget</span> appears as an
            overlay that can be triggered by time delay, scroll position, exit
            intent, or manual activation.
          </p>
        </div>
        <PopupWidgetCustomizer
          projectId={projectId}
          initialConfig={initialConfig}
        />
        <div className="border-t pt-6">
          <WidgetInstallCode projectId={projectId} widgetType="popup" />
        </div>
      </TabsContent>

      <TabsContent value="inline" className="space-y-6">
        <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4 mb-4">
          <p className="text-sm text-emerald-800">
            <span className="font-medium">Inline form</span> embeds directly
            into your page content - perfect for footers, sidebars, or any
            section where you want a persistent signup form.
          </p>
        </div>
        <InlineWidgetCustomizer
          projectId={projectId}
          initialConfig={initialInlineConfig}
        />
        <div className="border-t pt-6">
          <WidgetInstallCode projectId={projectId} widgetType="inline" />
        </div>
      </TabsContent>
    </Tabs>
  );
}
