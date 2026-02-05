"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { WidgetInstallNew } from "./widget-install-new";

interface EmbedCodeModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function EmbedCodeModal({ open, onOpenChange }: EmbedCodeModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="!max-w-7xl min-w-[1024px] w-full h-[85vh] p-0 overflow-hidden bg-slate-50 flex flex-col">
                <WidgetInstallNew />
            </DialogContent>
        </Dialog>
    );
}
