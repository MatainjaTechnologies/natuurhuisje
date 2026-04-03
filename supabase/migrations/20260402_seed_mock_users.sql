-- Seed mock users for each role (admin, landlord, user)
-- NOTE: This SQL file only creates entries in the users table.
-- You MUST create the corresponding auth.users entries via Supabase Dashboard or Admin API
-- See the companion JavaScript seeder script for automated creation

-- First, ensure we have the roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access - can manage everything'),
  ('landlord', 'Can add and manage their own properties'),
  ('user', 'Basic user access - can view and book properties')
ON CONFLICT (name) DO NOTHING;

-- Instructions for creating auth users:
-- 1. Go to Supabase Dashboard > Authentication > Users
-- 2. Create users with these emails and passwords:
--    - admin@natuurhuisje.com / Admin@123
--    - landlord@natuurhuisje.com / Landlord@123
--    - user@natuurhuisje.com / User@123
-- 3. After creating auth users, run the update statements below to link them

-- Example update statement (run after creating auth users):
-- UPDATE users SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'admin@natuurhuisje.com')
-- WHERE email = 'admin@natuurhuisje.com';

-- Display existing users and their roles
SELECT 
  u.id,
  u.email,
  u.display_name,
  r.name as role,
  u.auth_user_id,
  u.created_at
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
ORDER BY r.id;
