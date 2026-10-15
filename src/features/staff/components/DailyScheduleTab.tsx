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
      {/* Shift Overview Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-semibold text-slate-700">Ca trực hôm nay</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs text-slate-500">{shiftInfo.shift}</span>
            </div>
            <h2 className="text-base font-bold text-slate-900">{shiftInfo.facility}</h2>
            <p className="text-xs text-slate-500">{shiftInfo.facilityAddress}</p>
          </div>

          <div className="flex items-center gap-3 text-xs">
            <div className="bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Trực ban:</span>
              <span className="font-semibold text-slate-800">{shiftInfo.staffName} ({shiftInfo.staffId})</span>
            </div>
            <div className="bg-slate-50 px-3.5 py-2 rounded-lg border border-slate-200/80">
              <span className="text-slate-500 block text-[11px]">Hotline cơ sở:</span>
              <span className="font-semibold text-blue-700 font-mono">{shiftInfo.phone}</span>
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <button
          onClick={() => onNavigateTab('verify')}
          className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-slate-300 hover:shadow-xs transition"
        >
          <span className="text-xs font-medium text-slate-500 block">Lịch nhận kho hôm nay</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{checkInCount}</span>
            <span className="text-xs text-blue-600 font-medium">lượt nhận</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Khách hẹn nhận bàn giao</span>
        </button>

        <button
          onClick={() => onNavigateTab('checkout')}
          className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-slate-300 hover:shadow-xs transition"
        >
          <span className="text-xs font-medium text-slate-500 block">Lịch trả kho hôm nay</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{checkOutCount}</span>
            <span className="text-xs text-emerald-600 font-medium">hồ sơ trả</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Nghiệm thu & hoàn cọc</span>
        </button>

        <button
          onClick={() => onNavigateTab('incident')}
          className="bg-white p-4 rounded-xl border border-slate-200 text-left hover:border-slate-300 hover:shadow-xs transition"
        >
          <span className="text-xs font-medium text-slate-500 block">Sự cố cần hỗ trợ</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{incidentCount}</span>
            <span className="text-xs text-rose-600 font-medium">phiếu sự cố</span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Mất chìa, lỗi PIN, kỹ thuật</span>
        </button>

        <div className="bg-white p-4 rounded-xl border border-slate-200">
          <span className="text-xs font-medium text-slate-500 block">Tiến độ công việc ca trực</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{completedCount}/{tasks.length}</span>
            <span className="text-xs text-slate-500 font-medium">
              ({tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0}%)
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Nhiệm vụ đã hoàn thành</span>
        </div>
      </div>

      {/* Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Danh sách công việc & Lịch hẹn trong ca</h3>
            <p className="text-xs text-slate-500 mt-0.5">Theo dõi thời gian khách đến cơ sở và tiến độ các đầu việc phát sinh</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter buttons */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterType('all')}
                className={`px-2.5 py-1 rounded-md transition ${filterType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
              >
                Tất cả ({tasks.length})
              </button>
              <button
                onClick={() => setFilterType('check-in')}
                className={`px-2.5 py-1 rounded-md transition ${filterType === 'check-in' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
              >
                Nhận kho
              </button>
              <button
                onClick={() => setFilterType('check-out')}
                className={`px-2.5 py-1 rounded-md transition ${filterType === 'check-out' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
              >
                Trả kho
              </button>
              <button
                onClick={() => setFilterType('incident')}
                className={`px-2.5 py-1 rounded-md transition ${filterType === 'incident' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'hover:text-slate-900'}`}
              >
                Sự cố
              </button>
            </div>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition"
            >
              <StaffIcon name="plus" size={13} />
              Thêm công việc
            </button>
          </div>
        </div>

        {/* Task rows */}
        <div className="divide-y divide-slate-100">
          {filteredTasks.map((task) => {
            const isCompleted = task.status === 'completed'
            const typeLabels: Record<DailyTask['type'], { text: string; class: string }> = {
              'check-in': { text: 'Nhận kho', class: 'text-blue-700 bg-blue-50 border-blue-200' },
              'check-out': { text: 'Trả kho', class: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
              'inspection': { text: 'Kiểm tra', class: 'text-amber-800 bg-amber-50 border-amber-200' },
              'incident': { text: 'Sự cố', class: 'text-rose-700 bg-rose-50 border-rose-200' },
            }

            return (
              <div
                key={task.id}
                className={`flex items-start sm:items-center justify-between p-3.5 sm:px-5 gap-3 transition-colors ${
                  isCompleted ? 'bg-slate-50/60' : 'hover:bg-slate-50/80'
                }`}
              >
                <div className="flex items-start sm:items-center gap-3 min-w-0">
                  {/* Checkbox */}
                  <button
                    type="button"
                    onClick={() => onToggleTask(task.id)}
                    className={`mt-0.5 sm:mt-0 h-4.5 w-4.5 rounded border flex items-center justify-center transition shrink-0 ${
                      isCompleted ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 hover:border-slate-400 bg-white'
                    }`}
                  >
                    {isCompleted && <StaffIcon name="check" size={12} />}
                  </button>

                  {/* Time */}
                  <span className="font-mono text-xs font-semibold text-slate-700 shrink-0 w-12">
                    {task.time}
                  </span>

                  {/* Type badge */}
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border shrink-0 ${typeLabels[task.type].class}`}>
                    {typeLabels[task.type].text}
                  </span>

                  {/* Task details */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${isCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                      </span>
                      {task.priority === 'urgent' && (
                        <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                          Khẩn
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{task.customer}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-600">Kho {task.unitCode}</span>
                      {task.notes && (
                        <>
                          <span>•</span>
                          <span className="truncate max-w-xs">{task.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Action */}
                <div className="shrink-0 flex items-center gap-2">
                  {task.type === 'check-in' && !isCompleted && (
                    <button
                      onClick={() => onNavigateTab('verify')}
                      className="text-xs text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Bàn giao →
                    </button>
                  )}
                  {task.type === 'check-out' && !isCompleted && (
                    <button
                      onClick={() => onNavigateTab('checkout')}
                      className="text-xs text-emerald-600 hover:text-emerald-800 font-medium px-2 py-1 rounded hover:bg-emerald-50 transition"
                    >
                      Kiểm tra →
                    </button>
                  )}
                  {task.type === 'incident' && !isCompleted && (
                    <button
                      onClick={() => onNavigateTab('incident')}
                      className="text-xs text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition"
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
        <div className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-5 shadow-lg border border-slate-200 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Thêm nhiệm vụ ca trực</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-xs">
                <StaffIcon name="cross" size={16} />
              </button>
            </div>
            <form onSubmit={handleSubmitTask} className="space-y-3.5 text-xs">
              <div>
                <label className="font-medium text-slate-700 block mb-1">Thời gian</label>
                <input
                  type="time"
                  required
                  value={newTask.time}
                  onChange={e => setNewTask({ ...newTask, time: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Tên công việc</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Đón khách nhận kho A-101"
                  value={newTask.title}
                  onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Khách hàng</label>
                  <input
                    type="text"
                    placeholder="Tên khách"
                    value={newTask.customer}
                    onChange={e => setNewTask({ ...newTask, customer: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                  />
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Mã kho</label>
                  <input
                    type="text"
                    placeholder="A-101"
                    value={newTask.unitCode}
                    onChange={e => setNewTask({ ...newTask, unitCode: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Loại việc</label>
                  <select
                    value={newTask.type}
                    onChange={e => setNewTask({ ...newTask, type: e.target.value as DailyTask['type'] })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                  >
                    <option value="check-in">Nhận kho</option>
                    <option value="check-out">Trả kho</option>
                    <option value="inspection">Kiểm tra bảo trì</option>
                    <option value="incident">Sự cố</option>
                  </select>
                </div>
                <div>
                  <label className="font-medium text-slate-700 block mb-1">Mức ưu tiên</label>
                  <select
                    value={newTask.priority}
                    onChange={e => setNewTask({ ...newTask, priority: e.target.value as DailyTask['priority'] })}
                    className="w-full border border-slate-300 rounded-lg px-3 py-1.5 bg-white"
                  >
                    <option value="normal">Bình thường</option>
                    <option value="high">Ưu tiên cao</option>
                    <option value="urgent">Khẩn cấp</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="font-medium text-slate-700 block mb-1">Ghi chú</label>
                <textarea
                  rows={2}
                  placeholder="Ghi chú thêm..."
                  value={newTask.notes}
                  onChange={e => setNewTask({ ...newTask, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-1.5"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 font-medium"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold"
                >
                  Lưu công việc
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
