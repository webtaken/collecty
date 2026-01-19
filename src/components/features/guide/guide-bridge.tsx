"use client";

import { useEffect } from "react";
import { publishGuideEvent } from "@/lib/guide-events";

export function DashboardGuideBridge({ totalProjects, totalSubscribers }: { totalProjects: number; totalSubscribers: number; }) {
  useEffect(() => {
    publishGuideEvent("guide:projectCount", totalProjects);
    if (totalSubscribers > 0) publishGuideEvent("guide:hasSubscribers");
  }, [totalProjects, totalSubscribers]);
  return null;
}

export function ProjectGuideBridge({ opened, subscriberCount }: { opened: boolean; subscriberCount: number; }) {
  useEffect(() => {
    if (opened) publishGuideEvent("guide:viewedProject");
    if (subscriberCount > 0) publishGuideEvent("guide:hasSubscribers");
  }, [opened, subscriberCount]);
  return null;
}
