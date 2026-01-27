import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
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
import Script from "next/script";
import { WidgetPreview } from "@/components/landing/widget-preview";
import { LogoCarousel } from "@/components/ui/logo-carousel";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[oklch(0.11_0.015_285)] text-white">
      {/* Landing page widget */}
      <Script
        id="collecty-widget"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
              (function(c,o,l,e,t,y){
                c.collecty=c.collecty||function(){(c.collecty.q=c.collecty.q||[]).push(arguments)};
                var s=o.createElement('script');s.async=1;s.src=l;
                o.head.appendChild(s);
              })(window,document,'https://collecty.dev/widget/d0d5f429-4496-421f-a790-1929c3327017/widget.js');
            `,
        }}
      />
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[oklch(0.11_0.015_285)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Collecty Logo"
                width={36}
                height={36}
                className="rounded-xl"
              />
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
        <WidgetPreview />
      </section>

      {/* Frameworks Section */}
      <section className="py-12 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="text-center mb-8">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
            Works with your favorite frameworks
          </h2>
        </div>
        <div className="flex justify-center">
          <LogoCarousel
            logos={[
              { id: 1, img: NextjsIcon, name: "Next.js" },
              { id: 2, img: ReactIcon, name: "React" },
              { id: 3, img: VueIcon, name: "Vue" },
              { id: 4, img: SvelteIcon, name: "Svelte" },
              { id: 5, img: AstroIcon, name: "Astro" },
              { id: 6, img: AngularIcon, name: "Angular" },
              { id: 7, img: RemixIcon, name: "Remix" },
              { id: 8, img: NuxtIcon, name: "Nuxt" },
              { id: 9, img: LaravelIcon, name: "Laravel" },
              { id: 10, img: VanillaIcon, name: "Vanilla" },
            ]}
            columnCount={3}
          />
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
            <Image
              src="/logo.svg"
              alt="Collecty Logo"
              width={32}
              height={32}
              className="rounded-lg"
            />
            <span className="font-semibold font-[family-name:var(--font-outfit)]">
              Collecty
            </span>
          </div>
          <div className="flex items-center gap-6 text-sm text-white/40">
            <Link
              href="/terms"
              className="hover:text-white/70 transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </Link>
          </div>
          <p className="text-sm text-white/40">
            © {new Date().getFullYear()} Collecty. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
