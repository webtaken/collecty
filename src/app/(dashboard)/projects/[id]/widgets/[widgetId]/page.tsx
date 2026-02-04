"use client";

import { useEffect, useState } from "react";
import { useWidgetContext } from "@/components/features/projects/widget-context";
import { WidgetPreviewNew } from "@/components/features/projects/widget-preview-new";
import { Button } from "@/components/ui/button";
import { Edit, Code, ArrowUpRight } from "lucide-react";
import { EditWidgetModal } from "@/components/features/projects/edit-widget-modal";
import { EmbedCodeModal } from "@/components/features/projects/embed-code-modal";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";

export default function WidgetDetailPage() {
    const params = useParams();
    const { selectWidget, selectedWidget, activeEmbedType } = useWidgetContext();
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

    // Ensure the correct widget is selected based on URL
    useEffect(() => {
        if (params.widgetId && typeof params.widgetId === 'string') {
            selectWidget(params.widgetId);
        }
    }, [params.widgetId]);

    if (!selectedWidget) return null; // Or a loading state

    return (
        <div className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">{selectedWidget.name}</h2>
                    <p className="text-sm text-slate-500">
                        {activeEmbedType === "popup" ? "Popup Widget" : "Inline Form"}
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        onClick={() => setIsEditModalOpen(true)}
                        className="gap-2 bg-white"
                    >
                        <Edit className="w-4 h-4" />
                        Edit Widget
                    </Button>
                    <Button
                        variant="default"
                        onClick={() => setIsEmbedModalOpen(true)}
                        className="gap-2"
                    >
                        <Code className="w-4 h-4" />
                        Get Embed Code
                    </Button>
                </div>
            </div>

            <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] relative rounded-xl border-2 border-dashed border-slate-200 bg-slate-100/50 p-4">
                <div className={cn(
                    "w-full max-w-4xl transition-all duration-300",
                    activeEmbedType === "popup" ? "scale-90" : "scale-100"
                )}>
                    {/* Live Preview Label */}
                    <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/80 backdrop-blur px-3 py-1 rounded-full border shadow-sm text-xs font-medium text-slate-500 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Live Preview
                    </div>

                    <div className="pointer-events-none select-none relative isolate">
                        <div className="pointer-events-auto">
                            <WidgetPreviewNew />
                        </div>
                    </div>
                </div>
            </div>

            <EditWidgetModal open={isEditModalOpen} onOpenChange={setIsEditModalOpen} />
            <EmbedCodeModal open={isEmbedModalOpen} onOpenChange={setIsEmbedModalOpen} />
        </div>
    );
}
