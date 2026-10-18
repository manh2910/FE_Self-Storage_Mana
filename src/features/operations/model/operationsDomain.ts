export interface FacilityItem {
  id: string
  code: string
  name: string
  district: string
  city: string
  address: string
  managerName: string
  managerPhone: string
  managerEmail: string
  totalUnits: number
  occupiedUnits: number
  totalArea: number // m2
  status: 'active' | 'upgrading' | 'paused'
  openHours: string
  amenities: string[]
  monthlyRevenue: number // VND
}

export interface RentalPolicyConfig {
  id: string
  category: 'deposit' | 'renewal' | 'cancellation' | 'moveout' | 'overdue'
  title: string
  description: string
  value: string
  appliesTo: 'all' | 'custom'
  lastUpdated: string
  updatedBy: string
}

export interface PricingTier {
  id: string
  unitType: 'Small' | 'Medium' | 'Large' | 'Cold'
  name: string
  areaM2: number
  baseMonthlyPrice: number // VND
  quarterlyDiscountPercent: number // %
  annualDiscountPercent: number // %
  securityDeposit: number // VND
  status: 'active' | 'draft'
}

export interface AdditionalFee {
  id: string
  code: string
  name: string
  category: 'service' | 'penalty' | 'overdue' | 'damage'
  standardAmount: number // VND
  unit: string
  description: string
  isActive: boolean
}

export interface PromotionPolicy {
  id: string
  code: string
  title: string
  type: 'percent' | 'fixed_amount' | 'free_days'
  discountValue: number
  minLeaseMonths: number
  validUntil: string
  targetCustomers: 'all' | 'new_customer' | 'corporate'
  status: 'active' | 'scheduled' | 'expired'
  usageCount: number
}

export interface FacilityPerformance {
  facilityId: string
  facilityName: string
  occupancyRate: number // %
  targetOccupancyRate: number // %
  currentMonthRevenue: number
  previousMonthRevenue: number
  growthRate: number // %
  revPAM: number // Doanh thu trên mỗi m2
  totalUnits: number
  availableUnits: number
  occupiedUnits: number
  maintenanceUnits: number
  rating: 'excellent' | 'good' | 'warning'
}

export interface SystemReportRow {
  id: string
  contractCode: string
  facilityName: string
  unitCode: string
  unitType: 'Small' | 'Medium' | 'Large' | 'Cold'
  customerName: string
  customerType: 'Cá nhân' | 'Doanh nghiệp'
  startDate: string
  endDate: string
  monthlyRent: number
  depositPaid: number
  rentalStatus: 'Active' | 'Pending_Handover' | 'Overdue' | 'Returned'
  paymentStatus: 'Paid' | 'Pending' | 'Overdue'
}

export interface OperationsState {
  facilities: FacilityItem[]
  policies: RentalPolicyConfig[]
  pricingTiers: PricingTier[]
  additionalFees: AdditionalFee[]
  promotions: PromotionPolicy[]
}

const STORAGE_KEY = 'selfstorage:bom-operations:v1'

