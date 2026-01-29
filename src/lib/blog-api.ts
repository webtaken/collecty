// Massblogger API utilities

export interface BlogPost {
  title: string;
  slug: string;
  category: string;
  featuredImage: string;
  content?: string;
  metaTitle: string;
  metaDescription: string;
  createdAt: string;
  updatedAt: string;
  scheduleDate: string | null;
}

export interface InternalLink {
  keyword: string;
  url: string;
}

const MASSBLOG_URL = process.env.MASSBLOG_URL || "https://www.massblogger.com";
const MASSBLOG_API = process.env.MASSBLOG_API || "";

/**
 * Fetch all blog posts from Massblogger API
 * Filters out posts with future schedule dates
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  if (!MASSBLOG_API) {
    console.warn("MASSBLOG_API environment variable is not set");
    return [];
  }

  try {
    const res = await fetch(`${MASSBLOG_URL}/api/blog?apiKey=${MASSBLOG_API}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error("Failed to fetch blog posts:", res.status);
      return [];
    }

    const posts: BlogPost[] = await res.json();

    // Filter out posts with future schedule dates
    const now = new Date();
    return posts.filter((post) => {
      if (!post.scheduleDate) return true;
      return new Date(post.scheduleDate) <= now;
    });
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

/**
 * Fetch a single blog post by slug
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!MASSBLOG_API) {
    console.warn("MASSBLOG_API environment variable is not set");
    return null;
  }

  try {
    const res = await fetch(
      `${MASSBLOG_URL}/api/blog?apiKey=${MASSBLOG_API}&slug=${slug}`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) {
      return null;
    }

    const post: BlogPost = await res.json();

    // Check if post is scheduled for the future
    if (post.scheduleDate && new Date(post.scheduleDate) > new Date()) {
      return null;
    }

    return post;
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

/**
 * Fetch internal links from Massblogger API
 */
export async function getInternalLinks(): Promise<InternalLink[]> {
  if (!MASSBLOG_API) {
    return [];
  }

  try {
    const res = await fetch(
      `${MASSBLOG_URL}/api/internal-links?apiKey=${MASSBLOG_API}`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching internal links:", error);
    return [];
  }
}

/**
 * Replace keywords in content with internal link anchor tags
 * Uses word boundary regex for whole word matching (case-insensitive)
 */
export function replaceInternalLinks(
  content: string,
  links: InternalLink[],
): string {
  let result = content;

  for (const link of links) {
    // Word boundary regex with case-insensitive, global matching
    const regex = new RegExp(`\\b(${escapeRegex(link.keyword)})\\b`, "gi");
    result = result.replace(
      regex,
      `<a href="${link.url}" class="internal-link">$1</a>`,
    );
  }

  return result;
}

/**
 * Escape special regex characters in a string
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
