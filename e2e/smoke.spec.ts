import { expect, test, type Page } from "@playwright/test";
import { pages } from "./pages";

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

test("unknown paths show the not found page and keep their URL", async ({ page }) => {
  const errors = trackErrors(page);

  await page.goto("/does-not-exist", { waitUntil: "networkidle" });

  await expect(page).toHaveURL("/does-not-exist");
  await expect(page.locator("h1")).toHaveText("Page not found");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex");
  expect(errors).toEqual([]);
});

test("the not found page drops its noindex tag after leaving it", async ({ page }) => {
  await page.goto("/does-not-exist", { waitUntil: "networkidle" });
  await page.getByRole("main").getByRole("link", { name: "Documentation" }).click();

  await expect(page).toHaveURL("/documentation");
  await expect(page.locator('meta[name="robots"]')).toHaveCount(0);
});

test("the skip link is the first focus target and moves focus to the content", async ({ page }) => {
  await page.goto("/features", { waitUntil: "networkidle" });

  const skipLink = page.getByRole("link", { name: "Skip to content" });
  await expect(skipLink).not.toBeInViewport();
  await page.keyboard.press("Tab");
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeInViewport();

  await page.keyboard.press("Enter");
  await expect(page.locator("main#main")).toBeFocused();
});

test("deep links scroll to their heading", async ({ page }) => {
  await page.goto("/documentation#webhooks", { waitUntil: "networkidle" });
  await expect(page.locator("#webhooks")).toBeInViewport();
});

test("the canonical link follows the route", async ({ page }) => {
  await page.goto("/documentation?foo=bar#webhooks", { waitUntil: "networkidle" });
  const canonical = page.locator('link[rel="canonical"]');
  await expect(canonical).toHaveAttribute("href", "https://kellnr.io/documentation");

  await page.getByRole("banner").getByRole("link", { name: "Home" }).click();
  await expect(canonical).toHaveAttribute("href", "https://kellnr.io/");
});

test("the docs menu works with the keyboard", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const button = page.getByRole("banner").getByRole("button", { name: "Docs" });
  const submenu = page.locator(`#${await button.getAttribute("aria-controls")}`);

  await button.focus();
  await page.keyboard.press("Enter");
  await expect(button).toHaveAttribute("aria-expanded", "true");
  await expect(submenu.getByRole("link", { name: "Changelog" })).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(submenu.getByRole("link", { name: "Documentation" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(button).toHaveAttribute("aria-expanded", "false");
  await expect(button).toBeFocused();
  await expect(submenu).toBeHidden();

  await page.keyboard.press("Space");
  await expect(button).toHaveAttribute("aria-expanded", "true");
});

test("external navigation links announce that they open a new tab", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  for (const region of [page.getByRole("banner"), page.getByRole("contentinfo")]) {
    const github = region.getByRole("link", { name: "GitHub (opens in new tab)", exact: true });
    await expect(github).toHaveAttribute("target", "_blank");
  }
});

test("the mobile menu toggles the navigation", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.goto("/", { waitUntil: "networkidle" });
  const docs = page.getByRole("banner").getByRole("button", { name: "Docs" });

  await expect(docs).toBeHidden();
  await page.getByRole("button", { name: "Toggle navigation" }).click();
  await expect(docs).toBeVisible();

  await docs.click();
  await page.getByRole("banner").getByRole("link", { name: "Changelog" }).click();
  await expect(page).toHaveURL("/changelog");
  await expect(docs).toBeHidden();
});

test("the footer links every section", async ({ page }) => {
  await page.goto("/", { waitUntil: "networkidle" });
  const footer = page.getByRole("contentinfo");
  for (const name of [
    "Features",
    "Documentation",
    "Changelog",
    "Blog",
    "RSS feed",
    "Contact",
    "Sponsor",
  ]) {
    await expect(footer.getByRole("link", { name, exact: true })).toBeVisible();
  }
  await expect(
    footer.getByRole("link", { name: "GitHub Discussions (opens in new tab)" })
  ).toHaveAttribute("href", "https://github.com/kellnr/kellnr/discussions");
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
