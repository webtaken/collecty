"use client";

import { useEffect, useState } from "react";
import { GuidePanel } from "./guide-panel";
import { } from "react";

export function GuideFloatingUI() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return <GuidePanel />;
}
