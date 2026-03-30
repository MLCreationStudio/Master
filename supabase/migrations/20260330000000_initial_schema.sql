-- BUILDERMIND INITIAL SCHEMA (v0.1)

-- 1. Profiles Table (Extends Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  superpower TEXT,
  mrr_band TEXT CHECK (mrr_band IN ('ideation', 'validation', 'bootstrapper', 'scale', 'high_performance')),
  endgame_philosophy TEXT CHECK (endgame_philosophy IN ('bootstrapper', 'vc_backed')),
  timezone TEXT,
  setup_fee_paid BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Mastermind Groups Table
CREATE TABLE IF NOT EXISTS public.groups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Group Memberships (Many-to-Many)
CREATE TABLE IF NOT EXISTS public.memberships (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  group_id UUID REFERENCES public.groups(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (user_id, group_id)
);

-- 4. Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;

-- 5. Policies
-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Groups: Users can see groups they belong to
CREATE POLICY "Users can view their groups" ON public.groups
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships
      WHERE memberships.group_id = groups.id
      AND memberships.user_id = auth.uid()
    )
  );

-- Memberships: Users can see memberships of their own groups
CREATE POLICY "Users can view memberships in their groups" ON public.memberships
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.memberships AS m
      WHERE m.group_id = public.memberships.group_id
      AND m.user_id = auth.uid()
    )
  );
