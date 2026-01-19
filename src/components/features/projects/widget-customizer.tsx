"use client";

import { useWidgetGenerator } from "./widget-generator-context";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { PopupWidgetCustomizer } from "./popup-widget-customizer";
import { InlineWidgetCustomizer } from "./inline-widget-customizer";

export function WidgetCustomizer() {
  const {
    projectId,
    activeTab,
    popupConfig,
    setPopupConfig,
    inlineConfig,
    setInlineConfig,
  } = useWidgetGenerator();

  const isPopupActive = activeTab === "popup";

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Widget Customization</CardTitle>
        <CardDescription>
          {isPopupActive
            ? "Adjust the popup content, colors, and behavior to match your brand."
            : "Fine-tune the inline form’s layout, copy, and colors from right here."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isPopupActive ? (
          <>
            <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
              <p className="text-sm text-indigo-800">
                <span className="font-medium">Popup widget</span> appears as an
                overlay you can trigger by time delay, scroll position, exit intent,
                or manual activation.
              </p>
            </div>
            <PopupWidgetCustomizer
              projectId={projectId}
              initialConfig={popupConfig}
              showPreview={false}
              onConfigChange={setPopupConfig}
            />
          </>
        ) : (
          <>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-4">
              <p className="text-sm text-emerald-800">
                <span className="font-medium">Inline form</span> embeds directly into
                your page content — ideal for footers, sidebars, or any persistent
                signup area.
              </p>
            </div>
            <InlineWidgetCustomizer
              projectId={projectId}
              initialConfig={inlineConfig}
              showPreview={false}
              onConfigChange={setInlineConfig}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}
