export const managerSections = [
  { id: 'units', title: 'Manage Storage Units', short: 'Storage units', icon: 'box', description: 'Thêm, sửa, vô hiệu hóa kho; quản lý loại kho, kích thước, vị trí, giá thuê và trạng thái.' },
  { id: 'assign', title: 'Assign Storage Units', short: 'Unit allocation', icon: 'key', description: 'Phân bổ kho dựa trên loại kho, thời hạn thuê và tình trạng còn trống.' },
  { id: 'rentals', title: 'Monitor Rentals & Payments', short: 'Rentals & payments', icon: 'card', description: 'Theo dõi khách thuê, hợp đồng, thời hạn thuê và trạng thái thanh toán.' },
  { id: 'operations', title: 'Manage Storage Operations', short: 'Storage operations', icon: 'calendar', description: 'Giám sát quá trình bàn giao, trả kho, gia hạn và xử lý quá hạn.' },
  { id: 'staff', title: 'Manage Facility Staff', short: 'Facility staff', icon: 'users', description: 'Phân công nhân viên, giao nhiệm vụ và theo dõi tiến độ công việc.' },
  { id: 'reports', title: 'View Facility Reports', short: 'Facility reports', icon: 'chart', description: 'Xem báo cáo kho trống, kho đang thuê, doanh thu, tỷ lệ sử dụng và trường hợp quá hạn.' },
] as const

export function ManagerIcon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    box: 'm12 3 9 5v9l-9 5-9-5V8l9-5Zm-9 5 9 5 9-5M12 13v9',
    key: 'M14 8a5 5 0 1 1-10 0 5 5 0 0 1 10 0m-1 4 8 8m-4-4 3-3',
    card: 'M3 7h18v12H3V7Zm0 4h18M7 15h4',
    calendar: 'M7 3v4M17 3v4M3 10h18M5 5h14v16H5V5Zm3 9 3 3 5-5',
    users: 'M15 7a3 3 0 1 1-6 0 3 3 0 0 1 6 0M5 21v-3a7 7 0 0 1 14 0v3M18 4a3 3 0 0 1 0 6M21 21v-3a7 7 0 0 0-3-6',
    chart: 'M4 3v18h17M8 16v-4M13 16V8M18 16V5',
    arrow: 'M4 12h16m-6-6 6 6-6 6',
  }
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.box} /></svg>
}

export function managerSectionPath(id: string) {
  return `/manager/${id}`
}
