-- IndieForest Core PostgreSQL Migration Schema

-- 1. Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

-- 2. Customer Pine Trees Table (Subscribers & MRR)
CREATE TABLE IF NOT EXISTS public.trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  mrr NUMERIC NOT NULL DEFAULT 0,
  tier TEXT NOT NULL CHECK (tier IN ('sapling', 'young', 'mature', 'majestic', 'stump')),
  grid_x NUMERIC NOT NULL DEFAULT 0,
  grid_z NUMERIC NOT NULL DEFAULT 0,
  planted_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Daily Shipping Logs Table
CREATE TABLE IF NOT EXISTS public.ship_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('github', 'manual', 'stripe', 'lemonsqueezy', 'polar')),
  commit_url TEXT,
  xp_gained INT NOT NULL DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ship_logs ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
DO $$ BEGIN
  CREATE POLICY "Public profiles are viewable by everyone." 
    ON public.profiles FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can update their own profile." 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trees Policies
DO $$ BEGIN
  CREATE POLICY "Public trees are viewable by everyone." 
    ON public.trees FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can manage their own trees." 
    ON public.trees FOR ALL USING (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Ship Logs Policies
DO $$ BEGIN
  CREATE POLICY "Public ship logs are viewable by everyone." 
    ON public.ship_logs FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE POLICY "Users can insert their own ship logs." 
    ON public.ship_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Trigger: Automatically Create Profile on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    username,
    display_name,
    avatar_url,
    github_username,
    level,
    xp,
    streak_days,
    streak_shields,
    pinecones
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'user_name', new.raw_user_meta_data->>'preferred_username', 'builder_' || substr(new.id::text, 1, 6)),
    COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', 'Indie Builder'),
    COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
    COALESCE(new.raw_user_meta_data->>'user_name', ''),
    1,
    0,
    1,
    1,
    50
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
