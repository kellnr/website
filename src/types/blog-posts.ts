export type BlogPost = {
  /**
   * Stable identifier for the post (used by generators and consumers for deduping).
   * Example: "cross-plat-native-lib"
   */
  id: string;

  /** Human-readable title to display in RSS readers and UIs. */
  title: string;

  /**
   * Canonical absolute URL to the post.
   * Example: "https://kellnr.io/blog/cross-plat-native-lib"
   */
  url: string;

  /** File name (without .vue) of the post component in src/views/posts/. */
  component: string;

  /** Route name, defaults to the id. Only set for posts with older route names. */
  routeName?: string;

  /**
   * Publication datetime in RFC 3339 format (with timezone).
   * Example: "2024-01-14T20:40:00+00:00"
   */
  published: string;

  /** Topic used by the blog filter, e.g. "kellnr" or "rust". */
  category: string;

  /**
   * Short HTML snippet used as summary/content in RSS/Atom feeds.
   * Keep this small and self-contained (no external scripts).
   */
  summaryHtml: string;
};

export type BlogPostsDocument = {
  posts: BlogPost[];
};
