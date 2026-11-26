// @ts-check
const { test, expect } = require("@playwright/test");

test.describe("Kaamzo Live Production & Auth E2E Suite", () => {
  test("1. Homepage renders cleanly with zero runtime JS errors or mojibake", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1800);

    const bodyText = await page.locator("body").innerText();
    expect(bodyText).toContain("Ghar ka kaam");
    expect(bodyText).toContain("Kaamzo ke naam");
    expect(bodyText).not.toContain("à¨");
    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  });

  test("2. API security contracts: accounts blocked, KYC & job OTPs redacted, OTP send/verify single-use", async ({
    request,
  }) => {
    // Accounts collection list must be blocked
    const accRes = await request.get("/api/db?collection=accounts");
    expect(accRes.status()).toBe(403);

    // Public jobs list must redact otpCode / endOtpCode
    const jobsRes = await request.get("/api/db?collection=jobs");
    expect(jobsRes.status()).toBe(200);
    const jobsData = await jobsRes.json();
    for (const job of jobsData.items || []) {
      expect(job.otpCode).toBeUndefined();
      expect(job.endOtpCode).toBeUndefined();
    }

    // Public workers list must redact Aadhaar KYC photos & numbers
    const workersRes = await request.get("/api/db?collection=workers");
    expect(workersRes.status()).toBe(200);
    const workersData = await workersRes.json();
    for (const w of workersData.items || []) {
      expect(w.aadhaarNumber).toBeUndefined();
      expect(w.aadhaarFrontPhoto).toBeUndefined();
      expect(w.aadhaarBackPhoto).toBeUndefined();
    }

    // OTP send + wrong code reject + right code verify + replay reject
    const testEmail = `e2e.otp.${Date.now()}@example.com`;
    const sendRes = await request.post("/api/send-otp", {
      data: { email: testEmail, purpose: "email_verification", role: "customer" },
    });
    expect(sendRes.status()).toBe(200);
    const sendData = await sendRes.json();
    expect(sendData.success).toBe(true);
    expect(sendData.encryptedOtpToken).toBeTruthy();

    // Wrong code must fail
    const badVerify = await request.post("/api/verify-otp", {
      data: { email: testEmail, code: "000000", encryptedOtpToken: sendData.encryptedOtpToken },
    });
    expect(badVerify.status()).toBe(400);

    // If instant passkey returned (no external SMTP configured), verify single-use enforcement
    if (sendData.instantOtpCode) {
      const goodVerify = await request.post("/api/verify-otp", {
        data: {
          email: testEmail,
          code: String(sendData.instantOtpCode),
          encryptedOtpToken: sendData.encryptedOtpToken,
        },
      });
      expect(goodVerify.status()).toBe(200);
      const goodData = await goodVerify.json();
      expect(goodData.verified).toBe(true);

      // Replaying the same OTP token a second time must fail
      const replayVerify = await request.post("/api/verify-otp", {
        data: {
          email: testEmail,
          code: String(sendData.instantOtpCode),
          encryptedOtpToken: sendData.encryptedOtpToken,
        },
      });
      expect(replayVerify.status()).toBe(400);
    }
  });

  test("3. Full Customer Sign-Up + Mobile & Gmail OTP + Sign-Out + Sign-In roundtrip", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    const suffix = String(Date.now()).slice(-6);
    const testPhone = `9899${suffix}`;
    const testEmail = `kaamzo.e2e.${suffix}@gmail.com`;
    const testPass = "TestPass123!";
    const testName = `E2E Customer ${suffix}`;

    await page.goto("/register", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1200);

    // Choose Customer role
    await page.getByRole("button", { name: /I need a worker/i }).click();

    // Step 1: Name
    await page.locator('input[placeholder*="Rajesh Kumar"]').fill(testName);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 2: Phone + Mobile OTP Modal
    await page.locator('input[placeholder*="98140"]').fill(testPhone);
    await page.getByRole("button", { name: /Verify OTP/i }).click();
    const autoFillBtn = page.getByRole("button", { name: /Auto-Fill & Verify/i });
    await expect(autoFillBtn).toBeVisible({ timeout: 15_000 });
    await autoFillBtn.click();
    await expect(page.getByText("✓ OTP Verified")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 3: Email + Gmail OTP Modal
    await page.locator('input[placeholder="you@gmail.com"]').fill(testEmail);
    await page.getByRole("button", { name: /Send 6-digit OTP/i }).click();
    const emailAutoFill = page.getByRole("button", { name: /Auto-Fill & Verify/i });
    await expect(emailAutoFill).toBeVisible({ timeout: 15_000 });
    await emailAutoFill.click();
    await expect(page.getByText("✓ Verified")).toBeVisible({ timeout: 10_000 });
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 4: Area (already defaulted, click Continue)
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 5: UPI (optional for customer, set valid handle)
    await page.locator('input[placeholder*="@fam"]').fill(`${testPhone}@okaxis`);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 6: Password
    await page.locator('input[placeholder*="Minimum 4 characters"]').fill(testPass);
    await page.getByRole("button", { name: /Continue/i }).click();

    // Step 7: Review -> Submit
    await page.getByRole("button", { name: /Create my Kaamzo account/i }).click();
    await expect(page.getByText(/Welcome to Kaamzo/i)).toBeVisible({ timeout: 15_000 });

    // Navigate to Customer Portal
    await page.getByRole("button", { name: /Open Customer Portal/i }).click();
    await page.waitForTimeout(1000);
    expect(page.url()).toContain("/customer");

    // Sign out via Customer header button
    await page.locator('button[aria-label="Sign out"]').first().click();
    await page.waitForTimeout(1000);

    // Go back to /register -> Sign in mode -> test logging in with Phone + Password (even while leaving toggle on Worker to verify auto-role detection!)
    await page.goto("/register", { waitUntil: "load" });
    await page.getByRole("button", { name: /I want work/i }).waitFor({ state: "visible", timeout: 25_000 });
    await page.getByRole("button", { name: /^Sign in$/i }).click();
    await page.getByRole("button", { name: /^Worker$/i }).click();
    await page.locator('input[placeholder*="User ID, Mobile number, or Email"]').fill(testPhone);
    await page.locator('input[placeholder="Password"]').fill(testPass);
    await page.getByRole("button", { name: /Sign in →/i }).click();

    // Must auto-detect customer role and land on /customer
    await page.waitForURL(/\/customer/, { timeout: 15_000 });
    expect(page.url()).toContain("/customer");

    // Verify TopUtilityBar Sign out from homepage (/) works cleanly
    await page.goto("/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1000);
    const profileBtn = page.getByRole("button", { name: new RegExp(`E2E`, "i") }).first();
    if (await profileBtn.isVisible()) {
      await profileBtn.click();
      await page.getByRole("button", { name: /^Sign out$/i }).click();
      await page.waitForTimeout(600);
      await expect(page.getByRole("button", { name: /Sign in/i }).first()).toBeVisible();
    }

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  });

  test("4. Worker registration guards: tools check blocks users without tools", async ({ page }) => {
    const pageErrors = [];
    page.on("pageerror", (err) => pageErrors.push(err.message));

    await page.goto("/register", { waitUntil: "load" });
    await page.getByRole("button", { name: /I want work/i }).waitFor({ state: "visible", timeout: 25_000 });

    await page.getByRole("button", { name: /I want work/i }).click();
    await page.locator('input[placeholder*="Rajesh Kumar"]').fill("Ramesh Test Worker");
    await page.getByRole("button", { name: /Continue/i }).click();

    await page.locator('input[placeholder*="98140"]').fill("9814011223");
    await page.getByRole("button", { name: /Continue/i }).click();

    // Skip optional email
    await page.getByRole("button", { name: /Continue/i }).click();

    // Trade (Electrician default)
    await page.getByRole("button", { name: /Continue/i }).click();

    // Tools step: clicking "No — I need customer's tools" must show red alert and keep Continue disabled
    await page.getByRole("button", { name: /No — I need customer's tools/i }).click();
    await expect(page.getByRole("alert")).toContainText(/need your own tools/i);
    await expect(page.getByRole("button", { name: /Continue/i })).toBeDisabled();

    // Clicking "Yes — I bring my own full toolkit" enables Continue
    await page.getByRole("button", { name: /Yes — I bring my own full toolkit/i }).click();
    await expect(page.getByRole("button", { name: /Continue/i })).toBeEnabled();

    expect(pageErrors, `Uncaught page errors: ${pageErrors.join(" | ")}`).toEqual([]);
  });

  test("5. Payment gateway coupon bhavnoorsingh broadcasts free (₹0) while preserving worker payout", async ({
    request,
  }) => {
    const badCoupon = await request.post("/api/razorpay", {
      data: {
        action: "applyCouponPayment",
        jobId: `job_coupon_bad_${Date.now()}`,
        couponCode: "invalid_code",
        amountInr: 850,
      },
    });
    expect(badCoupon.status()).toBe(400);

    const goodCoupon = await request.post("/api/razorpay", {
      data: {
        action: "applyCouponPayment",
        jobId: `job_coupon_ok_${Date.now()}`,
        couponCode: "bhavnoorsingh",
        jobSnapshot: {
          title: "E2E Coupon Test Job",
          trade: "Electrician",
          dailyWage: 850,
          durationDays: 1,
          status: "broadcast",
        },
      },
    });
    expect(goodCoupon.status()).toBe(200);
    const data = await goodCoupon.json();
    expect(data.success).toBe(true);
    expect(data.couponApplied).toBe("bhavnoorsingh");
    expect(data.amountInr).toBe(0);
    expect(data.workerPayoutInr).toBe(850);
    expect(data.job.status).toBe("broadcast");
    expect(data.job.subsidizedByKaamzo).toBe(true);
    expect(data.job.workerPayout).toBe(850);
  });
});
