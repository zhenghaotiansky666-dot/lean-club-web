import { expect, test } from "@playwright/test";

const SHOTS = "screenshots";

test.describe("Lean Club MVP 冒烟测试", () => {
  test("1. 首页：品牌 / 标语 / 三个页签 / 数据条", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Lean Club/);
    await expect(page.getByText("LEAN CLUB", { exact: true })).toBeVisible();
    await expect(page.getByText("Global Rank & Proof of Work").first()).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "高校榜单" }).first()).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "21 天挑战" }).first()).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "关于我们" }).first()).toBeVisible();
    await expect(page.getByText("已接入高校").first()).toBeVisible();
    await expect(page.getByText("实时榜单速览").first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/home.png`, fullPage: true });
  });

  test("2. 排行榜：个人榜 + 高校 PK 与 #1 Lean Campus", async ({ page }) => {
    await page.goto("/leaderboard");
    const rows = page.locator("table tbody tr");
    await expect(rows.first()).toBeVisible();
    expect(await rows.count()).toBeGreaterThanOrEqual(10);
    await expect(page.getByText("澳门科技大学").first()).toBeVisible();
    await expect(page.getByText("香港大学").first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/leaderboard-personal.png`, fullPage: true });

    await page.getByRole("tab", { name: "高校战队 PK" }).click();
    await expect(page.getByText("#1 Lean Campus").first()).toBeVisible();
    await expect(page.getByText("西交利物浦大学").first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/leaderboard-campus.png`, fullPage: true });
  });

  test("3. 9.9 元解锁：弹窗 → 模拟支付 → 席位出现且刷新不丢", async ({ page }) => {
    await page.goto("/leaderboard");
    await page.getByRole("button", { name: /加入排行榜/ }).click();

    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    await expect(dialog.getByText("解锁全球排名席位")).toBeVisible();
    await expect(dialog.getByText("¥9.90")).toBeVisible();
    await expect(dialog.getByText("云闪付")).toBeVisible();
    await expect(dialog.getByText("微信支付")).toBeVisible();
    await expect(dialog.getByText("支付宝")).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/unlock-dialog.png` });

    await dialog.getByRole("button", { name: /模拟支付/ }).click();
    await expect(dialog.getByText("席位已解锁")).toBeVisible();
    await expect(dialog.getByText(/LC-/)).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/unlock-paid.png` });
    await dialog.getByRole("button", { name: "完成" }).click();

    await expect(page.getByText("YOUR SEAT").first()).toBeVisible();
    await expect(page.getByText("我的席位已解锁")).toBeVisible();
    await page.reload();
    await expect(page.getByText("YOUR SEAT").first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/leaderboard-unlocked.png`, fullPage: true });
  });

  test("4. 21 天挑战：进度 / 今日口令 / 全民监督与举报弹窗", async ({ page }) => {
    await page.goto("/challenge");
    await expect(page.getByText(/已坚持 7 \/ 21/)).toBeVisible();
    await expect(page.getByText("今日动态口令")).toBeVisible();
    await expect(page.getByText("全民监督 · 待审核打卡")).toBeVisible();
    await expect(page.getByRole("button", { name: /疑点举报/ }).first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/challenge.png`, fullPage: true });

    await page.getByRole("button", { name: /疑点举报/ }).first().click();
    const dialog = page.getByRole("dialog");
    await expect(dialog.getByText("举报疑点")).toBeVisible();
    await expect(dialog.getByText("疑似 AI 生成 / 换脸痕迹")).toBeVisible();
    await expect(dialog.getByText("光影不自然，疑似翻拍或合成")).toBeVisible();
    await expect(dialog.getByText("视频中未出现当日指定手势 / 口令")).toBeVisible();
    await expect(dialog.getByText(/分享被罚没押金/).first()).toBeVisible();
    await page.screenshot({ path: `${SHOTS}/report-dialog.png` });
  });

  test("5. API：/api/checkout 返回订单与 40/40/20 分润", async ({ request }) => {
    const res = await request.post("/api/checkout", {
      data: { sku: "leaderboard_ticket_9_9", gateway: "wechat", userId: "u-self" },
    });
    expect(res.status()).toBe(201);
    const order = await res.json();
    expect(order.orderId).toMatch(/^LC-/);
    expect(order.gateway).toBe("wechat");
    expect(order.amountCents).toBe(990);
    expect(order.split).toEqual({ ip: 40, platform: 40, chapterFund: 20 });
    expect(order.status).toBe("created");

    const confirm = await request.post("/api/checkout/confirm", {
      data: { orderId: order.orderId },
    });
    expect(confirm.status()).toBe(200);
    const paid = await confirm.json();
    expect(paid.status).toBe("paid");
    expect(paid.lineItems.label).toContain("排行榜");
  });
});
