import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/Button";
import Badge from "../../components/Badge";
import {
  isPushSupported,
  getNotificationPermission,
  requestNotificationPermission,
  sendLocalNotification,
} from "../../lib/notifications";
import { fetchTechnicianDispatch, type DispatchJob } from "../../lib/api";

export default function TechDashboard() {
  const [permission, setPermission] = useState<string>("default");
  const [notificationSent, setNotificationSent] = useState(false);

  const [jobs, setJobs] = useState<DispatchJob[]>([
    {
      id: "8912",
      clientName: "David Miller",
      serviceAddress: "1420 N Lake Shore Dr, Chicago IL",
      timeSlot: "08:00 AM – 10:00 AM",
      packageType: "Whole-Home HEPA Decontamination",
      targetCfm: 1200,
      status: "in_progress",
    },
    {
      id: "8913",
      clientName: "Sarah Jenkins",
      serviceAddress: "845 W Belden Ave, Chicago IL",
      timeSlot: "11:00 AM – 01:00 PM",
      packageType: "Standard Airway Extraction + Dryer Vent",
      targetCfm: 950,
      status: "pending",
    },
    {
      id: "8914",
      clientName: "Oak Park Medical Group",
      serviceAddress: "1010 Lake St, Oak Park IL",
      timeSlot: "02:00 PM – 04:00 PM",
      packageType: "Commercial Multi-Zone Compliance Audit",
      targetCfm: 2400,
      status: "pending",
    },
  ]);

  useEffect(() => {
    fetchTechnicianDispatch("tech-1").then((liveJobs) => {
      if (liveJobs && liveJobs.length > 0) {
        setJobs(liveJobs);
      }
    });
  }, []);

  useEffect(() => {
    if (isPushSupported()) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const handleEnableNotifications = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === "granted") {
      await sendLocalNotification("AeroDuct Dispatch Alert Active", {
        body: "Technician terminal connected. You will receive real-time schedule adjustments.",
      });
      setNotificationSent(true);
      setTimeout(() => setNotificationSent(false), 4000);
    }
  };

  const handleSimulateAlert = async () => {
    await sendLocalNotification("🚨 Urgent Dispatch Update", {
      body: "Client Sarah Jenkins requested 15-min prior arrival notification (Job #8913).",
    });
    setNotificationSent(true);
    setTimeout(() => setNotificationSent(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 md:p-8 font-inter">
      <div className="max-w-4xl mx-auto">
        {/* Header Strip */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                Technician Dispatch Terminal
              </h1>
              <Badge variant="success">Shift Active</Badge>
            </div>
            <p className="text-sm text-slate-400">
              NADCA Certified Field Unit • Van #4 (Chicago North Division)
            </p>
          </div>

          {/* Web Push Alert Action */}
          <div className="flex items-center gap-3">
            {permission !== "granted" ? (
              <Button
                variant="primary"
                size="sm"
                onClick={handleEnableNotifications}
              >
                🔔 Enable Dispatch Alerts
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  Push Alerts Active
                </span>
                <button
                  onClick={handleSimulateAlert}
                  className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1.5 rounded-lg border border-slate-700 transition-colors"
                >
                  Test Alert
                </button>
              </div>
            )}
          </div>
        </div>

        {notificationSent && (
          <div className="mb-6 p-3 bg-sky-950/80 border border-sky-600/50 rounded-xl text-xs text-sky-200 flex items-center gap-2 animate-fadeIn">
            <span>✓ Notification dispatched to device tray.</span>
          </div>
        )}

        {/* Schedule List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs uppercase tracking-wider text-slate-400 font-bold px-1">
            <span>Today's Manifest ({jobs.length} Jobs Assigned)</span>
            <span>NADCA ACR 2021 Standard</span>
          </div>

          {jobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800/90 border border-slate-700/80 hover:border-slate-600 rounded-2xl p-5 md:p-6 transition-all shadow-md"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-700 text-sky-300">
                      #{job.id}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      ⏱ {job.timeSlot}
                    </span>
                    {job.status === "in_progress" && (
                      <Badge variant="warning">On Site / Active</Badge>
                    )}
                    {job.status === "pending" && (
                      <Badge variant="default">Queued</Badge>
                    )}
                  </div>
                  <h2 className="text-lg font-bold text-white mb-1">
                    {job.clientName}
                  </h2>
                  <p className="text-sm text-slate-400 flex items-center gap-1.5 mb-3">
                    📍 {job.serviceAddress}
                  </p>
                  <div className="flex flex-wrap gap-2 text-xs text-slate-300">
                    <span className="px-2 py-1 bg-slate-900/60 rounded border border-slate-700/50">
                      📦 {job.packageType}
                    </span>
                    <span className="px-2 py-1 bg-slate-900/60 rounded border border-slate-700/50 text-emerald-400">
                      💨 Target Airflow: {job.targetCfm} CFM
                    </span>
                  </div>
                </div>

                <div className="flex flex-row md:flex-col gap-2 shrink-0">
                  <Link to={`/technician/checklist/${job.id}`}>
                    <Button variant="primary" size="sm" className="w-full">
                      Start Checklist
                    </Button>
                  </Link>
                  <Link to={`/technician/job/${job.id}`}>
                    <Button variant="secondary" size="sm" className="w-full">
                      Job Specs
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
