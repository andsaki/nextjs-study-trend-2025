import { test, expect } from "@playwright/test";

/**
 * Todo作成フローのE2Eテスト
 */
test.describe("Todo Creation Flow", () => {
  test.beforeEach(async ({ page }) => {
    // Todoリストページに移動
    await page.goto("/todos");
    await page.waitForLoadState("networkidle");
  });

  test("should navigate to create page and create a new todo", async ({ page }) => {
    // 新規作成ボタンをクリック
    await page.click('button:has-text("新規作成")');

    // 作成ページに遷移したことを確認
    await expect(page).toHaveURL(/\/todos\/new/);
    await expect(page.locator("h1")).toContainText("新しいTodoを作成");

    // フォームに入力
    const timestamp = Date.now();
    await page.fill('input[id="title"]', `E2Eテスト Todo ${timestamp}`);
    await page.fill(
      'textarea[id="description"]',
      "Playwrightで作成されたテストTodoです"
    );
    await page.selectOption('select[id="priority"]', "high");

    // 作成ボタンをクリック
    await page.click('button[type="submit"]:has-text("作成")');

    // 詳細ページに遷移したことを確認（最大10秒待機）
    await page.waitForURL(/\/todos\/[^/]+$/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // 作成したTodoの内容が表示されていることを確認
    await expect(page.locator("h1")).toContainText(`E2Eテスト Todo ${timestamp}`, { timeout: 10000 });
    await expect(page.locator("text=Playwrightで作成されたテストTodoです")).toBeVisible();
    await expect(page.locator("text=優先度: 高")).toBeVisible();
    await expect(page.locator("text=未完了")).toBeVisible();
  });

  test("should show validation error when title is empty", async ({ page }) => {
    // 新規作成ページに移動
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");

    // タイトルを空のまま作成ボタンをクリック
    await page.click('button[type="submit"]:has-text("作成")');

    // バリデーションエラーが表示されることを確認
    await expect(page.locator("text=タイトルは必須です")).toBeVisible();

    // URLが変わっていないことを確認（遷移していない）
    await expect(page).toHaveURL(/\/todos\/new/);
  });

  test("should create todo with minimum required fields", async ({ page }) => {
    // 新規作成ページに移動
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");

    // タイトルだけ入力
    const timestamp = Date.now();
    await page.fill('input[id="title"]', `最小限のTodo ${timestamp}`);

    // 作成ボタンをクリック
    await page.click('button[type="submit"]:has-text("作成")');

    // 詳細ページに遷移
    await page.waitForURL(/\/todos\/[^/]+$/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // タイトルが表示されていることを確認
    await expect(page.locator("h1")).toContainText(`最小限のTodo ${timestamp}`, { timeout: 10000 });
  });

  test("should cancel creation and return to list", async ({ page }) => {
    // 新規作成ページに移動
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");

    // フォームに入力
    await page.fill('input[id="title"]', "キャンセルされるTodo");

    // キャンセルボタンをクリック
    await page.click('button:has-text("キャンセル")');

    // 一覧ページに戻ったことを確認
    await expect(page).toHaveURL("/todos");
  });

  test("should navigate back to list using breadcrumb", async ({ page }) => {
    // 新規作成ページに移動
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");

    // パンくずリストで「Todo管理」をクリック
    await page.click('nav[aria-label="ページナビゲーション"] a:has-text("Todo管理")');

    // 一覧ページに戻ったことを確認
    await expect(page).toHaveURL("/todos");
  });

  test("should create todo and verify it appears in list", async ({ page }) => {
    const timestamp = Date.now();
    const todoTitle = `リスト確認用Todo ${timestamp}`;

    // 新規作成ページに移動
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");

    // Todoを作成
    await page.fill('input[id="title"]', todoTitle);
    await page.selectOption('select[id="priority"]', "medium");
    await page.click('button[type="submit"]:has-text("作成")');

    // 詳細ページから一覧に戻る
    await page.click('button:has-text("一覧に戻る")');
    await expect(page).toHaveURL("/todos");
    await page.waitForLoadState("networkidle");

    // 作成したTodoがリストに表示されていることを確認
    await expect(page.locator(`text=${todoTitle}`)).toBeVisible();
  });

  test("should create todo and toggle completion", async ({ page }) => {
    const timestamp = Date.now();
    const todoTitle = `完了テスト用Todo ${timestamp}`;

    // Todoを作成
    await page.goto("/todos/new");
    await page.waitForLoadState("networkidle");
    await page.fill('input[id="title"]', todoTitle);
    await page.click('button[type="submit"]:has-text("作成")');

    // 詳細ページに遷移するのを待つ
    await page.waitForURL(/\/todos\/[^/]+$/, { timeout: 10000 });
    await page.waitForLoadState("networkidle");

    // 詳細ページで未完了状態を確認
    await expect(page.locator("text=未完了")).toBeVisible({ timeout: 10000 });

    // チェックボックスをクリックして完了にする
    await page.click('button[aria-label*="完了"]');

    // 完了状態になったことを確認
    await page.waitForTimeout(500); // 更新を待つ
    await expect(page.locator("text=完了")).toBeVisible();
  });
});
