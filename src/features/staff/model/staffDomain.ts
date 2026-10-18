import { readUnits, type ManagedUnit, type unitStatuses } from '../../manager/model/storageUnits'
import { loadWorkspace, saveWorkspace } from '../../manager/model/facilityWorkspace'

export interface StaffShiftInfo {
  staffId: string
  staffName: string
  role: string
  shift: string
  facility: string
  facilityAddress: string
  phone: string
  status: 'Active' | 'Break' | 'Off'
}

export interface DailyTask {
  id: string
  time: string
  title: string
  customer: string
  unitCode: string
  type: 'check-in' | 'check-out' | 'inspection' | 'incident'
  status: 'pending' | 'in_progress' | 'completed'
  priority: 'normal' | 'high' | 'urgent'
  notes?: string
}

export interface BookingVerification {
  id: string
  bookingCode: string
  customerName: string
  customerPhone: string
  customerIdCard: string // CCCD
  customerEmail: string
  unitId: string
  unitCode: string
  unitType: 'Small' | 'Medium' | 'Large'
  unitArea: number
  startDate: string
  endDate: string
  depositAmount: number
  rentalAmount: number
  paymentStatus: 'Paid' | 'Partial' | 'Pending'
  verificationStatus: 'unverified' | 'verified' | 'checked_in'
  verifiedAt?: string
  verifiedBy?: string
  notes?: string
}

export interface HandoverRecord {
  id: string
  bookingCode: string
  unitCode: string
  customerName: string
  customerPhone: string
  accessMethod: 'pin' | 'card' | 'key'
  accessCode: string // PIN code or Card ID or Key ID
  checklist: {
    unitCleaned: boolean
    doorLockChecked: boolean
    accessDeviceHanded: boolean
    safetyRulesExplained: boolean
    contractSigned: boolean
  }
  handoverTime: string
  staffName: string
  customerConfirmed: boolean
  notes?: string
}

export interface ReturnInspection {
  id: string
  bookingCode: string
  unitCode: string
  customerName: string
  customerPhone: string
  returnDate: string
  cleanliness: 'clean' | 'dusty' | 'debris_left'
  equipmentCondition: 'good' | 'minor_scratches' | 'damaged'
  accessDeviceReturned: boolean
  penaltyAmount: number
  penaltyReason?: string
  depositRefundStatus: 'full_refund' | 'partial_refund' | 'no_refund'
  inspectionNotes: string
  inspectorName: string
  status: 'pending_inspection' | 'completed'
}

export interface IncidentTicket {
  id: string
  unitCode: string
  customerName: string
  customerPhone: string
  type: 'lost_key' | 'pin_error' | 'door_stuck' | 'damage' | 'support_request' | 'other'
  title: string
  description: string
  priority: 'urgent' | 'high' | 'normal' | 'low'
  status: 'open' | 'in_progress' | 'resolved'
  reportedAt: string
  resolvedAt?: string
  resolutionNotes?: string
  assignedTo: string
}

export interface StaffData {
  shiftInfo: StaffShiftInfo
  dailyTasks: DailyTask[]
  verifications: BookingVerification[]
  handovers: HandoverRecord[]
  returns: ReturnInspection[]
  incidents: IncidentTicket[]
}

const STAFF_STORAGE_KEY = 'selfstorage:staff-workspace:v1'

const initialShift: StaffShiftInfo = {
  staffId: 'STAFF-082',
  staffName: 'Lê Văn Hùng',
  role: 'Nhân viên trực cơ sở kho (Facility Staff)',
  shift: 'Ca sáng - chiều (07:30 – 16:30)',
  facility: 'Chi nhánh Quận 1 · Tòa nhà SelfStorage Center',
  facilityAddress: 'Số 45 Lê Duẩn, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
  phone: '0908 772 341',
  status: 'Active',
}

