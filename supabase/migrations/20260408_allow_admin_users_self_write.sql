-- Allow authenticated admins to create/update only their own admin_users row
-- Required for profile upsert flow in components/account/ProfileForm.tsx

DROP POLICY IF EXISTS "Admins can insert own admin_users" ON public.admin_users;
CREATE POLICY "Admins can insert own admin_users" ON public.admin_users
FOR INSERT
WITH CHECK (
  auth.uid() = auth_user_id
  AND role = 'admin'::user_role
);

DROP POLICY IF EXISTS "Admins can update own admin_users" ON public.admin_users;
CREATE POLICY "Admins can update own admin_users" ON public.admin_users
FOR UPDATE
USING (auth.uid() = auth_user_id)
WITH CHECK (
  auth.uid() = auth_user_id
  AND role = 'admin'::user_role
);
