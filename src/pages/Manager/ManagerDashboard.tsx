
export default function ManagerDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">


      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Manage your assigned facility</h2>
            <p className="text-sm text-slate-500 mt-1">Manage units, assign staff and monitor facility revenue.</p>
          </div>
          <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg border border-blue-200">
            Branch: Ho Chi Minh City Main
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ManagerCard title="Storage unit management" desc="Configure unit types, sizes, locations, rental prices and status." flow="Flow 5" />
          <ManagerCard title="Assign units to customers" desc="Assign a specific storage unit based on booking type and rental period." flow="Flow 1, 2" />
          <ManagerCard title="Contracts & Payments" desc="Track current customers, agreement periods and payment status." flow="Flow 3, 4" />
          <ManagerCard title="Handover, Move-out & Renewal" desc="Manage handovers, move-outs, renewals and overdue rentals." flow="Flow 2, 6" />
          <ManagerCard title="Staff assignments" desc="Assign staff shifts for handover, inspections and incident support." flow="Flow 5, 7" />
          <ManagerCard title="Facility reports" desc="View occupancy, revenue and overdue rental reports." flow="Flow 4, 5" />
        </div>
      </main>
    </div>
  )
}

function ManagerCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition cursor-pointer group">
      <div className="flex justify-between items-start mb-3">
        <span className="px-2.5 py-1 bg-orange-50 text-orange-600 text-xs font-bold rounded-lg">{flow}</span>
      </div>
      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}