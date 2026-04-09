-- Ensure deleting a category also deletes its house-category links.
-- This protects existing databases where the FK may have been created without ON DELETE CASCADE.

DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public'
      AND table_name = 'house_categories'
  ) THEN
    ALTER TABLE public.house_categories
      DROP CONSTRAINT IF EXISTS house_categories_category_id_fkey;

    ALTER TABLE public.house_categories
      ADD CONSTRAINT house_categories_category_id_fkey
      FOREIGN KEY (category_id)
      REFERENCES public.categories(id)
      ON DELETE CASCADE;
  END IF;
END $$;
