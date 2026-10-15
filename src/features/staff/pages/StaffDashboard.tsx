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
    document.title = 'Facility Staff Portal — SelfStorage'
    return () => { document.title = title }
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    setSearchParams({ tab: tabId })
  }

  // 1. Daily Schedule Handlers
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

  // 2. Booking Verification Handlers
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

  // 3. Handover Handlers
  const handleCompleteHandover = (record: Omit<HandoverRecord, 'id' | 'handoverTime'>) => {
    const now = new Date()
    const timeStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
    const id = `HO-${String(staffData.handovers.length + 1).padStart(2, '0')}`

    // Update unit status to 'Occupied'
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

  // 4. Unit Status Handlers
  const handleUpdateUnitStatus = (unitId: string, status: typeof unitStatuses[number]) => {
    updateStorageUnitStatus(unitId, status)
    setFacilityUnits(getFacilityUnits())
  }

  // 5. Check-out Inspection Handlers
  const handleCompleteReturn = (returnRecord: ReturnInspection) => {
    // Update unit status to 'Cleaning' so staff knows it needs dusting/cleaning
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

  // 6. Incident Handlers
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

  // Badge counts
  const unverifiedCount = staffData.verifications.filter((v) => v.verificationStatus === 'unverified').length
  const readyHandoverCount = staffData.verifications.filter((v) => v.verificationStatus === 'verified').length
  const pendingReturnCount = staffData.returns.filter((r) => r.status === 'pending_inspection').length
  const activeIncidentCount = staffData.incidents.filter((i) => i.status === 'open' || i.status === 'in_progress').length
  const cleaningUnitCount = facilityUnits.filter((u) => u.status === 'Cleaning').length

  const tabs = [
    {
      id: 'schedule',
      label: 'Theo dõi hàng ngày',
      icon: 'schedule',
      badge: `${staffData.dailyTasks.filter((t) => t.status === 'completed').length}/${staffData.dailyTasks.length}`,
      badgeColor: 'bg-slate-200 text-slate-700',
    },
    {
      id: 'verify',
      label: 'Xác minh đặt kho',
      icon: 'verify',
      badge: unverifiedCount > 0 ? `${unverifiedCount} chờ` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'handover',
      label: 'Hỗ trợ nhận kho',
      icon: 'handover',
      badge: readyHandoverCount > 0 ? `${readyHandoverCount} sẵn sàng` : undefined,
      badgeColor: 'bg-blue-100 text-blue-700',
    },
    {
      id: 'units',
      label: 'Trạng thái kho',
      icon: 'status',
      badge: cleaningUnitCount > 0 ? `${cleaningUnitCount} cần dọn` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'checkout',
      label: 'Kiểm tra trả kho',
      icon: 'checkout',
      badge: pendingReturnCount > 0 ? `${pendingReturnCount} chờ trả` : undefined,
      badgeColor: 'bg-emerald-100 text-emerald-800',
    },
    {
      id: 'incident',
      label: 'Xử lý sự cố tại chỗ',
      icon: 'incident',
      badge: activeIncidentCount > 0 ? `${activeIncidentCount} sự cố` : undefined,
      badgeColor: 'bg-rose-100 text-rose-700 animate-pulse',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800 pb-16">
      {/* Top Bar for Facility Staff */}
      <div className="bg-[#0f172a] text-white border-b border-slate-800">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-blue-600 rounded-xl text-white shadow-sm">
              <StaffIcon name="box" size={22} />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-black tracking-tight text-white">Facility Staff Portal</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Nhân viên trực cơ sở kho
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {staffData.shiftInfo.facility} · Ca trực: {staffData.shiftInfo.shift}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition border border-white/15"
            >
              <span>Về Trang chủ</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <div className="text-right hidden sm:block">
              <span className="text-xs text-slate-400 block">Nhân viên trực</span>
              <strong className="text-sm text-white">{staffData.shiftInfo.staffName}</strong>
            </div>
            <span className="h-8 w-8 rounded-full bg-blue-700 border border-blue-400 text-white font-bold flex items-center justify-center text-xs">
              LH
            </span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="max-w-[1240px] mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-1.5 flex flex-wrap gap-1.5 overflow-x-auto">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <StaffIcon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      isActive ? 'bg-white/20 text-white' : tab.badgeColor
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* Tab Contents */}
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
      </main>
    </div>
  )
}