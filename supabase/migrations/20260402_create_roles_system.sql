-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default roles
INSERT INTO roles (name, description) VALUES
  ('admin', 'Full system access - can manage everything'),
  ('landlord', 'Can add and manage their own properties'),
  ('user', 'Basic user access - can view and book properties')
ON CONFLICT (name) DO NOTHING;

-- Add role column to users table (if using Supabase auth, this might be in a profiles table)
-- Assuming you have a profiles or users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role_id INTEGER REFERENCES roles(id) DEFAULT 3;

-- Create index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);

-- Create a view for easy role checking
CREATE OR REPLACE VIEW user_roles AS
SELECT 
  u.id as user_id,
  u.email,
  r.name as role_name,
  r.description as role_description
FROM users u
LEFT JOIN roles r ON u.role_id = r.id;

-- Create function to check if user has role
CREATE OR REPLACE FUNCTION has_role(user_id UUID, role_name TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM users u
    JOIN roles r ON u.role_id = r.id
    WHERE u.id = user_id AND r.name = role_name
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_role(user_id, 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create function to check if user is landlord
CREATE OR REPLACE FUNCTION is_landlord(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN has_role(user_id, 'landlord');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add RLS policies for houses table based on roles
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view all houses" ON houses;
DROP POLICY IF EXISTS "Landlords can insert their own houses" ON houses;
DROP POLICY IF EXISTS "Landlords can update their own houses" ON houses;
DROP POLICY IF EXISTS "Landlords can delete their own houses" ON houses;
DROP POLICY IF EXISTS "Admins can do everything with houses" ON houses;

-- Enable RLS on houses table
ALTER TABLE houses ENABLE ROW LEVEL SECURITY;

-- Everyone can view published houses
CREATE POLICY "Users can view published houses" ON houses
  FOR SELECT
  USING (status = 'active' OR auth.uid() = host_id OR is_admin(auth.uid()));

-- Landlords can insert their own houses
CREATE POLICY "Landlords can insert houses" ON houses
  FOR INSERT
  WITH CHECK (
    (is_landlord(auth.uid()) OR is_admin(auth.uid())) 
    AND auth.uid() = host_id
  );

-- Landlords can update their own houses, admins can update any
CREATE POLICY "Landlords can update own houses" ON houses
  FOR UPDATE
  USING (
    auth.uid() = host_id OR is_admin(auth.uid())
  );

-- Landlords can delete their own houses, admins can delete any
CREATE POLICY "Landlords can delete own houses" ON houses
  FOR DELETE
  USING (
    auth.uid() = host_id OR is_admin(auth.uid())
  );

-- Grant permissions
GRANT SELECT ON roles TO authenticated;
GRANT SELECT ON user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION has_role TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION is_landlord TO authenticated;
