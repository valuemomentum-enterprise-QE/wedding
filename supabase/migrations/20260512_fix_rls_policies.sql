-- Fix overly permissive RLS policies on wedding planner tables.
--
-- Problem:  The "Allow all for ALL" policy uses USING (true) / WITH CHECK (true)
--           on INSERT, UPDATE, and DELETE, which bypasses row-level security.
-- Solution: Drop the blanket policy and create per-operation policies that
--           require authentication for writes and scope rows to the owning user.
--
-- Each table gets a `user_id` column (if missing) so rows are owned by a
-- Supabase Auth user.  Existing rows with NULL user_id are left accessible
-- to any authenticated user until they are claimed.

-- ============================================================
-- Helper: ensure RLS is enabled on every target table
-- ============================================================

-- budget_items
ALTER TABLE IF EXISTS public.budget_items ENABLE ROW LEVEL SECURITY;

-- guests
ALTER TABLE IF EXISTS public.guests ENABLE ROW LEVEL SECURITY;

-- tasks
ALTER TABLE IF EXISTS public.tasks ENABLE ROW LEVEL SECURITY;

-- vendors
ALTER TABLE IF EXISTS public.vendors ENABLE ROW LEVEL SECURITY;

-- events
ALTER TABLE IF EXISTS public.events ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 1. Add user_id column (idempotent – skipped if it already exists)
-- ============================================================
DO $$
BEGIN
  -- budget_items
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'budget_items')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'budget_items' AND column_name = 'user_id')
  THEN
    ALTER TABLE public.budget_items ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;

  -- guests
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'guests')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'guests' AND column_name = 'user_id')
  THEN
    ALTER TABLE public.guests ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;

  -- tasks
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'tasks')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tasks' AND column_name = 'user_id')
  THEN
    ALTER TABLE public.tasks ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;

  -- vendors
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'vendors')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'vendors' AND column_name = 'user_id')
  THEN
    ALTER TABLE public.vendors ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;

  -- events
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'events')
     AND NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'events' AND column_name = 'user_id')
  THEN
    ALTER TABLE public.events ADD COLUMN user_id uuid REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;
END $$;

-- ============================================================
-- 2. Drop the overly permissive "Allow all" policies
-- ============================================================
-- Using IF EXISTS so the migration is safe to re-run.

DROP POLICY IF EXISTS "Allow all" ON public.budget_items;
DROP POLICY IF EXISTS "Allow all for ALL" ON public.budget_items;

DROP POLICY IF EXISTS "Allow all" ON public.guests;
DROP POLICY IF EXISTS "Allow all for ALL" ON public.guests;

DROP POLICY IF EXISTS "Allow all" ON public.tasks;
DROP POLICY IF EXISTS "Allow all for ALL" ON public.tasks;

DROP POLICY IF EXISTS "Allow all" ON public.vendors;
DROP POLICY IF EXISTS "Allow all for ALL" ON public.vendors;

DROP POLICY IF EXISTS "Allow all" ON public.events;
DROP POLICY IF EXISTS "Allow all for ALL" ON public.events;

-- ============================================================
-- 3. Create scoped per-operation policies
-- ============================================================

-- ---- budget_items ----

-- SELECT: Authenticated users can read their own rows.
CREATE POLICY "Users can view own budget_items"
  ON public.budget_items FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

-- INSERT: Authenticated users can insert rows they own.
CREATE POLICY "Users can insert own budget_items"
  ON public.budget_items FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

-- UPDATE: Authenticated users can update their own rows.
CREATE POLICY "Users can update own budget_items"
  ON public.budget_items FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

-- DELETE: Authenticated users can delete their own rows.
CREATE POLICY "Users can delete own budget_items"
  ON public.budget_items FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- ---- guests ----

CREATE POLICY "Users can view own guests"
  ON public.guests FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own guests"
  ON public.guests FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own guests"
  ON public.guests FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own guests"
  ON public.guests FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- ---- tasks ----

CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- ---- vendors ----

CREATE POLICY "Users can view own vendors"
  ON public.vendors FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own vendors"
  ON public.vendors FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own vendors"
  ON public.vendors FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own vendors"
  ON public.vendors FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- ---- events ----

CREATE POLICY "Users can view own events"
  ON public.events FOR SELECT
  TO authenticated
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can insert own events"
  ON public.events FOR INSERT
  TO authenticated
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can update own events"
  ON public.events FOR UPDATE
  TO authenticated
  USING ( auth.uid() = user_id )
  WITH CHECK ( auth.uid() = user_id );

CREATE POLICY "Users can delete own events"
  ON public.events FOR DELETE
  TO authenticated
  USING ( auth.uid() = user_id );

-- ============================================================
-- 4. Create indexes on user_id for faster policy evaluation
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_budget_items_user_id ON public.budget_items(user_id);
CREATE INDEX IF NOT EXISTS idx_guests_user_id        ON public.guests(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_user_id          ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_vendors_user_id        ON public.vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_events_user_id         ON public.events(user_id);
