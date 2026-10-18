import axiosClient from '../../../shared/api/axiosClient'

export interface StaffReservation {
  reservationId: number
  customerName: string
  customerPhone: string
  unitCode: string
  unitTypeName: string
  startDate: string
  endDate: string
  status: string
  facilityName: string
}

// 1. Tra cứu danh sách lịch khách đến nhận kho (hoặc đang lưu trữ) theo cơ sở
export async function fetchStaffReservations(facilityId: number): Promise<StaffReservation[]> {
  try {
    const response = await axiosClient.get(`/staff/reservations?facilityId=${facilityId}`)
    return response.data
  } catch (err) {
    console.error('Lỗi tải danh sách đặt kho cho nhân viên:', err)
    return []
  }
}

// 2. Xác nhận Check-in & Bàn giao kho, cấp mã/thẻ truy cập
export async function confirmCheckIn(reservationId: number, accessCode: string): Promise<boolean> {
  try {
    await axiosClient.post(`/staff/reservations/${reservationId}/checkin`, { accessCode })
    return true
  } catch (err) {
    console.error('Lỗi xác nhận Check-in:', err)
    return false
  }
}

// 3. Xử lý trả kho / Kiểm tra tình trạng kho khi khách trả
export async function completeCheckOut(reservationId: number, notes: string): Promise<boolean> {
  try {
    await axiosClient.post(`/staff/reservations/${reservationId}/checkout`, { notes })
    return true
  } catch (err) {
    console.error('Lỗi khi trả kho:', err)
    return false
  }
}

// 4. Báo cáo hoặc xử lý sự cố tại chỗ (mất chìa khóa, lỗi mã khóa -> tạo Support Ticket)
export async function createSupportTicket(data: { unitId: number; customerId: number; issueType: string; description: string }): Promise<boolean> {
  try {
    await axiosClient.post('/staff/support-tickets', data)
    return true
  } catch (err) {
    console.error('Lỗi tạo phiếu hỗ trợ sự cố:', err)
    return false
  }
}