-- IndieForest Core PostgreSQL Migration Schema

-- 1. Profiles Table (Linked to Supabase Auth / Clerk Identity)
CREATE TABLE IF NOT EXISTS public.profiles (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  github_username TEXT,
  webhook_token TEXT UNIQUE DEFAULT encode(gen_random_bytes(24), 'hex'),
  level INT NOT NULL DEFAULT 1,
  xp INT NOT NULL DEFAULT 0,
  streak_days INT NOT NULL DEFAULT 1,
  streak_shields INT NOT NULL DEFAULT 1,
  pinecones INT NOT NULL DEFAULT 50,
  last_ship_date DATE,
  drought BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Island 3D Trees Table (Bilateral GitHub Conifers & Stripe Revenue Money Oaks)
CREATE TABLE IF NOT EXISTS public.trees (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'shipping' CHECK (type IN ('shipping', 'revenue')),
  commits INT DEFAULT NULL,
  mrr NUMERIC DEFAULT NULL,
  tier TEXT NOT NULL CHECK (tier IN ('sapling', 'young', 'mature', 'majestic', 'stump')),
  grid_x NUMERIC NOT NULL DEFAULT 0,
  grid_z NUMERIC NOT NULL DEFAULT 0,
  planted_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Daily Shipping Logs Table
CREATE TABLE IF NOT EXISTS public.ship_logs (
  id TEXT PRIMARY KEY,
  user_id TEXT REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('github', 'manual', 'stripe', 'lemonsqueezy', 'polar')),
  commit_url TEXT,
  xp_gained INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Public Guestbook & Visitor Cheers Table
CREATE TABLE IF NOT EXISTS public.guestbook_entries (
  id TEXT PRIMARY KEY,
  target_username TEXT NOT NULL,
  author TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ship_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guestbook_entries ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can upsert profile data with valid ID." 
    ON public.profiles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trees Policies
DO $$ BEGIN
  CREATE POLICY "Public trees are viewable by everyone." 
    ON public.trees FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can manage their trees." 
    ON public.trees FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ship Logs Policies
DO $$ BEGIN
  CREATE POLICY "Public ship logs are viewable by everyone." 
    ON public.ship_logs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert ship logs." 
    ON public.ship_logs FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Guestbook Policies
DO $$ BEGIN
  CREATE POLICY "Public guestbook entries are viewable by everyone." 
    ON public.guestbook_entries FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Anyone can sign the guestbook." 
    ON public.guestbook_entries FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
