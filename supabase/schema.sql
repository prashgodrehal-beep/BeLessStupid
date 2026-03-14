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
