-- Restrict admin_users self-service writes to UPDATE only
-- Upsert requires INSERT policy, which is intentionally disallowed to avoid self-provisioning admin rows.

DROP POLICY IF EXISTS "Admins can insert own admin_users" ON public.admin_users;

DROP POLICY IF EXISTS "Admins can update own admin_users" ON public.admin_users;
CREATE POLICY "Admins can update own admin_users" ON public.admin_users
FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (
  auth.uid() = auth_user_id
  AND role = 'admin'::user_role
);
