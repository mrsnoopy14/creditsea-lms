export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Operations Dashboard</h1>
      <p className="text-slate-500 text-lg max-w-2xl">
        Welcome to the CreditSea internal portal. Please use the sidebar navigation to access your authorized modules.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {[
          { title: "Sales Module", desc: "Track users who registered but haven't applied.", color: "bg-blue-50 border-blue-200 text-blue-800" },
          { title: "Sanction Module", desc: "Review and approve/reject pending loan applications.", color: "bg-amber-50 border-amber-200 text-amber-800" },
          { title: "Disbursement", desc: "Release funds for approved loans.", color: "bg-purple-50 border-purple-200 text-purple-800" },
          { title: "Collection", desc: "Record borrower payments and manage closures.", color: "bg-emerald-50 border-emerald-200 text-emerald-800" }
        ].map((mod) => (
          <div key={mod.title} className={`p-6 rounded-xl border ${mod.color} shadow-sm`}>
            <h3 className="font-semibold text-lg mb-2">{mod.title}</h3>
            <p className="text-sm opacity-90">{mod.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
