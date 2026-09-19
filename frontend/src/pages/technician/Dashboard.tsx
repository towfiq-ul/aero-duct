export default function TechDashboard() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4">
      <h1 className="text-2xl font-bold mb-6 text-emerald-400">Dispatch Dashboard</h1>
      <div className="space-y-4">
        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700">
          <h3 className="font-bold">Job #8912 - 10:00 AM</h3>
          <p className="text-sm text-slate-400">123 Main St, Chicago IL</p>
          <a href="/technician/job/8912" className="mt-4 block text-center bg-blue-600 py-2 rounded-lg font-medium hover:bg-blue-500">View Details</a>
        </div>
      </div>
    </div>
  );
}
