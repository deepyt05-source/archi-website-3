export type BlogPost = {
    title: string;
    slug: string;
    excerpt: string;
    published: boolean;
    contentType: "education" | "practiceUpdate";
    category: string;
    authorType: "pa" | "guest";
    guestName?: string;
    guestCredentials?: string;
    guestOrganization?: string;
    publishedAt: string;
    updatedAt?: string;
    reviewedAt?: string;
    featured: boolean;
    coverImage?: string;
    coverImageAlt?: string;
    coverImageCaption?: string;
    seoTitle?: string;
    seoDescription?: string;
    sample: boolean;
    body: string;
    readingTime: number;
};

const markdownFiles = import.meta.glob("./content/blog/*.md", { 
    query: "?raw",
    import: "default",
    eager: true,
}) as Record<string, string>;

function optionalString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim()
    ? value.trim()
    : undefined;
}

function parseFrontmatter(source: string): { data: Record<string, unknown>; content: string } {
  const match = source.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);

  if (!match) {
    throw new Error("Blog post is missing valid YAML frontmatter.");
  }

  const data: Record<string, unknown> = {};

  for (const line of match[1].split(/\r?\n/)) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;

    const separator = line.indexOf(":");
    if (separator === -1) continue;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();

    if (rawValue === "true" || rawValue === "false") {
      data[key] = rawValue === "true";
    } else if (
      (rawValue.startsWith('"') && rawValue.endsWith('"')) ||
      (rawValue.startsWith("'") && rawValue.endsWith("'"))
    ) {
      data[key] = rawValue.slice(1, -1);
    } else {
      data[key] = rawValue;
    }
  }

  return { data, content: match[2] };
}

function parsePost(path: string, source: string): BlogPost {
  const { data, content } = parseFrontmatter(source);

  const requiredStrings = [
    "title",
    "slug",
    "excerpt",
    "contentType",
    "category",
    "authorType",
    "publishedAt",
  ] as const;

  for (const field of requiredStrings) {
    if (typeof data[field] !== "string" || !data[field].trim()) {
      throw new Error(`Blog post ${path} is missing "${field}".`);
    }
  }

  const title = data.title as string;
  const slug = data.slug as string;
  const excerpt = data.excerpt as string;
  const category = data.category as string;
  const publishedAt = data.publishedAt as string;

  if (data.contentType !== "education" && data.contentType !== "practiceUpdate") {
    throw new Error(`Blog post ${path} has an invalid "contentType".`);
  }

  if (data.authorType !== "pa" && data.authorType !== "guest") {
    throw new Error(`Blog post ${path} has an invalid "authorType".`);
  }

  if (typeof data.published !== "boolean") {
    throw new Error(`Blog post ${path} is missing "published".`);
  }

  if (typeof data.featured !== "boolean") {
    throw new Error(`Blog post ${path} is missing "featured".`);
  }

  if (typeof data.sample !== "boolean") {
    throw new Error(`Blog post ${path} is missing "sample".`);
  }

  const wordCount = content
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return {
    title: title.trim(),
    slug: slug.trim(),
    excerpt: excerpt.trim(),
    published: data.published,
    contentType: data.contentType,
    category: category.trim(),
    authorType: data.authorType,
    guestName: optionalString(data.guestName),
    guestCredentials: optionalString(data.guestCredentials),
    guestOrganization: optionalString(data.guestOrganization),
    publishedAt: publishedAt.trim(),
    updatedAt: optionalString(data.updatedAt),
    reviewedAt: optionalString(data.reviewedAt),
    featured: data.featured,
    coverImage: optionalString(data.coverImage),
    coverImageAlt: optionalString(data.coverImageAlt),
    coverImageCaption: optionalString(data.coverImageCaption),
    seoTitle: optionalString(data.seoTitle),
    seoDescription: optionalString(data.seoDescription),
    sample: data.sample,
    body: content.trim(),
    readingTime: Math.max(1, Math.ceil(wordCount / 220)),
  };
}

const allPosts = Object.entries(markdownFiles).map(([path, source]) =>
  parsePost(path, source),
);

const duplicateSlugs = allPosts
  .map((post) => post.slug)
  .filter((slug, index, slugs) => slugs.indexOf(slug) !== index);

if (duplicateSlugs.length > 0) {
  throw new Error(
    `Duplicate blog slugs found: ${[...new Set(duplicateSlugs)].join(", ")}`,
  );
}

export const blogPosts = allPosts
  .filter((post) => post.published)
  .sort(
    (first, second) =>
      new Date(second.publishedAt).getTime() -
      new Date(first.publishedAt).getTime(),
  );

export const featuredPost =
  blogPosts.find((post) => post.featured) ?? blogPosts[0];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function formatBlogDate(date: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export function formatCategory(category: string): string {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
