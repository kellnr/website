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

  /**
   * Publication datetime in RFC 3339 format (with timezone).
   * Example: "2024-01-14T20:40:00+00:00"
   */
  published: string;

  /**
   * Short HTML snippet used as summary/content in RSS/Atom feeds.
   * Keep this small and self-contained (no external scripts).
   */
  summaryHtml: string;
};

export type BlogPostsDocument = {
  posts: BlogPost[];
};
