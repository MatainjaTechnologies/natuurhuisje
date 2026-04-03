-- Fix user_roles view to use auth_user_id for matching
-- This allows querying by auth.users.id instead of users.id

DROP VIEW IF EXISTS user_roles;

CREATE OR REPLACE VIEW user_roles AS
SELECT 
  u.auth_user_id as user_id,
  u.email,
  r.name as role_name,
  r.description as role_description
FROM users u
LEFT JOIN roles r ON u.role_id = r.id
WHERE u.auth_user_id IS NOT NULL;

-- Grant permissions
GRANT SELECT ON user_roles TO authenticated;
