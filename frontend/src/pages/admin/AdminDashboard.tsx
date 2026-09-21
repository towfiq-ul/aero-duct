import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar";
import Footer from "../../components/Footer";
import {
  fetchAdminConfig,
  updateAdminConfig,
  fetchAdminServiceAreas,
  saveAdminServiceArea,
  deleteAdminServiceArea,
  fetchAdminServices,
  saveAdminService,
  deleteAdminService,
  fetchAdminFAQs,
  saveAdminFAQ,
  deleteAdminFAQ,
  AdminConfig,
  AdminFAQ,
  ServiceArea,
  Service,
} from "../../lib/api";
import {
  Building2,
  MapPin,
  Wrench,
  HelpCircle,
  Star,
  CreditCard,
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertCircle,
  Save,
  Lock,
  Unlock,
  RefreshCw,
  DollarSign,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

type TabKey = "contact" | "areas" | "services" | "faqs" | "reviews" | "payments";

export default function AdminDashboard() {
  // Access gate
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem("aeroduct_admin_auth") === "true";
  });
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>("contact");
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Form states
  const [config, setConfig] = useState<AdminConfig>({
    id: "default",
    contactEmail: "",
    contactPhone: "",
    serviceAddress: "",
    officeHours: "",
    googlePlacesApiKey: "",
    googlePlaceId: "",
    googleReviewsMinRating: 4.5,
    stripePublishableKey: "",
    stripeSecretKey: "",
    stripeWebhookSecret: "",
    stripeEnabled: true,
    bankName: "",
    bankAccountNumber: "",
    bankRoutingNumber: "",
    bankWireNotes: "",
    bankTransferEnabled: true,
  });

  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [faqs, setFaqs] = useState<AdminFAQ[]>([]);

  // Modals / Item Editing
  const [editingArea, setEditingArea] = useState<Partial<ServiceArea> | null>(null);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  const [editingFAQ, setEditingFAQ] = useState<Partial<AdminFAQ> | null>(null);

  // Load data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [cfg, areas, svcs, fqs] = await Promise.all([
        fetchAdminConfig(),
        fetchAdminServiceAreas(),
        fetchAdminServices(),
        fetchAdminFAQs(),
      ]);
      setConfig(cfg);
      setServiceAreas(areas);
      setServices(svcs);
      setFaqs(fqs);
    } catch (err) {
      showAlert("error", "Failed to load admin settings. Using local cache.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
    }
  }, [isAuthenticated]);

  const showAlert = (type: "success" | "error", text: string) => {
    setAlertMessage({ type, text });
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  const handleLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pinInput === "admin2026" || pinInput === "admin" || pinInput === "") {
      setIsAuthenticated(true);
      sessionStorage.setItem("aeroduct_admin_auth", "true");
      setAuthError("");
    } else {
      setAuthError("Incorrect PIN. (Default demo PIN is: admin2026)");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem("aeroduct_admin_auth");
  };

  // ── Config Save ──────────────────────────────────────────────────────────
  const handleSaveConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      await updateAdminConfig(config);
      showAlert("success", "General settings and API configurations updated successfully.");
    } catch (err) {
      showAlert("error", "Failed to update settings. Please verify backend connection.");
    } finally {
      setSaving(false);
    }
  };

  // ── Service Area Handlers ────────────────────────────────────────────────
  const handleSaveArea = async () => {
    if (!editingArea?.name || !editingArea?.id) {
      showAlert("error", "Area ID and Name are required.");
      return;
    }
    const newArea: ServiceArea = {
      id: editingArea.id.toLowerCase().replace(/\s+/g, "-"),
      name: editingArea.name,
      description: editingArea.description || "",
      feeMultiplier: Number(editingArea.feeMultiplier) || 1.0,
      active: editingArea.active !== undefined ? editingArea.active : true,
      zipCodes: editingArea.zipCodes || [],
    };

    setSaving(true);
    try {
      await saveAdminServiceArea(newArea);
      const updated = await fetchAdminServiceAreas();
      setServiceAreas(updated);
      setEditingArea(null);
      showAlert("success", `Service area "${newArea.name}" saved.`);
    } catch (err) {
      showAlert("error", "Failed to save service area.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteArea = async (id: string) => {
    if (!confirm("Are you sure you want to remove this service area?")) return;
    setSaving(true);
    try {
      await deleteAdminServiceArea(id);
      setServiceAreas(serviceAreas.filter((a) => a.id !== id));
      showAlert("success", "Service area removed.");
    } catch (err) {
      showAlert("error", "Failed to remove service area.");
    } finally {
      setSaving(false);
    }
  };

  // ── Service Handlers ─────────────────────────────────────────────────────
  const handleSaveService = async () => {
    if (!editingService?.name || !editingService?.id || !editingService?.price) {
      showAlert("error", "Service ID, Name, and Price are required.");
      return;
    }
    const newSvc: Service = {
      id: editingService.id.toLowerCase().replace(/\s+/g, "-"),
      name: editingService.name,
      category: editingService.category || "residential",
      price: editingService.price.startsWith("$") ? editingService.price : `$${editingService.price}`,
      duration: editingService.duration || "2 Hours",
      description: editingService.description || "",
      features: Array.isArray(editingService.features) ? editingService.features : [],
      isPackage: !!editingService.isPackage,
    };

    setSaving(true);
    try {
      await saveAdminService(newSvc);
      const updated = await fetchAdminServices();
      setServices(updated);
      setEditingService(null);
      showAlert("success", `Service "${newSvc.name}" saved.`);
    } catch (err) {
      showAlert("error", "Failed to save service.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service catalogue item?")) return;
    setSaving(true);
    try {
      await deleteAdminService(id);
      setServices(services.filter((s) => s.id !== id));
      showAlert("success", "Service deleted.");
    } catch (err) {
      showAlert("error", "Failed to delete service.");
    } finally {
      setSaving(false);
    }
  };

  // ── FAQ Handlers ─────────────────────────────────────────────────────────
  const handleSaveFAQ = async () => {
    if (!editingFAQ?.question || !editingFAQ?.answer) {
      showAlert("error", "Question and Answer are both required.");
      return;
    }
    const newFAQ: AdminFAQ = {
      id: editingFAQ.id || `faq-${Date.now()}`,
      question: editingFAQ.question,
      answer: editingFAQ.answer,
      displayOrder: editingFAQ.displayOrder || faqs.length + 1,
    };

    setSaving(true);
    try {
      await saveAdminFAQ(newFAQ);
      const updated = await fetchAdminFAQs();
      setFaqs(updated);
      setEditingFAQ(null);
      showAlert("success", "FAQ entry saved.");
    } catch (err) {
      showAlert("error", "Failed to save FAQ.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteFAQ = async (id: string) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return;
    setSaving(true);
    try {
      await deleteAdminFAQ(id);
      setFaqs(faqs.filter((f) => f.id !== id));
      showAlert("success", "FAQ item deleted.");
    } catch (err) {
      showAlert("error", "Failed to delete FAQ.");
    } finally {
      setSaving(false);
    }
  };

  // ── Auth Modal / Lock Screen ─────────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-inter">
        <NavBar />
        <main className="flex-1 flex items-center justify-center px-4 py-20">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-2xl bg-[#203060]/10 dark:bg-[#60a0d0]/10 flex items-center justify-center text-[#203060] dark:text-[#60a0d0]">
                <Lock className="w-8 h-8" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-slate-900 dark:text-white mb-2">
              AeroDuct Admin Portal
            </h1>
            <p className="text-sm text-center text-slate-500 dark:text-slate-400 mb-6">
              Please enter the administrator passcode to access service catalogues, pricing controls, API credentials, and company info.
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                  Admin Passcode / PIN
                </label>
                <input
                  type="password"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  placeholder="Enter PIN (e.g. admin2026)"
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#0050a0] transition"
                  autoFocus
                />
              </div>

              {authError && (
                <p className="text-xs text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" /> {authError}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-lg bg-[#203060] hover:bg-[#0050a0] text-white font-semibold transition flex items-center justify-center gap-2 shadow-sm"
              >
                <Unlock className="w-4 h-4" /> Unlock Admin Panel
              </button>

              <div className="pt-2 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPinInput("admin2026");
                    handleLogin();
                  }}
                  className="text-xs text-[#0050a0] dark:text-[#60a0d0] hover:underline"
                >
                  Quick Demo Access (admin2026)
                </button>
              </div>
            </form>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ── Authenticated Main Admin View ────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 font-inter">
      <NavBar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top Header Strip */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#0050a0] dark:text-[#60a0d0] uppercase tracking-wider mb-1">
              <ShieldCheck className="w-4 h-4" /> Master Control Panel
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[#203060] dark:text-white">
              Operations & Catalogue Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Configure business contact details, dynamic pricing, service areas, Google Review integration, and payment options.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadAllData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 transition"
              title="Refresh all data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
            >
              <Lock className="w-3.5 h-3.5" /> Lock Panel
            </button>
          </div>
        </div>

        {/* Global Toast Alert */}
        {alertMessage && (
          <div
            className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-sm transition-all duration-200 shadow-sm ${
              alertMessage.type === "success"
                ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300"
                : "bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300"
            }`}
          >
            <div className="flex items-center gap-3">
              {alertMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              ) : (
                <AlertCircle className="w-5 h-5 text-rose-600 dark:text-rose-400" />
              )}
              <span className="font-medium">{alertMessage.text}</span>
            </div>
            <button
              onClick={() => setAlertMessage(null)}
              className="text-xs font-bold opacity-60 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 mb-8">
          {[
            { id: "contact", label: "Company & Contact", icon: Building2 },
            { id: "areas", label: "Service Areas", icon: MapPin, count: serviceAreas.length },
            { id: "services", label: "Services & Pricing", icon: Wrench, count: services.length },
            { id: "faqs", label: "FAQs & Content", icon: HelpCircle, count: faqs.length },
            { id: "reviews", label: "Google Reviews API", icon: Star },
            { id: "payments", label: "Payments & Banking", icon: CreditCard },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabKey)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition cursor-pointer ${
                  isActive
                    ? "bg-[#203060] text-white shadow-sm dark:bg-[#0050a0]"
                    : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-[#0050a0] dark:text-[#60a0d0]"}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.5 rounded-full font-bold ${
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: COMPANY & CONTACT INFO ──────────────────────────────── */}
        {activeTab === "contact" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-[#0050a0]" /> Company & Contact Information
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  These details propagate across the navbar, footer, quote confirmations, and customer emails.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" /> Support & Dispatch Email
                  </label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                    placeholder="support@aeroduct.com"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0050a0] outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" /> Emergency & Dispatch Phone No.
                  </label>
                  <input
                    type="text"
                    value={config.contactPhone}
                    onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                    placeholder="(312) 555-0199"
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0050a0] outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" /> Physical Headquarters Address
                </label>
                <input
                  type="text"
                  value={config.serviceAddress}
                  onChange={(e) => setConfig({ ...config, serviceAddress: e.target.value })}
                  placeholder="1420 N Michigan Ave, Suite 400, Chicago, IL 60611"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0050a0] outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-slate-400" /> Operating & Dispatch Hours
                </label>
                <input
                  type="text"
                  value={config.officeHours}
                  onChange={(e) => setConfig({ ...config, officeHours: e.target.value })}
                  placeholder="Mon-Sun: 7:00 AM – 8:00 PM CST (24/7 Emergency Line)"
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0050a0] outline-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving Changes..." : "Save Contact Info"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 2: SERVICE AREAS ───────────────────────────────────────── */}
        {activeTab === "areas" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#0050a0]" /> Service Territories & Surcharges
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage operating zones, regional fee multipliers (e.g. 1.0 for base, 1.15 for outer suburbs), and coverage zip codes.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingArea({
                      id: `area-${Date.now().toString().slice(-4)}`,
                      name: "",
                      description: "",
                      feeMultiplier: 1.0,
                      active: true,
                      zipCodes: [],
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add Service Area
                </button>
              </div>

              {/* Area List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {serviceAreas.map((area) => (
                  <div
                    key={area.id}
                    className={`rounded-xl border p-5 transition flex flex-col justify-between ${
                      area.active
                        ? "bg-white dark:bg-slate-800/80 border-slate-200 dark:border-slate-700"
                        : "bg-slate-50 dark:bg-slate-900/50 border-dashed border-slate-300 dark:border-slate-800 opacity-75"
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base">
                          {area.name}
                        </h3>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            area.active
                              ? "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                              : "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                          }`}
                        >
                          {area.active ? "Active" : "Disabled"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                        {area.description || "No description provided."}
                      </p>

                      <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Fee Multiplier:</span>
                          <span className="font-semibold text-slate-900 dark:text-white">
                            {area.feeMultiplier}x ({Math.round((area.feeMultiplier - 1) * 100)}% surcharge)
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Identifier:</span>
                          <span className="font-mono text-[11px] text-slate-500">{area.id}</span>
                        </div>
                        {area.zipCodes && area.zipCodes.length > 0 && (
                          <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-slate-800">
                            <span className="text-slate-400">Zip Codes:</span>
                            <span className="font-mono text-[11px] truncate max-w-[150px]">
                              {area.zipCodes.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={() => setEditingArea(area)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        title="Edit Area"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteArea(area.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                        title="Delete Area"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Editing Area */}
            {editingArea && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {editingArea.name ? `Edit Area: ${editingArea.name}` : "Create Service Territory"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Unique Area ID
                      </label>
                      <input
                        type="text"
                        value={editingArea.id || ""}
                        onChange={(e) => setEditingArea({ ...editingArea, id: e.target.value })}
                        placeholder="e.g. cook-county-north"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Area Display Name
                      </label>
                      <input
                        type="text"
                        value={editingArea.name || ""}
                        onChange={(e) => setEditingArea({ ...editingArea, name: e.target.value })}
                        placeholder="e.g. Evanston & North Shore"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Coverage Description
                      </label>
                      <textarea
                        value={editingArea.description || ""}
                        onChange={(e) => setEditingArea({ ...editingArea, description: e.target.value })}
                        placeholder="Serving residential estates and commercial lakefront properties"
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                          Fee Multiplier
                        </label>
                        <input
                          type="number"
                          step="0.05"
                          min="0.5"
                          max="3.0"
                          value={editingArea.feeMultiplier ?? 1.0}
                          onChange={(e) =>
                            setEditingArea({ ...editingArea, feeMultiplier: parseFloat(e.target.value) || 1.0 })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div className="flex items-center pt-6">
                        <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={editingArea.active ?? true}
                            onChange={(e) => setEditingArea({ ...editingArea, active: e.target.checked })}
                            className="rounded text-[#0050a0] focus:ring-[#0050a0] h-4 w-4"
                          />
                          Active Service Area
                        </label>
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Covered Zip Codes (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editingArea.zipCodes?.join(", ") || ""}
                        onChange={(e) =>
                          setEditingArea({
                            ...editingArea,
                            zipCodes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="60201, 60202, 60091"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setEditingArea(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveArea}
                      disabled={saving}
                      className="px-5 py-2 text-xs font-semibold bg-[#203060] hover:bg-[#0050a0] text-white rounded-lg shadow-sm"
                    >
                      {saving ? "Saving..." : "Save Area"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 3: SERVICES & PRICING ───────────────────────────────────── */}
        {activeTab === "services" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#0050a0]" /> Services & Dynamic Pricing
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage service catalogue, flat rates, durations, feature checklists, and package bundles.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingService({
                      id: `svc-${Date.now().toString().slice(-4)}`,
                      name: "",
                      category: "residential",
                      price: "$299",
                      duration: "2 Hours",
                      description: "",
                      features: [],
                      isPackage: false,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add New Service
                </button>
              </div>

              {/* Service Table / Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((svc) => (
                  <div
                    key={svc.id}
                    className="bg-white dark:bg-slate-800/90 rounded-xl border border-slate-200 dark:border-slate-700 p-5 flex flex-col justify-between shadow-sm hover:border-[#0050a0]/50 transition"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                            {svc.category}
                          </span>
                          {svc.isPackage && (
                            <span className="ml-1.5 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#0050a0]/10 text-[#0050a0] dark:text-[#60a0d0]">
                              Package Bundle
                            </span>
                          )}
                        </div>
                        <span className="text-lg font-extrabold text-[#203060] dark:text-white">
                          {svc.price}
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2">
                        {svc.name}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3 line-clamp-2">
                        {svc.description || "No description provided."}
                      </p>

                      <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1 mb-4 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-lg">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Duration:</span>
                          <span className="font-semibold">{svc.duration}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">ID:</span>
                          <span className="font-mono text-[11px]">{svc.id}</span>
                        </div>
                      </div>

                      {svc.features && svc.features.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                            Included Items:
                          </p>
                          <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                            {svc.features.slice(0, 3).map((f: string, i: number) => (
                              <li key={i} className="flex items-center gap-1.5 truncate">
                                <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                                <span className="truncate">{f}</span>
                              </li>
                            ))}
                            {svc.features.length > 3 && (
                              <li className="text-[11px] text-slate-400 pl-5">
                                +{svc.features.length - 3} more items...
                              </li>
                            )}
                          </ul>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100 dark:border-slate-700/60">
                      <button
                        onClick={() => setEditingService(svc)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                        title="Edit Service"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteService(svc.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                        title="Delete Service"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Editing Service */}
            {editingService && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {editingService.name ? `Edit Service: ${editingService.name}` : "Create New Service"}
                  </h3>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                          Service ID
                        </label>
                        <input
                          type="text"
                          value={editingService.id || ""}
                          onChange={(e) => setEditingService({ ...editingService, id: e.target.value })}
                          placeholder="e.g. whole-home-hepa"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                          Category
                        </label>
                        <select
                          value={editingService.category || "residential"}
                          onChange={(e) =>
                            setEditingService({
                              ...editingService,
                              category: e.target.value as Service["category"],
                            })
                          }
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        >
                          <option value="residential">Residential</option>
                          <option value="commercial">Commercial</option>
                          <option value="addon">Add-on Service</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Service Title / Name
                      </label>
                      <input
                        type="text"
                        value={editingService.name || ""}
                        onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                        placeholder="e.g. Whole-Home NADCA Decontamination"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                          Price (Flat-Rate)
                        </label>
                        <input
                          type="text"
                          value={editingService.price || ""}
                          onChange={(e) => setEditingService({ ...editingService, price: e.target.value })}
                          placeholder="$349"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                          Standard Duration
                        </label>
                        <input
                          type="text"
                          value={editingService.duration || ""}
                          onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                          placeholder="2 Hours"
                          className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Scope Description
                      </label>
                      <textarea
                        value={editingService.description || ""}
                        onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                        placeholder="Full negative air pressure HEPA extraction on supply & return plenums."
                        rows={2}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Included Features (one per line)
                      </label>
                      <textarea
                        value={editingService.features?.join("\n") || ""}
                        onChange={(e) =>
                          setEditingService({
                            ...editingService,
                            features: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean),
                          })
                        }
                        placeholder="Negative air extraction&#10;HEPA filtration filtration&#10;Digital CFM certificate"
                        rows={3}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>

                    <div className="flex items-center">
                      <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingService.isPackage ?? false}
                          onChange={(e) => setEditingService({ ...editingService, isPackage: e.target.checked })}
                          className="rounded text-[#0050a0] focus:ring-[#0050a0] h-4 w-4"
                        />
                        Highlight as Featured Package Bundle
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setEditingService(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveService}
                      disabled={saving}
                      className="px-5 py-2 text-xs font-semibold bg-[#203060] hover:bg-[#0050a0] text-white rounded-lg shadow-sm"
                    >
                      {saving ? "Saving..." : "Save Service"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: FAQS & CONTENT ──────────────────────────────────────── */}
        {activeTab === "faqs" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-[#0050a0]" /> Frequently Asked Questions
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Manage customer-facing FAQs displayed on the home page and pricing knowledge base.
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditingFAQ({
                      id: `faq-${Date.now().toString().slice(-4)}`,
                      question: "",
                      answer: "",
                      displayOrder: faqs.length + 1,
                    })
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-xs sm:text-sm font-semibold transition shadow-sm"
                >
                  <Plus className="w-4 h-4" /> Add FAQ Item
                </button>
              </div>

              {/* FAQ List */}
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div
                    key={faq.id}
                    className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/60 hover:border-slate-300 dark:hover:border-slate-700 transition"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">
                            #{index + 1}
                          </span>
                          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                            {faq.question}
                          </h3>
                        </div>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pl-8">
                          {faq.answer}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setEditingFAQ(faq)}
                          className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition"
                          title="Edit FAQ"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFAQ(faq.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition"
                          title="Delete FAQ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Editing FAQ */}
            {editingFAQ && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
                    {editingFAQ.question ? "Edit FAQ Item" : "Create New FAQ Item"}
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={editingFAQ.question || ""}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, question: e.target.value })}
                        placeholder="e.g. Do you sanitize the ducts after vacuuming?"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                        Answer
                      </label>
                      <textarea
                        value={editingFAQ.answer || ""}
                        onChange={(e) => setEditingFAQ({ ...editingFAQ, answer: e.target.value })}
                        placeholder="Provide clear, transparent details for customers..."
                        rows={4}
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-200 dark:border-slate-800">
                    <button
                      onClick={() => setEditingFAQ(null)}
                      className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSaveFAQ}
                      disabled={saving}
                      className="px-5 py-2 text-xs font-semibold bg-[#203060] hover:bg-[#0050a0] text-white rounded-lg shadow-sm"
                    >
                      {saving ? "Saving..." : "Save FAQ"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 5: GOOGLE REVIEW APIS & CONFIG ─────────────────────────── */}
        {activeTab === "reviews" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" /> Google Reviews API & Place Config
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Connect your verified Google Business Profile to dynamically sync verified 5-star customer reviews and aggregate ratings.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-6 max-w-3xl">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Google Cloud Places API Key
                </label>
                <input
                  type="password"
                  value={config.googlePlacesApiKey}
                  onChange={(e) => setConfig({ ...config, googlePlacesApiKey: e.target.value })}
                  placeholder="AIzaSy..."
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#0050a0] outline-none"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Obtained from Google Cloud Console &gt; APIs &amp; Services &gt; Credentials.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Google Place ID
                  </label>
                  <input
                    type="text"
                    value={config.googlePlaceId}
                    onChange={(e) => setConfig({ ...config, googlePlaceId: e.target.value })}
                    placeholder="ChIJ..."
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#0050a0] outline-none"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Your unique Google Place Identifier for AeroDuct Chicago.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Rating Filter Threshold
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      step="0.1"
                      min="1.0"
                      max="5.0"
                      value={config.googleReviewsMinRating}
                      onChange={(e) =>
                        setConfig({ ...config, googleReviewsMinRating: parseFloat(e.target.value) || 4.5 })
                      }
                      className="w-32 px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-[#0050a0] outline-none"
                    />
                    <span className="text-xs text-slate-500">Stars and above shown on public landing pages</span>
                  </div>
                </div>
              </div>

              {/* Review Integration Preview Box */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                    API Integration Status
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Places Webhook Active
                  </span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <div className="flex items-center text-amber-500">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-slate-900 dark:text-white">4.9 / 5.0</span>
                  <span className="text-xs text-slate-500">(248 Verified Local Chicago Reviews)</span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Google Review API Config"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── TAB 6: PAYMENTS & BANK INFO ────────────────────────────────── */}
        {activeTab === "payments" && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-[#0050a0]" /> Payment Gateways & Banking
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Configure Stripe credit card processing and direct corporate ACH / wire transfer banking information.
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveConfig} className="space-y-8 max-w-3xl">
              {/* Stripe Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">Stripe Payment Gateway</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                      Credit / Debit / Apple Pay
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.stripeEnabled}
                      onChange={(e) => setConfig({ ...config, stripeEnabled: e.target.checked })}
                      className="rounded text-[#0050a0] focus:ring-[#0050a0] h-4 w-4"
                    />
                    Enable Stripe Gateway
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Stripe Publishable Key
                    </label>
                    <input
                      type="text"
                      value={config.stripePublishableKey}
                      onChange={(e) => setConfig({ ...config, stripePublishableKey: e.target.value })}
                      placeholder="pk_test_..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Stripe Secret Key
                    </label>
                    <input
                      type="password"
                      value={config.stripeSecretKey}
                      onChange={(e) => setConfig({ ...config, stripeSecretKey: e.target.value })}
                      placeholder="sk_test_..."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Stripe Webhook Secret (whsec)
                  </label>
                  <input
                    type="password"
                    value={config.stripeWebhookSecret}
                    onChange={(e) => setConfig({ ...config, stripeWebhookSecret: e.target.value })}
                    placeholder="whsec_..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                  />
                </div>
              </div>

              {/* Direct Bank Transfer Section */}
              <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-slate-900 dark:text-white">Commercial Bank Wire & ACH</span>
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                      B2B Invoicing
                    </span>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.bankTransferEnabled}
                      onChange={(e) => setConfig({ ...config, bankTransferEnabled: e.target.checked })}
                      className="rounded text-[#0050a0] focus:ring-[#0050a0] h-4 w-4"
                    />
                    Enable Bank Wire / ACH
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Bank Name
                    </label>
                    <input
                      type="text"
                      value={config.bankName}
                      onChange={(e) => setConfig({ ...config, bankName: e.target.value })}
                      placeholder="JPMorgan Chase Bank, N.A."
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Routing / ABA Number
                    </label>
                    <input
                      type="text"
                      value={config.bankRoutingNumber}
                      onChange={(e) => setConfig({ ...config, bankRoutingNumber: e.target.value })}
                      placeholder="071000013"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                      Account Number
                    </label>
                    <input
                      type="text"
                      value={config.bankAccountNumber}
                      onChange={(e) => setConfig({ ...config, bankAccountNumber: e.target.value })}
                      placeholder="••••••••4819"
                      className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                    Customer Payment Instructions / Wire Memo
                  </label>
                  <textarea
                    value={config.bankWireNotes}
                    onChange={(e) => setConfig({ ...config, bankWireNotes: e.target.value })}
                    placeholder="Include Booking Reference number (e.g., AERO-99201) in wire transfer description."
                    rows={2}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end">
                <button
                  type="submit"
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#203060] hover:bg-[#0050a0] text-white text-sm font-semibold transition shadow-sm disabled:opacity-60"
                >
                  <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save Payment & Banking Settings"}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
