/**
 * VIXUAL - Admin Roles & Permissions System
 * 
 * Hiérarchie administrative:
 * 1. ADMIN/PATRON - contrôle total (jocelyndru@gmail.com)
 * 2. ADMIN-ADJOINT - gestion opérationnelle
 * 3. MODÉRATEUR - surveillance et modération
 * 4. SUPPORT - assistance utilisateurs
 */

export type AdminRole = 'admin' | 'admin_adjoint' | 'moderator' | 'support';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isPatron?: boolean;
  twoFactorEnabled: boolean;
  trustedIPs: string[];
  createdAt: Date;
  lastLogin?: Date;
  permissions: Permission[];
}

export type Permission = 
  | 'suspend_account'
  | 'block_content'
  | 'block_gains'
  | 'block_withdrawals'
  | 'delete_account'
  | 'modify_rules'
  | 'view_finances'
  | 'access_stripe'
  | 'view_logs'
  | 'warn_user'
  | 'freeze_vixupoints'
  | 'freeze_wallet'
  | 'force_verification'
  | 'open_investigation';

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  admin: [
    'suspend_account',
    'block_content',
    'block_gains',
    'block_withdrawals',
    'delete_account',
    'modify_rules',
    'view_finances',
    'access_stripe',
    'view_logs',
    'warn_user',
    'freeze_vixupoints',
    'freeze_wallet',
    'force_verification',
    'open_investigation',
  ],
  admin_adjoint: [
    'suspend_account',
    'block_content',
    'block_gains',
    'block_withdrawals',
    'warn_user',
    'freeze_vixupoints',
    'freeze_wallet',
    'force_verification',
    'open_investigation',
    'view_logs',
    'view_finances',
  ],
  moderator: [
    'block_content',
    'warn_user',
    'view_logs',
  ],
  support: [
    'warn_user',
  ],
};

export const PATRON_EMAIL = 'jocelyndru@gmail.com';

export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function canCreateRole(creatorRole: AdminRole, targetRole: AdminRole): boolean {
  // Only ADMIN can create other admins
  if (creatorRole !== 'admin') return false;
  if (targetRole === 'admin') return false; // Can't create another ADMIN
  return true;
}
