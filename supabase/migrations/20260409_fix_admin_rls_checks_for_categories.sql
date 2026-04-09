-- Fix admin checks for categories table and categories storage bucket
-- Previous policies relied on is_admin(auth.uid()), but legacy role functions may not
-- resolve correctly for auth_user_id/admin_users-only accounts.

-- categories table policies
DROP POLICY IF EXISTS "Admins can read categories" ON public.categories;
CREATE POLICY "Admins can read categories"
ON public.categories
FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Admins can insert categories" ON public.categories;
CREATE POLICY "Admins can insert categories"
ON public.categories
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Admins can update categories" ON public.categories;
CREATE POLICY "Admins can update categories"
ON public.categories
FOR UPDATE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Admins can delete categories" ON public.categories;
CREATE POLICY "Admins can delete categories"
ON public.categories
FOR DELETE
USING (
  EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

-- storage.objects policies for categories bucket
DROP POLICY IF EXISTS "Admins can upload category images" ON storage.objects;
CREATE POLICY "Admins can upload category images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Admins can update category images" ON storage.objects;
CREATE POLICY "Admins can update category images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
)
WITH CHECK (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);

DROP POLICY IF EXISTS "Admins can delete category images" ON storage.objects;
CREATE POLICY "Admins can delete category images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'categories'
  AND EXISTS (
    SELECT 1
    FROM public.admin_users au
    WHERE au.auth_user_id = auth.uid()
      AND au.role = 'admin'::user_role
  )
);
