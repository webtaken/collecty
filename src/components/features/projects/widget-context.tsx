"use client";

import {
  createContext,
  useContext,
  useState,
  useTransition,
  ReactNode,
} from "react";
import type { WidgetConfigUnified } from "@/db/schema/widgets";
import type { FrameworkId } from "@/lib/frameworks/install-code-generator";
import type { RichTextContent } from "@/db/schema/lead-magnets";
import {
  updateWidgetAction,
  createWidgetAction,
  attachLeadMagnetAction,
} from "@/actions/widgets";
import {
  createLeadMagnetAction,
  updateLeadMagnetAction,
  deleteLeadMagnetAction,
} from "@/actions/lead-magnets";
import { useRouter } from "next/navigation";

// Widget entity type (from database)
export type WidgetEntity = {
  id: string;
  projectId: string;
  name: string;
  config: WidgetConfigUnified;
  leadMagnetId: string | null;
  leadMagnet: {
    id: string;
    description?: RichTextContent | null;
    previewText?: string | null;
  } | null;
  isDefault: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// Lead magnet draft data type
export type LeadMagnetData = {
  description?: RichTextContent | null;
  previewText?: string;
};

type WidgetContextType = {
  projectId: string;
  widgets: WidgetEntity[];
  selectedWidget: WidgetEntity | null;
  selectWidget: (widgetId: string) => void;
  config: WidgetConfigUnified;
  updateConfig: <K extends keyof WidgetConfigUnified>(
    key: K,
    value: WidgetConfigUnified[K],
  ) => void;
  saveWidget: () => Promise<void>;
  createWidget: (name?: string) => Promise<void>;
  isSaving: boolean;
  hasUnsavedChanges: boolean;
  // For embed code generation
  activeEmbedType: "popup" | "inline";
  setActiveEmbedType: (type: "popup" | "inline") => void;
  selectedFramework: FrameworkId | null;
  setSelectedFramework: (framework: FrameworkId | null) => void;
  // Lead magnet state
  leadMagnetEnabled: boolean;
  setLeadMagnetEnabled: (enabled: boolean) => void;
  leadMagnetData: LeadMagnetData;
  updateLeadMagnetData: <K extends keyof LeadMagnetData>(
    key: K,
    value: LeadMagnetData[K],
  ) => void;
};

const WidgetContext = createContext<WidgetContextType | undefined>(undefined);

export function useWidgetContext() {
  const context = useContext(WidgetContext);
  if (!context) {
    throw new Error(
      "useWidgetContext must be used within a WidgetContextProvider",
    );
  }
  return context;
}

type WidgetContextProviderProps = {
  children: ReactNode;
  projectId: string;
  initialWidgets: WidgetEntity[];
};

export function WidgetContextProvider({
  children,
  projectId,
  initialWidgets,
}: WidgetContextProviderProps) {
  const router = useRouter();
  const [widgets, setWidgets] = useState<WidgetEntity[]>(initialWidgets);
  const [selectedWidgetId, setSelectedWidgetId] = useState<string | null>(
    initialWidgets.find((w) => w.isDefault)?.id ||
      initialWidgets[0]?.id ||
      null,
  );
  const [localConfig, setLocalConfig] = useState<WidgetConfigUnified | null>(
    null,
  );
  const [isSaving, startTransition] = useTransition();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeEmbedType, setActiveEmbedType] = useState<"popup" | "inline">(
    "popup",
  );
  const [selectedFramework, setSelectedFramework] =
    useState<FrameworkId | null>(null);

  // Lead magnet state
  const [leadMagnetEnabled, setLeadMagnetEnabledState] = useState(false);
  const [localLeadMagnetData, setLocalLeadMagnetData] =
    useState<LeadMagnetData | null>(null);

  const selectedWidget = widgets.find((w) => w.id === selectedWidgetId) || null;

  // Initialize lead magnet state when widget changes
  const currentLeadMagnetEnabled = selectedWidget?.leadMagnetId !== null;
  if (leadMagnetEnabled !== currentLeadMagnetEnabled && !hasUnsavedChanges) {
    setLeadMagnetEnabledState(currentLeadMagnetEnabled);
  }
  const config = localConfig || selectedWidget?.config || getDefaultConfig();

  function getDefaultConfig(): WidgetConfigUnified {
    return {
      title: "Stay in the loop",
      description: "Subscribe to our newsletter and never miss an update.",
      buttonText: "Subscribe",
      successMessage: "Thanks for subscribing!",
      primaryColor: "#6366f1",
      backgroundColor: "#ffffff",
      textColor: "#1f2937",
      showBranding: true,
      position: "center",
      triggerType: "delay",
      triggerValue: 3,
      layout: "horizontal",
      placeholderText: "Enter your email",
      borderRadius: 8,
    };
  }

  function selectWidget(widgetId: string) {
    // Save any unsaved changes first? Or discard?
    if (hasUnsavedChanges) {
      // For now, discard unsaved changes
      setLocalConfig(null);
      setLocalLeadMagnetData(null);
      setHasUnsavedChanges(false);
    }
    setSelectedWidgetId(widgetId);
    setLocalConfig(null);
    setLocalLeadMagnetData(null);
    // Reset lead magnet enabled state based on new widget
    const newWidget = widgets.find((w) => w.id === widgetId);
    setLeadMagnetEnabledState(newWidget?.leadMagnetId !== null);
  }

  function updateConfig<K extends keyof WidgetConfigUnified>(
    key: K,
    value: WidgetConfigUnified[K],
  ) {
    const newConfig = { ...config, [key]: value };
    setLocalConfig(newConfig);
    setHasUnsavedChanges(true);
  }

  function setLeadMagnetEnabled(enabled: boolean) {
    setLeadMagnetEnabledState(enabled);
    setHasUnsavedChanges(true);
  }

  // Get lead magnet data from selected widget or use local edits
  const getLeadMagnetDataFromWidget = (): LeadMagnetData => {
    if (selectedWidget?.leadMagnet) {
      return {
        description: selectedWidget.leadMagnet.description ?? undefined,
        previewText: selectedWidget.leadMagnet.previewText ?? "",
      };
    }
    return { previewText: "" };
  };

  const leadMagnetData = localLeadMagnetData ?? getLeadMagnetDataFromWidget();

  function updateLeadMagnetData<K extends keyof LeadMagnetData>(
    key: K,
    value: LeadMagnetData[K],
  ) {
    const newData = { ...leadMagnetData, [key]: value };
    setLocalLeadMagnetData(newData);
    setHasUnsavedChanges(true);
  }

  async function saveWidget() {
    if (!selectedWidget) return;
    // Allow saving if there's config changes OR lead magnet changes
    if (!localConfig && !hasUnsavedChanges) return;

    startTransition(async () => {
      try {
        // Save widget config if changed
        if (localConfig) {
          await updateWidgetAction(selectedWidget.id, { config: localConfig });
        }

        // Handle lead magnet changes
        const hadLeadMagnet = selectedWidget.leadMagnetId !== null;
        let newLeadMagnetId: string | null = selectedWidget.leadMagnetId;

        if (leadMagnetEnabled && !hadLeadMagnet) {
          // Create new lead magnet and attach to widget
          const newLeadMagnet = await createLeadMagnetAction({
            description: leadMagnetData.description,
            previewText: leadMagnetData.previewText,
          });
          await attachLeadMagnetAction(selectedWidget.id, newLeadMagnet.id);
          newLeadMagnetId = newLeadMagnet.id;
        } else if (leadMagnetEnabled && hadLeadMagnet && localLeadMagnetData) {
          // Update existing lead magnet
          await updateLeadMagnetAction(selectedWidget.leadMagnetId!, {
            description: leadMagnetData.description,
            previewText: leadMagnetData.previewText,
          });
        } else if (!leadMagnetEnabled && hadLeadMagnet) {
          // Delete lead magnet and detach from widget
          await attachLeadMagnetAction(selectedWidget.id, null);
          await deleteLeadMagnetAction(selectedWidget.leadMagnetId!);
          newLeadMagnetId = null;
        }

        // Update local state
        setWidgets((prev) =>
          prev.map((w) =>
            w.id === selectedWidget.id
              ? {
                  ...w,
                  config: localConfig || w.config,
                  leadMagnetId: newLeadMagnetId,
                }
              : w,
          ),
        );
        setHasUnsavedChanges(false);
        setLocalLeadMagnetData(null);
        router.refresh();
      } catch (error) {
        console.error("Failed to save widget:", error);
      }
    });
  }

  async function createNewWidget(name?: string) {
    startTransition(async () => {
      try {
        const newWidget = await createWidgetAction({
          projectId,
          name,
          config: getDefaultConfig(),
        });
        setWidgets((prev) => [newWidget as WidgetEntity, ...prev]);
        setSelectedWidgetId(newWidget.id);
        setLocalConfig(null);
        router.refresh();
      } catch (error) {
        console.error("Failed to create widget:", error);
      }
    });
  }

  return (
    <WidgetContext.Provider
      value={{
        projectId,
        widgets,
        selectedWidget,
        selectWidget,
        config,
        updateConfig,
        saveWidget,
        createWidget: createNewWidget,
        isSaving,
        hasUnsavedChanges,
        activeEmbedType,
        setActiveEmbedType,
        selectedFramework,
        setSelectedFramework,
        leadMagnetEnabled,
        setLeadMagnetEnabled,
        leadMagnetData,
        updateLeadMagnetData,
      }}
    >
      {children}
    </WidgetContext.Provider>
  );
}
