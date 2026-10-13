-- FinançasPessoaisAPP — schema + Row Level Security
-- Rode este arquivo no SQL Editor do Supabase.

create type public.transaction_type as enum ('income', 'expense');

create table public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  description text not null check (char_length(description) between 1 and 120),
  amount numeric(12, 2) not null check (amount > 0),
  date date not null,
  type public.transaction_type not null,
  category text not null,
  created_at timestamptz not null default now()
);

create index transactions_user_date_idx on public.transactions (user_id, date desc);

alter table public.transactions enable row level security;

create policy "own transactions: select"
  on public.transactions for select
  using (auth.uid() = user_id);

create policy "own transactions: insert"
  on public.transactions for insert
  with check (auth.uid() = user_id);

create policy "own transactions: update"
  on public.transactions for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "own transactions: delete"
  on public.transactions for delete
  using (auth.uid() = user_id);
