// lib/api.ts
// Typed API client. Currently backed by mock data.
// TODO: replace each function body with a real fetch() call to the Go backend.

import {
  MARKETS,
  SERVICE_TIERS,
  SLOTS,
  MOCK_PASSPORT,
  MOCK_BOOKINGS,
  type Market,
  type Tier,
  type Slot,
  type Passport,
  type Booking,
} from "./mockData";

export type { Market, Tier, Slot, Passport, Booking };

export type PriceBreakdownResult = {
  subtotal: number;
  taxRate: number;
  taxLabel: string;
  tax: number;
  total: number;
  currency: string;
  locale: string;
};

export type BookingInput = {
  marketId: string;
  tierId: string;
  slotId: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
};

// ── Markets ───────────────────────────────────────────────────────

export function getMarket(id: string): Market {
  // TODO: replace with real API call to Go backend
  const market = MARKETS.find((m) => m.id === id);
  if (!market) throw new Error(`Unknown market: ${id}`);
  return market;
}

export function getAllMarkets(): Market[] {
  // TODO: replace with real API call to Go backend
  return MARKETS;
}

// ── Tiers ─────────────────────────────────────────────────────────

export function getTiers(marketId: string): Tier[] {
  // TODO: replace with real API call to Go backend
  return SERVICE_TIERS[marketId] ?? [];
}

export function getTier(marketId: string, tierId: string): Tier {
  // TODO: replace with real API call to Go backend
  const tier = getTiers(marketId).find((t) => t.id === tierId);
  if (!tier) throw new Error(`Unknown tier: ${tierId} for market ${marketId}`);
  return tier;
}

// ── Slots ─────────────────────────────────────────────────────────

export function getSlots(marketId: string, date?: string): Slot[] {
  // TODO: replace with real API call to Go backend
  void marketId;
  if (date) return SLOTS.filter((s) => s.date === date);
  return SLOTS;
}

// ── Pricing ───────────────────────────────────────────────────────

export function calculatePrice(marketId: string, tierId: string): PriceBreakdownResult {
  // TODO: replace with real API call to Go backend at POST /api/v1/pricing/calculate
  const market = getMarket(marketId);
  const tier = getTier(marketId, tierId);
  const taxRate = marketId === "india" ? 0.18 : 0.08;
  const taxLabel = marketId === "india" ? "GST (18%)" : "Sales Tax (8%)";
  const subtotal = tier.price;
  const tax = parseFloat((subtotal * taxRate).toFixed(2));
  const total = parseFloat((subtotal + tax).toFixed(2));
  return { subtotal, taxRate, taxLabel, tax, total, currency: market.currency, locale: market.locale };
}

// ── Passport ──────────────────────────────────────────────────────

export function getPassport(id: string): Passport {
  // TODO: replace with real API call to Go backend at GET /api/v1/passport/:id
  void id;
  return MOCK_PASSPORT;
}

// ── Bookings ──────────────────────────────────────────────────────

export function getBooking(id: string): Booking {
  // TODO: replace with real API call to Go backend at GET /api/v1/bookings/:id
  void id;
  return (MOCK_BOOKINGS.find((b) => b.id === id) ?? MOCK_BOOKINGS[0])!;
}

export function createBooking(_input: BookingInput): Booking {
  // TODO: replace with real API call to Go backend at POST /api/v1/bookings
  return MOCK_BOOKINGS[0]!;
}
