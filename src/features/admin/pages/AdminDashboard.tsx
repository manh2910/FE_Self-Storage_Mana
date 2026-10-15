
export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">


      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Account Administration & Security</h2>
            <p className="text-sm text-slate-500 mt-1">Manage users, assign roles, configure permissions and review system logs.</p>
          </div>
          <span className="px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-lg border border-red-200">
            Access: Root Admin
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AdminCard title="Account management" desc="Create, suspend or activate user accounts across the system." />
          <AdminCard title="Assign system roles" desc="Assign roles for storage customers, staff, managers and operations." />
          <AdminCard title="Data permissions" desc="Configure facility and data access for each role." />
          <AdminCard title="Login history" desc="Review system access history and user session status." />
          <AdminCard title="Audit Logs" desc="Audit data changes, including create, update and delete operations." />
        </div>
      </main>
    </div>
  )
}

function AdminCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-orange-300 transition cursor-pointer group">
      <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-orange-600 transition-colors">{title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
    </div>
  )
}