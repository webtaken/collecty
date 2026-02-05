"use client";

import { useWidgetContext } from "./widget-context";
import { WidgetActiveSwitch } from "./widget-active-switch";
import { InlineEditableText } from "@/components/ui/inline-editable-text";
import { Calendar, Globe, ExternalLink } from "lucide-react";

interface ProjectHeaderProps {
  project: {
    id: string;
    name: string;
    domain: string | null;
    description: string | null;
    isActive: boolean;
    createdAt: Date;
  };
}

export function ProjectHeader({ project }: ProjectHeaderProps) {
  const updateProject = async (field: string, value: string) => {
    // Basic inline update for title
    await fetch(`/api/projects/${project.id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    window.location.reload();
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 w-full bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <WidgetActiveSwitch
          projectId={project.id}
          isActive={project.isActive}
        />

        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            <InlineEditableText
              value={project.name}
              onSave={(value) => updateProject("name", value)}
              className="hover:underline decoration-slate-300 underline-offset-4"
              inputClassName="text-xl font-bold bg-transparent border-none p-0 focus:ring-0"
            />
          </h1>

          <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
            {project.domain && (
              <>
                <div className="w-px h-3 bg-slate-200" />
                <a
                  href={project.domain.startsWith('http') ? project.domain : `https://${project.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 hover:text-orange-600 transition-colors"
                >
                  <Globe className="w-3 h-3" />
                  {project.domain}
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
