import type { Metadata } from "next";
import { Outfit, Manrope } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Collecty - Email Collection Made Simple",
  description:
    "Build your email list with beautiful, customizable popup widgets. Embed on any website in seconds.",
  keywords: [
    "email collection",
    "newsletter",
    "popup widget",
    "lead generation",
    "email marketing",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${outfit.variable} ${manrope.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" richColors />
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
      </body>
    </html>
  );
}
