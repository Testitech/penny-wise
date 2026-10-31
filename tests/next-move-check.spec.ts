import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/next-move-check");
});

test("requires explicit no-cost confirmation and refresh clears session inputs", async ({ page }) => {
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("100000");
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toHaveCount(0);
  await page.getByLabel("I have no costs to add before my next income").check();
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toBeVisible();
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("");
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toHaveCount(0);
  await expect(page.locator("#available-error")).toContainText("Enter money available now");
  await page.reload();
  await expect(page.getByLabel("Amount in ₦", { exact: true }).first()).toHaveValue("");
  await expect(page.getByLabel("I have no costs to add before my next income")).not.toBeChecked();
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toHaveCount(0);
});

test("removing the last cost invalidates the result and requires new confirmation", async ({ page }) => {
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("100000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await page.getByLabel("Cost 1 name").fill("Transport");
  await page.getByLabel("Cost 1 amount in ₦").fill("20000");
  await expect(page.getByText("₦80,000 remaining")).toBeVisible();
  await page.getByRole("button", { name: "Remove cost 1, Transport" }).click();
  await expect(page.getByRole("button", { name: "Add a cost" })).toBeFocused();
  await expect(page.getByText("₦80,000 remaining")).toHaveCount(0);
  await page.getByLabel("I have no costs to add before my next income").check();
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toBeVisible();
});

test("invalid input immediately removes stale results, then recovers", async ({ page }) => {
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("100000");
  await page.getByLabel("I have no costs to add before my next income").check();
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("15000");
  await expect(page.getByText("₦85,000 remaining")).toBeVisible();
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("15.5");
  await expect(page.getByText("₦85,000 remaining")).toHaveCount(0);
  await expect(page.getByText(/whole-naira amount, without decimals or symbols/)).toBeVisible();
  await page.getByLabel("Amount in ₦", { exact: true }).last().press("Tab");
  await expect(page.getByRole("status")).toContainText("Result unavailable");
  await expect(page.locator("#expense-amount")).toHaveAttribute("aria-describedby", "expense-error");
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("5000");
  await expect(page.getByText("₦95,000 remaining")).toBeVisible();
  await page.getByRole("button", { name: "Clear possible expense" }).click();
  await expect(page.getByText("₦95,000 remaining")).toHaveCount(0);
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toBeVisible();
});

test("keyboard add, remove and reset manage focus and untouched state", async ({ page }) => {
  await page.getByLabel("Amount in ₦", { exact: true }).first().focus();
  await page.keyboard.type("40000");
  await page.getByRole("button", { name: "Add a cost" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await page.keyboard.type("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("50000");
  await expect(page.getByText("Short by ₦10,000")).toBeVisible();
  await page.getByRole("button", { name: "Remove cost 1, Rent" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("button", { name: "Add a cost" })).toBeFocused();
  await page.getByRole("button", { name: "Reset check" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Amount in ₦", { exact: true }).first()).toBeFocused();
  await expect(page.getByLabel("Amount in ₦", { exact: true }).first()).toHaveValue("");
  await expect(page.getByText("Enter money available now and your costs to see an estimate.")).toBeVisible();
});

test("distinguishes zero and commitment shortfall before any expense", async ({ page }) => {
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("40000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("40000");
  await expect(page.getByText("₦0 remaining")).toBeVisible();
  await page.getByLabel("Cost 1 amount in ₦").fill("50000");
  await expect(page.getByText("Short by ₦10,000")).toBeVisible();
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("5000");
  await expect(page.getByText("Short by ₦15,000")).toBeVisible();
});

test("fits phone, tablet and desktop with labelled fields and live feedback", async ({ page }, testInfo) => {
  for (const width of [390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByRole("heading", { name: "Next Move Check" })).toBeVisible();
    await expect(page.getByLabel("Amount in ₦", { exact: true })).toHaveCount(2);
    await expect(page.locator("#available")).toHaveAttribute("aria-describedby", "available-hint");
    await expect(page.getByRole("status")).toHaveAttribute("aria-live", "polite");
    const overflows = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
    expect(overflows).toBe(false);
    await page.screenshot({ path: testInfo.outputPath(`next-move-check-${width}.png`), fullPage: true });
  }
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("40000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("50000");
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("5000");
  for (const width of [390, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(page.getByText("Short by ₦15,000")).toBeVisible();
    await page.screenshot({ path: testInfo.outputPath(`next-move-check-result-${width}.png`), fullPage: true });
  }
});

test("does not send entered figures in requests", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (request) => {
    requests.push(`${request.method()} ${request.url()} ${request.postData() ?? ""}`);
  });
  await page.getByLabel("Amount in ₦", { exact: true }).first().fill("123456");
  await page.getByLabel("I have no costs to add before my next income").check();
  await page.getByLabel("Amount in ₦", { exact: true }).last().fill("7890");
  await expect(page.getByText("₦115,566 remaining", { exact: true })).toBeVisible();
  expect(requests.filter((request) => /123456|7890/.test(request))).toEqual([]);
});
