# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e\mscb.spec.js >> Full MSCB Flow
- Location: tests\e2e\mscb.spec.js:3:5

# Error details

```
Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
Call log:
  - navigating to "http://localhost:3000/login", waiting until "load"

```

# Test source

```ts
  1  | import { test, expect } from "@playwright/test";
  2  | 
  3  | test("Full MSCB Flow", async ({ page }) => {
  4  | 
  5  |   // ---------------- GOV FLOW ----------------
> 6  |   await page.goto("http://localhost:3000/login");
     |              ^ Error: page.goto: net::ERR_CONNECTION_REFUSED at http://localhost:3000/login
  7  | 
  8  |   await page.fill("input[name=email]", "gov@test.com");
  9  |   await page.fill("input[name=password]", "123456");
  10 |   await page.click("button[type=submit]");
  11 | 
  12 |   await expect(page).toHaveURL(/dashboard\/gov/);
  13 | 
  14 |   // Create Drug Type
  15 |   await page.click("text=Drug Types");
  16 |   await page.click("text=Register Drug Type");
  17 | 
  18 |   await page.fill("input[name=name]", "Paracetamol");
  19 |   await page.fill("input[name=description]", "Painkiller");
  20 |   await page.click("text=Create");
  21 | 
  22 |   await expect(page.locator("text=Paracetamol")).toBeVisible();
  23 | 
  24 |   // Issue License
  25 |   await page.click("text=Licenses");
  26 |   await page.click("text=Issue License");
  27 | 
  28 |   await page.selectOption("select[name=drugType]", { label: "Paracetamol" });
  29 |   await page.selectOption("select[name=manufacturer]", { label: "PharmaCorp" });
  30 |   await page.click("text=Issue");
  31 | 
  32 |   await expect(page.locator("text=VALID")).toBeVisible();
  33 | 
  34 |   // ---------------- MANUFACTURER FLOW ----------------
  35 |   await page.goto("http://localhost:3000/login");
  36 | 
  37 |   await page.fill("input[name=email]", "mfr@test.com");
  38 |   await page.fill("input[name=password]", "123456");
  39 |   await page.click("button[type=submit]");
  40 | 
  41 |   await expect(page).toHaveURL(/dashboard\/manufacturer/);
  42 | 
  43 |   // Create Unit
  44 |   await page.selectOption("select[name=drugType]", { label: "Paracetamol" });
  45 |   await page.fill("input[name=expiration]", "2026-12-31");
  46 | 
  47 |   await page.click("text=Create Unit");
  48 | 
  49 |   const uuid = await page.locator("data-testid=unit-uuid").innerText();
  50 | 
  51 |   expect(uuid).toBeTruthy();
  52 | 
  53 |   // ---------------- PHARMACY FLOW ----------------
  54 |   await page.goto("http://localhost:3000/login");
  55 | 
  56 |   await page.fill("input[name=email]", "pharma@test.com");
  57 |   await page.fill("input[name=password]", "123456");
  58 |   await page.click("button[type=submit]");
  59 | 
  60 |   await expect(page).toHaveURL(/dashboard\/pharmacy/);
  61 | 
  62 |   // Receive / Transfer Unit
  63 |   await page.fill("input[name=uuid]", uuid);
  64 |   await page.fill("input[name=citizenId]", "citizen123");
  65 | 
  66 |   await page.click("text=Transfer");
  67 | 
  68 |   await expect(page.locator("text=Transfer successful")).toBeVisible();
  69 | 
  70 |   // ---------------- CITIZEN FLOW ----------------
  71 |   await page.goto("http://localhost:3000/verify");
  72 | 
  73 |   await page.fill("input[name=uuid]", uuid);
  74 |   await page.click("text=Verify");
  75 | 
  76 |   await expect(page.locator("text=Paracetamol")).toBeVisible();
  77 |   await expect(page.locator("text=City Pharmacy")).toBeVisible();
  78 | 
  79 | });
```