"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { publishGuideEvent, type GuideEventName } from "@/lib/guide-events";
import { GuideOverlay } from "./guide-overlay";

export type GuideStepKey = "create-project" | "project-details" | "select-framework" | "customize-widget" | "install-widget";

type GuideStep = {
  key: GuideStepKey;
  title: string;
  description: string;
  selectors?: string[];
};

const GUIDE_STORAGE_KEY = "collecty_guide_progress_v3";
const GUIDE_VISIBILITY_KEY = "collecty_guide_visible_v2";

const steps: GuideStep[] = [
  {
    key: "create-project",
    title: "Create your first project",
    description: "Start by creating a new project.",
    selectors: [
      'a[href="/projects/new"]',
    ],
  },
  {
    key: "project-details",
    title: "Set project details",
    description: "Write name of the project, set the URL and description.",
    selectors: [
      '[data-guide-target="project-details"]',
    ],
  },
  {
    key: "select-framework",
    title: "Select your framework",
    description: "Choose the technology stack for your project.",
    selectors: [
      '[data-guide-target="framework-selector"]',
    ],
  },
  {
    key: "customize-widget",
    title: "Customize the widget",
    description: "Customize the appearance and settings.",
    selectors: [
      '[data-guide-target="widget-customizer"]',
    ],
  },
  {
    key: "install-widget",
    title: "Install the widget",
    description: "Copy the code and paste it into your user project.",
    selectors: [
      '[data-guide-target="install-code"]',
    ],
  },
];

export type GuideProgress = Record<GuideStepKey, boolean>;

function defaultProgress(): GuideProgress {
  return {
    "create-project": false,
    "project-details": false,
    "select-framework": false,
    "customize-widget": false,
    "install-widget": false,
  };
}

type GuideContextValue = {
  open: boolean;
  setOpen: (v: boolean) => void;
  steps: GuideStep[];
  progress: GuideProgress;
  mark: (key: GuideStepKey, done: boolean) => void;
  focus: (key: GuideStepKey) => void;
  highlightedElements: HTMLElement[];
};

const GuideContext = createContext<GuideContextValue | null>(null);

export function useGuide() {
  const ctx = useContext(GuideContext);
  if (!ctx) throw new Error("useGuide must be used within GuideProvider");
  return ctx;
}

export function GuideProvider({ children, projectCount }: { children: React.ReactNode, projectCount?: number }) {
  const [open, setOpenState] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const stored = localStorage.getItem(GUIDE_VISIBILITY_KEY);
    return stored ? stored === "1" : false;
  });
  const [progress, setProgress] = useState<GuideProgress>(() => {
    if (typeof window === "undefined") return defaultProgress();
    try {
      const raw = localStorage.getItem(GUIDE_STORAGE_KEY);
      return raw ? { ...defaultProgress(), ...JSON.parse(raw) } : defaultProgress();
    } catch {
      return defaultProgress();
    }
  });

  // Auto-open for new users (0 projects) if not explicitly dismissed/closed before
  useEffect(() => {
    if (projectCount === 0) {
      const stored = localStorage.getItem(GUIDE_VISIBILITY_KEY);
      if (!stored) { // Only auto-open if user hasn't interacted with visibility yet
        setOpenState(true);
      }
    }
  }, [projectCount]);

  const setOpen = useCallback((v: boolean) => {
    setOpenState(v);
    try { localStorage.setItem(GUIDE_VISIBILITY_KEY, v ? "1" : "0"); } catch { }
  }, []);

  const mark = useCallback((key: GuideStepKey, done: boolean) => {
    setProgress((prev) => {
      const next = { ...prev, [key]: done };
      try { localStorage.setItem(GUIDE_STORAGE_KEY, JSON.stringify(next)); } catch { }
      return next;
    });
  }, []);

  const highlightClasses = "clt-highlight";
  // We use state for highlighted elements to force re-render of overlay if needed
  const [highlightedElements, setHighlightedElements] = useState<HTMLElement[]>([]);
  const highlightedRefs = useRef<HTMLElement[]>([]);

  const clearHighlights = useCallback(() => {
    highlightedRefs.current.forEach((el) => el.classList.remove(...highlightClasses.split(" ")));
    highlightedRefs.current = [];
    setHighlightedElements([]);
  }, [highlightClasses]);

  const focus = useCallback((key: GuideStepKey) => {
    clearHighlights();
    const step = steps.find((s) => s.key === key);
    if (!step?.selectors) return;

    // Small timeout to allow DOM updates
    setTimeout(() => {
      const newHighlights: HTMLElement[] = [];
      step.selectors?.forEach((sel) => {
        const el = document.querySelector(sel) as HTMLElement | null;
        if (el) {
          el.classList.add(...highlightClasses.split(" "));
          newHighlights.push(el);
          try { el.scrollIntoView({ behavior: "smooth", block: "center" }); } catch { }
        }
      });
      highlightedRefs.current = newHighlights;
      setHighlightedElements(newHighlights);
    }, 100);

  }, [clearHighlights]);

  // Event listeners to auto-mark steps
  useEffect(() => {
    const onProjectCount = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      if (typeof detail === "number" && detail > 0) mark("create-project", true);
    };

    // When project details are saved/viewed
    const onViewedProject = () => {
      mark("project-details", true);
    };

    const onSelectedFramework = () => mark("select-framework", true);
    const onCustomizedWidget = () => mark("customize-widget", true);
    const onCopiedPopup = () => mark("install-widget", true);
    const onCopiedInline = () => mark("install-widget", true);

    window.addEventListener("guide:projectCount", onProjectCount as EventListener);
    window.addEventListener("guide:viewedProject", onViewedProject);
    window.addEventListener("guide:selectedFramework", onSelectedFramework);
    window.addEventListener("guide:customizedWidget", onCustomizedWidget);
    window.addEventListener("guide:copiedPopup", onCopiedPopup);
    window.addEventListener("guide:copiedInline", onCopiedInline);

    return () => {
      window.removeEventListener("guide:projectCount", onProjectCount as EventListener);
      window.removeEventListener("guide:viewedProject", onViewedProject);
      window.removeEventListener("guide:selectedFramework", onSelectedFramework);
      window.removeEventListener("guide:customizedWidget", onCustomizedWidget);
      window.removeEventListener("guide:copiedPopup", onCopiedPopup);
      window.removeEventListener("guide:copiedInline", onCopiedInline);
    };
  }, [mark]);

  useEffect(() => {
    if (!open) {
      try { clearHighlights(); } catch { }
    }
  }, [open, clearHighlights]);

  const value = useMemo<GuideContextValue>(() => ({
    open,
    setOpen,
    steps,
    progress,
    mark,
    focus,
    highlightedElements
  }), [open, setOpen, progress, mark, focus, highlightedElements]);

  return (
    <GuideContext.Provider value={value}>
      <GuideOverlay />
      {children}
    </GuideContext.Provider>
  );
}
