"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const DEMOS = [
  {
    id: 0,
    title: "1. Create",
    description: "Customize your widget, apply a behavior, set brand colors, customize borders, etc.",
    video: "/landing/demo_1.mp4",
    color: "oklch(0.68 0.19 18)", // Brand Primary
  },
  {
    id: 1,
    title: "2. Customize",
    description: "Check the installation instructions, choose a framework, manually or copy an AI prompt.",
    video: "/landing/demo_2.mp4",
    color: "oklch(0.72 0.16 160)", // Teal
  },
  {
    id: 2,
    title: "3. Collect",
    description: "Start collecting emails for your projects and explore details about your subscribers.",
    video: "/landing/demo_3.mp4",
    color: "oklch(0.75 0.15 55)", // Pink/Purple
  },
];

export function LandingDemoVideos() {
  const [activeStep, setActiveStep] = useState(0);
  // Track if user has manually interacted to disable auto-rotation optionally
  // For now, we'll just let it loop through.

  return (
    <div className="w-full max-w-5xl mx-auto mt-16 relative z-10">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl max-h-[600px] bg-[oklch(0.68_0.19_18)]/5 blur-3xl rounded-full -z-10" />

      <div className="flex flex-col gap-12">
        {/* Navigation / Steps */}
        <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
          {DEMOS.map((demo, index) => {
            const isActive = activeStep === index;
            return (
              <button
                key={demo.id}
                onClick={() => setActiveStep(index)}
                className={cn(
                  "relative group flex flex-col items-center text-center p-4 rounded-xl transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-white/20",
                  isActive ? "opacity-100" : "opacity-50 hover:opacity-80",
                )}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <motion.div
                    layoutId="active-step-indicator"
                    className="absolute -bottom-2 w-12 h-1 rounded-full"
                    style={{ backgroundColor: demo.color }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <span
                  className={cn(
                    "text-lg sm:text-x font-bold mb-1 font-[family-name:var(--font-outfit)]",
                    isActive ? "text-white" : "text-white/70",
                  )}
                >
                  {demo.title}
                </span>
                <span className="text-sm text-white/40 hidden sm:block max-w-[200px]">
                  {demo.description}
                </span>
              </button>
            );
          })}
        </div>

        {/* Video Container */}
        <div className="relative w-full aspect-video max-w-4xl mx-auto rounded-xl sm:rounded-2xl overflow-hidden border border-white/10 bg-black/40 shadow-2xl shadow-black/50 backdrop-blur-sm">
          {/* Window Controls Mockup - REMOVED */}

          <div className="relative w-full h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
                className="absolute inset-0 h-full w-full bg-black"
              >
                <video
                  src={DEMOS[activeStep].video}
                  autoPlay
                  muted
                  playsInline
                  controls
                  className="w-full h-full object-cover"
                  onEnded={() => {
                    // optional: auto advance
                    setActiveStep((prev) => (prev + 1) % DEMOS.length);
                  }}
                />
              </motion.div>
            </AnimatePresence>

            {/* Overlay Gradient at bottom to blend if needed, or purely clean */}
          </div>
        </div>
      </div>
    </div>
  );
}
