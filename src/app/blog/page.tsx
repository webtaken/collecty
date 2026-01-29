import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getAllPosts, formatDate } from "@/lib/blog-api";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Collecty",
  description:
    "Tips, guides, and insights on email marketing, lead generation, and growing your subscriber list.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getAllPosts();

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

      {/* Header */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-1/2 -right-1/4 w-[600px] h-[600px] bg-[oklch(0.68_0.19_18)]/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-outfit)]">
            Blog
          </h1>
          <p className="text-xl text-white/60 max-w-2xl mx-auto">
            Tips, guides, and insights on email marketing and growing your
            subscriber list.
          </p>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-white/50 text-lg">
                No blog posts available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="group"
                >
                  <article className="rounded-2xl bg-white/[0.03] border border-white/5 overflow-hidden hover:border-white/10 hover:bg-white/[0.05] transition-all duration-300">
                    {post.featuredImage && (
                      <div className="aspect-video relative overflow-hidden">
                        <Image
                          src={post.featuredImage}
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      {post.category && (
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[oklch(0.68_0.19_18)]/15 text-[oklch(0.68_0.19_18)] mb-3">
                          {post.category}
                        </span>
                      )}
                      <h2 className="text-xl font-semibold mb-2 font-[family-name:var(--font-outfit)] group-hover:text-[oklch(0.68_0.19_18)] transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-white/50 text-sm line-clamp-2 mb-4">
                        {post.metaDescription}
                      </p>
                      <time className="text-white/40 text-sm">
                        {formatDate(post.createdAt)}
                      </time>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
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