const initialTasks: DailyTask[] = [
  { id: 'T-01', time: '08:00', title: 'Kiểm tra mở ca & an ninh hành lang Tầng 1 - 2', customer: 'Nội bộ cơ sở', unitCode: 'Tất cả khu A-B', type: 'inspection', status: 'completed', priority: 'normal', notes: 'Hệ thống camera, đèn chiếu sáng, thông gió hoạt động ổn định.' },
  { id: 'T-02', time: '09:00', title: 'Hỗ trợ khách hàng nhận kho & cấp mã PIN', customer: 'Nguyễn Minh Anh', unitCode: 'A-101', type: 'check-in', status: 'completed', priority: 'high', notes: 'Đã hoàn tất bàn giao mã PIN 6 số và ký biên bản.' },
  { id: 'T-03', time: '10:30', title: 'Xác minh hồ sơ đặt chỗ & CCCD trước nhận kho', customer: 'Phạm Gia Huy', unitCode: 'B-201', type: 'check-in', status: 'in_progress', priority: 'high', notes: 'Khách hẹn đến quầy lúc 11:00 để kiểm tra kho.' },
  { id: 'T-04', time: '11:15', title: 'Xử lý sự cố kẹt khóa điện tử tại chỗ', customer: 'Trần Hoàng Nam', unitCode: 'A-102', type: 'incident', status: 'in_progress', priority: 'urgent', notes: 'Bàn phím PIN chập chờn pin yếu, cần thay pin 9V.' },
  { id: 'T-05', time: '14:00', title: 'Kiểm tra hiện trạng trả kho & hoàn cọc', customer: 'Lê Thanh Hà', unitCode: 'B-202', type: 'check-out', status: 'pending', priority: 'normal', notes: 'Khách trả kho đúng hạn hợp đồng, cần kiểm tra vệ sinh sàn.' },
  { id: 'T-06', time: '15:30', title: 'Nghiệm thu dọn dẹp kho C-301 sau bảo trì', customer: 'Đội vệ sinh đối tác', unitCode: 'C-301', type: 'inspection', status: 'pending', priority: 'normal', notes: 'Chuyển trạng thái kho về Available sau khi dọn xong.' },
]

const initialVerifications: BookingVerification[] = [
  {
    id: 'VER-001',
    bookingCode: 'BK-8901',
    customerName: 'Nguyễn Minh Anh',
    customerPhone: '0912 345 678',
    customerIdCard: '079201004567',
    customerEmail: 'minhanh.nguyen@gmail.com',
    unitId: 'sample-a101',
    unitCode: 'A-101',
    unitType: 'Small',
    unitArea: 5,
    startDate: '2026-10-15',
    endDate: '2027-01-15',
    depositAmount: 850000,
    rentalAmount: 850000,
    paymentStatus: 'Paid',
    verificationStatus: 'checked_in',
    verifiedAt: '2026-10-15 08:45',
    verifiedBy: 'Lê Văn Hùng',
    notes: 'Đầy đủ CCCD gốc đối chiếu, cọc đã vào tài khoản công ty.'
  },
  {
    id: 'VER-002',
    bookingCode: 'BK-8902',
    customerName: 'Phạm Gia Huy',
    customerPhone: '0938 123 456',
    customerIdCard: '079203009812',
    customerEmail: 'giahuy.pham@outlook.com',
    unitId: 'sample-b201',
    unitCode: 'B-201',
    unitType: 'Large',
    unitArea: 20,
    startDate: '2026-10-15',
    endDate: '2027-04-15',
    depositAmount: 2800000,
    rentalAmount: 2800000,
    paymentStatus: 'Paid',
    verificationStatus: 'verified',
    verifiedAt: '2026-10-15 10:15',
    verifiedBy: 'Lê Văn Hùng',
    notes: 'Khách đến đúng hẹn, CCCD hợp lệ, đang chờ bàn giao chìa và thẻ từ.'
  },
  {
    id: 'VER-003',
    bookingCode: 'BK-8903',
    customerName: 'Đặng Quốc Bảo',
    customerPhone: '0977 889 900',
    customerIdCard: '079198007765',
    customerEmail: 'baodang.design@gmail.com',
    unitId: 'sample-c301',
    unitCode: 'C-301',
    unitType: 'Medium',
    unitArea: 10,
    startDate: '2026-10-16',
    endDate: '2027-01-16',
    depositAmount: 1500000,
    rentalAmount: 1500000,
    paymentStatus: 'Paid',
    verificationStatus: 'unverified',
    notes: 'Khách đã thanh toán qua thẻ tín dụng, cần đối chiếu CCCD khi đến nhận kho.'
  },
  {
    id: 'VER-004',
    bookingCode: 'BK-8904',
    customerName: 'Vũ Thị Mai Lan',
    customerPhone: '0903 667 889',
    customerIdCard: '079195003344',
    customerEmail: 'mailan.vu@fpt.com.vn',
    unitId: 'sample-a103',
    unitCode: 'A-103',
    unitType: 'Small',
    unitArea: 6,
    startDate: '2026-10-16',
    endDate: '2026-12-16',
    depositAmount: 950000,
    rentalAmount: 950000,
    paymentStatus: 'Partial',
    verificationStatus: 'unverified',
    notes: 'Mới thanh toán cọc 50%, cần thu nốt phần còn lại tại quầy khi nhận kho.'
  }
]

