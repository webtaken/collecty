"use client";

import { useWidgetContext } from "./widget-context";
import { motion, AnimatePresence } from "framer-motion";
import { Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { WidgetCustomizerNew } from "./widget-customizer-new";
import { WidgetSelector } from "./widget-selector";
import { WidgetPreviewNew } from "./widget-preview-new";
import { useEffect } from "react";

export function CustomizationSidePanel() {
    const {
        isCustomizerOpen,
        setIsCustomizerOpen,
        saveWidget,
        isSaving,
        hasUnsavedChanges
    } = useWidgetContext();

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === "Escape") setIsCustomizerOpen(false);
        };
        window.addEventListener("keydown", handleEsc);
        return () => window.removeEventListener("keydown", handleEsc);
    }, [setIsCustomizerOpen]);

    return (
        <>
            {/* Toggle Button - Gear Icon */}
            <div className="fixed top-24 right-0 z-[60] flex items-center">
                <motion.button
                    onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
                    className={cn(
                        "bg-primary text-white p-2.5 rounded-l-2xl shadow-xl flex items-center gap-2 group transition-all duration-300",
                        isCustomizerOpen && "opacity-0 pointer-events-none translate-x-full"
                    )}
                    whileHover={{
                        paddingLeft: "1.25rem",
                        paddingRight: "1rem",
                        scale: 1.05
                    }}
                    initial={false}
                >
                    <Settings className={cn(
                        "h-5 w-5 transition-all duration-500",
                        "group-hover:rotate-90"
                    )} />
                    <motion.span
                        className="font-semibold text-sm whitespace-nowrap overflow-hidden"
                        initial={{ width: 0, opacity: 0 }}
                        whileHover={{ width: "auto", opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    >
                        Customize Widget
                    </motion.span>
                </motion.button>
            </div>

            <AnimatePresence>
                {isCustomizerOpen && (
                    <>
                        {/* Backdrop overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsCustomizerOpen(false)}
                            className="fixed inset-0 bg-slate-900/10 backdrop-blur-[2px] z-50 transition-all duration-500"
                        />

                        {/* Floating Preview Panel (To the left of the side panel) */}
                        <motion.div
                            initial={{ x: "100%", opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: "100%", opacity: 0 }}
                            transition={{ type: "spring", damping: 30, stiffness: 200, delay: 0.1 }}
                            className="fixed inset-y-8 right-[440px] w-[500px] z-[70] hidden xl:flex flex-col"
                        >
                            <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 overflow-hidden h-full flex flex-col">
                                <div className="p-4 border-b bg-white/50 flex items-center justify-between">
                                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                                        <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                        Live Preview
                                    </h3>
                                    <div className="flex gap-1">
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                        <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                                    </div>
                                </div>
                                <div className="flex-1 p-8 flex items-center justify-center bg-slate-50/30">
                                    <WidgetPreviewNew isPlain={true} />
                                </div>
                                <div className="p-4 bg-white/50 border-t text-center">
                                    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                                        Previewing changes in real-time
                                    </p>
                                </div>
                            </div>
                        </motion.div>

                        {/* Slide-out Panel (Settings) */}
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed inset-y-0 right-0 w-full sm:w-[420px] bg-white shadow-2xl z-[70] border-l flex flex-col"
                        >
                            {/* Panel Header */}
                            <div className="p-6 border-b bg-white sticky top-0 z-10 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-xl font-bold text-slate-900">Customize Widget</h2>
                                        <p className="text-sm text-slate-500">Configure appearance and behavior</p>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setIsCustomizerOpen(false)}
                                        className="rounded-full hover:bg-slate-100 transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </Button>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                                        Selected Widget
                                    </Label>
                                    <WidgetSelector />
                                </div>
                            </div>

                            {/* Customizer Content */}
                            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
                                <WidgetCustomizerNew />
                            </div>

                            {/* Footer with Save Button */}
                            <div className="p-6 border-t bg-slate-50 shadow-[0_-4px_10px_rgba(0,0,0,0.03)] selection:bg-primary/10">
                                <Button
                                    onClick={saveWidget}
                                    disabled={isSaving || !hasUnsavedChanges}
                                    className={cn(
                                        "w-full h-12 gap-2 text-base font-bold transition-all duration-300 rounded-xl shadow-lg",
                                        hasUnsavedChanges
                                            ? "bg-primary hover:bg-primary/90 hover:scale-[1.02] active:scale-[0.98] shadow-primary/20"
                                            : "bg-primary hover:bg-primary/90 shadow-primary/10"
                                    )}
                                >
                                    {isSaving ? (
                                        <>
                                            <span className="h-5 w-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                            Saving Changes...
                                        </>
                                    ) : (
                                        <>
                                            {hasUnsavedChanges ? "Save Widget Changes" : "Everything Up to Date"}
                                        </>
                                    )}
                                </Button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
