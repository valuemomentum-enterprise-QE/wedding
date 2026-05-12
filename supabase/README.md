# Supabase Configuration

## Migrations

### `20260512_fix_rls_policies.sql`

Fixes the overly permissive RLS (Row Level Security) policies on all wedding planner tables.

**Problem:** The original `"Allow all for ALL"` policy used `USING (true)` and `WITH CHECK (true)`, which effectively bypasses row-level security for INSERT, UPDATE, and DELETE operations.

**Solution:**
1. Drops the blanket `"Allow all"` / `"Allow all for ALL"` policies.
2. Adds a `user_id` column (if missing) referencing `auth.users(id)` so each row is owned by a Supabase Auth user.
3. Creates separate per-operation policies (SELECT, INSERT, UPDATE, DELETE) scoped to `auth.uid() = user_id`.
4. Adds indexes on `user_id` for faster policy evaluation.

**Tables affected:** `budget_items`, `guests`, `tasks`, `vendors`, `events`.

### How to apply

**Option A — Supabase CLI:**
```bash
supabase db push
```

**Option B — Supabase Dashboard:**
1. Go to **SQL Editor** in the Supabase Dashboard.
2. Paste the contents of the migration file.
3. Click **Run**.

> **Note:** After applying, make sure existing rows have their `user_id` column set to the correct user. You can do this with:
> ```sql
> UPDATE public.budget_items SET user_id = '<your-auth-user-uuid>' WHERE user_id IS NULL;
> ```
> Repeat for `guests`, `tasks`, `vendors`, and `events`.
