-- ── Passes ───────────────────────────────────────────────────
CREATE TABLE passes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  to_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(from_user_id, to_user_id)
);

ALTER TABLE passes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can see own passes" ON passes FOR SELECT USING (auth.uid() = from_user_id);
CREATE POLICY "Users can create passes" ON passes FOR INSERT WITH CHECK (auth.uid() = from_user_id);

-- ── Matchmaking Discovery Logic ─────────────────────────────

/**
 * Returns a list of potential co-founders for the current user.
 * Filters for complementarity (Builder sees Founder, and vice-versa).
 * Excludes users already interacted with (Interest or Pass).
 */
CREATE OR REPLACE FUNCTION get_discovery_deck(p_user_id UUID, p_limit INT DEFAULT 10)
RETURNS TABLE (
  id UUID,
  name TEXT,
  avatar_url TEXT,
  city TEXT,
  role TEXT,
  project_name TEXT,
  problem_statement TEXT,
  project_stage TEXT,
  expertise_areas TEXT[],
  dedication TEXT,
  financial_expectation TEXT,
  contribution_summary TEXT,
  proof_of_work_url TEXT
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_user_role TEXT;
BEGIN
  -- 1. Get current user's role
  SELECT role INTO v_user_role FROM users WHERE id = p_user_id;

  RETURN QUERY
  SELECT 
    u.id,
    u.name,
    u.avatar_url,
    u.city,
    u.role,
    p.name as project_name,
    p.problem_statement,
    p.stage as project_stage,
    s.expertise_areas,
    s.dedication,
    s.financial_expectation,
    s.contribution_summary,
    s.proof_of_work_url
  FROM users u
  JOIN projects p ON u.id = p.user_id
  JOIN seeking s ON u.id = s.user_id
  WHERE u.status = 'active'
    AND u.id != p_user_id
    AND u.role != v_user_role -- Complementarity filter
    AND u.id NOT IN (
      -- Exclude users already in interests
      SELECT to_user_id FROM interests WHERE from_user_id = p_user_id
      UNION
      -- Exclude users already in passes
      SELECT to_user_id FROM passes WHERE from_user_id = p_user_id
    )
  ORDER BY u.created_at DESC
  LIMIT p_limit;
END;
$$;

-- ── Interest with Match Check ───────────────────────────────

/**
 * Registers interest from one user to another.
 * If mutual interest exists, creates a match and a conversation.
 */
CREATE OR REPLACE FUNCTION handle_interest(p_from_user_id UUID, p_to_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_mutual_interest BOOLEAN;
  v_match_id UUID;
  v_conv_id UUID;
  v_result JSONB;
BEGIN
  -- 1. Insert the interest record
  INSERT INTO interests (from_user_id, to_user_id)
  VALUES (p_from_user_id, p_to_user_id)
  ON CONFLICT (from_user_id, to_user_id) DO NOTHING;

  -- 2. Check if the target user already has interest in the current user
  SELECT EXISTS (
    SELECT 1 FROM interests 
    WHERE from_user_id = p_to_user_id AND to_user_id = p_from_user_id
  ) INTO v_mutual_interest;

  IF v_mutual_interest THEN
    -- 3. Create Match
    INSERT INTO matches (user_a_id, user_b_id)
    VALUES (p_from_user_id, p_to_user_id)
    RETURNING id INTO v_match_id;

    -- 4. Create Conversation
    INSERT INTO conversations (match_id)
    VALUES (v_match_id)
    RETURNING id INTO v_conv_id;

    -- Update match with conversation_id
    UPDATE matches SET conversation_id = v_conv_id WHERE id = v_match_id;

    -- 5. Send initial system message
    INSERT INTO messages (conversation_id, sender_id, content, is_system_message)
    VALUES (
      v_conv_id, 
      p_from_user_id, -- Arbitrarily set one as sender for the system message context if needed, but is_system_message handles it
      'Vocês deram match! Comecem a construir algo incrível.',
      TRUE
    );

    v_result := jsonb_build_object(
      'match', true,
      'match_id', v_match_id,
      'conversation_id', v_conv_id
    );
  ELSE
    v_result := jsonb_build_object('match', false);
  END IF;

  RETURN v_result;
END;
$$;
