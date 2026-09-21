// lib/api.ts
// Typed API client with live backend integration (VITE_API_URL)
// and automatic fallback to mock data when backend is unreachable (e.g. static hosting).

import {
  SERVICE_AREAS,
  SERVICES,
  type ServiceArea,
  type Service,
} from "./mockData";

export type { ServiceArea, Service };

export interface PriceBreakdownResult {
  subtotal: number;
  taxRate: number;
  taxLabel: string;
  tax: number;
  total: number;
  currency: string;
  locale: string;
}

export interface BookingPayload {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  serviceAreaId: string;
  selectedPackage: string;
  selectedAddons?: string[];
  propertyType?: string;
  squareFootage?: number;
  ductType?: string;
  preferredDate: string;
  arrivalWindow: string;
  accessNotes?: string;
  estimatedTotal?: number;
}

export interface BookingResult {
  id: string;
  referenceNumber: string;
  status: "confirmed" | "pending" | "dispatched";
  createdAt: string;
  booking: BookingPayload;
}

export interface PassportRecord {
  id: string;
  bookingId: string;
  referenceNumber: string;
  customerName: string;
  serviceAddress: string;
  inspectionDate: string;
  technicianName: string;
  leadTechBadge: string;
  nadcaCertificationId: string;
  systemModel: string;
  squareFootage: number;
  cfmPreClean: number;
  cfmPostClean: number;
  particulateReductionPercent: number;
  airQualityRating: "A+" | "A" | "B";
  beforeAfterRecords: Array<{
    id: string;
    section: string;
    description: string;
    beforeImage: string;
    afterImage: string;
    cleanedAt: string;
  }>;
  complianceSignOff: {
    auditor: string;
    nadcaStandard: string;
    issuedTimestamp: string;
  };
}

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api/v1";

