// Role types and permissions

export type RoleName = 'admin' | 'landlord' | 'user';

export interface Role {
  id: number;
  name: RoleName;
  description: string;
  created_at: string;
}

export interface UserRole {
  user_id: string;
  email: string;
  role_name: RoleName;
  role_description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  role_id: number;
  role?: Role;
  created_at?: string;
  updated_at?: string;
}

// Permission definitions for each role
export const RolePermissions = {
  admin: {
    canViewAllHouses: true,
    canEditAllHouses: true,
    canDeleteAllHouses: true,
    canManageUsers: true,
    canAccessAdminDashboard: true,
    canViewAnalytics: true,
    canManageRoles: true,
  },
  landlord: {
    canViewAllHouses: false,
    canEditAllHouses: false,
    canDeleteAllHouses: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
    canViewAnalytics: false,
    canManageRoles: false,
    canAddHouses: true,
    canEditOwnHouses: true,
    canDeleteOwnHouses: true,
    canViewOwnHouses: true,
  },
  user: {
    canViewAllHouses: false,
    canEditAllHouses: false,
    canDeleteAllHouses: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
    canViewAnalytics: false,
    canManageRoles: false,
    canAddHouses: false,
    canEditOwnHouses: false,
    canDeleteOwnHouses: false,
    canViewBookings: true,
    canMakeBookings: true,
  },
} as const;

export type Permission = keyof typeof RolePermissions.admin;

// Helper type for checking permissions
export interface PermissionCheck {
  hasPermission: boolean;
  role: RoleName;
  userId: string;
}
