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
  await expect(page.getByRole("status")).toContainText("Enter the possible expense as a whole-naira amount");
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

test("edits multiple costs and removes a non-final cost without losing the estimate", async ({ page }) => {
  await page.locator("#available").fill("100000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("40000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 2 name").fill("Transport");
  await page.getByLabel("Cost 2 amount in ₦").fill("5000");
  await expect(page.getByText("₦55,000 remaining")).toBeVisible();

  await page.getByLabel("Cost 1 amount in ₦").fill("30000");
  await page.getByLabel("Cost 2 amount in ₦").fill("10000");
  await expect(page.getByText("₦60,000 remaining")).toBeVisible();
  await page.getByRole("button", { name: "Remove cost 1, Rent" }).click();
  await expect(page.getByLabel("Cost 1 name")).toHaveValue("Transport");
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await expect(page.getByText("₦90,000 remaining", { exact: true })).toBeVisible();
});

test("keeps a live estimate while another cost is being added", async ({ page }) => {
  await page.locator("#available").fill("200000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("47000");
  await expect(page.locator("#estimate")).toContainText("Estimate ready");
  await expect(page.locator("#estimate")).toContainText("₦153,000 remaining");

  await page.getByRole("button", { name: "Add a cost" }).click();
  await expect(page.getByLabel("Cost 2 name")).toBeFocused();
  await expect(page.locator("#estimate")).toContainText("Live estimate · cost in progress");
  await expect(page.locator("#estimate")).toContainText("₦153,000 remaining");
  await expect(page.locator("#estimate")).toContainText("unfinished cost is not included yet");

  await page.getByLabel("Cost 2 amount in ₦").fill("5000");
  await expect(page.locator("#estimate")).toContainText("₦148,000 remaining");
  await expect(page.locator("#estimate")).toContainText("new cost amount is included");
  await page.locator("#expense-amount").fill("10000");
  await expect(page.locator("#estimate")).toContainText("₦138,000 remaining");
  await expect.poll(() => page.getByRole("status").textContent()).toContain("After the possible expense: ₦138,000 remaining");
  await page.getByRole("button", { name: "Clear possible expense" }).click();
  await page.getByLabel("Cost 2 amount in ₦").fill("5.5");
  await expect(page.locator("#estimate")).toContainText("Estimate unavailable");
  await expect(page.locator("#estimate")).not.toContainText("₦148,000 remaining");
  await page.getByLabel("Cost 2 amount in ₦").fill("5000");
  await page.getByLabel("Cost 2 name").fill("Transport");
  await expect(page.locator("#estimate")).toContainText("Estimate ready");
  await expect(page.locator("#estimate")).toContainText("₦148,000 remaining");
  await page.getByLabel("Cost 2 amount in ₦").fill("");
  await expect(page.locator("#estimate")).toContainText("Estimate unavailable");
});

test("prevents another cost while an existing row is incomplete and keeps removal available", async ({ page }) => {
  await page.locator("#available").fill("100000");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await expect(page.locator("#cost-1-name-error")).toHaveCount(0);
  await expect(page.locator("#cost-1-amount-error")).toHaveCount(0);
  await expect(page.locator("#estimate")).toContainText("Estimate unavailable");
  await page.locator("#expense-name").click();
  await expect(page.locator("#expense-name")).toBeFocused();
  await expect(page.locator("#cost-1-name-error")).toBeVisible();

  await page.getByRole("button", { name: "Add a cost" }).click();
  await expect(page.getByLabel("Cost 2 name")).toHaveCount(0);
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await expect(page.locator("#cost-1-name-error")).toBeVisible();
  await page.getByRole("button", { name: "Add a cost" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await expect(page.getByLabel("Cost 2 name")).toHaveCount(0);
  await page.getByLabel("Cost 1 name").fill("Transport");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await expect(page.getByLabel("Cost 1 amount in ₦")).toBeFocused();
  await expect(page.locator("#cost-1-amount-error")).toBeVisible();
  await expect(page.getByLabel("Cost 2 name")).toHaveCount(0);

  await page.getByRole("button", { name: "Remove cost 1, Transport" }).click();
  await expect(page.getByRole("button", { name: "Add a cost" })).toBeFocused();
  await expect(page.getByText("I have no costs to add before my next income")).toBeVisible();
});

test("Clear restores focus to the expense amount and the estimate link focuses its destination", async ({ page }) => {
  await page.locator("#available").fill("100000");
  await page.getByLabel("I have no costs to add before my next income").check();
  await page.locator("#expense-name").fill("Repair");
  await page.locator("#expense-amount").fill("15000");

  await page.getByRole("link", { name: "View updated estimate" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#estimate")).toBeFocused();
  await expect(page.locator("#estimate")).toContainText("Estimate ready");
  const outline = await page.locator("#estimate").evaluate((element) => getComputedStyle(element).outlineStyle);
  expect(outline).not.toBe("none");

  await page.getByRole("button", { name: "Clear possible expense" }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("#expense-amount")).toBeFocused();
  await expect(page.locator("#expense-amount")).toHaveValue("");
  await expect(page.getByText("₦100,000 remaining", { exact: true })).toBeVisible();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Reset check" })).toBeFocused();
});

test("completes the cost and possible-expense journey using the keyboard", async ({ page }) => {
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Pennywise home" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "Back to landing" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#available")).toBeFocused();
  await page.keyboard.type("100000");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Add a cost" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByLabel("Cost 1 name")).toBeFocused();
  await page.keyboard.type("Transport");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Cost 1 amount in ₦")).toBeFocused();
  await page.keyboard.type("20000");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Remove cost 1, Transport" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Add a cost" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.locator("#expense-name")).toBeFocused();
  await page.keyboard.type("Repair");
  await page.keyboard.press("Tab");
  await expect(page.locator("#expense-amount")).toBeFocused();
  await page.keyboard.type("5000");
  await page.keyboard.press("Tab");
  await expect(page.getByRole("button", { name: "Clear possible expense" })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: "View updated estimate" })).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#estimate")).toBeFocused();
  await expect(page.locator("#estimate")).toContainText("₦75,000 remaining");
});

test("announces settled results and relevant errors without speaking each keystroke", async ({ page }) => {
  await page.locator("#available").fill("100000");
  await page.getByLabel("I have no costs to add before my next income").check();
  await page.evaluate(() => {
    const messages: string[] = [];
    const status = document.querySelector('[role="status"]');
    new MutationObserver(() => {
      const message = status?.textContent?.trim();
      if (message) messages.push(message);
    }).observe(status!, { childList: true, characterData: true, subtree: true });
    Object.assign(window, { __observedAnnouncements: messages });
  });

  await page.locator("#available").focus();
  await page.keyboard.press("ControlOrMeta+A");
  await page.keyboard.type("120000");
  await expect.poll(() => page.getByRole("status").textContent()).toContain("₦120,000 remaining");
  const messages = await page.evaluate(() => (window as Window & { __observedAnnouncements: string[] }).__observedAnnouncements);
  expect(messages.length).toBeLessThan(6);
  expect(messages.at(-1)).toContain("Before the possible expense: ₦120,000 remaining");

  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("Rent");
  await page.getByLabel("Cost 1 amount in ₦").fill("1.5");
  await page.locator("#available").fill("130000");
  await page.locator("#available").blur();
  await expect(page.getByRole("status")).not.toContainText("cost amount");
  await page.getByLabel("Cost 1 amount in ₦").focus();
  await page.getByLabel("Cost 1 amount in ₦").blur();
  await expect(page.getByRole("status")).toContainText("whole-naira amount");
});

test("associates aggregate cost overflow with cost amounts", async ({ page }) => {
  await page.locator("#available").fill("0");
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 1 name").fill("First");
  await page.getByLabel("Cost 1 amount in ₦").fill(String(Number.MAX_SAFE_INTEGER));
  await page.getByRole("button", { name: "Add a cost" }).click();
  await page.getByLabel("Cost 2 name").fill("Second");
  await page.getByLabel("Cost 2 amount in ₦").fill("1");
  await expect(page.locator("#cost-total-error")).toBeVisible();
  await expect(page.getByLabel("Cost 1 amount in ₦")).toHaveAttribute("aria-describedby", "cost-total-error");
  await expect(page.getByLabel("Cost 2 amount in ₦")).toHaveAttribute("aria-describedby", "cost-total-error");
  await expect(page.locator("#estimate")).toContainText("Estimate unavailable");
  await page.getByLabel("Cost 2 amount in ₦").fill("2");
  await expect(page.locator("#cost-total-error")).toBeVisible();
});

test("places one estimate after Costs on mobile without scrolling while typing", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 700 });
  await page.locator("#available").fill("100000");
  for (let index = 1; index <= 3; index += 1) {
    await page.getByRole("button", { name: "Add a cost" }).click();
    await page.getByLabel(`Cost ${index} name`).fill(`Cost ${index}`);
    await page.getByLabel(`Cost ${index} amount in ₦`).fill("1000");
  }
  const positions = await page.evaluate(() => {
    const costs = document.querySelector("#costs-title")!.closest("section")!.getBoundingClientRect();
    const estimate = document.querySelector("#estimate")!.getBoundingClientRect();
    const expense = document.querySelector("#expense-title")!.closest("section")!.getBoundingClientRect();
    return { costsBottom: costs.bottom, estimateTop: estimate.top, estimateBottom: estimate.bottom, expenseTop: expense.top };
  });
  expect(positions.estimateTop).toBeGreaterThanOrEqual(positions.costsBottom);
  expect(positions.expenseTop).toBeGreaterThanOrEqual(positions.estimateBottom);
  await expect(page.locator("#estimate")).toContainText("Estimate ready");
  await page.getByLabel("Cost 3 amount in ₦").focus();
  await page.keyboard.press("ControlOrMeta+A");
  const scrollBefore = await page.evaluate(() => window.scrollY);
  await page.keyboard.type("2000");
  const scrollAfter = await page.evaluate(() => window.scrollY);
  expect(Math.abs(scrollAfter - scrollBefore)).toBeLessThan(100);
  await expect(page.getByLabel("Cost 3 amount in ₦")).toBeFocused();
  await expect(page.locator("#estimate")).toContainText("₦96,000 remaining");
});
