"use client";

import { useWidgetGenerator } from "./widget-generator-context";
import { frameworks, type FrameworkId } from "@/lib/frameworks/install-code-generator";
import { WidgetActiveSwitch } from "./widget-active-switch";
import { publishGuideEvent } from "@/lib/guide-events";
import { InlineEditableText } from "@/components/ui/inline-editable-text";
import { cn } from "@/lib/utils";
import { Code2, Globe, Calendar } from "lucide-react";

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
    const {
        activeTab,
        selectedPopupFramework,
        setSelectedPopupFramework,
        selectedInlineFramework,
        setSelectedInlineFramework
    } = useWidgetGenerator();

    const currentFrameworkId = activeTab === "popup" ? selectedPopupFramework : selectedInlineFramework;
    const setFramework = activeTab === "popup" ? setSelectedPopupFramework : setSelectedInlineFramework;

    const updateProject = async (field: string, value: string) => {
        await fetch(`/api/projects/${project.id}/update`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [field]: value }),
        });
        window.location.reload();
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
            {/* Project Details Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 h-full" data-guide-target="project-details">
                <div className="grid grid-cols-[auto_1fr] gap-4">

                    {/* Left column – Active switch */}
                    <div className="pt-1">
                        <WidgetActiveSwitch
                            projectId={project.id}
                            isActive={project.isActive}
                        />
                    </div>

                    {/* Right column – Title only */}
                    <div className="min-w-0">
                        <h1 className="text-2xl font-bold tracking-tight text-slate-900 min-w-0">
                            <InlineEditableText
                                value={project.name}
                                onSave={(value) => updateProject("name", value)}
                                className="hover:underline decoration-slate-300 underline-offset-4 truncate block"
                                inputClassName="text-2xl font-bold bg-transparent border-none p-0 focus:ring-0 w-full"
                            />
                        </h1>
                    </div>

                    {/* Meta info — ALINEADO AL BORDE IZQUIERDO DEL SWITCH */}
                    <div className="col-start-1 col-span-2 flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            <span>
                                Created {new Date(project.createdAt).toLocaleDateString()}
                            </span>
                        </div>

                        <div className="h-4 w-px bg-slate-200 hidden sm:block" />

                        <div className="flex items-center gap-1.5 min-w-0">
                            <Globe className="w-4 h-4 flex-shrink-0" />
                            <InlineEditableText
                                value={project.domain || ""}
                                onSave={(value) => updateProject("domain", value)}
                                placeholder="Add domain..."
                                className="hover:text-indigo-600 transition-colors truncate block"
                                inputClassName="text-sm py-0 px-1 h-auto min-h-0 w-full"
                            />
                        </div>
                    </div>

                    {/* Description — ALINEADA AL BORDE IZQUIERDO DEL SWITCH */}
                    <div className="col-start-1 col-span-2 bg-slate-50 rounded-lg p-3 border border-slate-100">
                        <InlineEditableText
                            value={project.description || ""}
                            onSave={(value) => updateProject("description", value)}
                            placeholder="Add a description for your project..."
                            type="textarea"
                            className="text-slate-600 text-sm leading-relaxed min-h-[40px]"
                            inputClassName="bg-white text-sm"
                        />
                    </div>

                </div>
            </div>



            {/* Framework Selector Section */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full flex flex-col">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                        <Code2 className="w-4 h-4 text-indigo-500" />
                        Select Framework
                    </h2>
                    <span className="text-xs text-slate-500 font-medium bg-slate-100 px-2 py-1 rounded-full">
                        {activeTab === "popup" ? "Popup Widget" : "Inline Form"}
                    </span>
                </div>

                <div className="bg-slate-50/50 rounded-lg border border-slate-200 p-1.5 flex-1 min-h-0 relative" data-guide-target="framework-selector">
                    <div className="absolute inset-0 p-1.5 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                        <div className="grid grid-cols-4 sm:grid-cols-6 lg:grid-cols-4 xl:grid-cols-6 gap-1.5">
                            {frameworks.map((framework) => {
                                const Icon = framework.icon;
                                const isSelected = currentFrameworkId === framework.id;

                                return (
                                    <button
                                        key={framework.id}
                                        onClick={() => {
                                            setFramework(framework.id as FrameworkId);
                                            publishGuideEvent("guide:selectedFramework");
                                        }}
                                        className={cn(
                                            "flex flex-col items-center justify-center",
                                            "h-16 px-1 rounded-md border transition-all duration-150",
                                            "hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20",
                                            isSelected
                                                ? "bg-white border-indigo-500 shadow-sm ring-1 ring-indigo-500/10"
                                                : "bg-white border-transparent hover:border-slate-200 text-slate-500 hover:text-slate-700"
                                        )}
                                    >
                                        <div
                                            className={cn(
                                                "p-1 rounded-md mb-1 transition-colors",
                                                isSelected
                                                    ? "bg-indigo-50 text-indigo-600"
                                                    : "bg-slate-50 text-current"
                                            )}
                                        >
                                            <Icon className="w-4 h-4" />
                                        </div>

                                        <span
                                            className={cn(
                                                "text-[9px] font-medium truncate w-full text-center uppercase tracking-wide",
                                                isSelected ? "text-indigo-700" : "text-current"
                                            )}
                                        >
                                            {framework.name}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
