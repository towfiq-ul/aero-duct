import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/Badge";
import { Button } from "@/components/Button";
import { getPassport } from "@/lib/api";

type FindingStatus = "Clean" | "Needs Attention" | "Critical";

function statusVariant(status: FindingStatus) {
  if (status === "Clean") return "success" as const;
  if (status === "Needs Attention") return "warning" as const;
  return "destructive" as const;
}

function ScoreCard({
  label,
  value,
  unit,
  badge,
  subtitle,
}: {
  label: string;
  value: number;
  unit: string;
  badge?: string;
  subtitle: string;
}) {
  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">{label}</p>
        <p className="text-4xl font-extrabold text-slate-900 tracking-tight">
          {value}
          <span className="text-sm text-slate-400 font-semibold ml-1">{unit}</span>
        </p>
      </div>
      <div className="mt-4">
        {badge && (
          <div className="flex justify-center mb-1">
            <Badge variant="success" dot>{badge}</Badge>
          </div>
        )}
        <p className="text-[11px] text-slate-400">{subtitle}</p>
      </div>
    </div>
  );
}

import { useParams } from "react-router-dom";

export default function PassportPage() {
  const { id } = useParams<{ id: string }>();
  const passport = getPassport(id || "");

  const completedDate = new Date(passport.completedAt).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const completedTime = new Date(passport.completedAt).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return (
    <div className="min-h-screen bg-slate-50/70">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Certificate Header Banner */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                  <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse" />
                  Official Digital Duct Health Passport™
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                  ✓ Verified Clean
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {passport.propertyAddress}
              </h1>
              <p className="text-sm text-slate-500 mt-1">
                Serviced and certified on <strong>{completedDate}</strong> at {completedTime}
              </p>
            </div>

            <div className="flex-shrink-0 flex sm:flex-col items-end gap-2">
              <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200/80 px-3 py-1.5 rounded-xl">
                CERT: {passport.id}
              </span>
              <span className="text-[11px] text-slate-400 font-medium">Permanent Record URL</span>
            </div>
          </div>

          {/* Technician Verification Badge */}
          <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-base font-bold shadow-sm">
                {passport.technicianInitials}
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">{passport.technicianName}</p>
                <p className="text-xs text-slate-500">
                  Lead Certified Technician · NADCA Cert #78294 · Illinois HVAC
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-lg font-semibold">
                🛡️ ACR 2021 Compliant
              </span>
            </div>
          </div>
        </div>

        {/* Scores Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <ScoreCard
            label="Airflow Velocity Score"
            value={passport.airflowScore}
            unit="/ 100"
            badge="Optimal Airflow"
            subtitle="+42% CFM efficiency improvement"
          />
          <ScoreCard
            label="Contamination Index"
            value={passport.contaminationScore}
            unit="/ 100"
            subtitle="Particulates &amp; dander cleared"
          />
          <div className="bg-white border border-slate-200/90 rounded-2xl p-6 text-center shadow-xs flex flex-col justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overall Rating</p>
              <p className="text-4xl font-extrabold text-slate-900 tracking-tight">{passport.rating}</p>
            </div>
            <div className="mt-4">
              <div className="flex justify-center mb-1">
                <Badge
                  variant={passport.rating === "Excellent" ? "success" : passport.rating === "Good" ? "info" : "warning"}
                  dot
                >
                  {passport.rating} Condition
                </Badge>
              </div>
              <p className="text-[11px] text-slate-400">Exceeds indoor air standards</p>
            </div>
          </div>
        </div>

        {/* Technician Notes */}
        <div className="bg-white border border-slate-200/90 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-blue-600 text-lg">📝</span>
            <h2 className="text-base font-bold text-slate-900">Certified Technician Notes</h2>
          </div>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50/70 p-4 rounded-xl border border-slate-100">
            "{passport.notes}"
          </p>
        </div>

        {/* Findings Table */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Detailed Zone Inspection Findings</h2>
              <p className="text-xs text-slate-400 mt-0.5">Borescope optical check of supply trunks, returns, and plenum</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">{passport.findings.length} Zones Inspected</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-left border-b border-slate-100">
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">HVAC Zone</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-slate-500 uppercase tracking-wider">Notes &amp; Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {passport.findings.map((finding) => (
                  <tr key={finding.area} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900 whitespace-nowrap">{finding.area}</td>
                    <td className="px-6 py-4">
                      <Badge variant={statusVariant(finding.status)} dot>{finding.status}</Badge>
                    </td>
                    <td className="px-6 py-4 text-slate-600">{finding.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Video Documentation Simulation */}
        <div className="bg-white border border-slate-200/90 rounded-3xl overflow-hidden shadow-sm">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900">Borescope Camera Video Documentation</h2>
              <p className="text-xs text-slate-400 mt-0.5">High-definition 1080p optical probe capture</p>
            </div>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
              HD Borescope
            </span>
          </div>
          <div className="relative aspect-video bg-slate-900 flex items-center justify-center group overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            
            {/* Simulation overlay text */}
            <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
              <span className="text-xs font-mono text-white font-semibold tracking-wider">
                REC • MAIN_TRUNK_AFTER_CLEAN.MP4 (04:18)
              </span>
            </div>

            <div className="text-center z-10 space-y-3">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center mx-auto border border-white/30 group-hover:scale-110 group-hover:bg-blue-600 transition-all duration-200 shadow-xl cursor-pointer">
                <svg className="w-7 h-7 translate-x-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
              <div>
                <p className="text-white text-sm font-bold">Watch Borescope Inspection Video</p>
                <p className="text-xs text-slate-400">Supply line &amp; main return trunk verification footage</p>
              </div>
            </div>

            <div className="absolute bottom-4 right-4 z-10 text-xs font-mono text-slate-400">
              1080p · 60fps · Timestamp: {completedDate}
            </div>
          </div>
        </div>

        {/* Actions bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Download Official PDF Certificate
            </Button>
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Copy Shareable Link
            </Button>
          </div>
          <Button href="/" variant="ghost" size="lg">
            ← Return to AeroDuct Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
