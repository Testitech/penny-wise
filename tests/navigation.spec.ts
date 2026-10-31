import { expect, test } from "@playwright/test";

test("landing and check navigation works without wide gutters or overflow", async ({ page }, testInfo) => {
  for (const width of [1920, 1440, 1366, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/");
    await expect(page.getByRole("navigation", { name: "Main navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Try Next Move Check" })).toBeVisible();
    const hero = await page.locator(".hero-layout").boundingBox();
    expect(hero).not.toBeNull();
    expect(hero!.x).toBeLessThanOrEqual(Math.max(32, width * 0.05));
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
