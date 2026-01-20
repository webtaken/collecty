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
  VanillaIcon,
} from "@/components/icons/frameworks";

export default function LandingPage() {
  const [widgetType, setWidgetType] = useState<"popup" | "inline">("popup");

  return (
    <div className="min-h-screen bg-[oklch(0.11_0.015_285)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[oklch(0.11_0.015_285)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-gradient-to-br from-[oklch(0.68_0.19_18)] to-[oklch(0.65_0.22_35)] rounded-xl flex items-center justify-center shadow-lg shadow-[oklch(0.68_0.19_18)]/20">
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
              <span className="text-xl font-bold tracking-tight font-[family-name:var(--font-outfit)]">
                Collecty
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login">
                <Button
                  variant="ghost"
                  className="text-white/70 hover:text-white hover:bg-white/5"
                >
                  Sign In
                </Button>
              </Link>
              <Link href="/login">
                <Button className="bg-[oklch(0.68_0.19_18)] hover:bg-[oklch(0.63_0.19_18)] text-white shadow-lg shadow-[oklch(0.68_0.19_18)]/25">
                  Get Started Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects - Warm coral/amber gradients */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[900px] h-[900px] bg-[oklch(0.68_0.19_18)]/15 rounded-full blur-[120px]" />
          <div className="absolute -bottom-1/3 -left-1/4 w-[700px] h-[700px] bg-[oklch(0.75_0.15_55)]/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[oklch(0.72_0.16_160)]/8 rounded-full blur-[80px]" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
          >
            <span className="w-2 h-2 bg-[oklch(0.72_0.16_160)] rounded-full animate-pulse" />
            <span className="text-sm text-white/70">
              New: Inline Forms & Framework Support
            </span>
          </div>

          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 font-[family-name:var(--font-outfit)] opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}
          >
            Grow your email list{" "}
            <span className="bg-gradient-to-r from-[oklch(0.68_0.19_18)] via-[oklch(0.75_0.15_55)] to-[oklch(0.72_0.16_160)] text-transparent bg-clip-text">
              effortlessly
            </span>
          </h1>

          <p
            className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.35s", animationFillMode: "forwards" }}
          >
            Beautiful, customizable popup widgets and inline forms that convert
            visitors into subscribers. Set up in minutes, embed anywhere with a
            single line of code.
          </p>

          <div
            className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-fade-in-up"
            style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}
          >
            <Link href="/login">
              <Button
                size="lg"
                className="bg-[oklch(0.68_0.19_18)] hover:bg-[oklch(0.63_0.19_18)] text-lg px-8 py-6 h-auto shadow-xl shadow-[oklch(0.68_0.19_18)]/25 transition-all hover:shadow-2xl hover:shadow-[oklch(0.68_0.19_18)]/30 hover:-translate-y-0.5"
              >
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

          <p
            className="text-sm text-white/40 mt-6 opacity-0 animate-fade-in"
            style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
          >
            Free forever for up to 1,000 subscribers. No credit card required.
          </p>
        </div>

        {/* Widget Preview */}
        <div
          className="max-w-4xl mx-auto mt-20 relative z-10 opacity-0 animate-fade-in-up"
          style={{ animationDelay: "0.7s", animationFillMode: "forwards" }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.11_0.015_285)] via-transparent to-transparent z-10 pointer-events-none" />

          {/* Controls */}
          <div className="flex justify-center mb-6 relative z-20">
            <div className="bg-white/5 backdrop-blur-sm p-1 rounded-lg border border-white/10 inline-flex">
              <button
                onClick={() => setWidgetType("popup")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  widgetType === "popup"
                    ? "bg-[oklch(0.68_0.19_18)] text-white shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Popup Widget
              </button>
              <button
                onClick={() => setWidgetType("inline")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  widgetType === "inline"
                    ? "bg-[oklch(0.68_0.19_18)] text-white shadow-lg"
                    : "text-white/50 hover:text-white/80"
                }`}
              >
                Inline Form
              </button>
            </div>
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
              {/* Simulated website content */}
              <div className="absolute inset-0 p-8 opacity-15 pointer-events-none">
                <div className="h-8 w-48 bg-white/20 rounded mb-8" />
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-3/4 bg-white/10 rounded" />
                </div>

                {widgetType === "inline" && <div className="h-32 my-8" />}

                <div className="space-y-4 mt-8">
                  <div className="h-4 w-full bg-white/10 rounded" />
                  <div className="h-4 w-5/6 bg-white/10 rounded" />
                </div>
              </div>

              {/* Widgets */}
              {widgetType === "popup" ? (
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
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Frameworks Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="text-center mb-8">
          <p className="text-white/40 font-medium tracking-wide text-sm uppercase">
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
              <div
                key={i}
                className="flex items-center gap-3 text-white/40 opacity-60 hover:opacity-100 transition-opacity"
              >
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
              <div
                key={`dup-${i}`}
                className="flex items-center gap-3 text-white/40 opacity-60 hover:opacity-100 transition-opacity"
              >
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
              Everything you need to grow your list
            </h2>
            <p className="text-white/50 text-lg max-w-2xl mx-auto">
              Powerful features to help you capture more emails and convert more
              visitors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                    />
                  </svg>
                ),
                title: "Fully Customizable",
                description:
                  "Match your brand with custom colors, text, and positioning.",
                color: "oklch(0.68_0.19_18)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                    />
                  </svg>
                ),
                title: "Inline & Popup",
                description:
                  "Choose between non-intrusive inline forms or high-converting popups.",
                color: "oklch(0.72_0.16_160)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "IP Geolocation",
                description:
                  "Target specific countries or regions to increase relevance.",
                color: "oklch(0.75_0.15_55)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                ),
                title: "Smart Triggers",
                description:
                  "Show your popup at the perfect moment: delay, scroll, or exit-intent.",
                color: "oklch(0.62_0.20_280)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                    />
                  </svg>
                ),
                title: "Easy Integration",
                description:
                  "Works with Next.js, React, Vue, Shopify, WordPress, and more.",
                color: "oklch(0.70_0.18_200)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                ),
                title: "Analytics Dashboard",
                description:
                  "Track views, clicks, and conversion rates in real-time.",
                color: "oklch(0.68_0.19_18)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                ),
                title: "Secure & Private",
                description:
                  "GDPR compliant. Your subscriber data is encrypted and safe.",
                color: "oklch(0.72_0.16_160)",
              },
              {
                icon: (
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
                title: "Fast Setup",
                description:
                  "Get your first widget running in under 2 minutes.",
                color: "oklch(0.75_0.15_55)",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300 group"
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${feature.color} 15%, transparent)`,
                    color: feature.color,
                  }}
                >
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2 font-[family-name:var(--font-outfit)]">
                  {feature.title}
                </h3>
                <p className="text-white/50 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white/[0.02] border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
              Up and running in 3 simple steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Create a project",
                description:
                  "Sign up and create your first project. Choose your prefered framework.",
              },
              {
                step: "02",
                title: "Customize & Configure",
                description:
                  "Design your widget, set display rules, and configure integrations.",
              },
              {
                step: "03",
                title: "Embed & Collect",
                description:
                  "Copy the snippet to your site and start collecting emails instantly.",
              },
            ].map((item, i) => (
              <div key={i} className="text-center">
                <div className="text-5xl font-bold text-[oklch(0.68_0.19_18)]/30 mb-4 font-[family-name:var(--font-outfit)]">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2 font-[family-name:var(--font-outfit)]">
                  {item.title}
                </h3>
                <p className="text-white/50">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-[oklch(0.68_0.19_18)]/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
            Ready to grow your email list?
          </h2>
          <p className="text-white/50 text-lg mb-8">
            Join thousands of creators and businesses using Collecty to build
            their audience.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[oklch(0.68_0.19_18)] hover:bg-[oklch(0.63_0.19_18)] text-lg px-8 py-6 h-auto shadow-xl shadow-[oklch(0.68_0.19_18)]/25 transition-all hover:shadow-2xl hover:shadow-[oklch(0.68_0.19_18)]/30 hover:-translate-y-0.5"
            >
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
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-white/5">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-[oklch(0.68_0.19_18)] to-[oklch(0.65_0.22_35)] rounded-lg flex items-center justify-center">
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
            <span className="font-semibold font-[family-name:var(--font-outfit)]">
              Collecty
            </span>
          </div>
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Collecty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
