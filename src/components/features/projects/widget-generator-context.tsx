"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { WidgetConfig, InlineWidgetConfig } from "@/db/schema/projects";
import type { FrameworkId } from "@/lib/frameworks/install-code-generator";

type WidgetGeneratorContextType = {
    projectId: string;
    activeTab: "popup" | "inline";
    setActiveTab: (tab: "popup" | "inline") => void;
    popupConfig: WidgetConfig;
    setPopupConfig: (config: WidgetConfig) => void;
    inlineConfig: InlineWidgetConfig;
    setInlineConfig: (config: InlineWidgetConfig) => void;
    selectedPopupFramework: FrameworkId | null;
    setSelectedPopupFramework: (framework: FrameworkId | null) => void;
    selectedInlineFramework: FrameworkId | null;
    setSelectedInlineFramework: (framework: FrameworkId | null) => void;
};

const WidgetGeneratorContext = createContext<WidgetGeneratorContextType | undefined>(undefined);

export function useWidgetGenerator() {
    const context = useContext(WidgetGeneratorContext);
    if (!context) {
        throw new Error("useWidgetGenerator must be used within a WidgetGeneratorProvider");
    }
    return context;
}

type WidgetGeneratorProviderProps = {
    children: ReactNode;
    projectId: string;
    initialPopupConfig: WidgetConfig;
    initialInlineConfig: InlineWidgetConfig;
};

export function WidgetGeneratorProvider({
    children,
    projectId,
    initialPopupConfig,
    initialInlineConfig,
}: WidgetGeneratorProviderProps) {
    const [activeTab, setActiveTab] = useState<"popup" | "inline">("popup");
    const [popupConfig, setPopupConfig] = useState(initialPopupConfig);
    const [inlineConfig, setInlineConfig] = useState(initialInlineConfig);
    const [selectedPopupFramework, setSelectedPopupFramework] = useState<FrameworkId | null>(null);
    const [selectedInlineFramework, setSelectedInlineFramework] = useState<FrameworkId | null>(null);

    useEffect(() => {
        setPopupConfig(initialPopupConfig);
    }, [initialPopupConfig]);

    useEffect(() => {
        setInlineConfig(initialInlineConfig);
    }, [initialInlineConfig]);

    return (
        <WidgetGeneratorContext.Provider
            value={{
                projectId,
                activeTab,
                setActiveTab,
                popupConfig,
                setPopupConfig,
                inlineConfig,
                setInlineConfig,
                selectedPopupFramework,
                setSelectedPopupFramework,
                selectedInlineFramework,
                setSelectedInlineFramework,
            }}
        >
            {children}
        </WidgetGeneratorContext.Provider>
    );
}
