import { test, expect } from "@playwright/test";

test("Full MSCB Flow", async ({ page }) => {

  // ---------------- GOV FLOW ----------------
  await page.goto("http://localhost:3000/login");

  await page.fill("input[name=email]", "gov@test.com");
  await page.fill("input[name=password]", "123456");
  await page.click("button[type=submit]");

  await expect(page).toHaveURL(/dashboard\/gov/);

  // Create Drug Type
  await page.click("text=Drug Types");
  await page.click("text=Register Drug Type");

  await page.fill("input[name=name]", "Paracetamol");
  await page.fill("input[name=description]", "Painkiller");
  await page.click("text=Create");

  await expect(page.locator("text=Paracetamol")).toBeVisible();

  // Issue License
  await page.click("text=Licenses");
  await page.click("text=Issue License");

  await page.selectOption("select[name=drugType]", { label: "Paracetamol" });
  await page.selectOption("select[name=manufacturer]", { label: "PharmaCorp" });
  await page.click("text=Issue");

  await expect(page.locator("text=VALID")).toBeVisible();

  // ---------------- MANUFACTURER FLOW ----------------
  await page.goto("http://localhost:3000/login");

  await page.fill("input[name=email]", "mfr@test.com");
  await page.fill("input[name=password]", "123456");
  await page.click("button[type=submit]");

  await expect(page).toHaveURL(/dashboard\/manufacturer/);

  // Create Unit
  await page.selectOption("select[name=drugType]", { label: "Paracetamol" });
  await page.fill("input[name=expiration]", "2026-12-31");

  await page.click("text=Create Unit");

  const uuid = await page.locator("data-testid=unit-uuid").innerText();

  expect(uuid).toBeTruthy();

  // ---------------- PHARMACY FLOW ----------------
  await page.goto("http://localhost:3000/login");

  await page.fill("input[name=email]", "pharma@test.com");
  await page.fill("input[name=password]", "123456");
  await page.click("button[type=submit]");

  await expect(page).toHaveURL(/dashboard\/pharmacy/);

  // Receive / Transfer Unit
  await page.fill("input[name=uuid]", uuid);
  await page.fill("input[name=citizenId]", "citizen123");

  await page.click("text=Transfer");

  await expect(page.locator("text=Transfer successful")).toBeVisible();

  // ---------------- CITIZEN FLOW ----------------
  await page.goto("http://localhost:3000/verify");

  await page.fill("input[name=uuid]", uuid);
  await page.click("text=Verify");

  await expect(page.locator("text=Paracetamol")).toBeVisible();
  await expect(page.locator("text=City Pharmacy")).toBeVisible();

});