export const initialFacilities: FacilityItem[] = [
  {
    id: 'fac-d1',
    code: 'SS-HCM-D1',
    name: 'SelfStorage Quận 1',
    district: 'Quận 1',
    city: 'TP. Hồ Chí Minh',
    address: '128 Nguyễn Du, Bến Thành, Quận 1, TP.HCM',
    managerName: 'Trần Văn Đức',
    managerPhone: '0903 112 233',
    managerEmail: 'duc.tran@selfstorage.vn',
    totalUnits: 60,
    occupiedUnits: 53,
    totalArea: 650,
    status: 'active',
    openHours: '06:00 - 22:00 (Thẻ từ 24/7)',
    amenities: ['Bảo vệ 24/7', 'Camera AI nhận diện', 'Kiểm soát nhiệt độ & độ ẩm', 'Thang hàng tải trọng 2 tấn', 'Wifi tốc độ cao'],
    monthlyRevenue: 87500000,
  },
  {
    id: 'fac-td',
    code: 'SS-HCM-TD',
    name: 'SelfStorage Thủ Đức',
    district: 'TP. Thủ Đức',
    city: 'TP. Hồ Chí Minh',
    address: '45 Võ Văn Ngân, Linh Chiểu, TP. Thủ Đức, TP.HCM',
    managerName: 'Lê Hoàng Minh',
    managerPhone: '0908 445 667',
    managerEmail: 'minh.le@selfstorage.vn',
    totalUnits: 90,
    occupiedUnits: 72,
    totalArea: 1100,
    status: 'active',
    openHours: '06:00 - 22:00 (Thẻ từ 24/7)',
    amenities: ['Bảo vệ 24/7', 'Bãi đỗ xe tải bốc dỡ', 'Kho lạnh chuyên dụng', 'Hệ thống báo cháy tự động', 'Xe nâng & xe đẩy hàng'],
    monthlyRevenue: 104200000,
  },
  {
    id: 'fac-bt',
    code: 'SS-HCM-BT',
    name: 'SelfStorage Bình Thạnh',
    district: 'Bình Thạnh',
    city: 'TP. Hồ Chí Minh',
    address: '208 Điện Biên Phủ, Phường 22, Bình Thạnh, TP.HCM',
    managerName: 'Phạm Hồng Ánh',
    managerPhone: '0912 334 556',
    managerEmail: 'anh.pham@selfstorage.vn',
    totalUnits: 50,
    occupiedUnits: 44,
    totalArea: 520,
    status: 'active',
    openHours: '07:00 - 21:00 (Thẻ từ 24/7)',
    amenities: ['Bảo vệ 24/7', 'Camera an ninh', 'Cửa cuốn tự động', 'Khu đóng gói miễn phí'],
    monthlyRevenue: 66800000,
  },
  {
    id: 'fac-q7',
    code: 'SS-HCM-Q7',
    name: 'SelfStorage Quận 7 (Phú Mỹ Hưng)',
    district: 'Quận 7',
    city: 'TP. Hồ Chí Minh',
    address: '15 Nguyễn Văn Linh, Tân Phong, Quận 7, TP.HCM',
    managerName: 'Đỗ Quốc Tuấn',
    managerPhone: '0938 778 990',
    managerEmail: 'tuan.do@selfstorage.vn',
    totalUnits: 80,
    occupiedUnits: 61,
    totalArea: 950,
    status: 'active',
    openHours: '24/7 Toàn thời gian',
    amenities: ['Bảo vệ 24/7', 'Kho lạnh chuẩn dược phẩm', 'Thang hàng công nghiệp', 'Kiểm soát ẩm 45-55%', 'Hầm đỗ container'],
    monthlyRevenue: 98500000,
  },
  {
    id: 'fac-cg',
    code: 'SS-HN-CG',
    name: 'SelfStorage Cầu Giấy',
    district: 'Cầu Giấy',
    city: 'Hà Nội',
    address: '89 Cầu Giấy, Quan Hoa, Cầu Giấy, Hà Nội',
    managerName: 'Nguyễn Thị Thu Hằng',
    managerPhone: '0945 667 889',
    managerEmail: 'hang.nguyen@selfstorage.vn',
    totalUnits: 75,
    occupiedUnits: 56,
    totalArea: 800,
    status: 'upgrading',
    openHours: '06:30 - 21:30',
    amenities: ['Bảo vệ 24/7', 'Camera AI', 'Hệ thống hút ẩm', 'Đang mở rộng khu kho lạnh'],
    monthlyRevenue: 79200000,
  },
]

