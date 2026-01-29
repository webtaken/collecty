import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  getAllPosts,
  getPostBySlug,
  getInternalLinks,
  replaceInternalLinks,
  formatDate,
} from "@/lib/blog-api";
import type { Metadata } from "next";

export const revalidate = 60;

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found | Collecty" };
  }

  return {
    title: post.metaTitle || `${post.title} | Collecty`,
    description: post.metaDescription,
    openGraph: {
      title: post.metaTitle || post.title,
      description: post.metaDescription,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const [post, internalLinks] = await Promise.all([
    getPostBySlug(slug),
    getInternalLinks(),
  ]);

  if (!post) {
    notFound();
  }

  // Process content with internal links
  const processedContent = post.content
    ? replaceInternalLinks(post.content, internalLinks)
    : "";

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
              <Link
                href="/blog"
                className="text-white/70 hover:text-white transition-colors"
              >
                Blog
              </Link>
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

      {/* Article */}
      <article className="pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          {/* Back link */}
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-white/50 hover:text-white transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Blog
          </Link>

          {/* Header */}
          <header className="mb-8">
            {post.category && (
              <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[oklch(0.68_0.19_18)]/15 text-[oklch(0.68_0.19_18)] mb-4">
                {post.category}
              </span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight mb-4 font-[family-name:var(--font-outfit)]">
              {post.title}
            </h1>
            <time className="text-white/50">{formatDate(post.createdAt)}</time>
          </header>

          {/* Featured Image */}
          {post.featuredImage && (
            <div className="aspect-video relative rounded-2xl overflow-hidden mb-10">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* Content */}
          <div
            className="prose prose-invert prose-lg max-w-none
              prose-headings:font-[family-name:var(--font-outfit)]
              prose-headings:text-white
              prose-p:text-white/80
              prose-a:text-[oklch(0.68_0.19_18)]
              prose-a:no-underline
              hover:prose-a:underline
              prose-strong:text-white
              prose-code:text-[oklch(0.72_0.16_160)]
              prose-code:bg-white/10
              prose-code:px-1.5
              prose-code:py-0.5
              prose-code:rounded
              prose-pre:bg-white/5
              prose-pre:border
              prose-pre:border-white/10
              prose-blockquote:border-l-[oklch(0.68_0.19_18)]
              prose-blockquote:text-white/70
              prose-li:text-white/80
              prose-img:rounded-xl"
            dangerouslySetInnerHTML={{ __html: processedContent }}
          />
        </div>
      </article>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/[0.02] border-t border-white/5">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 font-[family-name:var(--font-outfit)]">
            Ready to grow your email list?
          </h2>
          <p className="text-white/50 mb-6">
            Start collecting emails with beautiful, customizable popups.
          </p>
          <Link href="/login">
            <Button
              size="lg"
              className="bg-[oklch(0.68_0.19_18)] hover:bg-[oklch(0.63_0.19_18)] text-lg px-8 shadow-xl shadow-[oklch(0.68_0.19_18)]/25"
            >
              Get Started Free
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
