export const managerSections = [
  { id: 'units', title: 'Storage Unit Management', short: 'Storage unit management', icon: 'box', description: 'Add, edit, delete or deactivate units; manage size, location, pricing and status.' },
  { id: 'staff', title: 'Staff Management', short: 'Staff management', icon: 'users', description: 'Manage staff profiles, assignments, shifts, availability and performance.' },
  { id: 'assign', title: 'Reservation Management', short: 'Reservation management', icon: 'key', description: 'Monitor reservations and allocate suitable units to customers.' },
  { id: 'rentals', title: 'Contract Management', short: 'Contract management', icon: 'document', description: 'Track rental contracts, terms, renewals and terminations.' },
  { id: 'payments', title: 'Payment Monitoring', short: 'Payment monitoring', icon: 'card', description: 'Monitor payments, outstanding balances and overdue amounts.' },
  { id: 'operations', title: 'Handover Management', short: 'Handover management', icon: 'calendar', description: 'Supervise unit handovers and returns.' },
  { id: 'support', title: 'Support Management', short: 'Support management', icon: 'support', description: 'Assign support requests and approve cases beyond staff authority.' },
  { id: 'reports', title: 'Reports & Analytics', short: 'Reports & analytics', icon: 'chart', description: 'View revenue, occupancy, unit status and staff performance.' },
] as const

export function ManagerIcon({ name, size = 22 }: { name: string; size?: number }) {
  const paths: Record<string, string> = {
    building: 'M3 21h18M5 21V3h14v18M9 7h2m2 0h2M9 11h2m2 0h2M10 21v-6h4v6',
    document: 'M6 3h9l3 3v15H6V3Zm3 7h6m-6 4h6m-6 4h4',
    support: 'M4 14v-3a8 8 0 0 1 16 0v3M4 11H2v7h4v-7H4Zm16 0h2v7h-4v-7h2Zm0 7v3h-8',
    cleaning: 'm12 3 7 7M10 5l4 4-6 7-4-4 6-7ZM8 16l-3 5m6-4-1 5m-6-8-3 3',
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
