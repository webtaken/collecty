"use client";

import { useGuide } from "./guide-context";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export function GuideOverlay() {
    const { open, highlightedElements } = useGuide();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || !open || highlightedElements.length === 0) return null;

    return createPortal(
        <div className="fixed inset-0 bg-black/70 z-40 transition-opacity duration-300 animate-in fade-in" style={{ pointerEvents: "none" }} />,
        document.body
    );
}
