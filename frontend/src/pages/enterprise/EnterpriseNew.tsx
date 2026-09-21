import { useState } from "react";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Button } from "@/components/Button";

export default function EnterpriseNew() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    facilityType: "office",
    sqft: "10000-25000",
    hvacUnits: "4-8",
    tier: "quarterly",
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e] transition-colors duration-200">
      <NavBar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-8">
          <span className="inline-block px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-[#0050a0] dark:text-[#60a0d0] bg-[#e6f0f9] dark:bg-[#0050a0]/10 border border-[#c0d9f0] dark:border-[#0050a0]/20 rounded-md mb-2">
            Annual Maintenance Contracts
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-[#203060] dark:text-white tracking-tight">
            Commercial AMC Onboarding
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Custom enterprise ventilation maintenance with dedicated account managers and guaranteed 24/7 SLA dispatch.
          </p>
        </div>

        <div className="bg-white dark:bg-[#0d1225] border border-slate-200 dark:border-slate-800 rounded-xl p-6 sm:p-8 shadow-card">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-14 h-14 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                ✓
              </div>
              <h2 className="text-2xl font-bold text-[#203060] dark:text-white">
                AMC Proposal Request Received
              </h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                Thank you, <span className="font-semibold">{formData.contactName}</span>. A commercial facility engineer will review your specifications for <span className="font-semibold">{formData.companyName}</span> and contact you within 2 business hours.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                <Link
                  to="/enterprise/dashboard"
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#203060] hover:bg-[#0050a0] rounded-md transition-colors"
                >
                  View Enterprise Portal
                </Link>
                <Link
                  to="/"
                  className="px-5 py-2.5 text-xs font-medium text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 rounded-md hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
                >
                  Return Home
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Company / Organization *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    placeholder="e.g. Apex Health Systems"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Facility Contact Person *</label>
                  <input
                    type="text"
                    required
                    value={formData.contactName}
                    onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                    placeholder="e.g. Sarah Jenkins (VP Facilities)"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Corporate Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="s.jenkins@apexhealth.com"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Direct Phone *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(312) 555-8491"
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Facility Type</label>
                  <select
                    value={formData.facilityType}
                    onChange={(e) => setFormData({ ...formData, facilityType: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  >
                    <option value="office">Commercial Office Space</option>
                    <option value="medical">Medical / Healthcare Clinic</option>
                    <option value="restaurant">Restaurant / Commercial Kitchen</option>
                    <option value="hoa">Condo / Multi-Family HOA</option>
                    <option value="industrial">Warehouse / Light Industrial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Approximate Sq. Ft.</label>
                  <select
                    value={formData.sqft}
                    onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  >
                    <option value="under-10000">&lt; 10,000 sq ft</option>
                    <option value="10000-25000">10,000 – 25,000 sq ft</option>
                    <option value="25000-75000">25,000 – 75,000 sq ft</option>
                    <option value="over-75000">&gt; 75,000 sq ft (Multi-building)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Preferred Cadence</label>
                  <select
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none"
                  >
                    <option value="quarterly">Quarterly Certified (Recommended)</option>
                    <option value="semi-annual">Semi-Annual Preventive</option>
                    <option value="monthly">Monthly High-Occupancy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Specific Compliance Requirements / Facility Details
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="e.g. Requires OSHA air quality certificate for annual state health inspection, rooftop air handler units accessible by stairwell."
                  className="w-full px-3 py-2 text-sm rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-[#203060] focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2">
                <Button type="submit" size="lg" className="w-full justify-center">
                  Request Custom Commercial AMC Proposal
                </Button>
              </div>

              <p className="text-center text-[11px] text-slate-400">
                Guaranteed commercial NDA protected. All estimates prepared by NADCA Certified HVAC Engineers.
              </p>
            </form>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