const initialHandovers: HandoverRecord[] = [
  {
    id: 'HO-01',
    bookingCode: 'BK-8901',
    unitCode: 'A-101',
    customerName: 'Nguyễn Minh Anh',
    customerPhone: '0912 345 678',
    accessMethod: 'pin',
    accessCode: '682914',
    checklist: {
      unitCleaned: true,
      doorLockChecked: true,
      accessDeviceHanded: true,
      safetyRulesExplained: true,
      contractSigned: true
    },
    handoverTime: '2026-10-15 09:10',
    staffName: 'Lê Văn Hùng',
    customerConfirmed: true,
    notes: 'Bàn giao mã PIN điện tử, hướng dẫn thao tác nhập mã mở kho thành công.'
  }
]

const initialReturns: ReturnInspection[] = [
  {
    id: 'RET-01',
    bookingCode: 'BK-7812',
    unitCode: 'B-202',
    customerName: 'Lê Thanh Hà',
    customerPhone: '0909 234 567',
    returnDate: '2026-10-15',
    cleanliness: 'clean',
    equipmentCondition: 'good',
    accessDeviceReturned: true,
    penaltyAmount: 0,
    depositRefundStatus: 'full_refund',
    inspectionNotes: 'Kho trống trơn, dọn dẹp sạch sẽ, ổ khóa nguyên vẹn. Đủ điều kiện hoàn cọc 100%.',
    inspectorName: 'Lê Văn Hùng',
    status: 'pending_inspection'
  },
  {
    id: 'RET-02',
    bookingCode: 'BK-7640',
    unitCode: 'A-104',
    customerName: 'Hoàng Trọng Nghĩa',
    customerPhone: '0988 554 433',
    returnDate: '2026-10-14',
    cleanliness: 'clean',
    equipmentCondition: 'minor_scratches',
    accessDeviceReturned: true,
    penaltyAmount: 0,
    depositRefundStatus: 'full_refund',
    inspectionNotes: 'Xước nhẹ sơn tường ngoài do dọn đồ, trong giới hạn hao mòn tự nhiên, hoàn cọc đầy đủ.',
    inspectorName: 'Lê Văn Hùng',
    status: 'completed'
  }
]

