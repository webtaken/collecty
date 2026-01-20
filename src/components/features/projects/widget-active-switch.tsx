"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { toggleProjectStatusAction } from "@/actions/projects";

export function WidgetActiveSwitch({
  projectId,
  isActive,
}: {
  projectId: string;
  isActive: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [active, setActive] = useState(isActive);
  const [lightning, setLightning] = useState(false);

  async function handleToggle() {
    setPending(true);
    setLightning(true);
    await toggleProjectStatusAction(projectId);
    setActive((a) => !a);
    setTimeout(() => setLightning(false), 600);
    setPending(false);
  }

  const tooltipText = active
    ? "Click to deactivate widget. Your widget will stop collecting feedback."
    : "Click to activate widget. Your widget will start collecting feedback.";

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          className={`relative flex items-center px-4 py-2 rounded-full text-white font-bold text-xs transition-colors duration-300
            ${active ? "bg-emerald-500 shadow-lg" : "bg-red-800"}
            ${pending ? "opacity-60" : ""}
          `}
          disabled={pending}
          onClick={handleToggle}
          style={{ minWidth: 96 }}
        >
          <span className="flex items-center gap-2">
            {active ? (
              <>
                <svg
                  className={`w-5 h-5 transition-transform ${lightning ? "animate-lightning" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 2L3 14h9l-1 8L21 10h-9l1-8z"
                  />
                </svg>
                Active
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <circle cx="12" cy="12" r="10" strokeDasharray="4 2" />
                </svg>
                Inactive
              </>
            )}
          </span>
          <style jsx>{`
            .animate-lightning {
              animation: lightning-flash 0.6s linear;
            }
            @keyframes lightning-flash {
              0% {
                transform: scale(1) rotate(-8deg);
                filter: drop-shadow(0 0 8px #fff700);
              }
              30% {
                transform: scale(1.2) rotate(8deg);
                filter: drop-shadow(0 0 16px #fff700);
              }
              60% {
                transform: scale(1.1) rotate(-5deg);
                filter: drop-shadow(0 0 6px #fff700);
              }
              100% {
                transform: scale(1) rotate(0deg);
                filter: none;
              }
            }
          `}</style>
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={8}>
        {tooltipText}
      </TooltipContent>
    </Tooltip>
  );
}
