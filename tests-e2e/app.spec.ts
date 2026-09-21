import { expect, type Page, test } from "@playwright/test";

test.describe("main page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4321/");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("kinect-stretch");
  });

  test("has no debug controls", async ({ page }) => {
    await expectDebugControls({ page, visible: false });
  });

  test("has canvas with three.js engine", async ({ page }) => {
    await expectThreeCanvas({ page });
  });
});

test.describe("debug page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4321/debug");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("kinect-stretch - debug");
  });

  test("has debug controls", async ({ page }) => {
    await expectDebugControls({ page, visible: true });
  });

  test("has canvas with three.js engine", async ({ page }) => {
    await expectThreeCanvas({ page });
  });
});

test.describe("static page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("http://localhost:4321/static");
  });

  test("has title", async ({ page }) => {
    await expect(page).toHaveTitle("kinect-stretch - static");
  });

  test("has rendered scene", async ({ page }) => {
    await expectThreeCanvas({ page });
    await expect(page).toHaveScreenshot();
  });
});

async function expectThreeCanvas({ page }: { page: Page }): Promise<void> {
  const canvas = page.locator("canvas[data-engine]");
  await expect(canvas).toBeVisible();

  const engine = await canvas.evaluate((element) =>
    element.getAttribute("data-engine"),
  );
  await expect(engine).toBe("three.js r186");
}

async function expectDebugControls({
  page,
  visible,
}: {
  page: Page;
  visible: boolean;
}): Promise<void> {
  const container = page.locator(".container");
  await expect(container).toBeVisible();

  const firstChild = container.locator("> *").first();
  if (visible) {
    await expect(firstChild).toHaveClass(/^leva-/);
  } else {
    await expect(firstChild).not.toHaveClass(/^leva-/);
  }
}
