-- ============================================================
-- Foundo — Initial Database Schema
-- Based on PRD v1.0 Section 2.2
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ── Users ────────────────────────────────────────────────────
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  city TEXT NOT NULL DEFAULT '',
  role TEXT NOT NULL CHECK (role IN ('founder', 'builder')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'observing', 'partnered', 'rejected')),
  linkedin_url TEXT,
  github_url TEXT,
  reference_name TEXT,
  city_preference TEXT NOT NULL DEFAULT 'any-brazil' CHECK (city_preference IN ('same-city', 'any-brazil', 'international')),
  contact_preference TEXT NOT NULL DEFAULT 'email' CHECK (contact_preference IN ('email', 'whatsapp')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  last_active_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  -- At least one verification link required
  CONSTRAINT check_verification CHECK (linkedin_url IS NOT NULL OR github_url IS NOT NULL)
);

-- ── Projects ─────────────────────────────────────────────────
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) <= 40),
  problem_statement TEXT NOT NULL,
  stage TEXT NOT NULL CHECK (stage IN ('exploration', 'building', 'traction', 'expansion')),
  evidence TEXT,
  status_update TEXT,
  status_updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ── Seeking ──────────────────────────────────────────────────
CREATE TABLE seeking (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expertise_areas TEXT[] NOT NULL DEFAULT '{}',
  dedication TEXT NOT NULL CHECK (dedication IN ('full-time', 'part-time-transition', 'gradual')),
  horizon TEXT NOT NULL CHECK (horizon IN ('1-3-months', '3-6-months', 'no-deadline')),
  financial_expectation TEXT NOT NULL CHECK (financial_expectation IN ('equity-only', 'equity-pro-labore', 'equity-market', 'defining')),
  contribution_summary TEXT NOT NULL,
  proof_of_work_url TEXT
);

-- ── Interests ────────────────────────────────────────────────
CREATE TABLE interests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

-- ── Matches ──────────────────────────────────────────────────
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_a_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  user_b_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  matched_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  conversation_id UUID
);

-- ── Conversations ────────────────────────────────────────────
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived'))
);

-- Add FK from matches to conversations
ALTER TABLE matches
  ADD CONSTRAINT fk_matches_conversation
  FOREIGN KEY (conversation_id) REFERENCES conversations(id);

-- ── Messages ─────────────────────────────────────────────────
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_system_message BOOLEAN NOT NULL DEFAULT FALSE
);

-- ── Conversation Reads ───────────────────────────────────────
CREATE TABLE conversation_reads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, conversation_id)
);

-- ── Match Followups ──────────────────────────────────────────
CREATE TABLE match_followups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  sent_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  day_offset INT NOT NULL CHECK (day_offset IN (7, 30, 90)),
  response_a TEXT,
  response_b TEXT
);

-- ── Communities ──────────────────────────────────────────────
CREATE TABLE communities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  contact_name TEXT,
  slug TEXT UNIQUE NOT NULL,
  users_approved INT NOT NULL DEFAULT 0,
  users_pending INT NOT NULL DEFAULT 0
);

-- ── Indexes ──────────────────────────────────────────────────
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_last_active ON users(last_active_at DESC);
CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_stage ON projects(stage);
CREATE INDEX idx_seeking_user ON seeking(user_id);
CREATE INDEX idx_interests_from ON interests(from_user_id);
CREATE INDEX idx_interests_to ON interests(to_user_id);
CREATE INDEX idx_matches_users ON matches(user_a_id, user_b_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);
CREATE INDEX idx_conversation_reads_user ON conversation_reads(user_id, conversation_id);

-- ── RLS Policies ─────────────────────────────────────────────
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE seeking ENABLE ROW LEVEL SECURITY;
ALTER TABLE interests ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_reads ENABLE ROW LEVEL SECURITY;

-- Users can read active profiles
CREATE POLICY "Active users are viewable"
  ON users FOR SELECT
  USING (status = 'active');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = id);


-- Projects viewable for active users
CREATE POLICY "Projects are viewable for active users"
  ON projects FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = projects.user_id AND users.status = 'active'));

-- Projects can be inserted by their owners
CREATE POLICY "Users can create own project"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Projects can be updated by their owners
CREATE POLICY "Users can update own project"
  ON projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Seeking viewable for active users
CREATE POLICY "Seeking is viewable for active users"
  ON seeking FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = seeking.user_id AND users.status = 'active'));

-- Seeking can be inserted by their owners
CREATE POLICY "Users can create own seeking"
  ON seeking FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Seeking can be updated by their owners
CREATE POLICY "Users can update own seeking"
  ON seeking FOR UPDATE
  USING (auth.uid() = user_id);

-- Interests: users can see their own
CREATE POLICY "Users can see own interests"
  ON interests FOR SELECT
  USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);

-- Interests: users can create
CREATE POLICY "Users can create interests"
  ON interests FOR INSERT
  WITH CHECK (auth.uid() = from_user_id);

-- Matches: users can see their own
CREATE POLICY "Users can see own matches"
  ON matches FOR SELECT
  USING (auth.uid() = user_a_id OR auth.uid() = user_b_id);

-- Conversations: users can see own
CREATE POLICY "Users can see own conversations"
  ON conversations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM matches
      WHERE matches.id = conversations.match_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- Messages: users can see messages in their conversations
CREATE POLICY "Users can see messages in own conversations"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      JOIN matches ON matches.id = conversations.match_id
      WHERE conversations.id = messages.conversation_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- Messages: users can insert in own conversations
CREATE POLICY "Users can send messages in own conversations"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id
    AND EXISTS (
      SELECT 1 FROM conversations
      JOIN matches ON matches.id = conversations.match_id
      WHERE conversations.id = messages.conversation_id
      AND (matches.user_a_id = auth.uid() OR matches.user_b_id = auth.uid())
    )
  );

-- Conversation Reads: users can view, insert, and update their own reads
CREATE POLICY "Users can view own conversation reads"
  ON conversation_reads FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversation reads"
  ON conversation_reads FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own conversation reads"
  ON conversation_reads FOR UPDATE
  USING (auth.uid() = user_id);

