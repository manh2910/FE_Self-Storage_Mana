import axiosClient from '../../../shared/api/axiosClient'

export interface CreateBookingPayload {
  customerId: number
  facilityId: number
  unitTypeId: number
  unitId?: number
  discountId?: number
  startDate: string
  rentalMonths: number
  selectedPackageIds?: number[]
}

export interface RealBookingResponse {
  reservationId: number
  customerId: number
  customerName: string
  facilityName: string
  unitTypeName: string
  unitCode: string
  startDate: string
  endDate: string
  rentalMonths: number
  monthlyPrice: number
  depositAmount: number
  discountAmount: number
  totalAmount: number
  status: string
  createdAt: string
  initialPayment?: {
    paymentId: number
    paymentCode: string
    amount: number
    status: string
    paymentType: string
  }
}

/** Gọi API Backend để tạo đơn đặt kho thực tế lưu vào SQL Server */
export async function createBookingInDB(payload: CreateBookingPayload): Promise<RealBookingResponse | null> {
  try {
    const response = await axiosClient.post<RealBookingResponse>('/bookings', payload)
    return response.data
  } catch (err) {
    console.error('Lỗi khi gửi đơn đặt kho lên database:', err)
    return null
  }
}

/** Lấy chi tiết đơn đặt kho từ Database */
export async function fetchBookingDetailFromDB(reservationId: number): Promise<RealBookingResponse | null> {
  try {
    const response = await axiosClient.get<RealBookingResponse>(`/bookings/${reservationId}`)
    return response.data
  } catch (err) {
    console.error('Lỗi khi tải chi tiết đơn từ database:', err)
    return null
  }
}

/** Lấy danh sách các đơn của khách hàng từ Database */
export async function fetchCustomerBookingsFromDB(customerId: number): Promise<RealBookingResponse[]> {
  try {
    const response = await axiosClient.get<RealBookingResponse[]>(`/bookings/customer/${customerId}`)
    return response.data
  } catch (err) {
    console.error('Lỗi khi tải danh sách đơn của khách hàng từ database:', err)
    return []
  }
}

/** Hủy đơn đặt kho trong Database */
export async function cancelBookingInDB(reservationId: number, customerId: number = 1): Promise<boolean> {
  try {
    await axiosClient.put(`/bookings/${reservationId}/cancel?customerId=${customerId}`)
    return true
  } catch (err) {
    console.error('Lỗi khi hủy đơn trên database:', err)
    return false
  }
}