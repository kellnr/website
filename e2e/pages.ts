import blogData from "../src/data/blog-posts.json" with { type: "json" };

/** Every page of the site, checked by the smoke and accessibility tests. */
export const pages = [
  "/",
  "/features",
  "/changelog",
  "/documentation",
  "/documentation/v6",
  "/contact",
  "/sponsor",
  "/blog",
  ...blogData.posts.map((post) => new URL(post.url).pathname),
];
