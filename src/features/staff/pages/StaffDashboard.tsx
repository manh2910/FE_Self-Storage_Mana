import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { StaffIcon } from '../components/StaffIcons'
import { DailyScheduleTab } from '../components/DailyScheduleTab'
import { BookingVerificationTab } from '../components/BookingVerificationTab'
import { HandoverTab } from '../components/HandoverTab'
import { UnitStatusTab } from '../components/UnitStatusTab'
import { CheckOutInspectionTab } from '../components/CheckOutInspectionTab'
import { IncidentHandlingTab } from '../components/IncidentHandlingTab'
import {
  loadStaffData,
  saveStaffData,
  getFacilityUnits,
  updateStorageUnitStatus,
  type StaffData,
  type DailyTask,
  type HandoverRecord,
  type ReturnInspection,
  type IncidentTicket
} from '../model/staffDomain'
import type { unitStatuses } from '../../manager/model/storageUnits'

export default function StaffDashboard() {
  const [searchParams, setSearchParams] = useSearchParams()
  const initialTab = searchParams.get('tab') || 'schedule'
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [activeHandoverBooking, setActiveHandoverBooking] = useState<string>('')

  const [staffData, setStaffData] = useState<StaffData>(() => loadStaffData())
  const [facilityUnits, setFacilityUnits] = useState(() => getFacilityUnits())

  useEffect(() => {
    saveStaffData(staffData)
  }, [staffData])

  useEffect(() => {
    const title = document.title
    document.title = 'Vận hành cơ sở kho — SelfStorage'
    return () => { document.title = title }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // Handlers
  const handleToggleTask = (taskId: string) => {
    setStaffData((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((t) =>
        t.id === taskId ? { ...t, status: t.status === 'completed' ? 'pending' : 'completed' } : t
      ),
    }))
  }

  const handleAddTask = (newTask: Omit<DailyTask, 'id'>) => {
    const id = `T-${String(staffData.dailyTasks.length + 1).padStart(2, '0')}`
    setStaffData((prev) => ({
      ...prev,
      dailyTasks: [...prev.dailyTasks, { ...newTask, id }],
    }))
  }

  const handleVerifyBooking = (id: string, notes?: string) => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    setStaffData((prev) => ({
      ...prev,
      verifications: prev.verifications.map((v) =>
        v.id === id
          ? {
              ...v,
              verificationStatus: 'verified',
              verifiedAt: timeStr,
              verifiedBy: prev.shiftInfo.staffName,
              notes: notes || v.notes,
            }
          : v
      ),
    }))
  }

  const handleProceedToHandover = (bookingCode: string) => {
    setActiveHandoverBooking(bookingCode)
    handleTabChange('handover')
  }

  const handleCompleteHandover = (record: Omit<HandoverRecord, 'id' | 'handoverTime'>) => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const id = `HO-${String(staffData.handovers.length + 1).padStart(2, '0')}`

    const targetUnit = facilityUnits.find((u) => u.code === record.unitCode)
    if (targetUnit) {
      updateStorageUnitStatus(targetUnit.id, 'Occupied')
      setFacilityUnits(getFacilityUnits())
    }

    setStaffData((prev) => ({
      ...prev,
      handovers: [{ ...record, id, handoverTime: timeStr }, ...prev.handovers],
      verifications: prev.verifications.map((v) =>
        v.bookingCode === record.bookingCode ? { ...v, verificationStatus: 'checked_in' } : v
      ),
      dailyTasks: prev.dailyTasks.map((t) =>
        t.unitCode === record.unitCode && t.type === 'check-in' ? { ...t, status: 'completed' } : t
      ),
    }))
  }

  const handleUpdateUnitStatus = (unitId: string, status: typeof unitStatuses[number]) => {
    updateStorageUnitStatus(unitId, status)
    setFacilityUnits(getFacilityUnits())
  }

  const handleCompleteReturn = (returnRecord: ReturnInspection) => {
    const targetUnit = facilityUnits.find((u) => u.code === returnRecord.unitCode)
    if (targetUnit) {
      updateStorageUnitStatus(targetUnit.id, 'Cleaning')
      setFacilityUnits(getFacilityUnits())
    }

    setStaffData((prev) => ({
      ...prev,
      returns: prev.returns.map((r) => (r.id === returnRecord.id ? returnRecord : r)),
      dailyTasks: prev.dailyTasks.map((t) =>
        t.unitCode === returnRecord.unitCode && t.type === 'check-out' ? { ...t, status: 'completed' } : t
      ),
    }))
  }

  const handleAddIncident = (ticket: Omit<IncidentTicket, 'id' | 'reportedAt'>) => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const id = `INC-${Math.floor(100 + Math.random() * 900)}`

    setStaffData((prev) => ({
      ...prev,
      incidents: [{ ...ticket, id, reportedAt: timeStr }, ...prev.incidents],
    }))
  }

  const handleResolveIncident = (ticketId: string, resolutionNotes: string) => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    setStaffData((prev) => ({
      ...prev,
      incidents: prev.incidents.map((inc) =>
        inc.id === ticketId
          ? {
              ...inc,
              status: 'resolved',
              resolvedAt: timeStr,
              resolutionNotes,
            }
          : inc
      ),
    }))
  }

  const handleUpdateIncidentStatus = (ticketId: string, status: IncidentTicket['status']) => {
    setStaffData((prev) => ({
      ...prev,
      incidents: prev.incidents.map((inc) => (inc.id === ticketId ? { ...inc, status } : inc)),
    }))
  }

  // Badges
  const unverifiedCount = staffData.verifications.filter((v) => v.verificationStatus === 'unverified').length
  const readyHandoverCount = staffData.verifications.filter((v) => v.verificationStatus === 'verified').length
  const pendingReturnCount = staffData.returns.filter((r) => r.status === 'pending_inspection').length
  const activeIncidentCount = staffData.incidents.filter((i) => i.status === 'open' || i.status === 'in_progress').length
  const cleaningUnitCount = facilityUnits.filter((u) => u.status === 'Cleaning').length

  const tabs = [
    {
      id: 'schedule',
      label: 'Lịch trình ca trực',
      icon: 'schedule',
      count: staffData.dailyTasks.filter((t) => t.status === 'completed').length,
      total: staffData.dailyTasks.length,
    },
    {
      id: 'verify',
      label: 'Xác minh đặt kho',
      icon: 'verify',
      badge: unverifiedCount > 0 ? unverifiedCount : undefined,
      badgeType: 'warning',
    },
    {
      id: 'handover',
      label: 'Bàn giao kho & Mã PIN',
      icon: 'handover',
      badge: readyHandoverCount > 0 ? readyHandoverCount : undefined,
      badgeType: 'info',
    },
    {
      id: 'units',
      label: 'Trạng thái kho',
      icon: 'status',
      badge: cleaningUnitCount > 0 ? `${cleaningUnitCount} cần dọn` : undefined,
      badgeType: 'neutral',
    },
    {
      id: 'checkout',
      label: 'Kiểm tra trả kho',
      icon: 'checkout',
      badge: pendingReturnCount > 0 ? pendingReturnCount : undefined,
      badgeType: 'warning',
    },
    {
      id: 'incident',
      label: 'Xử lý sự cố tại chỗ',
      icon: 'incident',
      badge: activeIncidentCount > 0 ? activeIncidentCount : undefined,
      badgeType: 'danger',
    },
  ]

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 font-sans pb-16 antialiased">
      {/* Top Application Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2 text-slate-900 font-extrabold text-lg tracking-tight hover:text-blue-600 transition">
              <span className="h-8 w-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-black text-sm shadow-xs">
                S
              </span>
              <span>SelfStorage<span className="text-blue-600">.</span></span>
            </Link>
            <span className="text-slate-300">/</span>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-700">Cơ sở kho</span>
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Quận 1 · TP.HCM
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 text-xs border-r border-slate-200 pr-4">
              <span className="text-slate-500">Ca trực: <strong className="text-slate-700 font-semibold">{staffData.shiftInfo.shift}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500">Nhân viên: <strong className="text-slate-900 font-semibold">{staffData.shiftInfo.staffName}</strong></span>
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition shadow-2xs"
            >
              <span>Về Trang chủ</span>
              <span aria-hidden="true" className="text-slate-400">↗</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-[1200px] mx-auto px-4 sm:px-6 pt-7 space-y-6">
        {/* Page Title & Context Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 pb-1">
          <div>
            <p className="text-[11px] font-bold tracking-wider text-blue-600 uppercase">
              BÀN GIAO & VẬN HÀNH CƠ SỞ
            </p>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Khu vực thao tác nhân viên trực kho
            </h1>
            <p className="mt-1.5 text-xs text-slate-500">
              Kiểm tra thông tin nhận kho, cấp phát mã PIN/chìa khóa, cập nhật tình trạng phòng kho và xử lý sự cố tại quầy.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
              Ca trực đang hoạt động
            </span>
          </div>
        </div>

        {/* Clean Segmented Tab Navigation */}
        <nav aria-label="Staff navigation tabs" className="border-b border-slate-200 flex space-x-1 sm:space-x-2 overflow-x-auto pb-px">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 py-3 px-3.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-blue-600 text-blue-600 bg-white/50'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                <StaffIcon name={tab.icon} size={16} className={isActive ? 'text-blue-600' : 'text-slate-400'} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="text-[11px] font-normal text-slate-400 ml-0.5">
                    ({tab.count}/{tab.total})
                  </span>
                )}
                {tab.badge !== undefined && (
                  <span
                    className={`ml-1 px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      tab.badgeType === 'danger'
                        ? 'bg-rose-100 text-rose-700'
                        : tab.badgeType === 'warning'
                        ? 'bg-amber-100 text-amber-800'
                        : tab.badgeType === 'info'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>

        {/* Active Tab Panel */}
        <div className="pt-2">
          {activeTab === 'schedule' && (
            <DailyScheduleTab
              shiftInfo={staffData.shiftInfo}
              tasks={staffData.dailyTasks}
              onToggleTask={handleToggleTask}
              onAddTask={handleAddTask}
              onNavigateTab={handleTabChange}
            />
          )}

          {activeTab === 'verify' && (
            <BookingVerificationTab
              verifications={staffData.verifications}
              onVerifyBooking={handleVerifyBooking}
              onProceedToHandover={handleProceedToHandover}
            />
          )}

          {activeTab === 'handover' && (
            <HandoverTab
              verifications={staffData.verifications}
              handovers={staffData.handovers}
              activeBookingCode={activeHandoverBooking}
              onCompleteHandover={handleCompleteHandover}
            />
          )}

          {activeTab === 'units' && (
            <UnitStatusTab
              units={facilityUnits}
              onUpdateStatus={handleUpdateUnitStatus}
            />
          )}

          {activeTab === 'checkout' && (
            <CheckOutInspectionTab
              returns={staffData.returns}
              onCompleteReturn={handleCompleteReturn}
            />
          )}

          {activeTab === 'incident' && (
            <IncidentHandlingTab
              incidents={staffData.incidents}
              onAddIncident={handleAddIncident}
              onResolveIncident={handleResolveIncident}
              onUpdateIncidentStatus={handleUpdateIncidentStatus}
            />
          )}
        </div>
      </main>
    </div>
  )
}