import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function EnterpriseDashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 w-full">
        <h1 className="text-3xl font-bold text-slate-900 mb-8">Client Dashboard</h1>
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <p className="text-slate-600">Active Contracts: 0</p>
          <p className="text-slate-600 mt-2">Recent Invoices: None</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
