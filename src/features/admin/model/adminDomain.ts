import type { UserRole } from '../../auth/types/auth'

export interface AdminUserAccount {
  id: string
  username: string
  fullName: string
  email: string
  phoneNumber: string
  role: UserRole
  assignedFacilityId: string // 'all' | 'fac-d1' | 'fac-td' | 'fac-bt' | 'fac-q7' | 'fac-cg'
  assignedFacilityName: string
  status: 'Active' | 'Suspended' | 'Pending'
  createdAt: string
  lastLoginAt: string
}

export interface RoleMatrixConfig {
  role: UserRole
  roleNameVi: string
  description: string
  scope: 'Toàn hệ thống' | 'Theo cơ sở phân công' | 'Chỉ dữ liệu cá nhân'
  modules: {
    id: string
    name: string
    canView: boolean
    canCreate: boolean
    canEdit: boolean
    canDelete: boolean
    canExport: boolean
  }[]
}

export interface FacilityAccessConfig {
  id: string
  userId: string
  userName: string
  role: UserRole
  assignedFacilityId: string
  assignedFacilityName: string
  accessLevel: 'FullAccess' | 'OperationalOnly' | 'ReadOnly'
  canManagePricing: boolean
  canManageStaff: boolean
  canExportReports: boolean
  updatedAt: string
}

export interface LoginLogEntry {
  id: string
  username: string
  fullName: string
  role: UserRole
  ipAddress: string
  device: string
  loginTime: string
  status: 'Success' | 'Failed' | 'Suspicious'
  note?: string
}

export interface ActivityAuditEntry {
  id: string
  actorName: string
  role: UserRole
  action: string
  targetEntity: string // 'StorageUnit A-101', 'User account', 'Rental Policy'
  facilityName: string
  timestamp: string
  severity: 'Info' | 'Warning' | 'Critical'
  details: string
}

export interface AdminSystemState {
  users: AdminUserAccount[]
  rolesConfig: RoleMatrixConfig[]
  facilityAccessList: FacilityAccessConfig[]
  loginLogs: LoginLogEntry[]
  activityLogs: ActivityAuditEntry[]
}

const STORAGE_KEY = 'selfstorage:admin-state:v1'

export const initialAdminUsers: AdminUserAccount[] = [
  {
    id: 'usr-001',
    username: 'admin.khuong',
    fullName: 'Lê Nguyễn Quốc Khương',
    email: 'khuong.le@selfstorage.vn',
    phoneNumber: '0909 149 563',
    role: 'SystemAdministrator',
    assignedFacilityId: 'all',
    assignedFacilityName: 'Toàn hệ thống (Toàn quốc)',
    status: 'Active',
    createdAt: '2026-01-15',
    lastLoginAt: '2026-10-17 17:30',
  },
  {
    id: 'usr-002',
    username: 'bom.manh',
    fullName: 'Nguyễn Văn Mạnh',
    email: 'manh.nguyen@selfstorage.vn',
    phoneNumber: '0912 345 678',
    role: 'BusinessOperationsManager',
    assignedFacilityId: 'all',
    assignedFacilityName: 'Toàn hệ thống (Toàn quốc)',
    status: 'Active',
    createdAt: '2026-02-01',
    lastLoginAt: '2026-10-17 16:45',
  },
  {
    id: 'usr-003',
    username: 'fm.ductran',
    fullName: 'Trần Văn Đức',
    email: 'duc.tran@selfstorage.vn',
    phoneNumber: '0903 112 233',
    role: 'FacilityManager',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    status: 'Active',
    createdAt: '2026-03-10',
    lastLoginAt: '2026-10-17 15:10',
  },
  {
    id: 'usr-004',
    username: 'fm.minhle',
    fullName: 'Lê Hoàng Minh',
    email: 'minh.le@selfstorage.vn',
    phoneNumber: '0908 445 667',
    role: 'FacilityManager',
    assignedFacilityId: 'fac-td',
    assignedFacilityName: 'Cơ sở Thủ Đức (TP.HCM)',
    status: 'Active',
    createdAt: '2026-03-15',
    lastLoginAt: '2026-10-17 14:20',
  },
  {
    id: 'usr-005',
    username: 'staff.hung',
    fullName: 'Lê Văn Hùng',
    email: 'hung.le@selfstorage.vn',
    phoneNumber: '0933 556 778',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    status: 'Active',
    createdAt: '2026-04-01',
    lastLoginAt: '2026-10-17 17:05',
  },
  {
    id: 'usr-006',
    username: 'staff.phuong',
    fullName: 'Nguyễn Thị Phương',
    email: 'phuong.nguyen@selfstorage.vn',
    phoneNumber: '0977 889 900',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-td',
    assignedFacilityName: 'Cơ sở Thủ Đức (TP.HCM)',
    status: 'Active',
    createdAt: '2026-04-10',
    lastLoginAt: '2026-10-16 18:30',
  },
  {
    id: 'usr-007',
    username: 'cust.namtran',
    fullName: 'Trần Hoàng Nam',
    email: 'nam.tran@gmail.com',
    phoneNumber: '0988 123 456',
    role: 'StorageCustomer',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (Kho A-101)',
    status: 'Active',
    createdAt: '2026-08-01',
    lastLoginAt: '2026-10-15 20:15',
  },
  {
    id: 'usr-008',
    username: 'cust.lehathanh',
    fullName: 'Lê Thanh Hà',
    email: 'ha.le@gmail.com',
    phoneNumber: '0911 223 344',
    role: 'StorageCustomer',
    assignedFacilityId: 'fac-td',
    assignedFacilityName: 'Cơ sở Thủ Đức (Kho TD-M02)',
    status: 'Suspended',
    createdAt: '2026-07-20',
    lastLoginAt: '2026-10-10 09:12',
  },
]

