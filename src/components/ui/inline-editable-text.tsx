"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface InlineEditableTextProps {
    value: string;
    onSave: (newValue: string) => Promise<void>;
    placeholder?: string;
    type?: "text" | "textarea";
    className?: string;
    displayClassName?: string;
    inputClassName?: string;
}

export function InlineEditableText({
    value,
    onSave,
    placeholder = "Click to edit...",
    type = "text",
    className,
    displayClassName,
    inputClassName,
}: InlineEditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value);
    const [isSaving, setIsSaving] = useState(false);
    const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

    useEffect(() => {
        setEditValue(value);
    }, [value]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = async () => {
        if (editValue !== value && editValue.trim() !== "") {
            setIsSaving(true);
            try {
                await onSave(editValue.trim());
            } catch (error) {
                console.error("Failed to save:", error);
                setEditValue(value); // Revert on error
            } finally {
                setIsSaving(false);
            }
        } else {
            setEditValue(value); // Revert if no change or empty
        }
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && type === "text") {
            e.preventDefault();
            inputRef.current?.blur();
        }
        if (e.key === "Escape") {
            setEditValue(value);
            setIsEditing(false);
        }
    };

    if (isEditing) {
        const InputComponent = type === "textarea" ? "textarea" : "input";
        return (
            <InputComponent
                ref={inputRef as any}
                type={type === "text" ? "text" : undefined}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className={cn(
                    "w-full border border-indigo-500 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500",
                    type === "textarea" && "min-h-[60px] resize-none",
                    inputClassName
                )}
                disabled={isSaving}
            />
        );
    }

    return (
        <div
            onDoubleClick={handleDoubleClick}
            className={cn(
                "cursor-pointer hover:bg-slate-50 rounded px-2 py-1 -mx-2 -my-1 transition-colors",
                !value && "text-slate-400 italic",
                displayClassName,
                className
            )}
            title="Double-click to edit"
        >
            {value || placeholder}
        </div>
    );
}
