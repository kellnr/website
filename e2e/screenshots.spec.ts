import { expect, test, type Locator, type Page } from "@playwright/test";

type Scheme = "light" | "dark";

const heroImage = (page: Page) => page.locator(".hero-image img");
const searchScreenshot = (page: Page) => page.getByAltText("Searching crates in the Kellnr web UI");

function loadedSource(image: Locator): Promise<string> {
  return image.evaluate((img: HTMLImageElement) => img.currentSrc);
}

async function expectHero(page: Page, scheme: Scheme) {
  await expect
    .poll(() => loadedSource(heroImage(page)))
    .toMatch(new RegExp(`/landing-${scheme}-\\d+\\.`));
}

async function expectFeatureScreenshot(page: Page, scheme: Scheme) {
  await page.goto("/features", { waitUntil: "networkidle" });
  const image = searchScreenshot(page);
  await image.scrollIntoViewIfNeeded();
  await expect(image).toHaveAttribute("src", `/images/kellnr/search-${scheme}.png`);
  await expect.poll(() => loadedSource(image)).toMatch(new RegExp(`/search-${scheme}\\.png$`));
}

for (const scheme of ["light", "dark"] as const) {
  test(`a ${scheme} OS gets the ${scheme} screenshots`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: scheme });
    await page.goto("/", { waitUntil: "networkidle" });

    await expectHero(page, scheme);
    await expectFeatureScreenshot(page, scheme);
  });
}

test("an explicit light choice on a dark OS gets the light screenshots", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("kellnr-theme", "light"));
  await page.goto("/", { waitUntil: "networkidle" });

  await expectHero(page, "light");
  await expectFeatureScreenshot(page, "light");
});

test("the screenshots follow the theme toggle and OS changes", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "networkidle" });
  const toggle = page.getByRole("button", { name: /^Color theme:/ });

  await toggle.click();
  await toggle.click();
  await expect(toggle).toHaveAccessibleName(/^Color theme: dark\./);
  await expectHero(page, "dark");

  await toggle.click();
  await expect(toggle).toHaveAccessibleName(/^Color theme: system\./);
  await expectHero(page, "light");

  await page.emulateMedia({ colorScheme: "dark" });
  await expectHero(page, "dark");
});

test("small screens get the mobile crop in the theme of the OS", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 800 });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/", { waitUntil: "networkidle" });

  await expect
    .poll(() => loadedSource(heroImage(page)))
    .toMatch(/\/landing-mobile-dark-\d+\.(avif|webp)$/);
});