const initialIncidents: IncidentTicket[] = [
  {
    id: 'INC-101',
    unitCode: 'A-102',
    customerName: 'Trần Hoàng Nam',
    customerPhone: '0933 881 122',
    type: 'pin_error',
    title: 'Bàn phím khóa số không nhận tín hiệu nhập mã',
    description: 'Khách đến lấy tài liệu nhưng bấm mã PIN không có phản hồi âm thanh. Đèn báo pin nhấp nháy đỏ.',
    priority: 'urgent',
    status: 'in_progress',
    reportedAt: '2026-10-15 10:45',
    assignedTo: 'Lê Văn Hùng'
  },
  {
    id: 'INC-102',
    unitCode: 'B-201',
    customerName: 'Lê Quốc Đạt',
    customerPhone: '0918 332 211',
    type: 'lost_key',
    title: 'Khách báo mất 01 thẻ từ ra vào khu vực tầng 2',
    description: 'Khách đánh rơi thẻ từ RFID khi di chuyển, yêu cầu hủy quyền thẻ cũ và cấp thẻ mới.',
    priority: 'high',
    status: 'resolved',
    reportedAt: '2026-10-15 08:30',
    resolvedAt: '2026-10-15 09:15',
    resolutionNotes: 'Đã vô hiệu hóa mã thẻ RFID #CARD-781, lập phiếu thu phí cấp lại thẻ 100.000đ và cấp thẻ mới #CARD-992.',
    assignedTo: 'Lê Văn Hùng'
  },
  {
    id: 'INC-103',
    unitCode: 'Dãy B Tầng 1',
    customerName: 'Đặng Thanh Tâm',
    customerPhone: '0972 665 544',
    type: 'support_request',
    title: 'Cần mượn xe đẩy hàng chịu tải lớn (400kg)',
    description: 'Khách chuyển kho hàng gia dụng cồng kềnh, cần mượn 2 xe kéo sàn và hỗ trợ mở cửa cuốn khoang xe tải.',
    priority: 'normal',
    status: 'resolved',
    reportedAt: '2026-10-15 09:40',
    resolvedAt: '2026-10-15 10:00',
    resolutionNotes: 'Đã xuất kho 2 xe kéo sàn từ phòng kỹ thuật, khách đã ký mượn và sử dụng an toàn.',
    assignedTo: 'Lê Văn Hùng'
  }
]

export function loadStaffData(): StaffData {
  try {
    const raw = localStorage.getItem(STAFF_STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as StaffData
      return {
        shiftInfo: parsed.shiftInfo || initialShift,
        dailyTasks: parsed.dailyTasks || initialTasks,
        verifications: parsed.verifications || initialVerifications,
        handovers: parsed.handovers || initialHandovers,
        returns: parsed.returns || initialReturns,
        incidents: parsed.incidents || initialIncidents,
      }
    }
  } catch (err) {
    console.error('Error loading staff data:', err)
  }
  return {
    shiftInfo: initialShift,
    dailyTasks: initialTasks,
    verifications: initialVerifications,
    handovers: initialHandovers,
    returns: initialReturns,
    incidents: initialIncidents,
  }
}

export function saveStaffData(data: StaffData) {
  try {
    localStorage.setItem(STAFF_STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Error saving staff data:', err)
  }
}

/** Đọc danh sách tất cả các kho (tương thích trực tiếp với dữ liệu Facility Manager) */
export function getFacilityUnits(): ManagedUnit[] {
  try {
    return readUnits(localStorage)
  } catch {
    return [
      { id: 'sample-a101', code: 'A-101', type: 'Small', area: 5, location: 'Floor 1 · Zone A', price: 850000, status: 'Occupied' },
      { id: 'sample-a102', code: 'A-102', type: 'Medium', area: 10, location: 'Floor 1 · Zone A', price: 1500000, status: 'Occupied' },
      { id: 'sample-a103', code: 'A-103', type: 'Small', area: 6, location: 'Floor 1 · Zone A', price: 950000, status: 'Available' },
      { id: 'sample-b201', code: 'B-201', type: 'Large', area: 20, location: 'Floor 2 · Zone B', price: 2800000, status: 'Occupied' },
      { id: 'sample-b202', code: 'B-202', type: 'Medium', area: 10, location: 'Floor 2 · Zone B', price: 1500000, status: 'Cleaning' },
      { id: 'sample-c301', code: 'C-301', type: 'Medium', area: 10, location: 'Floor 3 · Zone C', price: 1500000, status: 'Maintenance' },
      { id: 'sample-c302', code: 'C-302', type: 'Small', area: 5, location: 'Floor 3 · Zone C', price: 850000, status: 'Available' },
    ]
  }
}

/** Cập nhật trạng thái một kho đồng thời đồng bộ vào Workspace của hệ thống */
export function updateStorageUnitStatus(unitId: string, newStatus: typeof unitStatuses[number]) {
  try {
    const ws = loadWorkspace(localStorage)
    const updatedUnits = ws.units.map(u => u.id === unitId ? { ...u, status: newStatus } : u)
    saveWorkspace(localStorage, { ...ws, units: updatedUnits })
    return true
  } catch (err) {
    console.error('Could not sync with workspace, saving locally:', err)
    return false
  }
}
