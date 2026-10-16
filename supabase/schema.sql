-- ============================================================================
-- Lean Club · 全球薄肌俱乐部 —— Supabase / PostgreSQL schema（预留，MVP 未启用）
--
-- 启用步骤：
--   1) Supabase 控制台 → SQL Editor → 粘贴本文件并执行
--   2) .env.local 写入 NEXT_PUBLIC_DATA_SOURCE=supabase
--                      NEXT_PUBLIC_SUPABASE_URL=...
--                      NEXT_PUBLIC_SUPABASE_ANON_KEY=...
--   3) pnpm add @supabase/supabase-js
--   4) 在 src/lib/data/supabase.ts 内用 supabase-js 实现同名函数（签名已对齐）
-- ============================================================================

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------- 高校 / 城市战队
create table if not exists public.campuses (
  id            text primary key,                -- must / hku / xjtl ...
  name          text not null,                   -- 简体校名
  name_en       text not null,
  short_name    text not null,                   -- MUST / HKU
  city          text not null,
  country       text not null,
  member_count  integer not null default 0,
  checkin_count integer not null default 0,
  created_at    timestamptz not null default now()
);

-- ---------------------------------------------------------------- 用户
create type public.pass_tier as enum ('founder', 'gold', 'silver', 'bronze');

create table if not exists public.users (
  id           uuid primary key default gen_random_uuid(),
  auth_uid     uuid unique references auth.users (id) on delete set null,
  display_name text not null,
  campus_id    text not null references public.campuses (id),
  city         text,
  pass_tier    public.pass_tier,
  pass_serial  text,
  pass_issued_at timestamptz,
  joined_at    timestamptz not null default now()
);

create index if not exists users_campus_idx on public.users (campus_id);

-- ---------------------------------------------------------------- 排行榜席位
create table if not exists public.leaderboard_entries (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.users (id) on delete cascade,
  season       text not null default '2026Q4',
  lean_index   smallint not null check (lean_index between 0 and 100),
  checkin_days smallint not null default 0,
  streak       smallint not null default 0,
  updated_at   timestamptz not null default now(),
  unique (user_id, season)
);

create index if not exists leaderboard_season_index_idx
  on public.leaderboard_entries (season, lean_index desc);

-- ---------------------------------------------------------------- 21 天打卡
create type public.checkin_status as enum ('pending', 'approved', 'rejected');

create table if not exists public.challenge_checkins (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid not null references public.users (id) on delete cascade,
  season           text not null default '2026Q4',
  day              smallint not null check (day between 1 and 21),
  checkin_date     date not null,
  required_gesture text not null,                -- 当日系统下发的动态口令
  media_path       text,                         -- Storage 路径（已打码版本）
  masked           boolean not null default true,
  status           public.checkin_status not null default 'pending',
  approves         integer not null default 0,
  reports          integer not null default 0,
  submitted_at     timestamptz not null default now(),
  unique (user_id, season, day)                  -- 每天只能提交一次
);

create index if not exists checkins_season_day_idx
  on public.challenge_checkins (season, day, status);

-- ---------------------------------------------------------------- 全民监督投票
create table if not exists public.peer_review_votes (
  id          uuid primary key default gen_random_uuid(),
  checkin_id  uuid not null references public.challenge_checkins (id) on delete cascade,
  reviewer_id uuid not null references public.users (id) on delete cascade,
  verdict     text not null check (verdict in ('approve', 'report')),
  reasons     text[] default '{}',               -- ai_generated / lighting_unnatural ...
  created_at  timestamptz not null default now(),
  unique (checkin_id, reviewer_id)               -- 同一打卡每人只能投一次
);

create index if not exists votes_checkin_idx on public.peer_review_votes (checkin_id);

-- ---------------------------------------------------------------- 订单（聚合支付预留）
create type public.order_status as enum ('created', 'pending', 'paid', 'refunded', 'failed');

create table if not exists public.payment_orders (
  order_id       text primary key,               -- LC-xxxx
  user_id        uuid not null references public.users (id) on delete cascade,
  sku            text not null check (sku in ('leaderboard_ticket_9_9', 'challenge_deposit_100')),
  amount_cents   integer not null,
  currency       char(3) not null default 'CNY',
  gateway        text not null check (gateway in ('yunshanfu', 'wechat', 'alipay')),
  gateway_txn_id text,                           -- 支付网关流水号（回调写入）
  status         public.order_status not null default 'created',
  split_ip       smallint not null default 40,   -- 40% IP / 合作方
  split_platform smallint not null default 40,   -- 40% 平台技术
  split_chapter  smallint not null default 20,   -- 20% 各地高校分会长活动基金
  created_at     timestamptz not null default now(),
  paid_at        timestamptz,
  refunded_at    timestamptz
);

create index if not exists orders_user_idx on public.payment_orders (user_id, created_at desc);

-- ---------------------------------------------------------------- RLS（行级安全）
-- MVP 阶段用匿名读 + 服务端写入；正式上线前请按需收紧。
alter table public.campuses            enable row level security;
alter table public.users               enable row level security;
alter table public.leaderboard_entries enable row level security;
alter table public.challenge_checkins  enable row level security;
alter table public.peer_review_votes   enable row level security;
alter table public.payment_orders      enable row level security;

drop policy if exists "campuses are public" on public.campuses;
create policy "campuses are public"
  on public.campuses for select using (true);

drop policy if exists "leaderboard is public" on public.leaderboard_entries;
create policy "leaderboard is public"
  on public.leaderboard_entries for select using (true);

-- 打卡与订单：默认仅 service_role 可读写（客户端经 Route Handler 访问）。

-- ---------------------------------------------------------------- 种子数据
insert into public.campuses (id, name, name_en, short_name, city, country, member_count, checkin_count)
values
  ('must', '澳门科技大学',   'Macau University of Science and Technology', 'MUST',  '澳门', '中国澳门', 1286, 18422),
  ('hku',  '香港大学',       'The University of Hong Kong',                'HKU',   '香港', '中国香港', 1204, 17988),
  ('xjtl', '西交利物浦大学', 'Xi''an Jiaotong-Liverpool University',       'XJTLU', '苏州', '中国',      986, 13240),
  ('unnc', '宁波诺丁汉大学', 'University of Nottingham Ningbo China',      'UNNC',  '宁波', '中国',      742,  9860),
  ('cuhk', '香港中文大学',   'The Chinese University of Hong Kong',        'CUHK',  '香港', '中国香港',   668,  8412),
  ('um',   '澳门大学',       'University of Macau',                        'UM',    '澳门', '中国澳门',   594,  7180)
on conflict (id) do nothing;
