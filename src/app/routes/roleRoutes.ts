import { UserRole } from '../../features/auth/types/auth';

/**
 * Mỗi Actor = 1 layout / dashboard chính
 * Route được bảo vệ theo role
 */
export const ROLE_HOME: Record<UserRole, string> = {
  StorageCustomer: '/customer',
  FacilityStaff: '/staff',
  FacilityManager: '/manager',
  BusinessOperationsManager: '/operations',
  SystemAdministrator: '/admin',
};

export const ROLE_LABELS: Record<UserRole, string> = {
  StorageCustomer: 'Storage customer',
  FacilityStaff: 'Facility staff',
  FacilityManager: 'Facility management',
  BusinessOperationsManager: 'Operations management',
  SystemAdministrator: 'System administration',
};
