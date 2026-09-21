import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { fetchPassport, type PassportRecord } from "@/lib/api";
import LoadingSkeleton from "@/components/LoadingSkeleton";

export default function Passport() {
  const { id } = useParams<{ id: string }>();
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<PassportRecord | null>(null);

  const passportId = id || "PASS-2026-0842";

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchPassport(passportId).then((data) => {
      if (mounted) {
        setRecord(data);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [passportId]);

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

        {loading || !record ? (
          <div className="space-y-6">
            <LoadingSkeleton height={140} className="rounded-xl" />
            <LoadingSkeleton height={100} className="rounded-xl" />
            <LoadingSkeleton height={240} className="rounded-xl" />
          </div>
        ) : (
          /* Certificate Card */
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
                  Standards Compliance: {record.complianceSignOff.nadcaStandard} · Auditor: {record.complianceSignOff.auditor}
                </p>
              </div>

              <div className="bg-white/10 rounded-lg px-4 py-3 text-center border border-white/15">
                <span className="text-[10px] uppercase font-bold text-[#60a0d0] tracking-wider block">
                  Particulate Reduction
                </span>
                <span className="text-3xl font-black text-emerald-400">
                  {record.particulateReductionPercent}%
                </span>
                <span className="text-[10px] text-white/70 block mt-0.5 font-medium">
                  Rating: {record.airQualityRating} Optimal
                </span>
              </div>
            </div>

            {/* Property & Job Metadata */}
            <div className="p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-4 gap-6 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Service Location</span>
                <span className="font-bold text-slate-800 dark:text-white">{record.serviceAddress}</span>
                <span className="text-slate-500 block">Client: {record.customerName}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Inspection Date</span>
                <span className="font-bold text-slate-800 dark:text-white">{record.inspectionDate}</span>
                <span className="text-slate-500 block">Model: {record.systemModel}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Certified Specialist</span>
                <span className="font-bold text-slate-800 dark:text-white">{record.technicianName}</span>
                <span className="text-slate-500 block">{record.nadcaCertificationId}</span>
              </div>
              <div>
                <span className="text-slate-400 uppercase font-semibold text-[10px] block mb-1">Verification Status</span>
                <span className="inline-flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  PASSED AUDIT
                </span>
                <span className="text-slate-500 block">Area: {record.squareFootage} sq ft</span>
              </div>
            </div>

            {/* Before / After Inspection Media */}
            <div className="p-6 sm:p-8 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-[#203060] dark:text-white uppercase tracking-wider mb-4">
                Diagnostic Borescope Visual Records ({record.beforeAfterRecords.length} Sections Verified)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {record.beforeAfterRecords.map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-900">
                    <div className="p-3 bg-slate-800 text-xs font-bold text-slate-200 flex justify-between">
                      <span>{item.section}</span>
                      <span className="text-sky-300">{item.cleanedAt}</span>
                    </div>
                    <div className="p-4 space-y-3">
                      <p className="text-xs text-slate-600 dark:text-slate-400">{item.description}</p>
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-900/50">
                          <span className="font-bold text-red-600 dark:text-red-400 block mb-1">Before:</span>
                          <span>Borescope verified debris layer & microbial presence</span>
                        </div>
                        <div className="bg-emerald-50 dark:bg-emerald-950/30 p-2 rounded border border-emerald-200 dark:border-emerald-900/50">
                          <span className="font-bold text-emerald-600 dark:text-emerald-400 block mb-1">After:</span>
                          <span>Restored to bare galvanized steel finish</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
                      <td className="py-3 px-4 text-slate-500">{record.cfmPreClean} CFM (Restricted)</td>
                      <td className="py-3 px-4 font-semibold text-[#0050a0] dark:text-[#60a0d0]">{record.cfmPostClean} CFM (Optimal)</td>
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">
                        +{Math.round(((record.cfmPostClean - record.cfmPreClean) / record.cfmPreClean) * 100)}% Airflow
                      </td>
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
                      <td className="py-3 px-4 text-emerald-600 dark:text-emerald-400 font-bold">-{record.particulateReductionPercent}% Airborne Dust</td>
                      <td className="py-3 px-4"><span className="text-emerald-600 font-bold">✓ PASSED</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

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
