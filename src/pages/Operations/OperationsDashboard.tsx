
export default function OperationsDashboard() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-800">


      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-900">System-wide Strategy & Policies</h2>
            <p className="text-sm text-slate-500 mt-1">Manage facilities, rental prices, deposit policies and revenue reports.</p>
          </div>
          <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs font-bold rounded-lg border border-purple-200">
            Scope: Nationwide
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <OpsCard title="Facility directory" desc="Manage all storage facilities across SelfStorage." flow="Flow 4, 5" />
          <OpsCard title="Rental policies" desc="Set policies for deposits, renewals, cancellations, move-out and overdue rentals." flow="Flow 4, 6" />
          <OpsCard title="Pricing & Additional Fees" desc="Set rental prices, additional charges, overdue fees and discounts." flow="Flow 4" />
          <OpsCard title="Revenue & Performance" desc="Monitor revenue, occupancy and performance across facilities." flow="Flow 4" />
          <OpsCard title="System reports" desc="View and export reports by facility, unit type, revenue and agreement." flow="Flow 4" />
        </div>
      </main>
    </div>
  )
}

function OpsCard({ title, desc, flow }: { title: string; desc: string; flow: string }) {
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