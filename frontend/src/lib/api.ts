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
  return apiRequest<ServiceArea[]>("/geo/areas", { method: "GET" }, () => getAllServiceAreas());
}

export async function fetchServices(): Promise<Service[]> {
  return apiRequest<Service[]>("/services", { method: "GET" }, () => getServices());
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

export async function createBooking(payload: BookingPayload): Promise<BookingResult> {
  return apiRequest<BookingResult>(
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
  );
}

export async function fetchBooking(id: string): Promise<BookingResult | null> {
  return apiRequest<BookingResult | null>(
    `/bookings/${id}`,
    { method: "GET" },
    () => {
      try {
        const saved = localStorage.getItem(`booking_${id}`);
        if (saved) return JSON.parse(saved);
      } catch (_) {}
      return null;
    }
  );
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
