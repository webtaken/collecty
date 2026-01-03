"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  NextjsIcon, 
  ReactIcon, 
  VueIcon, 
  SvelteIcon, 
  AstroIcon, 
  AngularIcon, 
  RemixIcon, 
  NuxtIcon, 
  LaravelIcon, 
  VanillaIcon 
} from "@/components/icons/frameworks";

export default function LandingPage() {
  const [widgetType, setWidgetType] = useState<"popup" | "inline">("popup");

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-slate-800/50 backdrop-blur-lg bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
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
              <span className="text-xl font-bold tracking-tight">Collecty</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-slate-800">
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-indigo-600 hover:bg-indigo-500">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-indigo-600/20 rounded-full blur-3xl opacity-50" />
          <div className="absolute -bottom-1/2 -left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 mb-8">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-slate-300">New: Inline Forms & Framework Support</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            Grow your email list{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
              effortlessly
            </span>
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Beautiful, customizable popup widgets and inline forms that convert visitors into subscribers. 
            Set up in minutes, embed anywhere with a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-lg px-8 py-6 h-auto">
                Start Collecting Emails
                <svg
                  className="w-5 h-5 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Button>
            </Link>
          </div>

          <p className="text-sm text-slate-500 mt-6">
            Free forever for up to 1,000 subscribers. No credit card required.
          </p>
        </div>

        {/* Widget Preview */}
        <div className="max-w-4xl mx-auto mt-20 relative z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10 pointer-events-none" />
          
          {/* Controls */}
          <div className="flex justify-center mb-6 relative z-20">
            <div className="bg-slate-900/80 backdrop-blur-sm p-1 rounded-lg border border-slate-800 inline-flex">
              <button
                onClick={() => setWidgetType("popup")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  widgetType === "popup"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Popup Widget
              </button>
              <button
                onClick={() => setWidgetType("inline")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  widgetType === "inline"
                    ? "bg-indigo-600 text-white shadow-lg"
                    : "text-slate-400 hover:text-slate-200"
                }`}
              >
                Inline Form
              </button>
            </div>
          </div>

          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-2xl overflow-hidden transition-all duration-500">
            <div className="flex items-center gap-2 px-4 py-3 bg-slate-800/50 border-b border-slate-700">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="flex-1 text-center">
                <span className="text-xs text-slate-500">yourwebsite.com</span>
              </div>
            </div>
            <div className="p-8 bg-gradient-to-br from-slate-800/50 to-slate-900 min-h-[450px] flex items-center justify-center relative">
              {/* Simulated website content */}
              <div className="absolute inset-0 p-8 opacity-20 pointer-events-none">
                <div className="h-8 w-48 bg-slate-600 rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-slate-700 rounded" />
                  <div className="h-4 w-full bg-slate-700 rounded" />
                  <div className="h-4 w-3/4 bg-slate-700 rounded" />
                </div>
                
                {widgetType === "inline" && <div className="h-32 my-8" />} {/* Space for inline widget */}

                <div className="space-y-4 mt-8">
                  <div className="h-4 w-full bg-slate-700 rounded" />
                  <div className="h-4 w-5/6 bg-slate-700 rounded" />
                </div>
              </div>

              {/* Widgets */}
              {widgetType === "popup" ? (
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full relative z-10 animate-in fade-in zoom-in duration-300">
                  <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">
                    Stay in the loop
                  </h3>
                  <p className="text-slate-600 mb-6">
                    Subscribe to our newsletter and never miss an update.
                  </p>
                  <div className="flex gap-3">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-lg text-slate-900 outline-none focus:border-indigo-600 transition-colors"
                      disabled
                    />
                    <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors">
                      Subscribe
                    </button>
                  </div>
                </div>
              ) : (
                <div className="w-full max-w-2xl mx-auto z-10 animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-6 sm:p-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                      <div className="flex-1 text-left">
                        <h3 className="text-xl font-semibold text-white mb-1">Join the newsletter
</h3>
                        <p className="text-slate-300 text-sm">Get weekly insights delivered to your inbox.</p>
                      </div>
                      <div className="flex w-full sm:w-auto gap-2">
                        <input
                          type="email"
                          placeholder="email@example.com"
                          className="flex-1 bg-slate-900/50 border border-slate-700 hover:border-slate-600 rounded-lg px-4 py-2.5 text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                          disabled
                        />
                        <button className="bg-white text-slate-950 px-5 py-2.5 rounded-lg font-semibold hover:bg-slate-200 transition-colors whitespace-nowrap">
                          Join Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section className="py-12 border-y border-slate-800 bg-slate-900/30 overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-slate-400 font-medium tracking-wide text-sm uppercase">
            Works with your favorite frameworks
          </p>
        </div>
        <div className="relative flex overflow-x-hidden group">
          <div className="animate-marquee whitespace-nowrap flex items-center gap-12 sm:gap-20">
            {/* First Set */}
            {[
              { icon: NextjsIcon, name: "Next.js" },
              { icon: ReactIcon, name: "React" },
              { icon: VueIcon, name: "Vue" },
              { icon: SvelteIcon, name: "Svelte" },
              { icon: AstroIcon, name: "Astro" },
              { icon: AngularIcon, name: "Angular" },
              { icon: RemixIcon, name: "Remix" },
              { icon: NuxtIcon, name: "Nuxt" },
              { icon: LaravelIcon, name: "Laravel" },
              { icon: VanillaIcon, name: "Vanilla JS" },
            ].map((Framework, i) => (
              <div key={i} className="flex items-center gap-3 text-slate-400 opacity-60 hover:opacity-100 transition-opacity">
                <Framework.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="text-lg font-semibold">{Framework.name}</span>
              </div>
            ))}
            
            {/* Duplicate Set for Infinite Scroll */}
            {[
              { icon: NextjsIcon, name: "Next.js" },
              { icon: ReactIcon, name: "React" },
              { icon: VueIcon, name: "Vue" },
              { icon: SvelteIcon, name: "Svelte" },
              { icon: AstroIcon, name: "Astro" },
              { icon: AngularIcon, name: "Angular" },
              { icon: RemixIcon, name: "Remix" },
              { icon: NuxtIcon, name: "Nuxt" },
              { icon: LaravelIcon, name: "Laravel" },
              { icon: VanillaIcon, name: "Vanilla JS" },
            ].map((Framework, i) => (
              <div key={`dup-${i}`} className="flex items-center gap-3 text-slate-400 opacity-60 hover:opacity-100 transition-opacity">
                <Framework.icon className="w-8 h-8 sm:w-10 sm:h-10" />
                <span className="text-lg font-semibold">{Framework.name}</span>
              </div>
            ))}
          </div>

          <div className="absolute top-0 animate-marquee2 whitespace-nowrap flex items-center gap-12 sm:gap-20 ml-12 sm:ml-20">
             {/* Duplicate of Duplicate Set to ensure smoothness if needed, or rely on CSS animation 'marquee' defined in globals */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to grow your list
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Powerful features to help you capture more emails and convert more visitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                ),
                title: "Fully Customizable",
                description: "Match your brand with custom colors, text, and positioning.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
                  </svg>
                ),
                title: "Inline & Popup",
                description: "Choose between non-intrusive inline forms or high-converting popups.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "IP Geolocation",
                description: "Target specific countries or regions to increase relevance.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                ),
                title: "Smart Triggers",
                description: "Show your popup at the perfect moment: delay, scroll, or exit-intent.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                ),
                title: "Easy Integration",
                description: "Works with Next.js, React, Vue, Shopify, WordPress, and more.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
                title: "Analytics Dashboard",
                description: "Track views, clicks, and conversion rates in real-time.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
                title: "Secure & Private",
                description: "GDPR compliant. Your subscriber data is encrypted and safe.",
              },
              {
                icon: (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
                title: "Fast Setup",
                description: "Get your first widget running in under 2 minutes.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors"
              >
                <div className="w-12 h-12 bg-indigo-600/10 rounded-xl flex items-center justify-center text-indigo-400 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900/50 border-y border-slate-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Up and running in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a project",
                description: "Sign up and create your first project. Choose your prefered framework.",
              },
              {
                step: "02",
                title: "Customize & Configure",
                description: "Design your widget, set display rules, and configure integrations.",
              },
              {
                step: "03",
                title: "Embed & Collect",
                description: "Copy the snippet to your site and start collecting emails instantly.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-indigo-600/30 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-slate-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to grow your email list?
          </h2>
          <p className="text-slate-400 text-lg mb-8">
            Join thousands of creators and businesses using Collecty to build their audience.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-lg px-8 py-6 h-auto">
              Get Started for Free
              <svg
                className="w-5 h-5 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <svg
                className="w-4 h-4 text-white"
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
            <span className="font-semibold">Collecty</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Collecty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
