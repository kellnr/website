import { expect, test, type Locator } from "@playwright/test";
import blogData from "../src/data/blog-posts.json" with { type: "json" };
import changelogData from "../src/data/changelog.json" with { type: "json" };

const kellnrMajor = changelogData.releases[0]!.version.split(".")[0]!;

const longDate = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

/** Whether the item is fully visible inside its horizontally scrolling list. */
function isInsideList(item: Locator): Promise<boolean> {
  return item.evaluate((el) => {
    const list = el.closest("ul")!.getBoundingClientRect();
    const rect = el.getBoundingClientRect();
    return rect.left >= list.left - 1 && rect.right <= list.right + 1;
  });
}

test.describe("features page", () => {
  test("starts with the shared page header", async ({ page }) => {
    await page.goto("/features");
    const crumbs = page.getByRole("navigation", { name: "breadcrumb" });
    await expect(crumbs.getByRole("link", { name: "Kellnr" })).toHaveAttribute("href", "/");
    await expect(crumbs.getByText("Features")).toHaveAttribute("aria-current", "page");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Features");
  });

  test("marks the section in view in the section navigation", async ({ page }) => {
    await page.goto("/features");
    const nav = page.getByRole("navigation", { name: "Feature sections" });
    const proxy = nav.getByRole("link", { name: "Crates.io Proxy" });

    await proxy.click();

    await expect(proxy).toHaveAttribute("aria-current", "location");
    await expect(nav.locator('[aria-current="location"]')).toHaveCount(1);
  });

  test("keeps the current section visible in a scrolling navigation", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/features");
    const nav = page.getByRole("navigation", { name: "Feature sections" });

    const item = nav.getByRole("link", { name: "Deployment" });
    expect(await isInsideList(item)).toBe(false);

    await page.locator("#deployment").evaluate((el) => el.scrollIntoView());

    await expect(item).toHaveAttribute("aria-current", "location");
    await expect.poll(() => isInsideList(item)).toBe(true);
    await expect(nav.locator("ul")).toHaveClass(/fade-start/);
  });

  test("does not fade a navigation that fits", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("/features");
    const list = page.getByRole("navigation", { name: "Feature sections" }).locator("ul");
    await expect(list).not.toHaveClass(/fade-(start|end)/);
  });

  test("lazy loads screenshots below the fold", async ({ page }) => {
    await page.goto("/features");
    const shots = page.locator(".showcase-shot, .section-shot");
    expect(await shots.count()).toBeGreaterThan(0);
    for (const shot of await shots.all()) {
      await expect(shot).toHaveAttribute("loading", "lazy");
      await expect(shot).toHaveAttribute("decoding", "async");
      await expect(shot).toHaveAttribute("width", /^\d+$/);
      await expect(shot).toHaveAttribute("height", /^\d+$/);
    }
  });
});

test.describe("landing page", () => {
  test("quick start pulls the image of the current major version", async ({ page, context }) => {
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/");
    const block = page.locator(".quickstart-section .code-block").first();

    await expect(block.locator("code")).toContainText(`ghcr.io/kellnr/kellnr:${kellnrMajor}`);
    const versions = (await block.locator("code").textContent())!.match(/kellnr\/kellnr:(\S+)/g);
    expect(versions).toEqual([`kellnr/kellnr:${kellnrMajor}`]);

    await block.getByRole("button", { name: "Copy" }).click();
    const copied = await page.evaluate(() => navigator.clipboard.readText());
    expect(copied).toContain(`ghcr.io/kellnr/kellnr:${kellnrMajor}`);
  });

  test("both calls to action read the same", async ({ page }) => {
    await page.goto("/");
    const ctas = page.locator(".hero-actions .btn-primary, .cta-section .btn-primary");
    await expect(ctas).toHaveCount(2);
    for (const cta of await ctas.all()) {
      await expect(cta).toHaveText("Get started");
      await expect(cta).toHaveAttribute("href", "/documentation#installation");
    }
  });

  test("hero screenshot offers AVIF and WebP", async ({ page }) => {
    await page.goto("/");
    const picture = page.locator(".hero-image picture");
    await expect(picture.locator('source[type="image/avif"]')).not.toHaveCount(0);
    await expect(picture.locator('source[type="image/webp"]')).not.toHaveCount(0);
    const img = picture.locator("img");
    await expect(img).toHaveAttribute("fetchpriority", "high");
    await expect(img).toHaveAttribute("width", "3534");
    await expect(img).toHaveAttribute("height", "2314");
    expect(await img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0)).toBe(
      true
    );
  });

  test("hero screenshot loads on small screens", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    await page.goto("/");
    const img = page.locator(".hero-image picture img");
    await expect
      .poll(() => img.evaluate((el: HTMLImageElement) => el.currentSrc))
      .toMatch(/landing-mobile-\d+\.(avif|webp)$/);
  });
});

test("blog post header shows the publication date", async ({ page }) => {
  const post = blogData.posts[0]!;
  await page.goto(new URL(post.url).pathname);
  const time = page.locator(".page-header .page-subtitle time");
  await expect(time).toHaveText(longDate.format(new Date(post.published)));
  await expect(time).toHaveAttribute("datetime", post.published);
});
