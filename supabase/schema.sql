-- ============================================================
-- BeLessStupid — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ── DECISIONS TABLE ──────────────────────────────────────────
create table if not exists public.decisions (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references auth.users(id) on delete cascade not null,

  -- Decision metadata
  category_id         text not null,
  category_label      text not null,
  mode                text not null check (mode in ('quick', 'guided')),
  decision_text       text not null,

  -- Full audit data (stored as JSONB for flexibility)
  intake_answers      jsonb default '{}'::jsonb,
  selected_model_ids  text[] default '{}',
  model_answers       jsonb default '{}'::jsonb,
  insights            jsonb default '{}'::jsonb,

  -- Memo output
  recommendation      text,
  confidence          text,
  bet_size            text,
  memo                jsonb,

  -- Timestamps
  created_at          timestamptz default now() not null,
  updated_at          timestamptz default now() not null
);

-- ── ROW LEVEL SECURITY ────────────────────────────────────────
-- Users can only see their own decisions
alter table public.decisions enable row level security;

create policy "Users see own decisions"
  on public.decisions for select
  using (auth.uid() = user_id);

create policy "Users insert own decisions"
  on public.decisions for insert
  with check (auth.uid() = user_id);

create policy "Users update own decisions"
  on public.decisions for update
  using (auth.uid() = user_id);

create policy "Users delete own decisions"
  on public.decisions for delete
  using (auth.uid() = user_id);

-- ── AUTO-UPDATE updated_at ─────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger decisions_updated_at
  before update on public.decisions
  for each row execute procedure public.handle_updated_at();

-- ── INDEXES ───────────────────────────────────────────────────
create index decisions_user_id_idx on public.decisions(user_id);
create index decisions_created_at_idx on public.decisions(created_at desc);


-- ============================================================
-- STAGE 4 ADDITIONS — Credits & Payments
-- Run this in Supabase SQL Editor after the initial schema
-- ============================================================

-- ── USER CREDITS ──────────────────────────────────────────────
create table if not exists public.user_credits (
  id               uuid default gen_random_uuid() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null unique,
  credits          integer not null default 0 check (credits >= 0),
  total_purchased  integer not null default 0,
  total_used       integer not null default 0,
  created_at       timestamptz default now() not null,
  updated_at       timestamptz default now() not null
);

alter table public.user_credits enable row level security;

create policy "Users read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

create policy "Users update own credits"
  on public.user_credits for update
  using (auth.uid() = user_id);

-- Service role can insert/update (used by API routes)
create policy "Service role manages credits"
  on public.user_credits for all
  using (true)
  with check (true);

create trigger user_credits_updated_at
  before update on public.user_credits
  for each row execute procedure public.handle_updated_at();

-- ── PAYMENT HISTORY ───────────────────────────────────────────
create table if not exists public.payment_history (
  id                    uuid default gen_random_uuid() primary key,
  user_id               uuid references auth.users(id) on delete cascade not null,
  razorpay_order_id     text not null,
  razorpay_payment_id   text,
  pack_id               text not null,
  pack_name             text not null,
  credits_purchased     integer not null,
  amount_paise          integer not null,   -- store in paise (₹1 = 100 paise)
  currency              text not null default 'INR',
  status                text not null default 'pending'
                          check (status in ('pending','paid','failed')),
  created_at            timestamptz default now() not null,
  updated_at            timestamptz default now() not null
);

alter table public.payment_history enable row level security;

create policy "Users read own payments"
  on public.payment_history for select
  using (auth.uid() = user_id);

create policy "Service role manages payments"
  on public.payment_history for all
  using (true)
  with check (true);

create trigger payment_history_updated_at
  before update on public.payment_history
  for each row execute procedure public.handle_updated_at();

create index payment_history_user_id_idx on public.payment_history(user_id);

-- ── AUTO-GRANT FREE CREDITS ON SIGNUP ────────────────────────
-- Trigger fires when a new user is created in auth.users
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_credits (user_id, credits, total_purchased, total_used)
  values (new.id, 2, 0, 0)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();


-- ============================================================
-- Stage 4 — Credits System
-- Run this in Supabase SQL Editor after the initial schema
-- ============================================================

-- ── USER CREDITS TABLE ────────────────────────────────────────
create table if not exists public.user_credits (
  id           uuid default gen_random_uuid() primary key,
  user_id      uuid references auth.users(id) on delete cascade not null unique,
  credits      integer default 3 not null check (credits >= 0),  -- 3 free on signup
  total_bought integer default 0 not null,
  updated_at   timestamptz default now() not null
);

alter table public.user_credits enable row level security;

create policy "Users read own credits"
  on public.user_credits for select
  using (auth.uid() = user_id);

create policy "Users insert own credits"
  on public.user_credits for insert
  with check (auth.uid() = user_id);

-- ── PAYMENTS TABLE ────────────────────────────────────────────
create table if not exists public.payments (
  id                  uuid default gen_random_uuid() primary key,
  user_id             uuid references auth.users(id) on delete cascade not null,
  razorpay_order_id   text not null,
  razorpay_payment_id text,
  pack_id             text not null,   -- "single" | "five" | "ten"
  credits             integer not null,
  amount_paise        integer not null, -- amount in paise (₹299 = 29900)
  status              text default 'created' check (status in ('created','paid','failed')),
  created_at          timestamptz default now() not null
);

alter table public.payments enable row level security;

create policy "Users read own payments"
  on public.payments for select
  using (auth.uid() = user_id);

create policy "Users insert own payments"
  on public.payments for insert
  with check (auth.uid() = user_id);

-- ── AUTO-CREATE CREDITS ON SIGNUP ─────────────────────────────
-- Trigger: when a new user signs up, give them 3 free credits
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_credits (user_id, credits)
  values (new.id, 3)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Index
create index if not exists payments_user_id_idx on public.payments(user_id);
