# Role-Based Access Control (RBAC) Implementation

## Overview
This document describes the role-based access control system implemented for the Natuurhuisje marketplace.

## Roles

### 1. Admin
- **Full system access**
- Can view, edit, and delete all houses
- Can manage all users and their roles
- Access to admin dashboard
- Access to system analytics
- Can manage bookings for all properties

### 2. Landlord
- Can add new properties
- Can edit and delete only their own properties
- Can manage bookings for their own properties
- Can set special pricing for their properties
- Cannot access admin features
- Cannot edit other landlords' properties

### 3. User (Default)
- Can view and book properties
- Can view their own bookings
- Can manage their profile
- Cannot add or manage properties
- Cannot access admin or landlord features

## Database Schema

### Tables Created

#### `roles` table
```sql
- id (SERIAL PRIMARY KEY)
- name (VARCHAR(50) UNIQUE) - 'admin', 'landlord', 'user'
- description (TEXT)
- created_at (TIMESTAMP)
```

#### `users` table modification
```sql
- role_id (INTEGER REFERENCES roles(id)) - Added column
```

#### `user_roles` view
```sql
- Combines users and roles for easy querying
- Returns: user_id, email, role_name, role_description
```

### Database Functions

1. `has_role(user_id, role_name)` - Check if user has specific role
2. `is_admin(user_id)` - Check if user is admin
3. `is_landlord(user_id)` - Check if user is landlord

### Row Level Security (RLS) Policies

Applied to `houses` table:
- Users can view published houses
- Landlords can insert houses (with their user_id as host_id)
- Landlords can update/delete only their own houses
- Admins can do everything

## Implementation Files

### 1. Database Migration
**File:** `supabase/migrations/20260402_create_roles_system.sql`
- Creates roles table with default roles
- Adds role_id to users table
- Creates helper functions
- Sets up RLS policies

### 2. TypeScript Types
**File:** `types/roles.ts`
- Defines `RoleName` type: 'admin' | 'landlord' | 'user'
- Defines `Role`, `UserRole`, `UserProfile` interfaces
- Defines `RolePermissions` object with permissions for each role

### 3. Utility Functions
**File:** `lib/roles.ts`
- `getUserRole(userId)` - Get user's role
- `hasRole(userId, roleName)` - Check specific role
- `isAdmin(userId)` - Check if admin
- `isLandlord(userId)` - Check if landlord
- `hasPermission(userId, permission)` - Check specific permission
- `canEditHouse(userId, houseId)` - Check if user can edit specific house
- `getUserHouses(userId)` - Get houses based on role
- `updateUserRole(adminUserId, targetUserId, newRoleId)` - Admin only

### 4. UI Components
**File:** `components/AccountSidebar.tsx`
- Updated to fetch and display user role
- Shows role badge (Admin/Landlord/User)
- Filters navigation menu based on role
- Admin sees: Admin Dashboard, User Management, Analytics
- Landlord sees: My Properties, Booking Management, Special Pricing
- User sees: My Bookings, Dashboard, Profile

## Navigation Structure

### Admin Navigation
- Dashboard
- Profile
- Password Change
- Booking Management (all properties)
- My Properties (all properties)
- Special Pricing (all properties)
- **Admin Dashboard**
- **User Management**
- **Analytics**

### Landlord Navigation
- Dashboard
- Profile
- Password Change
- **Booking Management** (own properties)
- **My Properties** (own properties)
- **Special Pricing** (own properties)

### User Navigation
- Dashboard
- Profile
- Password Change
- **My Bookings**

## Usage Examples

### Check if user can edit a house
```typescript
import { canEditHouse } from '@/lib/roles';

const userId = 'user-uuid';
const houseId = 123;

if (await canEditHouse(userId, houseId)) {
  // Allow editing
} else {
  // Show error
}
```

### Get user's houses based on role
```typescript
import { getUserHouses } from '@/lib/roles';

const { data: houses, error } = await getUserHouses(userId);
// Admin gets all houses
// Landlord gets only their houses
// User gets empty array
```

### Check permissions
```typescript
import { hasPermission } from '@/lib/roles';

if (await hasPermission(userId, 'canAccessAdminDashboard')) {
  // Show admin dashboard
}
```

## Next Steps

### To Complete Implementation:

1. **Run Database Migration**
   ```bash
   # Apply the migration to your Supabase database
   supabase db push
   ```

2. **Assign Initial Roles**
   ```sql
   -- Make yourself an admin
   UPDATE users SET role_id = 1 WHERE email = 'your-email@example.com';
   
   -- Make someone a landlord
   UPDATE users SET role_id = 2 WHERE email = 'landlord@example.com';
   ```

3. **Create Admin Pages**
   - `app/[lang]/account/admin/page.tsx` - Admin dashboard
   - `app/[lang]/account/admin/users/page.tsx` - User management
   - `app/[lang]/account/admin/analytics/page.tsx` - Analytics

4. **Add Route Protection**
   - Create middleware to check roles before allowing access
   - Redirect unauthorized users

5. **Update Existing Pages**
   - Update `app/[lang]/host/edit/[id]/page.tsx` to check ownership
   - Update listings page to filter by role
   - Update booking management to filter by role

## Security Considerations

1. **Always verify on server-side** - Client-side role checks are for UX only
2. **Use RLS policies** - Database enforces access control
3. **Validate ownership** - Always check if landlord owns the resource
4. **Audit logs** - Consider adding audit trail for admin actions
5. **Role changes** - Only admins can change roles

## Testing

1. Create test users with different roles
2. Verify each role can only access their permitted features
3. Test that landlords can only edit their own properties
4. Test that admins can access everything
5. Test that users cannot access landlord/admin features
