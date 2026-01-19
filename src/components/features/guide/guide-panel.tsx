"use client";

import { useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGuide } from "./guide-context";

export function GuidePanel() {
  const { open, setOpen, steps, progress, focus } = useGuide();

  const nextKey = useMemo(() => {
    return steps.find((s) => !progress[s.key])?.key ?? null;
  }, [steps, progress]);

  // Auto-focus next incomplete step when panel is open or progress updates
  useEffect(() => {
    if (open && nextKey) {
      focus(nextKey);
    }
  }, [open, nextKey, focus]);

  // Re-apply focus when DOM changes (e.g., route navigation loads new elements)
  useEffect(() => {
    if (!open || !nextKey) return;
    const observer = new MutationObserver(() => {
      try { focus(nextKey); } catch {}
    });
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, [open, nextKey, focus]);

  if (!open) return null;

  return (
    <div className="clt-floating-panel w-full max-w-sm">
      <Card className="shadow-xl border-indigo-200">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle>Step-by-step guide</CardTitle>
              <CardDescription>We stay on this screen. I auto-check steps as you progress.</CardDescription>
            </div>
            <Button size="sm" variant="outline" onClick={() => setOpen(false)}>Minimize</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {steps.map((s) => {
              const done = progress[s.key];
              return (
                <div key={s.key} className="flex items-start gap-3 p-2 rounded-lg border bg-white">
                  <div className={`mt-0.5 size-5 rounded-full flex items-center justify-center ${done ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {done ? (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>
                    ) : (
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="9" strokeWidth="2.5"/></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{s.title}</p>
                    <p className="text-xs text-slate-600">{s.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
