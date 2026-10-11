import { UserRole } from '../types/auth';

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
  StorageCustomer: 'Khách hàng thuê kho',
  FacilityStaff: 'Nhân viên cơ sở',
  FacilityManager: 'Quản lý cơ sở',
  BusinessOperationsManager: 'Quản lý vận hành',
  SystemAdministrator: 'Quản trị hệ thống',
};
