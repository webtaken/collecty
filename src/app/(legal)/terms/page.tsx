import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | Collecty",
  description:
    "Read the Terms of Service for Collecty - Email Collection Made Simple.",
};

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-[oklch(0.11_0.015_285)] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-white/5 backdrop-blur-xl bg-[oklch(0.11_0.015_285)]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
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
            </Link>
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

      {/* Content */}
      <main className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-outfit)]">
              Terms of Service
            </h1>
            <p className="text-white/50">
              Last updated:{" "}
              {new Date().toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>

          <div className="prose prose-invert prose-lg max-w-none">
            <div className="space-y-8">
              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  1. Acceptance of Terms
                </h2>
                <p className="text-white/70 leading-relaxed">
                  By accessing or using Collecty&apos;s services, website, and
                  any associated applications (collectively, the
                  &quot;Service&quot;), you agree to be bound by these Terms of
                  Service (&quot;Terms&quot;). If you do not agree to these
                  Terms, you may not access or use the Service. These Terms
                  constitute a legally binding agreement between you and
                  Collecty.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  2. Description of Service
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Collecty provides email collection widgets and forms that can
                  be embedded on websites. Our Service includes:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>
                    Customizable popup and inline email collection widgets
                  </li>
                  <li>Analytics and reporting dashboard</li>
                  <li>Subscriber management tools</li>
                  <li>Integration options with third-party services</li>
                  <li>API access for developers</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  3. Account Registration
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  To use certain features of the Service, you must register for
                  an account. When you register, you agree to:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Provide accurate, current, and complete information</li>
                  <li>Maintain and promptly update your account information</li>
                  <li>Keep your password secure and confidential</li>
                  <li>
                    Accept responsibility for all activities under your account
                  </li>
                  <li>Notify us immediately of any unauthorized access</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  4. Acceptable Use
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  You agree not to use the Service to:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Violate any applicable laws or regulations</li>
                  <li>Infringe on intellectual property rights of others</li>
                  <li>Transmit spam, malware, or other harmful content</li>
                  <li>
                    Collect emails without proper consent from subscribers
                  </li>
                  <li>Impersonate any person or entity</li>
                  <li>
                    Interfere with or disrupt the Service or its infrastructure
                  </li>
                  <li>
                    Attempt to gain unauthorized access to any part of the
                    Service
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  5. Data and Privacy
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Your use of the Service is also governed by our{" "}
                  <Link
                    href="/privacy"
                    className="text-[oklch(0.68_0.19_18)] hover:text-[oklch(0.75_0.19_18)] underline underline-offset-2"
                  >
                    Privacy Policy
                  </Link>
                  . You are responsible for ensuring that your use of the
                  Service complies with all applicable data protection and
                  privacy laws, including obtaining necessary consents from your
                  subscribers for email collection and communication.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  6. Intellectual Property
                </h2>
                <p className="text-white/70 leading-relaxed">
                  The Service and its original content, features, and
                  functionality are owned by Collecty and are protected by
                  international copyright, trademark, patent, trade secret, and
                  other intellectual property laws. You may not copy, modify,
                  distribute, sell, or lease any part of our Service without
                  prior written consent.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  7. Limitation of Liability
                </h2>
                <p className="text-white/70 leading-relaxed">
                  To the maximum extent permitted by law, Collecty shall not be
                  liable for any indirect, incidental, special, consequential,
                  or punitive damages, or any loss of profits or revenues,
                  whether incurred directly or indirectly, or any loss of data,
                  use, goodwill, or other intangible losses resulting from your
                  use of the Service.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  8. Termination
                </h2>
                <p className="text-white/70 leading-relaxed">
                  We may terminate or suspend your account and access to the
                  Service immediately, without prior notice or liability, for
                  any reason, including if you breach these Terms. Upon
                  termination, your right to use the Service will cease
                  immediately. You may also terminate your account at any time
                  through your account settings.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  9. Changes to Terms
                </h2>
                <p className="text-white/70 leading-relaxed">
                  We reserve the right to modify these Terms at any time. We
                  will notify you of any material changes by posting the new
                  Terms on this page and updating the &quot;Last updated&quot;
                  date. Your continued use of the Service after such changes
                  constitutes your acceptance of the new Terms.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  10. Contact Us
                </h2>
                <p className="text-white/70 leading-relaxed">
                  If you have any questions about these Terms, please contact us
                  at{" "}
                  <a
                    href="mailto:legal@collecty.dev"
                    className="text-[oklch(0.68_0.19_18)] hover:text-[oklch(0.75_0.19_18)] underline underline-offset-2"
                  >
                    legal@collecty.dev
                  </a>
                  .
                </p>
              </section>
            </div>
          </div>
        </div>
      </main>

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
