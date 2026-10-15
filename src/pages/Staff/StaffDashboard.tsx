
export default function StaffDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">


      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Today’s shift tasks</h2>
            <p className="text-sm text-slate-500 mt-1">Handle check-in, access handover and move-out inspections.</p>
          </div>
          <span className="px-3 py-1 bg-green-50 text-green-600 text-xs font-bold rounded-lg border border-green-200">
            Shift: Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <StaffCard title="Check-in & Unit Handover" desc="Confirm reservations and issue access PINs or key cards during check-in." flow="Flow 2" />
          <StaffCard title="Today’s customers" desc="Track customers arriving for check-in, move-out or support today." flow="Flow 2, 7" />
          <StaffCard title="Update unit status" desc="Update units to Occupied, Maintenance or Cleaning after inspection." flow="Flow 2, 5" />
          <StaffCard title="On-site incident support" desc="Help with lost keys, access issues, damaged equipment and support tickets." flow="Flow 7" />
          <StaffCard title="Move-out inspection" desc="Record equipment condition, assess damage and any applicable charges." flow="Flow 6" />
        </div>
      </main>
    </div>
  )
}

function StaffCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
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