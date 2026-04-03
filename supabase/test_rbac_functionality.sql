-- ============================================
-- RBAC Functionality Test Query
-- Run this in Supabase SQL Editor to verify everything is working
-- ============================================

-- 1. Check all roles
SELECT '=== ROLES ===' as section;
SELECT id, name, description, created_at 
FROM roles 
ORDER BY id;

-- 2. Check all users with their roles
SELECT '=== USERS WITH ROLES ===' as section;
SELECT 
  u.id,
  u.email,
  u.display_name,
  r.name as role_name,
  r.description as role_description,
  u.auth_user_id,
  CASE 
    WHEN u.auth_user_id IS NOT NULL THEN '✓ Linked'
    ELSE '✗ Not Linked'
  END as auth_status,
  u.created_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
ORDER BY r.id, u.email;

-- 3. Check user_roles view (used by AccountSidebar)
SELECT '=== USER_ROLES VIEW ===' as section;
SELECT 
  user_id,
  email,
  role_name,
  role_description
FROM user_roles
ORDER BY role_name;

-- 4. Count users by role
SELECT '=== USER COUNT BY ROLE ===' as section;
SELECT 
  r.name as role,
  COUNT(u.id) as user_count
FROM roles r
LEFT JOIN users u ON u.role_id = r.id
GROUP BY r.id, r.name
ORDER BY r.id;

-- 5. Check mock users specifically
SELECT '=== MOCK USERS ===' as section;
SELECT 
  u.email,
  r.name as role,
  u.display_name,
  u.auth_user_id IS NOT NULL as has_auth_user,
  u.created_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.email IN (
  'admin@natuurhuisje.com',
  'landlord@natuurhuisje.com',
  'user@natuurhuisje.com'
)
ORDER BY r.id;

-- 6. Test role checking functions
SELECT '=== ROLE CHECKING FUNCTIONS ===' as section;

-- Get a sample user ID for each role
DO $$
DECLARE
  admin_user_id UUID;
  landlord_user_id UUID;
  regular_user_id UUID;
BEGIN
  -- Get user IDs
  SELECT auth_user_id INTO admin_user_id 
  FROM users WHERE email = 'admin@natuurhuisje.com';
  
  SELECT auth_user_id INTO landlord_user_id 
  FROM users WHERE email = 'landlord@natuurhuisje.com';
  
  SELECT auth_user_id INTO regular_user_id 
  FROM users WHERE email = 'user@natuurhuisje.com';
  
  -- Test functions
  RAISE NOTICE 'Admin user is_admin: %', is_admin(admin_user_id);
  RAISE NOTICE 'Admin user is_landlord: %', is_landlord(admin_user_id);
  RAISE NOTICE 'Landlord user is_landlord: %', is_landlord(landlord_user_id);
  RAISE NOTICE 'Landlord user is_admin: %', is_admin(landlord_user_id);
  RAISE NOTICE 'Regular user is_admin: %', is_admin(regular_user_id);
  RAISE NOTICE 'Regular user is_landlord: %', is_landlord(regular_user_id);
END $$;

-- 7. Check if houses table has proper RLS policies
SELECT '=== HOUSES TABLE RLS POLICIES ===' as section;
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'houses'
ORDER BY policyname;

-- 8. Verify auth.users exist for mock users
SELECT '=== AUTH USERS ===' as section;
SELECT 
  au.id,
  au.email,
  au.created_at,
  au.email_confirmed_at IS NOT NULL as email_confirmed,
  EXISTS(
    SELECT 1 FROM users u WHERE u.auth_user_id = au.id
  ) as has_user_record
FROM auth.users au
WHERE au.email IN (
  'admin@natuurhuisje.com',
  'landlord@natuurhuisje.com',
  'user@natuurhuisje.com'
)
ORDER BY au.email;

-- 9. Summary report
SELECT '=== SUMMARY REPORT ===' as section;
SELECT 
  'Total Roles' as metric,
  COUNT(*)::text as value
FROM roles
UNION ALL
SELECT 
  'Total Users' as metric,
  COUNT(*)::text as value
FROM users
UNION ALL
SELECT 
  'Users with Auth' as metric,
  COUNT(*)::text as value
FROM users
WHERE auth_user_id IS NOT NULL
UNION ALL
SELECT 
  'Mock Users Created' as metric,
  COUNT(*)::text as value
FROM users
WHERE email IN (
  'admin@natuurhuisje.com',
  'landlord@natuurhuisje.com',
  'user@natuurhuisje.com'
)
UNION ALL
SELECT 
  'Admin Users' as metric,
  COUNT(*)::text as value
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'admin'
UNION ALL
SELECT 
  'Landlord Users' as metric,
  COUNT(*)::text as value
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'landlord'
UNION ALL
SELECT 
  'Regular Users' as metric,
  COUNT(*)::text as value
FROM users u
JOIN roles r ON u.role_id = r.id
WHERE r.name = 'user';

-- 10. Final validation check
SELECT '=== VALIDATION CHECK ===' as section;
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM roles) = 3 THEN '✓'
    ELSE '✗'
  END || ' All 3 roles exist' as check_result
UNION ALL
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM users WHERE email IN (
      'admin@natuurhuisje.com',
      'landlord@natuurhuisje.com',
      'user@natuurhuisje.com'
    )) = 3 THEN '✓'
    ELSE '✗'
  END || ' All 3 mock users exist'
UNION ALL
SELECT 
  CASE 
    WHEN (SELECT COUNT(*) FROM users WHERE email IN (
      'admin@natuurhuisje.com',
      'landlord@natuurhuisje.com',
      'user@natuurhuisje.com'
    ) AND auth_user_id IS NOT NULL) = 3 THEN '✓'
    ELSE '✗'
  END || ' All mock users linked to auth'
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM pg_views WHERE viewname = 'user_roles') THEN '✓'
    ELSE '✗'
  END || ' user_roles view exists'
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'is_admin') THEN '✓'
    ELSE '✗'
  END || ' is_admin() function exists'
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'is_landlord') THEN '✓'
    ELSE '✗'
  END || ' is_landlord() function exists'
UNION ALL
SELECT 
  CASE 
    WHEN EXISTS(SELECT 1 FROM pg_proc WHERE proname = 'has_role') THEN '✓'
    ELSE '✗'
  END || ' has_role() function exists';
