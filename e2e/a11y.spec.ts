import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { pages } from "./pages";

const WCAG_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];
const SHOWN_TARGETS = 3;

type Violation = Awaited<ReturnType<AxeBuilder["analyze"]>>["violations"][number];

function describeViolation({ id, impact, nodes }: Violation): string {
  const targets = nodes.slice(0, SHOWN_TARGETS).map((node) => node.target.join(" "));
  return `${id} (${impact}, ${nodes.length} elements): ${targets.join(" | ")}`;
}

const COLOR_SCHEMES = ["light", "dark"] as const;

for (const colorScheme of COLOR_SCHEMES) {
  for (const path of [...pages, "/does-not-exist"]) {
    test(`has no accessibility violations on ${path} (${colorScheme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme });
      await page.goto(path, { waitUntil: "networkidle" });

      const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();

      expect(results.violations.map(describeViolation)).toEqual([]);
    });
  }
}

// The toggle's explicit choice must win over the OS setting in both directions.
for (const [osScheme, chosen] of [
  ["light", "dark"],
  ["dark", "light"],
] as const) {
  test(`has no accessibility violations with ${chosen} chosen on a ${osScheme} OS`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: osScheme });
    await page.addInitScript((theme) => localStorage.setItem("kellnr-theme", theme), chosen);
    await page.goto("/documentation", { waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", chosen);

    const results = await new AxeBuilder({ page }).withTags(WCAG_TAGS).analyze();
    expect(results.violations.map(describeViolation)).toEqual([]);
  });
}
