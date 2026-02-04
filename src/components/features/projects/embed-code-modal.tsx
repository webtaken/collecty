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
            <DialogContent className="max-w-[80vw] w-[80vw] min-w-[800px] max-h-[90vh] overflow-y-auto">
                <WidgetInstallNew />
            </DialogContent>
        </Dialog>
    );
}