/**
 * Generic helper to safely query the backend API with an automatic fallback
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  fallback: () => T | Promise<T>
): Promise<T> {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(options.headers || {}),
      },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      console.warn(`[API] Endpoint ${endpoint} returned ${res.status}. Using fallback.`);
      return await fallback();
    }
    return (await res.json()) as T;
  } catch (err) {
    // Graceful offline or server unreachable fallback
    return await fallback();
  }
}

// ── Synchronous Helpers (Preserved for backwards compatibility) ─────

export function getServiceArea(id: string): ServiceArea {
  const area = SERVICE_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown area: ${id}`);
  return area;
}

export function getAllServiceAreas(): ServiceArea[] {
  return SERVICE_AREAS;
}

export function getServices(): Service[] {
  return SERVICES;
}

export function getService(id: string): Service {
  const svc = SERVICES.find((s) => s.id === id);
  if (!svc) throw new Error(`Unknown service: ${id}`);
  return svc;
}

export function calculatePrice(
  areaId: string,
  serviceIds: string[]
): PriceBreakdownResult {
  const area = getServiceArea(areaId);
  let subtotal = 0;
  serviceIds.forEach((id) => {
    const svc = getService(id);
    const match = svc.price.match(/\d+/);
    if (match) subtotal += parseInt(match[0], 10);
  });
  subtotal *= area.feeMultiplier;

  const taxRate = 0.08;
  const taxLabel = "Sales Tax (8%)";
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  return {
    subtotal,
    taxRate,
    taxLabel,
    tax,
    total,
    currency: "USD",
    locale: "en-US",
  };
}

// ── Asynchronous Live API Methods ───────────────────────────────────

export async function fetchServiceAreas(): Promise<ServiceArea[]> {
  return apiRequest<ServiceArea[] | { serviceAreas: ServiceArea[] }>(
    "/geo/areas",
    { method: "GET" },
    () => getAllServiceAreas()
  ).then((res) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).serviceAreas)) return (res as any).serviceAreas;
    return getAllServiceAreas();
  });
}

export async function fetchServices(): Promise<Service[]> {
  return apiRequest<Service[] | { services: Service[] }>(
    "/services",
    { method: "GET" },
    () => getServices()
  ).then((res) => {
    if (Array.isArray(res)) return res;
    if (res && Array.isArray((res as any).services)) return (res as any).services;
    return getServices();
  });
}

export async function calculatePriceAsync(
  areaId: string,
  serviceIds: string[]
): Promise<PriceBreakdownResult> {
  return apiRequest<PriceBreakdownResult>(
    "/pricing/calculate",
    {
      method: "POST",
      body: JSON.stringify({ areaId, serviceIds }),
    },
    () => calculatePrice(areaId, serviceIds)
  );
}

// ── Time Slots Binding ──────────────────────────────────────────────

export interface AvailableSlot {
  id: string;
  time: string;
  startTime?: string;
  endTime?: string;
  period?: "Morning" | "Afternoon" | "Evening";
  available: boolean;
}

export async function fetchAvailableSlots(
  date?: string,
  market: string = "chicago"
): Promise<AvailableSlot[]> {
  const query = new URLSearchParams();
  if (date) query.set("date", date);
  query.set("market", market);

  return apiRequest<{ slots: any[] }>(
    `/bookings/slots?${query.toString()}`,
    { method: "GET" },
    () => {
      return {
        slots: [
          { id: "slot-1", time: "08:00 AM - 10:00 AM", period: "Morning", available: true },
          { id: "slot-2", time: "10:00 AM - 12:00 PM", period: "Morning", available: true },
          { id: "slot-3", time: "01:00 PM - 03:00 PM", period: "Afternoon", available: true },
          { id: "slot-4", time: "03:00 PM - 05:00 PM", period: "Afternoon", available: false },
          { id: "slot-5", time: "05:00 PM - 07:00 PM", period: "Evening", available: true },
        ],
      };
    }
  ).then((res) => {
    if (!res || !Array.isArray(res.slots)) return [];
    return res.slots.map((s: any) => ({
      id: s.id || s.time,
      time: s.time || `${s.startTime || "08:00 AM"} - ${s.endTime || "10:00 AM"}`,
      startTime: s.startTime,
      endTime: s.endTime,
      period: s.period || (s.startTime?.includes("AM") ? "Morning" : "Afternoon"),
      available: s.available !== undefined ? s.available : true,
    }));
  });
}

// ── Booking Creation & Lookup ───────────────────────────────────────

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  return apiRequest<any>(
    "/bookings",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
    () => {
      // Offline / fallback mock booking generator
      const ref = `AERO-${Math.floor(100000 + Math.random() * 900000)}`;
      const result: BookingResult = {
        id: `b-${Date.now()}`,
        referenceNumber: ref,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        booking: payload,
      };
      try {
        localStorage.setItem(`booking_${result.id}`, JSON.stringify(result));
      } catch (_) {}
      return result;
    }
  ).then((res) => {
    if (res && res.booking && res.booking.id) {
      return {
        id: res.booking.id,
        referenceNumber: res.booking.referenceNumber || res.booking.id,
        status: res.booking.status || "confirmed",
        createdAt: res.booking.createdAt || new Date().toISOString(),
        booking: payload,
      };
    }
    return res as BookingResult;
  });
}

export async function fetchBooking(id: string): Promise<BookingResult | null> {
  return apiRequest<any>(
    `/bookings/${id}`,
    { method: "GET" },
    () => {
      try {
        const saved = localStorage.getItem(`booking_${id}`);
        if (saved) return JSON.parse(saved);
      } catch (_) {}
      return null;
    }
  ).then((res) => {
    if (!res) return null;
    if (res.booking && res.booking.id) {
      return {
        id: res.booking.id,
        referenceNumber: res.booking.referenceNumber || res.booking.id,
        status: res.booking.status || "confirmed",
        createdAt: res.booking.createdAt || new Date().toISOString(),
        booking: res.booking,
      };
    }
    return res;
  });
}

// ── Authentication Binding ──────────────────────────────────────────

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: string;
  market?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export async function loginUser(email: string, password: string): Promise<AuthResponse> {
  return apiRequest<AuthResponse>(
    "/auth/login",
    {
      method: "POST",
      body: JSON.stringify({ email, password }),
    },
    () => {
      return {
        token: "demo-jwt-aeroduct-token",
        user: {
          id: "usr-demo",
          email,
          firstName: "Demo",
          lastName: "Customer",
          role: "customer",
          market: "chicago",
        },
      };
    }
  ).then((res) => {
    if (res && res.token) {
      localStorage.setItem("aeroduct_auth_token", res.token);
      localStorage.setItem("aeroduct_auth_user", JSON.stringify(res.user));
    }
    return res;
  });
}

export async function signupUser(payload: {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  password: string;
  phone?: string;
  market?: string;
}): Promise<AuthResponse> {
  // Parse single name input if provided
  let first = payload.firstName || "";
  let last = payload.lastName || "";
  if (payload.name && !first) {
    const parts = payload.name.trim().split(" ");
    first = parts[0] || "Valued";
    last = parts.slice(1).join(" ") || "Customer";
  }
  if (!first) first = "Customer";

  const requestBody = {
    firstName: first,
    lastName: last,
    email: payload.email,
    password: payload.password,
    phone: payload.phone || "(312) 555-0100",
    market: payload.market || "chicago",
  };

  return apiRequest<AuthResponse>(
    "/auth/signup",
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    },
    () => {
      return {
        token: "demo-jwt-aeroduct-token",
        user: {
          id: `usr-${Date.now()}`,
          email: payload.email,
          firstName: first,
          lastName: last,
          phone: requestBody.phone,
          role: "customer",
          market: requestBody.market,
        },
      };
    }
  ).then((res) => {
    if (res && res.token) {
      localStorage.setItem("aeroduct_auth_token", res.token);
      localStorage.setItem("aeroduct_auth_user", JSON.stringify(res.user));
    }
    return res;
  });
}

export async function resetPasswordUser(
  token: string,
  newPassword: string
): Promise<{ success: boolean; message: string }> {
  return apiRequest<{ success: boolean; message: string }>(
    "/auth/reset-password",
    {
      method: "POST",
      body: JSON.stringify({ token, newPassword }),
    },
    () => ({ success: true, message: "Password updated successfully" })
  );
}

export function getCurrentUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem("aeroduct_auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function logoutUser(): void {
  localStorage.removeItem("aeroduct_auth_token");
  localStorage.removeItem("aeroduct_auth_user");
}

// ── Technician Dispatch Binding ─────────────────────────────────────

export interface DispatchJob {
  id: string;
  clientName: string;
  serviceAddress: string;
  timeSlot: string;
  packageType: string;
  targetCfm: number;
  status: "pending" | "in_progress" | "completed";
}

export async function fetchTechnicianDispatch(techId: string = "tech-1"): Promise<DispatchJob[]> {
  return apiRequest<{ jobs: any[] }>(
    `/technician/dispatch/${techId}`,
    { method: "GET" },
    () => {
      return {
        jobs: [
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
        ],
      };
    }
  ).then((res) => {
    if (!res || !Array.isArray(res.jobs)) return [];
    return res.jobs.map((j: any) => ({
      id: j.id || j.referenceNumber || "job",
      clientName:
        j.clientName ||
        (j.customer ? `${j.customer.firstName} ${j.customer.lastName}` : "Client"),
      serviceAddress:
        j.serviceAddress ||
        (j.address ? `${j.address.line1}, ${j.address.city}` : "Service Address"),
      timeSlot:
        j.timeSlot ||
        (j.timeSlot && j.timeSlot.startTime
          ? `${j.timeSlot.startTime} – ${j.timeSlot.endTime}`
          : "08:00 AM – 10:00 AM"),
      packageType: j.packageType || j.tier || j.serviceCategory || "HEPA Decontamination",
      targetCfm: j.targetCfm || 1200,
      status: (j.status as any) || "pending",
    }));
  });
}

export async function fetchPassport(id: string): Promise<PassportRecord> {
  return apiRequest<PassportRecord>(
    `/passport/${id}`,
    { method: "GET" },
    () => {
      // Mock passport fallback
      return {
        id: id || "AD-99201",
        bookingId: "b-88124",
        referenceNumber: "AERO-55291",
        customerName: "Eleanor Vance",
        serviceAddress: "1420 N Lake Shore Dr, Chicago, IL",
        inspectionDate: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        }),
        technicianName: "Marcus Sterling",
        leadTechBadge: "NADCA-CVI-8891",
        nadcaCertificationId: "NADCA-ASCS-4410",
        systemModel: "Trane CleanEffects Variable Speed 4.0-Ton",
        squareFootage: 2850,
        cfmPreClean: 820,
        cfmPostClean: 1240,
        particulateReductionPercent: 94.2,
        airQualityRating: "A+",
        beforeAfterRecords: [
          {
            id: "rec-1",
            section: "Main Supply Trunk & Borescope Inspection",
            description:
              "High particulate buildup, fiberglass microbial bloom eradicated via HEPA negative-air contact extraction.",
            beforeImage:
              "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80",
            afterImage:
              "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80",
            cleanedAt: "10:45 AM",
          },
          {
            id: "rec-2",
            section: "Primary Return Plenum & Blower Wheel Hub",
            description:
              "Heavy lint felt matting removed; blower squirrel-cage balanced; evaporator coil sanitized with EPA plant botanical agent.",
            beforeImage:
              "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
            afterImage:
              "https://images.unsplash.com/photo-1581092335397-9583fe92d232?auto=format&fit=crop&w=600&q=80",
            cleanedAt: "11:20 AM",
          },
        ],
        complianceSignOff: {
          auditor: "NADCA ACR 2021 Clinical Spec Quality Control",
          nadcaStandard: "ACR 2021 Section 4.2 Restorative Standard",
          issuedTimestamp: new Date().toISOString(),
        },
      };
    }
  );
}

export async function submitChecklist(
  bookingId: string,
  checklistData: Record<string, unknown>
): Promise<{ success: boolean; passportId: string }> {
  return apiRequest<{ success: boolean; passportId: string }>(
    `/technician/checklist/${bookingId}`,
    {
      method: "POST",
      body: JSON.stringify(checklistData),
    },
    () => {
      return {
        success: true,
        passportId: `AD-${Math.floor(10000 + Math.random() * 90000)}`,
      };
    }
  );
}

// ── Admin Panel API Methods ─────────────────────────────────────────

export interface AdminConfig {
  id: string;
  contactEmail: string;
  contactPhone: string;
  serviceAddress: string;
  officeHours: string;
  googlePlacesApiKey: string;
  googlePlaceId: string;
  googleReviewsMinRating: number;
  stripePublishableKey: string;
  stripeSecretKey: string;
  stripeWebhookSecret: string;
  stripeEnabled: boolean;
  bankName: string;
  bankAccountNumber: string;
  bankRoutingNumber: string;
  bankWireNotes: string;
  bankTransferEnabled: boolean;
}

export interface AdminFAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder?: number;
}

const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  id: "default",
  contactEmail: "support@aeroduct.com",
  contactPhone: "(312) 555-0199",
  serviceAddress: "1420 N Michigan Ave, Suite 400, Chicago, IL 60611",
  officeHours: "Mon-Sat: 7:00 AM - 7:00 PM CST",
  googlePlacesApiKey: "AIzaSyDummyKeySampleForReviews12345",
  googlePlaceId: "ChIJ7cv00DwsDogRAMDACa2m4K8",
  googleReviewsMinRating: 4.5,
  stripePublishableKey: "pk_test_51MzSampleAeroDuctStripeKey",
  stripeSecretKey: "sk_test_SampleSecretKeyAeroDuct",
  stripeWebhookSecret: "whsec_sampleWebhookSecret",
  stripeEnabled: true,
  bankName: "JPMorgan Chase Bank, N.A.",
  bankAccountNumber: "••••••••4819",
  bankRoutingNumber: "071000013",
  bankWireNotes: "Please reference your booking invoice number on ACH / Wire memo.",
  bankTransferEnabled: true,
};

export async function fetchAdminConfig(): Promise<AdminConfig> {
  return apiRequest<AdminConfig>("/admin/config", { method: "GET" }, () => {
    try {
      const stored = localStorage.getItem("aeroduct_admin_config");
      if (stored) return JSON.parse(stored);
    } catch (_) {}
    return DEFAULT_ADMIN_CONFIG;
  });
}

export async function updateAdminConfig(config: AdminConfig): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    "/admin/config",
    {
      method: "PUT",
      body: JSON.stringify(config),
    },
    () => {
      try {
        localStorage.setItem("aeroduct_admin_config", JSON.stringify(config));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function fetchAdminServiceAreas(): Promise<ServiceArea[]> {
  return apiRequest<{ serviceAreas: ServiceArea[] }>(
    "/admin/service-areas",
    { method: "GET" },
    () => {
      try {
        const stored = localStorage.getItem("aeroduct_admin_areas");
        if (stored) return { serviceAreas: JSON.parse(stored) };
      } catch (_) {}
      return { serviceAreas: SERVICE_AREAS };
    }
  ).then((res) => res.serviceAreas || SERVICE_AREAS);
}

export async function saveAdminServiceArea(area: ServiceArea): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    "/admin/service-areas",
    {
      method: "POST",
      body: JSON.stringify(area),
    },
    async () => {
      try {
        const areas = await fetchAdminServiceAreas();
        const existingIdx = areas.findIndex((a) => a.id === area.id);
        if (existingIdx >= 0) {
          areas[existingIdx] = area;
        } else {
          areas.push(area);
        }
        localStorage.setItem("aeroduct_admin_areas", JSON.stringify(areas));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function deleteAdminServiceArea(id: string): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    `/admin/service-areas/${id}`,
    { method: "DELETE" },
    async () => {
      try {
        const areas = (await fetchAdminServiceAreas()).filter((a) => a.id !== id);
        localStorage.setItem("aeroduct_admin_areas", JSON.stringify(areas));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function fetchAdminServices(): Promise<Service[]> {
  return apiRequest<{ services: Service[] }>(
    "/admin/services",
    { method: "GET" },
    () => {
      try {
        const stored = localStorage.getItem("aeroduct_admin_services");
        if (stored) return { services: JSON.parse(stored) };
      } catch (_) {}
      return { services: SERVICES };
    }
  ).then((res) => res.services || SERVICES);
}

export async function saveAdminService(svc: Service): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    "/admin/services",
    {
      method: "POST",
      body: JSON.stringify(svc),
    },
    async () => {
      try {
        const services = await fetchAdminServices();
        const idx = services.findIndex((s) => s.id === svc.id);
        if (idx >= 0) {
          services[idx] = svc;
        } else {
          services.push(svc);
        }
        localStorage.setItem("aeroduct_admin_services", JSON.stringify(services));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function deleteAdminService(id: string): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    `/admin/services/${id}`,
    { method: "DELETE" },
    async () => {
      try {
        const services = (await fetchAdminServices()).filter((s) => s.id !== id);
        localStorage.setItem("aeroduct_admin_services", JSON.stringify(services));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function fetchAdminFAQs(): Promise<AdminFAQ[]> {
  return apiRequest<{ faqs: AdminFAQ[] }>("/admin/faqs", { method: "GET" }, () => {
    try {
      const stored = localStorage.getItem("aeroduct_admin_faqs");
      if (stored) return { faqs: JSON.parse(stored) };
    } catch (_) {}
    return {
      faqs: [
        {
          id: "faq-1",
          question: "How often should I have my ducts cleaned?",
          answer: "The EPA recommends duct cleaning every 3–5 years for most residential properties.",
        },
        {
          id: "faq-2",
          question: "How long does the service take?",
          answer: "Most homes are completed within our guaranteed 2-hour arrival window.",
        },
        {
          id: "faq-3",
          question: "Is the pricing really flat-rate? No add-ons?",
          answer: "Yes. The price you see on the pricing page is the price you pay. We don't charge per vent.",
        },
      ],
    };
  }).then((res) => res.faqs || []);
}

export async function saveAdminFAQ(faq: AdminFAQ): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    "/admin/faqs",
    {
      method: "POST",
      body: JSON.stringify(faq),
    },
    async () => {
      try {
        const faqs = await fetchAdminFAQs();
        const idx = faqs.findIndex((f) => f.id === faq.id);
        if (idx >= 0) {
          faqs[idx] = faq;
        } else {
          faqs.push(faq);
        }
        localStorage.setItem("aeroduct_admin_faqs", JSON.stringify(faqs));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

export async function deleteAdminFAQ(id: string): Promise<boolean> {
  return apiRequest<{ success: boolean }>(
    `/admin/faqs/${id}`,
    { method: "DELETE" },
    async () => {
      try {
        const faqs = (await fetchAdminFAQs()).filter((f) => f.id !== id);
        localStorage.setItem("aeroduct_admin_faqs", JSON.stringify(faqs));
      } catch (_) {}
      return { success: true };
    }
  ).then(() => true);
}

