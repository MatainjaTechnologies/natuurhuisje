-- Option 2: strict admin separation
-- Keep admins only in admin_users table and remove admin records from users table.

-- Disable sync from users -> admin_users (no longer needed for strict separation)
DROP TRIGGER IF EXISTS trg_sync_admin_users_from_users ON public.users;
DROP FUNCTION IF EXISTS public.sync_admin_users_from_users();

-- Remove admin rows from users table
DELETE FROM public.users
WHERE role = 'admin'::user_role OR role_id = 1;

-- Ensure admin_users can still be read by the currently authenticated admin user
DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users" ON public.admin_users
FOR SELECT
USING (auth.uid() = auth_user_id);
