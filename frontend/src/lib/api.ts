// lib/api.ts
// Typed API client. Currently backed by mock data.
// TODO: replace each function body with a real fetch() call to the Go backend.

import {
  SERVICE_AREAS,
  SERVICES,
  type ServiceArea,
  type Service,
} from "./mockData";

export type { ServiceArea, Service };

export type PriceBreakdownResult = {
  subtotal: number;
  taxRate: number;
  taxLabel: string;
  tax: number;
  total: number;
  currency: string;
  locale: string;
};

// ── Service Areas ───────────────────────────────────────────────────

export function getServiceArea(id: string): ServiceArea {
  // TODO: replace with real API call to Go backend
  const area = SERVICE_AREAS.find((a) => a.id === id);
  if (!area) throw new Error(`Unknown area: ${id}`);
  return area;
}

export function getAllServiceAreas(): ServiceArea[] {
  // TODO: replace with real API call to Go backend
  return SERVICE_AREAS;
}

// ── Services ────────────────────────────────────────────────────────

export function getServices(): Service[] {
  // TODO: replace with real API call to Go backend
  return SERVICES;
}

export function getService(id: string): Service {
  // TODO: replace with real API call to Go backend
  const svc = SERVICES.find((s) => s.id === id);
  if (!svc) throw new Error(`Unknown service: ${id}`);
  return svc;
}

// ── Pricing ───────────────────────────────────────────────────────

export function calculatePrice(areaId: string, serviceIds: string[]): PriceBreakdownResult {
  // TODO: replace with real API call to Go backend at POST /api/v1/pricing/calculate
  const area = getServiceArea(areaId);
  let subtotal = 0;
  serviceIds.forEach(id => {
      const svc = getService(id);
      const match = svc.price.match(/\d+/);
      if (match) subtotal += parseInt(match[0], 10);
  });
  subtotal *= area.feeMultiplier;
  
  const taxRate = 0.08;
  const taxLabel = "Sales Tax (8%)";
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  return { subtotal, taxRate, taxLabel, tax, total, currency: "USD", locale: "en-US" };
}
