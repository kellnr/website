import { expect, test } from "@playwright/test";
import changelogData from "../src/data/changelog.json" with { type: "json" };

const expectedImage = `ghcr.io/kellnr/kellnr:${changelogData.releases[0]!.version.split(".")[0]}`;

test("has exactly one h1", async ({ page }) => {
  await page.goto("/documentation");
  await expect(page.locator("h2#installation")).toBeVisible();
  await expect(page.locator("h1")).toHaveCount(1);
});

test("section headings are named by their text and link to themselves", async ({ page }) => {
  await page.goto("/documentation");
  const heading = page.locator("h2#installation");
  await expect(heading).toHaveAccessibleName("Installation");
  await expect(heading.getByRole("link", { name: "Installation", exact: true })).toHaveAttribute(
    "href",
    "#installation"
  );
});

test("/documentation/v6 redirects to /documentation", async ({ page }) => {
  await page.goto("/documentation/v6");
  await expect(page).toHaveURL("/documentation");
});

test("marks only the TOC entry of the section in view", async ({ page }) => {
  await page.goto("/documentation#configuration");
  const current = page.locator(".toc-sidebar a[aria-current]");
  await expect(current).toHaveCount(1);
  await expect(current).toHaveText("Configuration");
  await expect(current).toHaveAttribute("aria-current", "location");
});

test("search jumps to the selected section", async ({ page }) => {
  await page.goto("/documentation");
  const search = page.locator(".toc-sidebar").getByRole("combobox", {
    name: "Search the documentation",
  });
  await search.fill("oauth");

  const options = page.locator(".toc-sidebar").getByRole("option");
  await expect(options.first()).toBeVisible();
  const headings = await options.locator(".result-heading").allTextContents();
  const index = headings.indexOf("OAuth2/OIDC");
  expect(index, `results: ${headings.join(", ")}`).toBeGreaterThanOrEqual(0);

  for (let i = 0; i <= index; i++) {
    await search.press("ArrowDown");
  }
  await expect(options.nth(index)).toHaveAttribute("aria-selected", "true");
  await search.press("Enter");

  await expect(page).toHaveURL("/documentation#oauth2");
  await expect(page.locator("h3#oauth2")).toBeInViewport();
});

test("search reports when nothing matches", async ({ page }) => {
  await page.goto("/documentation");
  const search = page.locator(".toc-sidebar").getByRole("combobox");
  await search.fill("xyzzy-nothing");
  await expect(page.locator(".toc-sidebar").getByRole("status")).toHaveText("No results");
  await search.press("Escape");
  await expect(search).toHaveValue("");
});

test("names no fixed Kellnr version", async ({ page }) => {
  await page.goto("/documentation");
  await expect(page.locator("body")).not.toContainText("Kellnr v6");
});

test("docker commands use the current major image tag", async ({ page }) => {
  await page.goto("/documentation");
  const dockerBlock = page.locator("#docker-container ~ .code-block").first();
  await expect(dockerBlock.locator("code.hljs")).toContainText(`${expectedImage}\n`);
  await expect(page.locator("code.hljs", { hasText: "ghcr.io/kellnr/kellnr:6" })).toHaveCount(0);
});

test("copies the docker command with the derived image tag", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/documentation");
  const dockerBlock = page.locator("#docker-container ~ .code-block").first();
  await dockerBlock.getByRole("button", { name: "Copy" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain(`-e "KELLNR_ORIGIN__HOSTNAME=kellnr.example.com" ${expectedImage}`);
});

test("mobile TOC toggle does not stick below the navbar", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/documentation");
  const toggle = page.locator(".toc-mobile-toggle");
  await expect(toggle).toBeVisible();
  await page.mouse.wheel(0, 3000);
  await expect(toggle).not.toBeInViewport();
});

test("does not scroll horizontally on phones", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/documentation", { waitUntil: "networkidle" });
  const width = await page.evaluate(() => document.documentElement.scrollWidth);
  expect(width).toBeLessThanOrEqual(390);
});

test("long code lines show an overflow hint until scrolled to the end", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/documentation#pre-built-binaries");
  const scroll = page.locator(".code-scroll", { hasText: "Invoke-WebRequest" });
  await expect(scroll).toHaveClass(/overflows-right/);
  await scroll.locator(".code-content").evaluate((el) => (el.scrollLeft = el.scrollWidth));
  await expect(scroll).not.toHaveClass(/overflows-right/);
});

test("only code blocks that scroll are keyboard focusable", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/documentation", { waitUntil: "networkidle" });
  const areas = page.locator(".code-content");
  const states = await areas.evaluateAll((elements) =>
    elements.map((el) => ({
      scrolls: el.scrollWidth > el.clientWidth + 1,
      focusable: el.getAttribute("tabindex") === "0",
    }))
  );
  expect(states.some((s) => s.scrolls)).toBe(true);
  expect(states.some((s) => !s.scrolls)).toBe(true);
  for (const state of states) {
    expect(state.focusable).toBe(state.scrolls);
  }
});