export const initialPolicies: RentalPolicyConfig[] = [
  {
    id: 'pol-dep-01',
    category: 'deposit',
    title: 'Quy chuẩn tiền cọc đảm bảo hợp đồng',
    description: 'Khách hàng đặt cọc tương đương đúng 01 tháng tiền thuê kho trước khi nhận kho. Tiền cọc được bảo lưu và hoàn lại 100% khi thanh lý hợp đồng hợp lệ.',
    value: '100% giá thuê 1 tháng',
    appliesTo: 'all',
    lastUpdated: '2026-10-10',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
  {
    id: 'pol-dep-02',
    category: 'deposit',
    title: 'Thời gian hoàn tiền cọc sau nghiệm thu',
    description: 'Thời gian chuyển khoản hoàn lại tiền cọc cho khách hàng trong vòng tối đa 03 ngày làm việc kể từ thời điểm ký biên bản nghiệm thu trả kho hoàn tất.',
    value: 'Tối đa 3 ngày làm việc',
    appliesTo: 'all',
    lastUpdated: '2026-10-12',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
  {
    id: 'pol-ren-01',
    category: 'renewal',
    title: 'Thời hạn thông báo gia hạn hợp đồng',
    description: 'Hệ thống tự động gửi thông báo nhắc gia hạn qua SMS/Email trước ngày kết thúc hợp đồng 07 ngày. Khách hàng xác nhận gia hạn trực tuyến hoặc tại quầy.',
    value: '7 ngày trước khi hết hạn',
    appliesTo: 'all',
    lastUpdated: '2026-10-05',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
  {
    id: 'pol-can-01',
    category: 'cancellation',
    title: 'Quy định hủy giữ chỗ trước ngày nhận kho',
    description: 'Hủy trước 48h hoàn 100% tiền cọc giữ chỗ; hủy trong vòng 24h - 48h hoàn 50%; hủy dưới 24h hoặc ngày nhận kho không hoàn cọc giữ chỗ.',
    value: 'Phân bậc: 100% / 50% / 0%',
    appliesTo: 'all',
    lastUpdated: '2026-10-08',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
  {
    id: 'pol-mov-01',
    category: 'moveout',
    title: 'Thông báo trả kho và nghiệm thu vệ sinh',
    description: 'Khách hàng cần tạo thông báo trả kho trước tối thiểu 03 ngày. Khách hàng có trách nhiệm dọn dẹp sạch sẽ đồ đạc, rác thải và bàn giao chìa khóa/thẻ từ.',
    value: 'Báo trước tối thiểu 3 ngày',
    appliesTo: 'all',
    lastUpdated: '2026-10-09',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
  {
    id: 'pol-ove-01',
    category: 'overdue',
    title: 'Thời gian ân hạn và khóa mã truy cập',
    description: 'Ân hạn thanh toán 03 ngày sau ngày đến hạn. Quá hạn 04 ngày sẽ tự động vô hiệu hóa mã PIN/thẻ từ cửa kho. Quá hạn 15 ngày sẽ lập biên bản niêm phong kho.',
    value: 'Ân hạn 3 ngày · Khóa ngày 4 · Niêm phong ngày 15',
    appliesTo: 'all',
    lastUpdated: '2026-10-11',
    updatedBy: 'Lê Nguyễn Quốc Khương (BOM)',
  },
]

export const initialPricingTiers: PricingTier[] = [
  {
    id: 'tier-s',
    unitType: 'Small',
    name: 'Kho nhỏ cá nhân (Small)',
    areaM2: 5,
    baseMonthlyPrice: 850000,
    quarterlyDiscountPercent: 5,
    annualDiscountPercent: 12,
    securityDeposit: 850000,
    status: 'active',
  },
  {
    id: 'tier-m',
    unitType: 'Medium',
    name: 'Kho vừa hộ gia đình (Medium)',
    areaM2: 10,
    baseMonthlyPrice: 1500000,
    quarterlyDiscountPercent: 7,
    annualDiscountPercent: 15,
    securityDeposit: 1500000,
    status: 'active',
  },
  {
    id: 'tier-l',
    unitType: 'Large',
    name: 'Kho lớn doanh nghiệp (Large)',
    areaM2: 20,
    baseMonthlyPrice: 2800000,
    quarterlyDiscountPercent: 10,
    annualDiscountPercent: 18,
    securityDeposit: 2800000,
    status: 'active',
  },
  {
    id: 'tier-c',
    unitType: 'Cold',
    name: 'Kho lạnh kiểm soát nhiệt độ (Cold Storage)',
    areaM2: 10,
    baseMonthlyPrice: 2400000,
    quarterlyDiscountPercent: 5,
    annualDiscountPercent: 12,
    securityDeposit: 2400000,
    status: 'active',
  },
]

export const initialAdditionalFees: AdditionalFee[] = [
  {
    id: 'fee-key',
    code: 'FEE-KEY-LOST',
    name: 'Phí cấp lại thẻ từ RFID / Chìa khóa dự phòng',
    category: 'service',
    standardAmount: 150000,
    unit: 'Lần cấp lại',
    description: 'Áp dụng khi khách làm mất thẻ từ ra vào hoặc chìa khóa cơ của kho lưu trữ.',
    isActive: true,
  },
  {
    id: 'fee-clean',
    code: 'FEE-CLEAN-DEBRIS',
    name: 'Phí vệ sinh rác thải tồn đọng khi trả kho',
    category: 'penalty',
    standardAmount: 200000,
    unit: 'Khoản phạt / lần',
    description: 'Áp dụng khi khách trả kho để lại rác thải cồng kềnh, thùng carton hoặc vết bẩn nặng.',
    isActive: true,
  },
  {
    id: 'fee-late',
    code: 'FEE-LATE-DAY',
    name: 'Phí phạt quá hạn thanh toán theo ngày',
    category: 'overdue',
    standardAmount: 50000,
    unit: 'VNĐ / ngày trễ hạn',
    description: 'Bắt đầu tính từ ngày thứ 4 sau ngày đến hạn kỳ thanh toán tiền thuê kho.',
    isActive: true,
  },
  {
    id: 'fee-unlock',
    code: 'FEE-UNLOCK-OVERDUE',
    name: 'Phí mở khóa truy cập sau niêm phong nợ cước',
    category: 'overdue',
    standardAmount: 250000,
    unit: 'Lần mở khóa',
    description: 'Phí kiểm tra, mở niêm phong và kích hoạt lại mã PIN sau khi khách thanh toán nợ.',
    isActive: true,
  },
  {
    id: 'fee-cart',
    code: 'FEE-CART-RENTAL',
    name: 'Mượn xe kéo đẩy hàng nội bộ cơ sở',
    category: 'service',
    standardAmount: 0,
    unit: 'Miễn phí',
    description: 'Tiện ích miễn phí hỗ trợ khách hàng tự bốc xếp và vận chuyển đồ đạc trong ca trực.',
    isActive: true,
  },
]

export const initialPromotions: PromotionPolicy[] = [
  {
    id: 'promo-welcome',
    code: 'CHAOBANMOI',
    title: 'Ưu đãi tháng đầu cho khách hàng cá nhân mới',
    type: 'percent',
    discountValue: 15,
    minLeaseMonths: 3,
    validUntil: '2026-12-31',
    targetCustomers: 'new_customer',
    status: 'active',
    usageCount: 42,
  },
  {
    id: 'promo-biz',
    code: 'DOANHNGHIEP2026',
    title: 'Gói hỗ trợ lưu trữ hồ sơ doanh nghiệp vừa và nhỏ',
    type: 'percent',
    discountValue: 20,
    minLeaseMonths: 12,
    validUntil: '2026-12-31',
    targetCustomers: 'corporate',
    status: 'active',
    usageCount: 18,
  },
  {
    id: 'promo-moving',
    code: 'MIENPHIDONKHO',
    title: 'Tặng 07 ngày lưu trữ khi ký hợp đồng trên 6 tháng',
    type: 'free_days',
    discountValue: 7,
    minLeaseMonths: 6,
    validUntil: '2026-11-30',
    targetCustomers: 'all',
    status: 'active',
    usageCount: 29,
  },
]

export const sampleReportRows: SystemReportRow[] = [
  {
    id: 'rep-01',
    contractCode: 'HD-2026-089',
    facilityName: 'SelfStorage Quận 1',
    unitCode: 'A-101',
    unitType: 'Small',
    customerName: 'Trần Hoàng Nam',
    customerType: 'Cá nhân',
    startDate: '2026-08-01',
    endDate: '2026-11-01',
    monthlyRent: 850000,
    depositPaid: 850000,
    rentalStatus: 'Active',
    paymentStatus: 'Paid',
  },
  {
    id: 'rep-02',
    contractCode: 'HD-2026-092',
    facilityName: 'SelfStorage Quận 1',
    unitCode: 'A-102',
    unitType: 'Medium',
    customerName: 'Công ty TNHH Logistics Nam Việt',
    customerType: 'Doanh nghiệp',
    startDate: '2026-07-15',
    endDate: '2027-01-15',
    monthlyRent: 1500000,
    depositPaid: 1500000,
    rentalStatus: 'Active',
    paymentStatus: 'Paid',
  },
  {
    id: 'rep-03',
    contractCode: 'HD-2026-105',
    facilityName: 'SelfStorage Thủ Đức',
    unitCode: 'TD-M02',
    unitType: 'Medium',
    customerName: 'Lê Thanh Hà',
    customerType: 'Cá nhân',
    startDate: '2026-09-01',
    endDate: '2026-10-15',
    monthlyRent: 1300000,
    depositPaid: 1300000,
    rentalStatus: 'Overdue',
    paymentStatus: 'Overdue',
  },
  {
    id: 'rep-04',
    contractCode: 'HD-2026-110',
    facilityName: 'SelfStorage Thủ Đức',
    unitCode: 'TD-L01',
    unitType: 'Large',
    customerName: 'Công ty Cổ phần Thương mại Sao Kim',
    customerType: 'Doanh nghiệp',
    startDate: '2026-06-01',
    endDate: '2027-05-31',
    monthlyRent: 2800000,
    depositPaid: 2800000,
    rentalStatus: 'Active',
    paymentStatus: 'Paid',
  },
  {
    id: 'rep-05',
    contractCode: 'HD-2026-118',
    facilityName: 'SelfStorage Bình Thạnh',
    unitCode: 'BT-S05',
    unitType: 'Small',
    customerName: 'Phạm Gia Huy',
    customerType: 'Cá nhân',
    startDate: '2026-10-01',
    endDate: '2027-01-01',
    monthlyRent: 850000,
    depositPaid: 850000,
    rentalStatus: 'Pending_Handover',
    paymentStatus: 'Pending',
  },
  {
    id: 'rep-06',
    contractCode: 'HD-2026-120',
    facilityName: 'SelfStorage Quận 7 (Phú Mỹ Hưng)',
    unitCode: 'Q7-C01',
    unitType: 'Cold',
    customerName: 'Công ty Dược phẩm Quốc tế Meditech',
    customerType: 'Doanh nghiệp',
    startDate: '2026-05-10',
    endDate: '2027-05-10',
    monthlyRent: 2400000,
    depositPaid: 2400000,
    rentalStatus: 'Active',
    paymentStatus: 'Paid',
  },
  {
    id: 'rep-07',
    contractCode: 'HD-2026-125',
    facilityName: 'SelfStorage Cầu Giấy',
    unitCode: 'CG-M10',
    unitType: 'Medium',
    customerName: 'Nguyễn Minh Anh',
    customerType: 'Cá nhân',
    startDate: '2026-08-20',
    endDate: '2026-11-20',
    monthlyRent: 1450000,
    depositPaid: 1450000,
    rentalStatus: 'Active',
    paymentStatus: 'Paid',
  },
]

export function loadOperationsData(): OperationsState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial: OperationsState = {
        facilities: initialFacilities,
        policies: initialPolicies,
        pricingTiers: initialPricingTiers,
        additionalFees: initialAdditionalFees,
        promotions: initialPromotions,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw) as OperationsState
  } catch {
    return {
      facilities: initialFacilities,
      policies: initialPolicies,
      pricingTiers: initialPricingTiers,
      additionalFees: initialAdditionalFees,
      promotions: initialPromotions,
    }
  }
}

export function saveOperationsData(data: OperationsState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch (err) {
    console.error('Failed to save operations data', err)
  }
}

export function calculateFacilityPerformance(facilities: FacilityItem[]): FacilityPerformance[] {
  return facilities.map((f) => {
    const occupancyRate = Math.round((f.occupiedUnits / f.totalUnits) * 100)
    const targetOccupancyRate = 85
    const previousMonthRevenue = Math.round(f.monthlyRevenue * 0.94) // baseline
    const growthRate = +(((f.monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100).toFixed(1)
    const revPAM = Math.round(f.monthlyRevenue / f.totalArea)
    const availableUnits = f.totalUnits - f.occupiedUnits
    const maintenanceUnits = f.status === 'upgrading' ? 4 : 1

    let rating: FacilityPerformance['rating'] = 'good'
    if (occupancyRate >= 85) rating = 'excellent'
    else if (occupancyRate < 70) rating = 'warning'

    return {
      facilityId: f.id,
      facilityName: f.name,
      occupancyRate,
      targetOccupancyRate,
      currentMonthRevenue: f.monthlyRevenue,
      previousMonthRevenue,
      growthRate,
      revPAM,
      totalUnits: f.totalUnits,
      availableUnits,
      occupiedUnits: f.occupiedUnits,
      maintenanceUnits,
      rating,
    }
  })
}

export const formatVND = (value: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
}
