import { describe, expect, it } from "vitest";
import { mount, RouterLinkStub } from "@vue/test-utils";
import { createMemoryHistory, createRouter } from "vue-router";
import BlogView from "@/views/BlogView.vue";
import blogData from "@/data/blog-posts.json";
import { formatDate, formatShortDate } from "@/utils/date";

async function render() {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: "/blog", component: BlogView }],
  });
  await router.push("/blog");
  return mount(BlogView, { global: { plugins: [router], stubs: { RouterLink: RouterLinkStub } } });
}

describe("BlogView", () => {
  it("formats the featured and listed dates with the shared helpers", async () => {
    const [first, second] = blogData.posts;
    const times = (await render()).findAll("time");
    expect(times[0]!.text()).toBe(formatDate(first!.published));
    expect(times[1]!.text()).toBe(formatShortDate(second!.published));
  });
});
