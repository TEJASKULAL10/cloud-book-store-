-- ==========================================
-- SUPABASE DATABASE & STORAGE SETUP SCRIPT
-- ==========================================
-- Run this script in your Supabase Dashboard:
-- SQL Editor > New query > Paste this code > Click "Run"

-- 1. Create the 'books' database table
create table if not exists public.books (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  author text not null,
  category text not null,
  description text not null,
  file_name text not null,
  file_type text not null,
  file_size bigint not null,
  file_url text not null,
  storage_path text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Enable Row Level Security (RLS) on 'books'
alter table public.books enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Users can view their own books" on public.books;
drop policy if exists "Users can insert their own books" on public.books;
drop policy if exists "Users can delete their own books" on public.books;

-- Create RLS policies for 'books' table
create policy "Users can view their own books"
  on public.books for select
  using (auth.uid() = user_id);

create policy "Users can insert their own books"
  on public.books for insert
  with check (auth.uid() = user_id);

create policy "Users can delete their own books"
  on public.books for delete
  using (auth.uid() = user_id);

-- 3. Storage Policies
drop policy if exists "Allow public reads from books bucket" on storage.objects;
drop policy if exists "Allow uploads to books bucket" on storage.objects;
drop policy if exists "Allow deletes from books bucket" on storage.objects;

create policy "Allow public reads from books bucket"
  on storage.objects for select
  using (bucket_id = 'books');

create policy "Allow uploads to books bucket"
  on storage.objects for insert
  with check (bucket_id = 'books');

create policy "Allow deletes from books bucket"
  on storage.objects for delete
  using (bucket_id = 'books');
