import { expect, test, type Page } from "@playwright/test";

const toggle = (page: Page) => page.getByRole("button", { name: /^Color theme:/ });

function themeAttribute(page: Page): Promise<string | null> {
  return page.evaluate(() => document.documentElement.getAttribute("data-theme"));
}

function bodyBackground(page: Page): Promise<string> {
  return page.evaluate(() => getComputedStyle(document.body).backgroundColor);
}

test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/", { waitUntil: "networkidle" });
});

test("the toggle cycles through system, light and dark", async ({ page }) => {
  await expect(toggle(page)).toHaveAccessibleName(/^Color theme: system\./);
  expect(await themeAttribute(page)).toBeNull();

  await toggle(page).click();
  await expect(toggle(page)).toHaveAccessibleName(/^Color theme: light\./);
  expect(await themeAttribute(page)).toBe("light");

  await toggle(page).click();
  await expect(toggle(page)).toHaveAccessibleName(/^Color theme: dark\./);
  expect(await themeAttribute(page)).toBe("dark");

  await toggle(page).click();
  await expect(toggle(page)).toHaveAccessibleName(/^Color theme: system\./);
  expect(await themeAttribute(page)).toBeNull();
});

test("the chosen theme survives a reload", async ({ page }) => {
  await toggle(page).click();
  await toggle(page).click();
  expect(await themeAttribute(page)).toBe("dark");

  await page.reload({ waitUntil: "networkidle" });

  expect(await themeAttribute(page)).toBe("dark");
  await expect(toggle(page)).toHaveAccessibleName(/^Color theme: dark\./);
});

test("light and dark themes have different page backgrounds", async ({ page }) => {
  await toggle(page).click();
  const light = await bodyBackground(page);

  await toggle(page).click();
  const dark = await bodyBackground(page);

  expect(light).not.toBe(dark);
});

test("the system theme follows the color scheme of the OS", async ({ page }) => {
  const light = await bodyBackground(page);

  await page.emulateMedia({ colorScheme: "dark" });

  expect(await bodyBackground(page)).not.toBe(light);
});

test("an explicit light choice overrides a dark OS", async ({ page }) => {
  const lightBackground = await bodyBackground(page);

  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => localStorage.setItem("kellnr-theme", "light"));
  await page.reload({ waitUntil: "networkidle" });

  expect(await themeAttribute(page)).toBe("light");
  expect(await bodyBackground(page)).toBe(lightBackground);
});
