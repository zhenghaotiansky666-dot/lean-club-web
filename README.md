# Lean Club · 全球薄肌俱乐部（Web MVP）

暗黑黑金风格的全球高校薄肌社群平台 MVP：**9.9 元全球排行榜** + **21 天自律执行力对赌（全民监督）**。
本仓库是 Phase 1–4 的完整纯前端可跑版本：界面、交互、类型、API 与数据层全就绪，数据使用型别化 Mock，
并预留 Supabase 与聚合支付接口。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 前端 | Next.js 16（App Router）+ React 19 + TypeScript（strict） |
| 样式 | Tailwind CSS v4 + shadcn/ui（Base UI 原语）+ Lucide Icons |
| 数据 | `src/lib/data` 数据访问层；`NEXT_PUBLIC_DATA_SOURCE=mock｜supabase` 切换 |
| 后端 | Next.js Route Handlers（`/api/checkout*`、`/api/checkins*`） |
| 测试 | Playwright 冒烟测试 + `next build` 类型检查 |

## 本机运行（注意：本机没有系统 Node）

这台机器没有系统级 Node.js（无 Homebrew / nvm），但 Codex 运行时自带 Node v24 与 pnpm。
**所有命令前先导出它自带的 Node 路径：**

```bash
export PATH="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin:$PATH"

pnpm install          # 首次
pnpm dev              # http://localhost:3000
pnpm build            # 生产构建（含 TypeScript 检查）
pnpm start            # 运行生产构建
pnpm lint             # ESLint
pnpm test:e2e         # Playwright 冒烟测试（自动 build + start）
```

首次跑 Playwright 需下载 Chromium（约 150MB）：

```bash
pnpm exec playwright install chromium
```

## 页面与路由

| 路径 | 内容 |
| --- | --- |
| `/` | Hero（品牌 / 标语 / 双 CTA）、四项数据条、实时榜单速览、Top 1 战队、两条赛事入口、三重防作弊 |
| `/leaderboard` | 个人 Flex 榜（排名 / 薄肌指数 / 打卡 / Pass）+ 高校战队 PK 榜（#1 Lean Campus 认证）+ 9.9 元解锁弹窗 |
| `/challenge` | 21 天进度与日历、今日动态口令、打卡上传（自动打码占位）、全民监督审核卡与举报弹窗、线下背书提示、押金缴纳 |
| `/about` | 品牌故事、高校分会、赛制规则、40/40/20 收益分配、Roadmap |
| `POST /api/checkout` | 创建订单（9.9 门票 / 100 押金），返回 `orderId`、`gateway`、`split` |
| `POST /api/checkout/confirm` | 模拟支付成功（真实环境改为网关回调 + 验签） |
| `POST /api/checkins` | 提交当日打卡 |
| `POST /api/checkins/vote` | 全民监督投票（通过 / 举报，举报需带疑点原因） |

## 数据层与 Supabase 切换

`src/lib/data/index.ts` 是唯一入口，按 `NEXT_PUBLIC_DATA_SOURCE` 选择实现：

- **mock（默认）**：`src/lib/data/mock.ts`，无需密钥即可跑通全部交互；读取函数带 `"use cache"`，
  以配合 Next 16 的 Cache Components。
- **supabase（预留）**：`src/lib/data/supabase.ts` + `supabase/schema.sql`。未配置密钥时自动回退
  mock 并在服务端打印提醒。

启用真实数据库：

```bash
cp .env.example .env.local                 # 填 URL / anon key，并设 NEXT_PUBLIC_DATA_SOURCE=supabase
# 在 Supabase SQL Editor 执行 supabase/schema.sql
pnpm add @supabase/supabase-js             # 再在 src/lib/data/supabase.ts 用 supabase-js 实现同名函数
```

写操作（`src/lib/data/mutations.ts`）只由 Route Handler 调用，客户端一律走 API，避免把服务端数据层
打进浏览器包。

## 设计系统

- 背景 `#000000`、面板 `#121212`、边框 `#1F1F1F`、高亮电光绿 `#00FF66`、文字 `#FFFFFF` / `#A0A0A0`
- 令牌集中在 `src/app/globals.css`（shadcn 变量 + 自定义 `lc-*` 工具类）
- 界面文案集中在 `src/lib/copy.ts`（简体中文），便于日后接 i18n
- 数字统一等宽字体 + `tabular-nums`

## 部署（Vercel）

1. 推到 GitHub，在 Vercel 导入（自动识别 Next.js）。
2. 环境变量：`NEXT_PUBLIC_DATA_SOURCE`（默认 `mock`）；接 Supabase 时再加 `NEXT_PUBLIC_SUPABASE_URL`、
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`。
3. 构建命令保持 `pnpm build` 即可。

## MVP 边界（当前为演示环境）

- 支付为**纯模拟**：只产出订单对象与 40/40/20 分润字段，不接真实通道、不产生真实扣款。
- 无登录 / 无文件上传：打卡媒体与头像均为 CSS 生成占位，并叠加「已自动打码」遮罩。
- 解锁状态存浏览器 `localStorage`（key：`leanclub.unlock`），刷新不丢失，清除后回到未解锁。
- 未接入视频自动打码、相似素材查重、部长后台与线下签到（见 `/about` Roadmap）。
