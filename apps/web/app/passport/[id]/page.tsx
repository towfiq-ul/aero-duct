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

function ScoreCard({ label, value, unit, badge }: { label: string; value: number; unit: string; badge?: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-4xl font-bold text-gray-900">
        {value}
        <span className="text-lg text-gray-400 font-normal ml-1">{unit}</span>
      </p>
      {badge && (
        <div className="mt-2 flex justify-center">
          <Badge variant="success">{badge}</Badge>
        </div>
      )}
    </div>
  );
}

export default async function PassportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const passport = getPassport(id);

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
    <div className="min-h-screen bg-gray-50">
      <NavBar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        {/* Header */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-widest">
                  Digital Duct Health Passport™
                </span>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{passport.propertyAddress}</h1>
              <p className="text-sm text-gray-500 mt-1">
                Serviced on {completedDate} at {completedTime}
              </p>
            </div>
            <div className="flex-shrink-0">
              <span className="font-mono text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                {passport.id}
              </span>
            </div>
          </div>

          {/* Technician */}
          <div className="mt-5 pt-5 border-t border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
              {passport.technicianInitials}
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{passport.technicianName}</p>
              <p className="text-xs text-gray-400">Certified AeroDuct Technician · NADCA Certified</p>
            </div>
          </div>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <ScoreCard label="Airflow Score" value={passport.airflowScore} unit="/ 100" badge="Excellent" />
          <ScoreCard label="Contamination Index" value={passport.contaminationScore} unit="/ 100" />
          <div className="bg-white border border-gray-200 rounded-xl p-5 text-center">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Overall Rating</p>
            <p className="text-4xl font-bold text-gray-900">{passport.rating}</p>
            <div className="mt-2 flex justify-center">
              <Badge variant={passport.rating === "Excellent" ? "success" : passport.rating === "Good" ? "info" : "warning"}>
                {passport.rating}
              </Badge>
            </div>
          </div>
        </div>

        {/* Technician Notes */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-sm font-semibold text-gray-900 mb-3">Technician Notes</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{passport.notes}</p>
        </div>

        {/* Findings table */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Inspection Findings</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Area</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {passport.findings.map((finding) => (
                <tr key={finding.area}>
                  <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{finding.area}</td>
                  <td className="px-6 py-4">
                    <Badge variant={statusVariant(finding.status)}>{finding.status}</Badge>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{finding.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Video documentation */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-gray-900">Video Documentation</h2>
          </div>
          <div className="aspect-video bg-gray-100 flex items-center justify-center">
            <div className="text-center text-gray-400">
              <svg className="w-10 h-10 mx-auto mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">Service video documentation</p>
              <p className="text-xs mt-1">Available after backend integration</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="primary">
            Download PDF Report
          </Button>
          <Button variant="secondary">
            Share Passport
          </Button>
          <Button href="/" variant="ghost">
            ← Back to Home
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
