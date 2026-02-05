"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { WidgetCustomizerNew } from "./widget-customizer-new";
import { WidgetPreviewNew } from "./widget-preview-new";
import { useWidgetContext } from "./widget-context";

interface EditWidgetModalProps {
  children?: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditWidgetModal({
  children,
  open,
  onOpenChange,
}: EditWidgetModalProps) {
  const { activeEmbedType } = useWidgetContext();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="!max-w-[100vw] !w-[80vw] h-[90vh] p-0 flex flex-col overflow-hidden bg-slate-50/50">
        <div className="flex flex-1 h-full overflow-hidden">
          {/* Left: Customizer Controls */}
          <div className="w-[450px] flex-shrink-0 border-r border-slate-200 bg-white h-full overflow-hidden">
            <WidgetCustomizerNew />
          </div>

          {/* Right: Preview Area */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-100 overflow-hidden relative">
            <div className="w-full h-full flex items-center justify-center">
              <div className="pointer-events-none select-none relative isolate">
                <div className="pointer-events-auto">
                  <WidgetPreviewNew hideTabs={true} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
