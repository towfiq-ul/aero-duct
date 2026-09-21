import { useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Checklist() {
  const { bookingId } = useParams<{ bookingId: string }>();
  const [completed, setCompleted] = useState(false);

  const [items, setItems] = useState([
    { id: "c1", label: "Initial Borescope Camera Survey (Recorded Before Condition)", checked: false },
    { id: "c2", label: "Pre-Clean Return Air Velocity Test (Recorded CFM Baseline)", checked: false },
    { id: "c3", label: "Main Trunk Negative Pressure Hookup (HEPA Exhaust Secured)", checked: false },
    { id: "c4", label: "Rotary Agitation Whip Clean through all Supply & Return Registers", checked: false },
    { id: "c5", label: "Evaporator Coil & Blower Motor Plenum Vacuum Sanitization", checked: false },
    { id: "c6", label: "EPA Botanical Disinfectant Mist Applied (10-min Contact Dwell)", checked: false },
    { id: "c7", label: "Post-Clean Borescope Verification (Restored Substrate Confirmed)", checked: false },
    { id: "c8", label: "Post-Clean CFM Flow Velocity Measured & Certified", checked: false },
  ]);

  const [cfmReading, setCfmReading] = useState("920");
  const [techNotes, setTechNotes] = useState("No visible mold growth in secondary trunk. Minor construction debris cleared.");

  const toggleItem = (id: string) => {
    setItems((prev) =>
      prev.map((it) => (it.id === id ? { ...it, checked: !it.checked } : it))
    );
  };

  const allChecked = items.every((it) => it.checked);

  const handleFinish = (e: React.FormEvent) => {
    e.preventDefault();
    setCompleted(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-8 flex flex-col font-sans">
      <div className="max-w-2xl w-full mx-auto flex-1">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div>
            <Link to="/technician" className="text-xs text-[#60a0d0] hover:underline block mb-1">
              ← Back to Dispatch
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-white">
              Service Checklist · Job #{bookingId || "8912"}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">NADCA ACR 2021 Field Protocol Verification</p>
          </div>

          <span className="px-2.5 py-1 text-[11px] font-bold rounded-full bg-blue-900/40 text-[#60a0d0] border border-blue-700/40">
            Tech Active
          </span>
        </div>

        {completed ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-3xl font-bold mx-auto mb-4 border border-emerald-500/30">
              ✓
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Job Protocol Completed!</h2>
            <p className="text-xs text-slate-400 max-w-md mx-auto mb-6">
              The customer's digital compliance certificate and borescope inspection passport has been compiled and activated.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to={`/passport/PASS-${bookingId || "8912"}`}
                className="px-5 py-2.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white rounded-md transition-colors"
              >
                View Customer Digital Passport →
              </Link>
              <Link
                to="/technician"
                className="px-5 py-2.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-md transition-colors"
              >
                Return to Dispatch
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleFinish} className="bg-slate-800/80 border border-slate-700 rounded-xl p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300">
                  Mandatory Protocol Steps ({items.filter((i) => i.checked).length} / {items.length})
                </h2>
                <button
                  type="button"
                  onClick={() => setItems((prev) => prev.map((i) => ({ ...i, checked: true })))}
                  className="text-xs text-[#60a0d0] hover:underline"
                >
                  Select All
                </button>
              </div>

              <div className="space-y-2.5">
                {items.map((item) => (
                  <label
                    key={item.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs cursor-pointer transition-colors ${
                      item.checked
                        ? "bg-emerald-950/20 border-emerald-500/30 text-emerald-300"
                        : "bg-slate-900/60 border-slate-700 hover:border-slate-600 text-slate-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.checked}
                      onChange={() => toggleItem(item.id)}
                      className="mt-0.5 rounded text-emerald-600 focus:ring-0"
                    />
                    <span className="leading-relaxed font-medium">{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-700">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Final Post-Clean CFM Reading
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={cfmReading}
                    onChange={(e) => setCfmReading(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#60a0d0]"
                  />
                  <span className="text-xs text-slate-400 font-bold">CFM</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Technician Sign-Off
                </label>
                <input
                  type="text"
                  readOnly
                  value="Marcus Vance (ASCS #78294)"
                  className="w-full px-3 py-2 text-xs bg-slate-900/50 border border-slate-700 rounded-md text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Technician Inspection Notes
              </label>
              <textarea
                rows={2}
                value={techNotes}
                onChange={(e) => setTechNotes(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-md text-white focus:outline-none focus:border-[#60a0d0] resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={!allChecked}
              className={`w-full py-3 rounded-lg text-xs font-bold transition-colors ${
                allChecked
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer"
                  : "bg-slate-700 text-slate-400 cursor-not-allowed opacity-60"
              }`}
            >
              {allChecked ? "Complete Service & Issue Digital Passport" : "Complete All Checklist Steps Above"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
