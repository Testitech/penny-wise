import { expect, test } from "@playwright/test";

test("landing and check navigation works at desktop, tablet, and phone widths", async ({ page }, testInfo) => {
  for (const width of [1440, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Try Next Move Check" })).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`landing-nav-${width}.png`) });
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);

    await page.getByRole("link", { name: "Try Next Move Check" }).click();
    await expect(page).toHaveURL(/\/next-move-check$/);
    await expect(page.getByRole("link", { name: "Back to landing" })).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth)).toBe(false);
    await page.getByRole("link", { name: "Back to landing" }).click();
    await expect(page).toHaveURL(/\/$/);
  }
});
