import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Collecty",
  description:
    "Learn how Collecty collects, uses, and protects your personal information.",
};

export default function PrivacyPolicyPage() {
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
              Privacy Policy
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
                  1. Introduction
                </h2>
                <p className="text-white/70 leading-relaxed">
                  At Collecty, we take your privacy seriously. This Privacy
                  Policy explains how we collect, use, disclose, and safeguard
                  your information when you use our email collection service.
                  Please read this policy carefully. By using Collecty, you
                  consent to the data practices described in this policy.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  2. Information We Collect
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We collect information in the following ways:
                </p>

                <h3 className="text-lg font-semibold mb-2 text-white/90">
                  2.1 Information You Provide
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4 mb-4">
                  <li>Account information (name, email address, password)</li>
                  <li>Profile information and preferences</li>
                  <li>
                    Payment and billing information (processed securely by our
                    payment providers)
                  </li>
                  <li>
                    Content you create, such as widget configurations and
                    settings
                  </li>
                  <li>Communications with our support team</li>
                </ul>

                <h3 className="text-lg font-semibold mb-2 text-white/90">
                  2.2 Information Collected Automatically
                </h3>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>
                    Device information (browser type, operating system, device
                    type)
                  </li>
                  <li>IP address and approximate location</li>
                  <li>Usage data (pages visited, features used, time spent)</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  3. How We Use Your Information
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We use the information we collect to:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Provide, maintain, and improve our Service</li>
                  <li>Process transactions and send related information</li>
                  <li>
                    Send you technical notices, updates, and support messages
                  </li>
                  <li>
                    Respond to your comments, questions, and customer service
                    requests
                  </li>
                  <li>Monitor and analyze usage patterns and trends</li>
                  <li>
                    Detect, investigate, and prevent fraudulent or unauthorized
                    activities
                  </li>
                  <li>Personalize and improve your experience</li>
                  <li>Comply with legal obligations</li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  4. Subscriber Data
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  When you use Collecty to collect emails from your website
                  visitors:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>
                    You remain the data controller for your subscriber data
                  </li>
                  <li>We act as a data processor on your behalf</li>
                  <li>
                    We store subscriber data securely and do not use it for our
                    own marketing purposes
                  </li>
                  <li>
                    You are responsible for obtaining proper consent from your
                    subscribers
                  </li>
                  <li>
                    You may export or delete your subscriber data at any time
                  </li>
                </ul>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  5. Data Sharing and Disclosure
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We may share your information with:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>
                    <strong className="text-white/90">
                      Service Providers:
                    </strong>{" "}
                    Third parties who assist us in operating our Service
                  </li>
                  <li>
                    <strong className="text-white/90">
                      Legal Requirements:
                    </strong>{" "}
                    When required by law or to protect our rights
                  </li>
                  <li>
                    <strong className="text-white/90">
                      Business Transfers:
                    </strong>{" "}
                    In connection with a merger, acquisition, or sale of assets
                  </li>
                  <li>
                    <strong className="text-white/90">
                      With Your Consent:
                    </strong>{" "}
                    When you explicitly authorize us to share your information
                  </li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  We do not sell your personal information to third parties.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  6. Data Security
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We implement appropriate security measures to protect your
                  information, including:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Regular security assessments and monitoring</li>
                  <li>Access controls and authentication requirements</li>
                  <li>Secure data centers with physical security measures</li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  However, no method of transmission over the Internet is 100%
                  secure. While we strive to protect your information, we cannot
                  guarantee absolute security.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  7. Your Rights and Choices
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  Depending on your location, you may have the following rights:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Access, correct, or delete your personal information</li>
                  <li>Object to or restrict certain processing of your data</li>
                  <li>
                    Data portability (receive your data in a structured format)
                  </li>
                  <li>Withdraw consent where processing is based on consent</li>
                  <li>Lodge a complaint with a supervisory authority</li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  To exercise these rights, please contact us at{" "}
                  <a
                    href="mailto:privacy@collecty.dev"
                    className="text-[oklch(0.68_0.19_18)] hover:text-[oklch(0.75_0.19_18)] underline underline-offset-2"
                  >
                    privacy@collecty.dev
                  </a>
                  .
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  8. Cookies and Tracking
                </h2>
                <p className="text-white/70 leading-relaxed mb-4">
                  We use cookies and similar technologies to:
                </p>
                <ul className="list-disc list-inside text-white/70 space-y-2 ml-4">
                  <li>Keep you logged in to your account</li>
                  <li>Remember your preferences and settings</li>
                  <li>Analyze how our Service is used</li>
                  <li>Provide personalized content and features</li>
                </ul>
                <p className="text-white/70 leading-relaxed mt-4">
                  You can control cookies through your browser settings. Note
                  that disabling cookies may affect the functionality of our
                  Service.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  9. International Data Transfers
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Your information may be transferred to and processed in
                  countries other than your country of residence. We ensure that
                  such transfers comply with applicable data protection laws and
                  implement appropriate safeguards, such as standard contractual
                  clauses, to protect your information.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  10. Data Retention
                </h2>
                <p className="text-white/70 leading-relaxed">
                  We retain your information for as long as your account is
                  active or as needed to provide you with our Service. We may
                  also retain certain information as required by law or for
                  legitimate business purposes, such as resolving disputes and
                  enforcing our agreements.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  11. Children&apos;s Privacy
                </h2>
                <p className="text-white/70 leading-relaxed">
                  Our Service is not directed to children under 16 years of age.
                  We do not knowingly collect personal information from
                  children. If we learn that we have collected personal
                  information from a child, we will take steps to delete that
                  information promptly.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  12. Changes to This Policy
                </h2>
                <p className="text-white/70 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will
                  notify you of any material changes by posting the new policy
                  on this page and updating the &quot;Last updated&quot; date.
                  We encourage you to review this policy periodically.
                </p>
              </section>

              <section className="p-6 rounded-2xl bg-white/[0.03] border border-white/5">
                <h2 className="text-2xl font-semibold mb-4 font-[family-name:var(--font-outfit)] text-white">
                  13. Contact Us
                </h2>
                <p className="text-white/70 leading-relaxed">
                  If you have any questions or concerns about this Privacy
                  Policy or our data practices, please contact us at{" "}
                  <a
                    href="mailto:privacy@collecty.dev"
                    className="text-[oklch(0.68_0.19_18)] hover:text-[oklch(0.75_0.19_18)] underline underline-offset-2"
                  >
                    privacy@collecty.dev
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
