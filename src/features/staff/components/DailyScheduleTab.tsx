import { useState } from 'react'
import { StaffIcon } from './StaffIcons'
import type { DailyTask, StaffShiftInfo } from '../model/staffDomain'

interface Props {
  shiftInfo: StaffShiftInfo
  tasks: DailyTask[]
  onToggleTask: (taskId: string) => void
  onAddTask: (task: Omit<DailyTask, 'id'>) => void
  onNavigateTab: (tabId: string) => void
}

export function DailyScheduleTab({ shiftInfo, tasks, onToggleTask, onAddTask, onNavigateTab }: Props) {
  const [filterType, setFilterType] = useState<string>('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTask, setNewTask] = useState({
    time: '14:30',
    title: '',
    customer: '',
    unitCode: '',
    type: 'check-in' as DailyTask['type'],
    priority: 'normal' as DailyTask['priority'],
    notes: ''
  })

  const filteredTasks = tasks.filter(t => filterType === 'all' || t.type === filterType)

  const checkInCount = tasks.filter(t => t.type === 'check-in').length
  const checkOutCount = tasks.filter(t => t.type === 'check-out').length
  const incidentCount = tasks.filter(t => t.type === 'incident').length
  const completedCount = tasks.filter(t => t.status === 'completed').length

  const handleSubmitTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTask.title.trim()) return
    onAddTask({
      ...newTask,
      status: 'pending'
    })
    setShowAddModal(false)
    setNewTask({
      time: '14:30',
      title: '',
      customer: '',
      unitCode: '',
      type: 'check-in',
      priority: 'normal',
      notes: ''
    })
  }

  return (
    <div className="space-y-6">
      {/* Shift Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold tracking-wider uppercase text-emerald-400">Ca trực đang diễn ra</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">{shiftInfo.facility}</h2>
            <p className="text-xs text-slate-300 flex items-center gap-2">
              <StaffIcon name="location" size={14} className="text-blue-400" />
              {shiftInfo.facilityAddress}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
              <span className="text-[11px] text-slate-300 block">Nhân viên trực ca</span>
              <span className="text-sm font-bold text-white flex items-center gap-1.5">
                <StaffIcon name="user" size={15} className="text-blue-400" />
                {shiftInfo.staffName}
              </span>
            </div>
            <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/15">
              <span className="text-[11px] text-slate-300 block">Thời gian ca</span>
              <span className="text-sm font-bold text-amber-300 flex items-center gap-1.5">
                <StaffIcon name="clock" size={15} />
                {shiftInfo.shift}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <button
          onClick={() => onNavigateTab('verify')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left hover:border-blue-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Nhận kho hôm nay</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition">
              <StaffIcon name="verify" size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{checkInCount}</span>
            <span className="text-xs font-medium text-blue-600">cuộc hẹn</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Xác minh & cấp mã mở kho</p>
        </button>

        <button
          onClick={() => onNavigateTab('checkout')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left hover:border-emerald-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Trả kho hôm nay</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition">
              <StaffIcon name="checkout" size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{checkOutCount}</span>
            <span className="text-xs font-medium text-emerald-600">hồ sơ</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Kiểm tra hiện trạng & hoàn cọc</p>
        </button>

        <button
          onClick={() => onNavigateTab('incident')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left hover:border-rose-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sự cố tại chỗ</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
              <StaffIcon name="incident" size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{incidentCount}</span>
            <span className="text-xs font-medium text-rose-600">yêu cầu</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Hỗ trợ chìa, mã PIN, kỹ thuật</p>
        </button>

        <button
          onClick={() => onNavigateTab('units')}
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left hover:border-amber-400 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Tiến độ công việc</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition">
              <StaffIcon name="check" size={18} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{completedCount}/{tasks.length}</span>
            <span className="text-xs font-medium text-emerald-600">
              {tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Nhiệm vụ trong ca đã hoàn thành</p>
        </button>
      </div>

      {/* Task Schedule Timeline */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <StaffIcon name="schedule" className="text-blue-600" />
              Lịch trình công việc trong ngày
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Theo dõi và tick hoàn thành các cuộc hẹn nhận kho, kiểm tra trả kho và xử lý phát sinh
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Filter buttons */}
            <div className="inline-flex rounded-xl bg-slate-100 p-1 text-xs font-semibold text-slate-600">
              <button
                onClick={() => setFilterType('all')}
                className={`px-3 py-1.5 rounded-lg transition ${filterType === 'all' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Tất cả ({tasks.length})
              </button>
              <button
                onClick={() => setFilterType('check-in')}
                className={`px-3 py-1.5 rounded-lg transition ${filterType === 'check-in' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Nhận kho
              </button>
              <button
                onClick={() => setFilterType('check-out')}
                className={`px-3 py-1.5 rounded-lg transition ${filterType === 'check-out' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Trả kho
              </button>
              <button
                onClick={() => setFilterType('incident')}
                className={`px-3 py-1.5 rounded-lg transition ${filterType === 'incident' ? 'bg-white text-blue-600 shadow-sm' : 'hover:text-slate-900'}`}
              >
                Sự cố
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-sm"
            >
              <StaffIcon name="plus" size={14} />
              Thêm công việc
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed'
            const badgeColors: Record<DailyTask['type'], string> = {
              'check-in': 'bg-blue-50 text-blue-700 border-blue-200',
              'check-out': 'bg-emerald-50 text-emerald-700 border-emerald-200',
              'inspection': 'bg-amber-50 text-amber-800 border-amber-200',
              'incident': 'bg-rose-50 text-rose-700 border-rose-200'
            }
            const typeLabels: Record<DailyTask['type'], string> = {
              'check-in': 'Nhận kho',
              'check-out': 'Trả kho',
              'inspection': 'Kiểm tra',
              'incident': 'Sự cố'
            }

            return (
              <div
                key={task.id}
                className={`flex items-start gap-4 p-4 rounded-xl border transition ${
                  isCompleted ? 'bg-slate-50/70 border-slate-200 opacity-75' : 'bg-white border-slate-200 hover:border-blue-300 shadow-xs'
                }`}
              >
                {/* Time Badge */}
                <div className="shrink-0 w-16 text-center">
                  <span className="text-xs font-extrabold text-slate-800 block">{task.time}</span>
                  <span className={`inline-block px-2 py-0.5 mt-1 rounded text-[10px] font-bold border ${badgeColors[task.type]}`}>
                    {typeLabels[task.type]}
                  </span>
                </div>

                {/* Checkbox */}
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  className={`mt-0.5 shrink-0 h-6 w-6 rounded-lg border flex items-center justify-center transition ${
                    isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-blue-600 bg-white'
                  }`}
                  title={isCompleted ? 'Đánh dấu chưa xong' : 'Đánh dấu đã hoàn thành'}
                >
                  {isCompleted && <StaffIcon name="check" size={15} />}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className={`text-sm font-bold ${isCompleted ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                      {task.title}
                    </h4>
                    {task.priority === 'urgent' && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-700 animate-pulse">
                        Khẩn cấp
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <StaffIcon name="user" size={13} className="text-slate-400" />
                      {task.customer}
                    </span>
                    <span className="flex items-center gap-1 font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                      <StaffIcon name="box" size={13} />
                      Kho {task.unitCode}
                    </span>
                    {task.notes && (
                      <span className="text-slate-500 italic max-w-md truncate">
                        • {task.notes}
                      </span>
                    )}
                  </div>
                </div>

                {/* Quick Action Button */}
                <div className="shrink-0">
                  {task.type === 'check-in' && (
                    <button
                      onClick={() => onNavigateTab('verify')}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold transition"
                    >
                      Bàn giao →
                    </button>
                  )}
                  {task.type === 'check-out' && (
                    <button
                      onClick={() => onNavigateTab('checkout')}
                      className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold transition"
                    >
                      Kiểm tra →
                    </button>
                  )}
                  {task.type === 'incident' && (
                    <button
                      onClick={() => onNavigateTab('incident')}
                      className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-xs font-semibold transition"
                    >
                      Xử lý →
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold text-slate-900">Thêm nhiệm vụ ca trực hôm nay</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <StaffIcon name="cross" size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmitTask} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Thời gian dự kiến</label>
                <input
                  type="time"
                  required
                  value={newTask.time}
                  onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Tiêu đề công việc</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đón khách nhận kho hoặc kiểm tra đèn hành lang"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Khách hàng / Đối tượng</label>
                  <input
                    type="text"
                    placeholder="Tên khách"
                    value={newTask.customer}
                    onChange={e => setNewTask({ ...newTask, customer: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mã kho liên quan</label>
                  <input
                    type="text"
                    placeholder="VD: A-101"
                    value={newTask.unitCode}
                    onChange={e => setNewTask({ ...newTask, unitCode: e.target.value })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Phân loại</label>
                  <select
                    value={newTask.type}
                    onChange={e => setNewTask({ ...newTask, type: e.target.value as DailyTask['type'] })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="check-in">Nhận kho</option>
                    <option value="check-out">Trả kho</option>
                    <option value="inspection">Kiểm tra bảo trì</option>
                    <option value="incident">Sự cố tại chỗ</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Mức ưu tiên</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as DailyTask['priority'] })}
                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 bg-white"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="high">Ưu tiên cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">Ghi chú lưu ý</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú chi tiết cho ca trực..."
                  value={newTask.notes}
                  onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold"
                >
                  Lưu nhiệm vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
