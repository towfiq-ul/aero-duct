import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function EnterpriseLanding() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <NavBar />
      <main className="flex-1 max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Enterprise & AMC Portal</h1>
        <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">Manage your Annual Maintenance Contracts, download invoices, and schedule priority services for multi-zone commercial facilities.</p>
        <div className="flex justify-center gap-4">
          <Button href="/enterprise/dashboard">Go to Dashboard</Button>
          <Button variant="secondary" href="/enterprise/new">Enquire about AMC</Button>
        </div>
      </main>
      <Footer />
    </div>
  );
}
