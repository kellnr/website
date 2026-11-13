import { expect, test } from "@playwright/test";
import changelogData from "../src/data/changelog.json" with { type: "json" };
import { versionId } from "../src/utils/changelog";

const latest = changelogData.releases.find((r) => r.isLatest);
// A release of an older major version, whose group is collapsed by default.
const OLD_VERSION_ID = "v6-0-0";

test("release headings are h2 elements with version ids", async ({ page }) => {
  expect(latest, "changelog.json marks a release as latest").toBeDefined();
  await page.goto("/changelog");

  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator(`h2#${versionId(latest!.version)}`)).toContainText(latest!.version);
  await expect(page.locator(`h2#${OLD_VERSION_ID}`)).toHaveCount(1);
  await expect(page.locator(`h2#${OLD_VERSION_ID}`)).toBeHidden();
});

test("a deep link opens the version group and scrolls to the release", async ({ page }) => {
  await page.goto(`/changelog#${OLD_VERSION_ID}`);

  const heading = page.locator(`h2#${OLD_VERSION_ID}`);
  await expect(heading).toBeVisible();
  await expect(heading).toBeInViewport();
  await expect(page.locator("details.major-group", { has: heading })).toHaveAttribute("open", "");
});

test("the version navigation opens the group of an older release", async ({ page }) => {
  await page.goto("/changelog");

  await page.locator(".version-sidebar").getByRole("link", { name: "6.0.0", exact: true }).click();

  await expect(page).toHaveURL(new RegExp(`#${OLD_VERSION_ID}$`));
  await expect(page.locator(`h2#${OLD_VERSION_ID}`)).toBeInViewport();
});

test("the type filter shows only matching entries", async ({ page }) => {
  await page.goto("/changelog?type=Fixed");

  await expect(page.getByRole("button", { name: /^Fixed/ })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  await expect(page.getByRole("button", { name: "All" })).toHaveAttribute("aria-pressed", "false");

  const types = await page
    .locator("li.entry")
    .evaluateAll((items) => items.map((item) => item.getAttribute("data-type")));
  expect(types.length).toBeGreaterThan(0);
  expect(new Set(types)).toEqual(new Set(["Fixed"]));
});

test("type chips update the query", async ({ page }) => {
  await page.goto("/changelog");

  await page.getByRole("button", { name: /^Security/ }).click();
  await page.getByRole("button", { name: /^Fixed/ }).click();
  await expect(page).toHaveURL(/\?type=Fixed(,|%2C)Security$/);

  await page.getByRole("button", { name: "All" }).click();
  await expect(page).toHaveURL(/\/changelog$/);
});

test("a type chip keeps the release anchor", async ({ page }) => {
  await page.goto(`/changelog#${OLD_VERSION_ID}`);

  await page.getByRole("button", { name: /^Security/ }).click();
  await expect(page).toHaveURL(new RegExp(`\\?type=Security#${OLD_VERSION_ID}$`));
});

test("the latest release is labeled Latest", async ({ page }) => {
  expect(latest, "changelog.json marks a release as latest").toBeDefined();
  await page.goto("/changelog");

  const release = page.locator("article.release", {
    has: page.locator(`h2#${versionId(latest!.version)}`),
  });
  await expect(release.locator(".latest")).toHaveText("Latest");
});

test("version numbers meet the AA contrast ratio", async ({ page }) => {
  await page.goto("/changelog");

  const color = await page
    .locator("h2 .version")
    .first()
    .evaluate((el) => getComputedStyle(el).color);
  expect(contrastOnWhite(color)).toBeGreaterThanOrEqual(4.5);
});

function contrastOnWhite(rgb: string): number {
  const channels = rgb.match(/\d+/g)?.slice(0, 3).map(Number);
  if (channels?.length !== 3) throw new Error(`Unexpected color value: "${rgb}"`);
  const [r, g, b] = channels.map((c) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  const luminance = 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
  return 1.05 / (luminance + 0.05);
}
