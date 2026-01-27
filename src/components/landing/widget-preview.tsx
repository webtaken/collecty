import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function WidgetPreview() {
  return (
    <div
      className="max-w-4xl mx-auto mt-20 relative z-10 opacity-0 animate-fade-in-up"
      style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.015_285)] via-transparent to-transparent z-10 pointer-events-none" />

      <Tabs defaultValue="popup" className="relative z-20">
        {/* Controls */}
        <div className="flex justify-center mb-6">
          <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10">
            <TabsTrigger
              value="popup"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-[oklch(0.68_0.19_18)] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/50 hover:text-white/80"
            >
              Popup Widget
            </TabsTrigger>
            <TabsTrigger
              value="inline"
              className="px-4 py-2 text-sm font-medium data-[state=active]:bg-[oklch(0.68_0.19_18)] data-[state=active]:text-white data-[state=active]:shadow-lg text-white/50 hover:text-white/80"
            >
              Inline Form
            </TabsTrigger>
          </TabsList>
        </div>

        <div className="bg-[oklch(0.14_0.015_285)] rounded-2xl border border-white/10 shadow-2xl overflow-hidden transition-all duration-500">
          <div className="flex items-center gap-2 px-4 py-3 bg-white/5 border-b border-white/5">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-[oklch(0.65_0.22_25)]/80" />
              <div className="w-3 h-3 rounded-full bg-[oklch(0.78_0.16_85)]/80" />
              <div className="w-3 h-3 rounded-full bg-[oklch(0.72_0.16_160)]/80" />
            </div>
            <div className="flex-1 text-center">
              <span className="text-xs text-white/40">yourwebsite.com</span>
            </div>
          </div>

          <div className="p-8 bg-gradient-to-br from-[oklch(0.16_0.015_285)] to-[oklch(0.12_0.015_285)] min-h-[450px] flex items-center justify-center relative">
            {/* Simulated website content - Popup version */}
            <TabsContent
              value="popup"
              className="w-full flex items-center justify-center"
            >
              <div className="absolute inset-0 p-8 opacity-15 pointer-events-none">
                <div className="h-8 w-48 bg-white/20 rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
                <div className="space-y-4 mt-8">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-300">
                <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
                <h3 className="text-2xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-outfit)]">
                  Stay in the loop
                </h3>
                <p className="text-slate-600 mb-6">
                  Subscribe to our newsletter and never miss an update.
                </p>
                <div className="flex gap-3">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 outline-none focus:border-[oklch(0.68_0.19_18)] transition-colors"
                    disabled
                  />
                  <button className="px-6 py-3 bg-[oklch(0.65_0.19_18)] text-white rounded-lg font-medium hover:bg-[oklch(0.60_0.19_18)] transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </TabsContent>

            {/* Simulated website content - Inline version */}
            <TabsContent
              value="inline"
              className="w-full flex items-center justify-center"
            >
              <div className="absolute inset-0 p-8 opacity-15 pointer-events-none">
                <div className="h-8 w-48 bg-white/20 rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>
                <div className="h-32 my-8" />
                <div className="space-y-4 mt-8">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                </div>
              </div>

              <div className="w-full max-w-2xl mx-auto z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="flex-1 text-left">
                      <h3 className="text-xl font-semibold text-white mb-1 font-[family-name:var(--font-outfit)]">
                        Join the newsletter
                      </h3>
                      <p className="text-white/60 text-sm">
                        Get weekly insights delivered to your inbox.
                      </p>
                    </div>
                    <div className="flex w-full sm:w-auto gap-2">
                      <input
                        type="email"
                        placeholder="email@example.com"
                        className="flex-1 bg-white/5 border border-white/10 hover:border-white/20 rounded-lg px-4 py-2.5 text-white placeholder:text-white/40 outline-none focus:ring-2 focus:ring-[oklch(0.68_0.19_18)]/50 transition-all"
                        disabled
                      />
                      <button className="bg-[oklch(0.68_0.19_18)] text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-[oklch(0.63_0.19_18)] transition-colors whitespace-nowrap">
                        Join Now
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </div>
      </Tabs>
    </div>
  );
}
