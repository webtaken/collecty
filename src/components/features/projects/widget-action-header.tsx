"use client";

import { useState } from "react";
import { useWidgetContext } from "./widget-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WidgetSelector } from "./widget-selector";
import { WidgetInstallNew } from "./widget-install-new";
import { Code } from "lucide-react";
import { cn } from "@/lib/utils";

export function WidgetActionHeader() {
    const { selectedWidget } = useWidgetContext();
    const [isInstallOpen, setIsInstallOpen] = useState(false);

    return (
        <Card className="shadow-sm overflow-hidden flex flex-col justify-center h-full">
            <CardContent className="p-4">
                <div className="flex flex-col h-full justify-center">
                    <div className="text-sm font-bold text-slate-900 mb-3 px-1 flex items-center gap-2">
                        <div className="h-5 w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(255,79,0,0.4)]" />
                        Widget Installation for your project
                    </div>

                    <div className="bg-slate-50/50 rounded-xl p-3 border border-slate-100 flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                            <WidgetSelector />
                        </div>
                        <Button
                            onClick={() => setIsInstallOpen(true)}
                            className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-11 px-6 font-bold shrink-0 transition-all hover:scale-[1.02] active:scale-[0.98]"
                            disabled={!selectedWidget}
                        >
                            <Code className="h-4 w-4 mr-2" />
                            Get Embed Code
                        </Button>
                    </div>
                </div>
            </CardContent>

            <Dialog open={isInstallOpen} onOpenChange={setIsInstallOpen}>
                <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
                    <div className="flex-1 bg-white overflow-hidden flex flex-col">
                        <WidgetInstallNew />
                    </div>
                </DialogContent>
            </Dialog>
        </Card>
    );
}
