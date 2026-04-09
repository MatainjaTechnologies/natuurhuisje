-- Create storage bucket for category images

INSERT INTO storage.buckets (id, name, public)
VALUES ('categories', 'categories', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Public read category images" ON storage.objects;
CREATE POLICY "Public read category images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'categories');

DROP POLICY IF EXISTS "Admins can upload category images" ON storage.objects;
CREATE POLICY "Admins can upload category images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'categories'
  AND public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins can update category images" ON storage.objects;
CREATE POLICY "Admins can update category images"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'categories'
  AND public.is_admin(auth.uid())
)
WITH CHECK (
  bucket_id = 'categories'
  AND public.is_admin(auth.uid())
);

DROP POLICY IF EXISTS "Admins can delete category images" ON storage.objects;
CREATE POLICY "Admins can delete category images"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'categories'
  AND public.is_admin(auth.uid())
);
