"use client";

import { useState } from "react";
import { useWidgetContext, type WidgetEntity } from "./widget-context";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ChevronDown, Plus, Check, Sparkles, Star, Layers } from "lucide-react";

export function WidgetSelector() {
  const {
    widgets,
    selectedWidget,
    selectWidget,
    createWidget,
    isSaving,
    hasUnsavedChanges,
  } = useWidgetContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreateWidget = async () => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      await createWidget(newWidgetName || undefined);
      setNewWidgetName("");
      setIsCreateDialogOpen(false);
    } finally {
      setIsCreating(false);
    }
  };

  if (widgets.length === 0) {
    return (
      <div className="flex items-center gap-3">
        <Button
          onClick={() => setIsCreateDialogOpen(true)}
          className="gap-2"
          variant="default"
        >
          <Plus className="h-4 w-4" />
          Create Your First Widget
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "gap-2 min-w-[200px] justify-between font-medium",
                "bg-gradient-to-r from-slate-50 to-white",
                "border-slate-200 hover:border-primary/50",
                "transition-all duration-200",
                hasUnsavedChanges && "border-amber-300 bg-amber-50/50",
              )}
            >
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br from-primary/10 to-primary/5",
                    "text-primary",
                  )}
                >
                  <Layers className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold">
                    {selectedWidget?.name || "Select Widget"}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {widgets.length} widget{widgets.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
              <ChevronDown className="h-4 w-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[280px]">
            <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Your Widgets
            </div>
            {widgets.map((widget) => (
              <DropdownMenuItem
                key={widget.id}
                onClick={() => selectWidget(widget.id)}
                className={cn(
                  "flex items-center gap-3 py-3 cursor-pointer",
                  selectedWidget?.id === widget.id && "bg-primary/5",
                )}
              >
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    "bg-gradient-to-br",
                    selectedWidget?.id === widget.id
                      ? "from-primary to-primary/80 text-white"
                      : "from-slate-100 to-slate-50 text-slate-500",
                  )}
                >
                  <Sparkles className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-medium truncate">{widget.name}</span>
                    {widget.isDefault && (
                      <Badge
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0"
                      >
                        <Star className="h-2.5 w-2.5 mr-0.5" />
                        Default
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Last updated{" "}
                    {new Date(widget.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                {selectedWidget?.id === widget.id && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => setIsCreateDialogOpen(true)}
              className="gap-2 text-primary cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create New Widget
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {hasUnsavedChanges && (
          <Badge
            variant="outline"
            className="bg-amber-50 text-amber-700 border-amber-200 animate-pulse"
          >
            Unsaved
          </Badge>
        )}
      </div>

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              Create New Widget
            </DialogTitle>
            <DialogDescription>
              Give your widget a name to identify it. You can customize its
              appearance after creating it.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input
                id="widget-name"
                placeholder="e.g., Homepage Popup, Footer Form"
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateWidget();
                }}
              />
              <p className="text-xs text-muted-foreground">
                Leave empty to auto-generate a name
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateWidget}
              disabled={isCreating}
              className="gap-2"
            >
              {isCreating ? (
                <>
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Create Widget
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
