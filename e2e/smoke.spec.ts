import { expect, test, type Page } from "@playwright/test";
import blogData from "../src/data/blog-posts.json" with { type: "json" };

const pages = [
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

/** Collects errors raised by the site itself; third-party scripts (e.g. Stripe) are ignored. */
function trackErrors(page: Page): string[] {
  const errors: string[] = [];
  const isOwn = (url: string) => url.startsWith(new URL(page.url() || "http://localhost").origin);

  page.on("pageerror", (error) => errors.push(`uncaught: ${error.message}`));
  page.on("console", (msg) => {
    if (msg.type() === "error" && (!msg.location().url || isOwn(msg.location().url))) {
      errors.push(`console: ${msg.text()}`);
    }
  });
  page.on("response", (response) => {
    if (response.status() >= 400 && isOwn(response.url())) {
      errors.push(`HTTP ${response.status()}: ${response.url()}`);
    }
  });
  page.on("requestfailed", (request) => {
    if (isOwn(request.url())) {
      errors.push(`request failed: ${request.url()}`);
    }
  });
  return errors;
}

for (const path of pages) {
  test(`renders ${path}`, async ({ page }) => {
    const errors = trackErrors(page);

    await page.goto(path, { waitUntil: "networkidle" });

    await expect(page.locator("h1").first()).not.toBeEmpty();
    expect(errors).toEqual([]);
  });
}

test("unknown paths redirect to the landing page", async ({ page }) => {
  await page.goto("/does-not-exist");
  await expect(page).toHaveURL("/");
});

test("code blocks are syntax highlighted", async ({ page }) => {
  await page.goto("/blog/async-closures-in-rust");
  await expect(page.locator("code.hljs").first()).toBeVisible();
  await expect(page.locator("code.hljs .hljs-keyword").first()).toBeVisible();
});

test("icon font loads", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return document.fonts.check('24px "Material Design Icons"');
  });
  expect(loaded).toBe(true);
});
