import type { PermissionShort } from '@/types/trojonetworks/permission';

export const PERMISSIONS = {
  Administrator: 'Administrator',
  'Read Network': 'Read Network',
  'Manage Network': 'Manage Network',
  'Read Access': 'Read Access',
  'Manage Access': 'Manage Access',
  'Read Permission': 'Read Permission',
  'Manage Permission': 'Manage Permission',
  'Read Role': 'Read Role',
  'Manage Role': 'Manage Role',
  IsUserOwner: 'IsUserOwner',
  IsNetworkUserOwner: 'IsNetworkUserOwner',
  IsUserProxyOwner: 'IsUserProxyOwner',
  'Read User': 'Read User',
  'Manage User': 'Manage User',
  'Read CustomPage': 'Read CustomPage',
  'Manage CustomPage': 'Manage CustomPage',
  'Read PageBlock': 'Read PageBlock',
  'Manage PageBlock': 'Manage PageBlock',
  'Read File': 'Read File',
  'Manage File': 'Manage File',
  'Read Configuration': 'Read Configuration',
  'Manage Configuration': 'Manage Configuration',
  'Read Blog': 'Read Blog',
  'Manage Blog': 'Manage Blog',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;

const getPermissionValue = (permission: string): string => {
  const value = PERMISSIONS[permission as PermissionKey];
  if (!value) throw new Error(`Permission '${permission}' does not exist.`);

  return value;
};

export function usePermissionChecker() {
  const hasPermission = (
    collection: PermissionShort[] | undefined | null,
    permission: string,
  ): boolean => {
    if (!collection) return false;

    const permissionValue = getPermissionValue(permission);

    return collection.some(
      (p) => p.name === PERMISSIONS.Administrator || p.name === permissionValue,
    );
  };

  return {
    permissions: PERMISSIONS,
    hasPermission,
  };
}
