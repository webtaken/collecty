"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sparkles, Plus, Eye } from "lucide-react";
import { GuideProvider, useGuide } from "@/components/features/guide/guide-context";
import { GuidePanel } from "@/components/features/guide/guide-panel";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
  },
  {
    name: "Projects",
    href: "/projects",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
  },
];

export function Sidebar({ projectCount }: { projectCount: number }) {
  const pathname = usePathname();

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 bg-slate-900">
      <GuideProvider projectCount={projectCount}>
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className="flex items-center h-16 px-6 border-b border-slate-800">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">Collecty</span>
            </Link>
          </div>

          {/* Guidance Section - Moved to top */}
          <div className="px-3 pt-4 pb-2">
            <div className="rounded-lg bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-indigo-600/20 border border-indigo-500/30 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-500/40 text-indigo-200 flex items-center justify-center rounded-full">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="text-xs font-semibold tracking-wide text-slate-200">First time using Collecty?</div>
              </div>
              <div className="space-y-2">
                <OpenGuideButton />
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 pb-4 space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href ||
                (item.href !== "/dashboard" && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                  )}
                >
                  {item.icon}
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Help Section */}
          <div className="p-4 border-t border-slate-800">
            <div className="p-4 rounded-lg bg-gradient-to-br from-indigo-600/20 to-purple-600/20 border border-indigo-500/20">
              <h4 className="text-sm font-medium text-white mb-1">Need help?</h4>
              <p className="text-xs text-slate-400 mb-3">
                Check our docs for guides and tutorials.
              </p>
              <Link
                href="#"
                className="text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                View Documentation →
              </Link>
            </div>
          </div>
          <GuidePanel />
        </div>
      </GuideProvider>
    </aside>
  );
}

function OpenGuideButton() {
  const { setOpen } = useGuide();
  return (
    <Button size="sm" className="bg-indigo-600 hover:bg-indigo-500 w-full justify-center font-medium" onClick={() => setOpen(true)}>
      Show me!
    </Button>
  );
}

function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href="/projects/new">
        <Button size="sm" variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300 hover:text-white">
          <Plus className="w-3.5 h-3.5 mr-1" />
          Create
        </Button>
      </Link>
      <Link href="/projects">
        <Button size="sm" variant="outline" className="w-full bg-slate-800/50 border-slate-600 hover:bg-slate-700/50 text-slate-300 hover:text-white">
          <Eye className="w-3.5 h-3.5 mr-1" />
          View
        </Button>
      </Link>
    </div>
  );
}
