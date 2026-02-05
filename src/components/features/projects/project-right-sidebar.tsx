"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useWidgetContext } from "./widget-context";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Users,
  Settings,
  Plus,
  Trash2,
  MoreHorizontal,
  Layers,
  Sparkles,
} from "lucide-react";
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectRightSidebarProps {
  project: {
    id: string;
    name: string;
  };
}

export function ProjectRightSidebar({ project }: ProjectRightSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { widgets, createWidget, deleteWidget, isSaving } = useWidgetContext();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newWidgetName, setNewWidgetName] = useState("");
  const [widgetToDelete, setWidgetToDelete] = useState<string | null>(null);

  const handleCreateWidget = async () => {
    if (isSaving) return;
    try {
      await createWidget(newWidgetName || undefined);
      setNewWidgetName("");
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error("Failed to create", error);
    }
  };

  const handleDeleteWidget = async () => {
    if (widgetToDelete) {
      await deleteWidget(widgetToDelete);
      setWidgetToDelete(null);
      router.push(`/projects/${project.id}/subscribers`);
    }
  };

  const isActive = (path: string) => pathname?.includes(path);
  const isWidgetActive = (widgetId: string) =>
    pathname?.includes(`/widgets/${widgetId}`);

  return (
    <div className="flex flex-col h-full bg-white border border-slate-200 w-64 shrink-0 rounded-lg">
      {/* Project Title Area */}
      <div className="p-4 border-b border-slate-100">
        <h2
          className="font-semibold text-slate-800 truncate"
          title={project.name}
        >
          {project.name}
        </h2>
        <p className="text-xs text-slate-500 mt-1">Project Management</p>
      </div>

      <div className="flex-1 overflow-y-auto py-4">
        {/* General Section */}
        <div className="px-3 mb-6">
          <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 px-3">
            General
          </h3>
          <nav className="space-y-1">
            <Link href={`/projects/${project.id}/subscribers`}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors",
                  isActive("/subscribers") &&
                    "bg-orange-50 text-orange-700 font-medium",
                )}
              >
                <Users
                  className={cn(
                    "w-4 h-4",
                    isActive("/subscribers")
                      ? "text-orange-600"
                      : "text-slate-500 group-hover:text-orange-600",
                  )}
                />
                Subscribers
              </Button>
            </Link>
            <Link href={`/projects/${project.id}/settings`}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 hover:bg-orange-50 hover:text-orange-600 transition-colors",
                  isActive("/settings") &&
                    "bg-orange-50 text-orange-700 font-medium",
                )}
              >
                <Settings
                  className={cn(
                    "w-4 h-4",
                    isActive("/settings")
                      ? "text-orange-600"
                      : "text-slate-500 group-hover:text-orange-600",
                  )}
                />
                Settings
              </Button>
            </Link>
          </nav>
        </div>

        {/* Widgets Section */}
        <div className="px-3">
          <div className="px-3 mb-3">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Widgets
            </h3>
            <Button
              variant="default"
              size="sm"
              className="w-full justify-start gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-sm transition-colors"
              onClick={() => setIsCreateDialogOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Create New Widget
            </Button>
          </div>

          <nav className="space-y-1">
            {widgets.map((widget) => (
              <div key={widget.id} className="group relative flex items-center">
                <Link
                  href={`/projects/${project.id}/widgets/${widget.id}`}
                  className="flex-1 min-w-0"
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 pr-8 hover:bg-orange-50 hover:text-orange-600 transition-colors",
                      isWidgetActive(widget.id) &&
                        "bg-orange-50 text-orange-700 font-medium",
                    )}
                  >
                    <Layers
                      className={cn(
                        "w-4 h-4 flex-shrink-0 group-hover:text-orange-600",
                        isWidgetActive(widget.id)
                          ? "text-orange-600"
                          : "text-slate-400",
                      )}
                    />
                    <span className="truncate">{widget.name}</span>
                  </Button>
                </Link>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-6 w-6 absolute right-1 opacity-0 group-hover:opacity-100 transition-opacity",
                        isWidgetActive(widget.id) && "opacity-100",
                      )}
                    >
                      <MoreHorizontal className="w-3 h-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setWidgetToDelete(widget.id)}
                      className="text-red-600 focus:text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Widget
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </nav>

          {widgets.length === 0 && (
            <div className="px-3 py-4 text-center">
              <p className="text-xs text-slate-400">No widgets yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Widget Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white">
                <Sparkles className="h-5 w-5" />
              </div>
              Create New Widget
            </DialogTitle>
            <DialogDescription>
              Name your new widget. You can customize it later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="widget-name">Widget Name</Label>
              <Input
                id="widget-name"
                placeholder="e.g., Newsletter Popup"
                value={newWidgetName}
                onChange={(e) => setNewWidgetName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleCreateWidget();
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreateWidget} disabled={isSaving}>
              {isSaving ? "Creating..." : "Create Widget"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Alert */}
      <AlertDialog
        open={!!widgetToDelete}
        onOpenChange={(open) => !open && setWidgetToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              widget and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteWidget}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
