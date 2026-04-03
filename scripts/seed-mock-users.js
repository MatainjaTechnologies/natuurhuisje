// Seed mock users for each role (admin, landlord, user)
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Try to load .env.local first, then fall back to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
const envPath = path.resolve(process.cwd(), '.env');

if (fs.existsSync(envLocalPath)) {
  require('dotenv').config({ path: envLocalPath });
  console.log('✓ Loaded environment from .env.local\n');
} else if (fs.existsSync(envPath)) {
  require('dotenv').config({ path: envPath });
  console.log('✓ Loaded environment from .env\n');
} else {
  console.error('❌ No .env or .env.local file found!');
  console.error('Please create a .env file with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Validate required environment variables
if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL is not set in your .env file');
  process.exit(1);
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY is not set in your .env file');
  console.error('You can find this in your Supabase Dashboard > Project Settings > API > service_role key');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin privileges
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mock users configuration
const mockUsers = [
  {
    email: 'admin@natuurhuisje.com',
    password: 'Admin@123',
    display_name: 'Admin User',
    role: 'admin',
    user_metadata: {
      first_name: 'Admin',
      last_name: 'User'
    }
  },
  {
    email: 'landlord@natuurhuisje.com',
    password: 'Landlord@123',
    display_name: 'Landlord User',
    role: 'landlord',
    user_metadata: {
      first_name: 'Landlord',
      last_name: 'User'
    }
  },
  {
    email: 'user@natuurhuisje.com',
    password: 'User@123',
    display_name: 'Regular User',
    role: 'user',
    user_metadata: {
      first_name: 'Regular',
      last_name: 'User'
    }
  }
];

async function seedMockUsers() {
  console.log('🌱 Starting mock users seeding...\n');

  try {
    // 1. Ensure roles exist
    console.log('Checking roles table...');
    const { data: roles, error: rolesError } = await supabase
      .from('roles')
      .select('id, name');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return;
    }

    console.log(`✓ Found ${roles.length} roles:`, roles.map(r => r.name).join(', '));
    console.log('');

    // Create a map of role names to IDs
    const roleMap = {};
    roles.forEach(role => {
      roleMap[role.name] = role.id;
    });

    // 2. Create mock users
    for (const mockUser of mockUsers) {
      console.log(`Creating user: ${mockUser.email} (${mockUser.role})...`);

      // Check if auth user already exists
      const { data: existingAuthUsers } = await supabase.auth.admin.listUsers();
      const existingAuthUser = existingAuthUsers?.users?.find(u => u.email === mockUser.email);

      let authUserId;

      if (existingAuthUser) {
        console.log(`  ⚠ Auth user already exists with ID: ${existingAuthUser.id}`);
        authUserId = existingAuthUser.id;
      } else {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: mockUser.email,
          password: mockUser.password,
          email_confirm: true,
          user_metadata: mockUser.user_metadata
        });

        if (authError) {
          console.error(`  ✗ Error creating auth user:`, authError.message);
          continue;
        }

        authUserId = authData.user.id;
        console.log(`  ✓ Created auth user with ID: ${authUserId}`);
      }

      // Check if user record already exists in users table
      const { data: existingUser } = await supabase
        .from('users')
        .select('id, email, role_id')
        .eq('auth_user_id', authUserId)
        .single();

      const roleId = roleMap[mockUser.role];

      if (existingUser) {
        // Update existing user's role if different
        if (existingUser.role_id !== roleId) {
          const { error: updateError } = await supabase
            .from('users')
            .update({ role_id: roleId })
            .eq('id', existingUser.id);

          if (updateError) {
            console.error(`  ✗ Error updating user role:`, updateError.message);
          } else {
            console.log(`  ✓ Updated user role to: ${mockUser.role}`);
          }
        } else {
          console.log(`  ✓ User already exists with correct role`);
        }
      } else {
        // Create new user record
        const { error: userError } = await supabase
          .from('users')
          .insert({
            auth_user_id: authUserId,
            email: mockUser.email,
            display_name: mockUser.display_name,
            role_id: roleId,
            created_at: new Date().toISOString()
          });

        if (userError) {
          console.error(`  ✗ Error creating user record:`, userError.message);
        } else {
          console.log(`  ✓ Created user record in users table`);
        }
      }

      console.log('');
    }

    // 3. Display all users with their roles
    console.log('📋 Current users in database:\n');
    const { data: allUsers, error: usersError } = await supabase
      .from('users')
      .select(`
        id,
        email,
        display_name,
        auth_user_id,
        role_id,
        roles (
          name,
          description
        ),
        created_at
      `)
      .order('role_id', { ascending: true });

    if (usersError) {
      console.error('Error fetching users:', usersError);
      return;
    }

    console.table(allUsers.map(u => ({
      Email: u.email,
      Name: u.display_name,
      Role: u.roles?.name || 'N/A',
      'Auth ID': u.auth_user_id ? u.auth_user_id.substring(0, 8) + '...' : 'N/A',
      Created: new Date(u.created_at).toLocaleDateString()
    })));

    console.log('\n✅ Mock users seeding completed successfully!\n');
    console.log('Test accounts credentials:');
    mockUsers.forEach(user => {
      console.log(`  ${user.role.toUpperCase().padEnd(10)} - ${user.email} / ${user.password}`);
    });

  } catch (error) {
    console.error('Unexpected error during seeding:', error);
  }
}

// Run the seed function
seedMockUsers();
