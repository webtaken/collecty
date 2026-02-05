"use client";

import { useMemo, useState } from "react";
import {
    frameworks,
    type FrameworkId,
    type Framework
} from "@/lib/frameworks/install-code-generator";
import { cn } from "@/lib/utils";
import { Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FrameworkSelectorProps {
    selectedFramework: FrameworkId | null;
    onSelect: (id: FrameworkId) => void;
    className?: string;
}

export function FrameworkSelector({
    selectedFramework,
    onSelect,
    className,
}: FrameworkSelectorProps) {
    const [searchTerm, setSearchTerm] = useState("");

    const filtered = useMemo(() => {
        return frameworks.filter(f =>
            f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            f.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm]);

    return (
        <div className={cn("space-y-4", className)}>
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search frameworks..."
                    className="pl-9 h-10 bg-slate-50 shadow-sm border-slate-200 focus-visible:ring-primary/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="grid grid-cols-[repeat(auto-fill,minmax(130px,1fr))] gap-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {filtered.map((f) => (
                    <FrameworkCard
                        key={f.id}
                        framework={f}
                        isSelected={selectedFramework === f.id}
                        onClick={() => onSelect(f.id as FrameworkId)}
                    />
                ))}

                {filtered.length === 0 && (
                    <div className="col-span-full py-12 text-center text-muted-foreground">
                        No frameworks found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
}

function FrameworkCard({
    framework,
    isSelected,
    onClick,
}: {
    framework: Framework;
    isSelected: boolean;
    onClick: () => void;
}) {
    const Icon = framework.icon;

    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all duration-200 text-center min-h-[90px]",
                isSelected
                    ? "bg-primary/5 border-primary shadow-sm ring-1 ring-primary/10"
                    : "bg-white border-slate-100 hover:border-slate-300 hover:shadow-sm"
            )}
        >
            {isSelected && (
                <div className="absolute top-2 right-2 h-4 w-4 rounded-full bg-primary text-white flex items-center justify-center">
                    <Check className="h-2.5 w-2.5" />
                </div>
            )}

            <div className={cn(
                "p-2 rounded-lg mb-2 transition-colors",
                isSelected ? "bg-white" : "bg-slate-50 group-hover:bg-white"
            )}>
                <Icon className="h-5 w-5" />
            </div>

            <span className={cn(
                "text-sm font-semibold tracking-tight",
                isSelected ? "text-primary" : "text-slate-700"
            )}>
                {framework.name}
            </span>
        </button>
    );
}
