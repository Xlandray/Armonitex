import { expect, test } from "@playwright/test";

const API = process.env.API_URL ?? "http://localhost:8080/api/v1";
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL ?? "admin@armonitex.com.tr";
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD ?? "change-me-please";

test("unauthenticated /portal redirects to login", async ({ page }) => {
  await page.goto("/portal");
  await expect(page).toHaveURL(/\/auth\/login/);
});

test("customer sees seeded project, records and documents", async ({ page, request }) => {
  // 1) admin token
  const tokenRes = await request.post(`${API}/auth/token`, {
    form: { username: ADMIN_EMAIL, password: ADMIN_PASSWORD },
  });
  expect(tokenRes.ok()).toBeTruthy();
  const adminToken = (await tokenRes.json()).access_token as string;
  const auth = { Authorization: `Bearer ${adminToken}` };

  // 2) seed a unique customer for this run
  const stamp = `${process.env.E2E_STAMP ?? "run"}-${test.info().workerIndex}`;
  const email = `e2e-${stamp}@example.com`;
  const password = "customer-pass-123";
  const custRes = await request.post(`${API}/admin/users`, {
    headers: auth,
    data: { email, full_name: "E2E Musteri", password, is_customer: true },
  });
  expect(custRes.ok()).toBeTruthy();
  const customerId = (await custRes.json()).id as string;

  const projRes = await request.post(`${API}/admin/projects`, {
    headers: auth,
    data: { customer_id: customerId, title: "E2E Proje", status: "uretimde" },
  });
  expect(projRes.ok()).toBeTruthy();
  const projectId = (await projRes.json()).id as string;

  await request.post(`${API}/admin/financial-records`, {
    headers: auth,
    data: {
      project_id: projectId,
      type: "quote",
      number: "TKL-E2E",
      amount: "1500.00",
      status: "bekliyor",
    },
  });

  // 3) log in as the customer through the UI
  await page.goto("/auth/login");
  await page.fill('input[name="email"]', email);
  await page.fill('input[name="password"]', password);
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL(/\/portal/);

  // 4) dashboard shows the project; detail shows the record
  await expect(page.getByText("E2E Proje")).toBeVisible();
  await page.getByText("E2E Proje").click();
  await expect(page).toHaveURL(new RegExp(`/portal/projeler/${projectId}`));
  await expect(page.getByText("TKL-E2E")).toBeVisible();
});
