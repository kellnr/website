import { beforeEach, describe, expect, it, vi } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import BlogPostTemplate from "@/components/blog/BlogPostTemplate.vue";
import blogData from "@/data/blog-posts.json";
import type { BlogPostsDocument } from "@/types/blog-posts";

const route = vi.hoisted(() => ({ name: undefined as string | undefined }));

vi.mock("vue-router", async (importOriginal) => ({
  ...(await importOriginal<typeof import("vue-router")>()),
  useRoute: () => route,
}));

const posts = (blogData as BlogPostsDocument).posts;

const postSources = import.meta.glob<string>("/src/views/posts/*.vue", {
  query: "?raw",
  import: "default",
  eager: true,
});

function render() {
  return mount(BlogPostTemplate, {
    props: { title: "A post" },
    global: { stubs: { RouterLink: RouterLinkStub } },
  });
}

describe("BlogPostTemplate", () => {
  beforeEach(() => {
    route.name = undefined;
  });

  it("shows the published date of the current post from blog-posts.json", () => {
    route.name = "kellnr-v7";
    const time = render().get("time");
    expect(time.text()).toBe("November 1, 2026");
    expect(time.attributes("datetime")).toBe("2026-11-01T12:00:00+00:00");
  });

  it("finds posts by their legacy route name", () => {
    route.name = "blog-wasm-compiler1";
    expect(render().get("time").text()).toBe("May 27, 2021");
  });

  it("names the route when the post is missing from blog-posts.json", () => {
    route.name = "no-such-post";
    vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(render).toThrow(/no-such-post/);
  });

  it.each(posts.map((post) => [post.component, post.routeName ?? post.id]))(
    "post %s resolves its date by route name %s",
    (_component, name) => {
      route.name = name;
      expect(render().get("time").text()).toMatch(/^[A-Z][a-z]+ \d{1,2}, \d{4}$/);
    }
  );

  it("no post passes its own date", () => {
    const withDate = Object.entries(postSources)
      .filter(([, source]) => /<BlogPostTemplate\b[^>]*\bdate=/.test(source))
      .map(([file]) => file);
    expect(withDate).toEqual([]);
  });
});