export const initialRolesConfig: RoleMatrixConfig[] = [
  {
    role: 'StorageCustomer',
    roleNameVi: 'Khách hàng thuê kho',
    description: 'Người dùng thuê kho cá nhân hoặc doanh nghiệp, tìm kiếm kho, đặt chỗ, nhận mã truy cập và quản lý hợp đồng của chính mình.',
    scope: 'Chỉ dữ liệu cá nhân',
    modules: [
      { id: 'm-storage', name: 'Tìm kiếm & Đặt kho lưu trữ', canView: true, canCreate: true, canEdit: false, canDelete: false, canExport: false },
      { id: 'm-contract', name: 'Hợp đồng & Hóa đơn cá nhân', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
      { id: 'm-access', name: 'Mã PIN & Quyền vào kho', canView: true, canCreate: false, canEdit: true, canDelete: false, canExport: false },
      { id: 'm-facility', name: 'Quản lý cơ sở & Nhân sự', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
      { id: 'm-system', name: 'Cấu hình hệ thống & Quản trị', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    ],
  },
  {
    role: 'FacilityStaff',
    roleNameVi: 'Nhân viên cơ sở',
    description: 'Nhân viên trực tại quầy kho: tiếp nhận khách, đối chiếu CCCD, bàn giao mã PIN/chìa, nghiệm thu trả kho và xử lý sự cố tại chỗ.',
    scope: 'Theo cơ sở phân công',
    modules: [
      { id: 'm-storage', name: 'Kiểm tra trạng thái kho & Đơn vị kho', canView: true, canCreate: false, canEdit: true, canDelete: false, canExport: false },
      { id: 'm-contract', name: 'Xác minh đặt kho & Bàn giao nhận kho', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
      { id: 'm-access', name: 'Cấp mã PIN & Xử lý thẻ từ/chìa khóa', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: false },
      { id: 'm-facility', name: 'Lịch trình ca trực & Sự cố tại chỗ', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { id: 'm-system', name: 'Cấu hình hệ thống & Quản trị', canView: false, canCreate: false, canEdit: false, canDelete: false, canExport: false },
    ],
  },
  {
    role: 'FacilityManager',
    roleNameVi: 'Quản lý cơ sở',
    description: 'Trưởng cơ sở quản lý toàn diện 01 cơ sở kho: quản lý danh sách phòng kho, phân công ca trực nhân viên, kiểm tra thanh toán và xử lý nợ quá hạn.',
    scope: 'Theo cơ sở phân công',
    modules: [
      { id: 'm-storage', name: 'Quản lý phòng kho & Quy hoạch mặt bằng', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-contract', name: 'Quản lý hợp đồng & Phê duyệt thuê kho', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { id: 'm-access', name: 'Kiểm soát truy cập & Xử lý quá hạn', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { id: 'm-facility', name: 'Phân ca nhân viên & Đánh giá công việc', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-system', name: 'Báo cáo cơ sở & Thống kê tài chính', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
    ],
  },
  {
    role: 'BusinessOperationsManager',
    roleNameVi: 'Quản lý Điều hành Kinh doanh (BOM)',
    description: 'Giám đốc vận hành & kinh doanh: quản trị toàn bộ danh mục cơ sở toàn quốc, thiết lập chính sách cho thuê chung, khung giá, theo dõi doanh thu và xuất báo cáo.',
    scope: 'Toàn hệ thống',
    modules: [
      { id: 'm-storage', name: 'Danh bạ cơ sở & Quy mô toàn quốc', canView: true, canCreate: true, canEdit: true, canDelete: false, canExport: true },
      { id: 'm-contract', name: 'Chính sách cho thuê & Khung giá niêm yết', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-access', name: 'Biểu phí phát sinh, quá hạn & Khuyến mãi', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-facility', name: 'Hiệu suất vận hành & Tỷ lệ lấp đầy kho', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
      { id: 'm-system', name: 'Xuất báo cáo tài chính & Doanh thu tổng', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
    ],
  },
  {
    role: 'SystemAdministrator',
    roleNameVi: 'Quản trị viên Hệ thống (Admin)',
    description: 'Quản trị viên cấp cao nhất: quản trị tài khoản người dùng, phân quyền vai trò, cấu hình bảo mật, phân bổ cơ sở và giám sát nhật ký kiểm toán Audit Logs.',
    scope: 'Toàn hệ thống',
    modules: [
      { id: 'm-storage', name: 'Quản trị tài khoản & Cấp phát quyền', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-contract', name: 'Cấu hình ma trận vai trò & Quyền dữ liệu', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-access', name: 'Phân bổ cơ sở & Phạm vi truy cập', canView: true, canCreate: true, canEdit: true, canDelete: true, canExport: true },
      { id: 'm-facility', name: 'Theo dõi lịch sử đăng nhập & Phiên làm việc', canView: true, canCreate: false, canEdit: false, canDelete: true, canExport: true },
      { id: 'm-system', name: 'Nhật ký kiểm toán hệ thống (Audit Logs)', canView: true, canCreate: false, canEdit: false, canDelete: false, canExport: true },
    ],
  },
]

export const initialFacilityAccess: FacilityAccessConfig[] = [
  {
    id: 'fa-01',
    userId: 'usr-003',
    userName: 'Trần Văn Đức',
    role: 'FacilityManager',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    accessLevel: 'FullAccess',
    canManagePricing: false,
    canManageStaff: true,
    canExportReports: true,
    updatedAt: '2026-10-10',
  },
  {
    id: 'fa-02',
    userId: 'usr-004',
    userName: 'Lê Hoàng Minh',
    role: 'FacilityManager',
    assignedFacilityId: 'fac-td',
    assignedFacilityName: 'Cơ sở Thủ Đức (TP.HCM)',
    accessLevel: 'FullAccess',
    canManagePricing: false,
    canManageStaff: true,
    canExportReports: true,
    updatedAt: '2026-10-12',
  },
  {
    id: 'fa-03',
    userId: 'usr-005',
    userName: 'Lê Văn Hùng',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-d1',
    assignedFacilityName: 'Cơ sở Quận 1 (TP.HCM)',
    accessLevel: 'OperationalOnly',
    canManagePricing: false,
    canManageStaff: false,
    canExportReports: false,
    updatedAt: '2026-10-14',
  },
  {
    id: 'fa-04',
    userId: 'usr-006',
    userName: 'Nguyễn Thị Phương',
    role: 'FacilityStaff',
    assignedFacilityId: 'fac-td',
    assignedFacilityName: 'Cơ sở Thủ Đức (TP.HCM)',
    accessLevel: 'OperationalOnly',
    canManagePricing: false,
    canManageStaff: false,
    canExportReports: false,
    updatedAt: '2026-10-14',
  },
  {
    id: 'fa-05',
    userId: 'usr-002',
    userName: 'Nguyễn Văn Mạnh',
    role: 'BusinessOperationsManager',
    assignedFacilityId: 'all',
    assignedFacilityName: 'Toàn hệ thống (Toàn quốc)',
    accessLevel: 'FullAccess',
    canManagePricing: true,
    canManageStaff: true,
    canExportReports: true,
    updatedAt: '2026-10-15',
  },
]

export const initialLoginLogs: LoginLogEntry[] = [
  {
    id: 'log-101',
    username: 'admin.khuong',
    fullName: 'Lê Nguyễn Quốc Khương',
    role: 'SystemAdministrator',
    ipAddress: '118.69.182.45',
    device: 'Chrome 128 · Windows 11',
    loginTime: '2026-10-17 17:30:12',
    status: 'Success',
    note: 'Đăng nhập thành công từ IP quản trị cố định',
  },
  {
    id: 'log-102',
    username: 'staff.hung',
    fullName: 'Lê Văn Hùng',
    role: 'FacilityStaff',
    ipAddress: '14.161.35.88',
    device: 'Edge 127 · Windows 10 (Máy quầy Q1)',
    loginTime: '2026-10-17 17:05:40',
    status: 'Success',
    note: 'Đăng nhập vào ca trực chiều',
  },
  {
    id: 'log-103',
    username: 'bom.manh',
    fullName: 'Nguyễn Văn Mạnh',
    role: 'BusinessOperationsManager',
    ipAddress: '115.79.20.12',
    device: 'Safari · macOS Sonoma',
    loginTime: '2026-10-17 16:45:02',
    status: 'Success',
    note: 'Đăng nhập kiểm tra báo cáo doanh thu',
  },
  {
    id: 'log-104',
    username: 'cust.lehathanh',
    fullName: 'Lê Thanh Hà',
    role: 'StorageCustomer',
    ipAddress: '27.72.60.190',
    device: 'Chrome Mobile · iOS 18',
    loginTime: '2026-10-17 16:12:15',
    status: 'Failed',
    note: 'Sai mật khẩu lần 2 (Tài khoản đang bị khóa)',
  },
  {
    id: 'log-105',
    username: 'fm.ductran',
    fullName: 'Trần Văn Đức',
    role: 'FacilityManager',
    ipAddress: '14.161.35.88',
    device: 'Chrome 128 · Windows 11',
    loginTime: '2026-10-17 15:10:33',
    status: 'Success',
    note: 'Phê duyệt hợp đồng thuê mới',
  },
  {
    id: 'log-106',
    username: 'unknown_scanner',
    fullName: 'Không xác định',
    role: 'StorageCustomer',
    ipAddress: '185.220.101.5',
    device: 'Python-requests/2.31',
    loginTime: '2026-10-17 14:02:50',
    status: 'Suspicious',
    note: 'Cảnh báo: Dò quét đăng nhập bất thường, hệ thống đã tự động chặn IP',
  },
]

export const initialActivityLogs: ActivityAuditEntry[] = [
  {
    id: 'act-501',
    actorName: 'Lê Nguyễn Quốc Khương',
    role: 'SystemAdministrator',
    action: 'Cập nhật phân quyền vai trò',
    targetEntity: 'Role: FacilityStaff',
    facilityName: 'Toàn hệ thống',
    timestamp: '2026-10-17 17:15',
    severity: 'Warning',
    details: 'Mở rộng quyền xác minh CCCD và cấp mã PIN truy cập nhanh tại quầy.',
  },
  {
    id: 'act-502',
    actorName: 'Nguyễn Văn Mạnh',
    role: 'BusinessOperationsManager',
    action: 'Điều chỉnh khung giá thuê',
    targetEntity: 'PricingTier: Medium (10m²)',
    facilityName: 'Toàn hệ thống',
    timestamp: '2026-10-17 16:30',
    severity: 'Info',
    details: 'Cập nhật giá thuê niêm yết lên 1.500.000 VNĐ/tháng và ưu đãi năm 15%.',
  },
  {
    id: 'act-503',
    actorName: 'Lê Văn Hùng',
    role: 'FacilityStaff',
    action: 'Bàn giao kho & Đổi trạng thái',
    targetEntity: 'StorageUnit: A-101',
    facilityName: 'Cơ sở Quận 1',
    timestamp: '2026-10-17 15:45',
    severity: 'Info',
    details: 'Hoàn tất bàn giao thẻ từ cho khách Trần Hoàng Nam, kho chuyển sang Occupied.',
  },
  {
    id: 'act-504',
    actorName: 'Trần Văn Đức',
    role: 'FacilityManager',
    action: 'Xử lý quá hạn & Khóa mã PIN',
    targetEntity: 'StorageUnit: TD-M02',
    facilityName: 'Cơ sở Thủ Đức',
    timestamp: '2026-10-17 14:10',
    severity: 'Critical',
    details: 'Vô hiệu hóa mã PIN truy cập do quá hạn thanh toán 5 ngày theo quy chế.',
  },
  {
    id: 'act-505',
    actorName: 'Lê Nguyễn Quốc Khương',
    role: 'SystemAdministrator',
    action: 'Khóa tài khoản người dùng',
    targetEntity: 'User: cust.lehathanh',
    facilityName: 'Cơ sở Thủ Đức',
    timestamp: '2026-10-17 11:20',
    severity: 'Warning',
    details: 'Tạm đình chỉ tài khoản do vi phạm hợp đồng thuê quá hạn không thanh toán.',
  },
]

export const selfStorageDictionary = [
  {
    termEn: 'Storage unit',
    termVi: 'Kho lưu trữ / Đơn vị kho',
    explanation: 'Không gian phòng kho riêng biệt có khóa an toàn (PIN/thẻ/chìa) được khách hàng thuê để cất giữ đồ đạc cá nhân hoặc hàng hóa.',
  },
  {
    termEn: 'Usage rate / Occupancy rate',
    termVi: 'Tỷ lệ lấp đầy / Tỷ lệ sử dụng kho',
    explanation: 'Chỉ số phần trăm số lượng kho đang có khách thuê thực tế chia cho tổng số kho sẵn sàng vận hành của một cơ sở hoặc toàn hệ thống.',
  },
  {
    termEn: 'Overdue handling',
    termVi: 'Xử lý quá hạn',
    explanation: 'Quy trình xử lý đối với các hợp đồng thuê trễ hạn thanh toán: tính phí phạt theo ngày, tạm khóa mã PIN và niêm phong kho lưu trữ.',
  },
  {
    termEn: 'Handover / Move-in',
    termVi: 'Thủ tục nhận kho & Bàn giao',
    explanation: 'Thủ tục đối chiếu giấy tờ tùy thân, ký biên bản bàn giao hiện trạng, cấp mã PIN điện tử, thẻ từ RFID hoặc chìa khóa vật lý.',
  },
  {
    termEn: 'Check-out / Move-out',
    termVi: 'Nghiệm thu trả kho & Thanh lý',
    explanation: 'Quy trình kiểm tra vệ sinh mặt bằng, kiểm tra hư hỏng trang thiết bị, thu hồi thẻ/chìa và hoàn tiền cọc cho khách hàng.',
  },
  {
    termEn: 'Security deposit',
    termVi: 'Tiền đặt cọc an ninh',
    explanation: 'Khoản tiền đặt cọc (thường tương đương 1 tháng tiền thuê) được giữ lại để đảm bảo trách nhiệm hợp đồng và hoàn lại khi thanh lý.',
  },
  {
    termEn: 'Grace period',
    termVi: 'Thời gian ân hạn',
    explanation: 'Khoảng thời gian (thường 3 ngày) sau ngày đến hạn mà khách hàng chưa bị tính phí phạt hoặc chưa bị khóa mã truy cập kho.',
  },
  {
    termEn: 'Facility scoping',
    termVi: 'Phân quyền theo cơ sở',
    explanation: 'Cơ chế giới hạn quyền hạn nhân sự (nhân viên, quản lý) chỉ được xem và thao tác dữ liệu thuộc cơ sở mình được phân công phụ trách.',
  },
]

export function loadAdminData(): AdminSystemState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial: AdminSystemState = {
        users: initialAdminUsers,
        rolesConfig: initialRolesConfig,
        facilityAccessList: initialFacilityAccess,
        loginLogs: initialLoginLogs,
        activityLogs: initialActivityLogs,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw) as AdminSystemState
  } catch {
    return {
      users: initialAdminUsers,
      rolesConfig: initialRolesConfig,
      facilityAccessList: initialFacilityAccess,
      loginLogs: initialLoginLogs,
      activityLogs: initialActivityLogs,
    }
  }
}

export function saveAdminData(data: AdminSystemState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save admin data', err)
  }
}
