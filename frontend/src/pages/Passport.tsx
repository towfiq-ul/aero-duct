import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Passport() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);

  const passportId = id || "PASS-2026-0842";

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#0a0f1e] transition-colors duration-200">
      <NavBar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Top bar & actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 pulse-dot" />
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Verified Clinical Airflow Audit
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#203060] dark:text-white tracking-tight mt-1">
              Digital Airway Passport
            </h1>
            <p className="text-xs font-mono text-slate-400 mt-0.5">Certificate Record #{passportId}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-semibold rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors text-slate-700 dark:text-slate-300 flex items-center gap-1.5"
            >
              {copied ? "✓ Copied" : "📋 Share Link"}
            </button>
            <button
              onClick={() => window.print()}
              className="px-3.5 py-2 text-xs font-semibold rounded-md bg-[#203060] hover:bg-[#0050a0] text-white transition-colors"
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="bg-white dark:bg-[#0d1225] border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-card mb-8">
          {/* Header Banner */}
          <div className="bg-[#203060] text-white p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#60a0d0]">
                Hospital-Grade HVAC Sanitization
              </span>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight mt-1">
                Clinical Hygiene & Decontamination Compliance
              </h2>
              <p className="text-xs text-[#a8d6eb] mt-1">
                Standards Compliance: NADCA ACR 2021 · EPA Disinfectant Protocol 92841-IL
              </p>
            </div>

            <div className="bg-white/10 rounded-lg px-4 py-3 text-center border border-white/15">
              <span className="text-[10px] uppercase font-bold text-[#60a0d0] tracking-wider block">
                Airflow Restoration Score
              </span>
              <span className="text-3xl font-black text-emerald-400">96 / 100</span>
              <span className="text-[10px] text-white/70 block mt-0.5 font-medium">Optimal Velocity</span>
            </div>
          </div>

          {/* Property & Job Metadata */}
          <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-slate-100 dark:border-slate-800 text-xs">
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Service Location</span>
              <span className="font-bold text-slate-800 dark:text-white">2847 N. Lincoln Ave</span>
              <span className="text-slate-500 block">Chicago, IL 60657</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Inspection Date</span>
              <span className="font-bold text-slate-800 dark:text-white">September 18, 2026</span>
              <span className="text-slate-500 block">Completed in 2.4 hrs</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Certified Specialist</span>
              <span className="font-bold text-slate-800 dark:text-white">Marcus Vance, ASCS</span>
              <span className="text-slate-500 block">NADCA ID #78294</span>
            </div>
            <div>
              <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Verification Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                PASSED AUDIT
              </span>
              <span className="text-slate-500 block">Next Due: Sep 2028</span>
            </div>
          </div>

          {/* Before / After Inspection Media */}
          <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
            <h3 className="text-sm font-bold text-[#203060] dark:text-white uppercase tracking-wider mb-4">
              Diagnostic Borescope Visual Record
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                <div className="p-3 bg-red-900/20 border-b border-red-500/20 text-xs font-bold text-red-700 dark:text-red-400 flex justify-between">
                  <span>BEFORE CLEANING</span>
                  <span>Plenum Heavy Particulates</span>
                </div>
                <div className="h-44 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <span className="text-2xl mb-1">📹</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Borescope Video Inspection Feed
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Recorded: 10:14 AM CST · High particulate dust index (&gt;180 µg/m³)
                  </span>
                </div>
              </div>

              <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                <div className="p-3 bg-emerald-900/20 border-b border-emerald-500/20 text-xs font-bold text-emerald-700 dark:text-emerald-400 flex justify-between">
                  <span>AFTER DECONTAMINATION</span>
                  <span>Clean Ductwork Substrate</span>
                </div>
                <div className="h-44 flex flex-col items-center justify-center p-6 text-center text-slate-400">
                  <span className="text-2xl mb-1">✨</span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    Substrate Cleanliness Verified
                  </span>
                  <span className="text-[11px] text-slate-400 mt-1">
                    Recorded: 12:28 PM CST · Restored to bare galvanized steel
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Lab & CFM Readings */}
          <div className="p-6 sm:p-8">
            <h3 className="text-sm font-bold text-[#203060] dark:text-white uppercase tracking-wider mb-4">
              Clinical Parameter Telemetry
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                  <tr>
                    <th className="py-2.5 px-4 font-semibold">Test Parameter</th>
                    <th className="py-2.5 px-4 font-semibold">Baseline Pre-Clean</th>
                    <th className="py-2.5 px-4 font-semibold">Final Post-Clean</th>
                    <th className="py-2.5 px-4 font-semibold">Standard Delta</th>
                    <th className="py-2.5 px-4 font-semibold">Compliance</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">Main Return CFM Velocity</td>
                    <td className="py-3 px-4 text-slate-500">640 CFM (Restricted)</td>
                    <td className="py-3 px-4 font-semibold text-[#0050a0] dark:text-[#60a0d0]">920 CFM (Optimal)</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">+43.7% Airflow</td>
                    <td className="py-3 px-4"><span className="text-emerald-600 font-bold">✓ PASSED</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">Static Pressure Resistance</td>
                    <td className="py-3 px-4 text-slate-500">0.82 in. w.g. (High load)</td>
                    <td className="py-3 px-4 font-semibold text-[#0050a0] dark:text-[#60a0d0]">0.49 in. w.g. (Factory spec)</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">-40.2% Motor Strain</td>
                    <td className="py-3 px-4"><span className="text-emerald-600 font-bold">✓ PASSED</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">Particulate Matter (PM2.5)</td>
                    <td className="py-3 px-4 text-slate-500">48.2 µg/m³</td>
                    <td className="py-3 px-4 font-semibold text-[#0050a0] dark:text-[#60a0d0]">4.1 µg/m³</td>
                    <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">-91.5% Airborne Dust</td>
                    <td className="py-3 px-4"><span className="text-emerald-600 font-bold">✓ PASSED</span></td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">Microbial Sanitization</td>
                    <td className="py-3 px-4 text-slate-500">Sporicidin Fog Applied</td>
                    <td className="py-3 px-4 font-semibold text-[#0050a0] dark:text-[#60a0d0]">10-min dwell contact</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">99.9% Mold Inactivation</td>
                    <td className="py-3 px-4"><span className="text-emerald-600 font-bold">✓ PASSED</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center text-xs text-slate-500">
          <Link to="/" className="text-[#0050a0] dark:text-[#60a0d0] hover:underline font-semibold">
            ← Return to AeroDuct Homepage
          </Link>
          <span>Licensed Illinois HVAC #058-2941 · Official Customer Record</span>
        </div>
      </main>

      <Footer />
    </div>
  );
}
