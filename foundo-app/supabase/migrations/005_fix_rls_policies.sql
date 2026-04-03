-- 1. Allow users to see their own profile regardless of status (active, pending, etc.)
-- This is critical so the app can identify the user during the admission process.
CREATE POLICY "Users can see own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- 2. Allow users to create their initial project entry
-- (Ensuring they can insert even if not active yet)
CREATE POLICY "Users can create project entry"
  ON projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 3. Allow users to create their initial seeking entry
CREATE POLICY "Users can create seeking entry"
  ON seeking FOR INSERT
  WITH CHECK (auth.uid() = user_id);
