// ─────────────────────────────────────────────────────────
// AeroDuct Shared Types — API contracts between web & api
// ─────────────────────────────────────────────────────────

// ── Geo / Market ─────────────────────────────────────────

export type Market = "chicago" | "india";
export type Currency = "USD" | "INR";

export interface GeoContext {
  market: Market;
  currency: Currency;
  country: string;
  city?: string;
}

// ── Service Tiers ─────────────────────────────────────────

export type ServiceCategory =
  | "residential_duct"
  | "dryer_vent"
  | "commercial_kitchen"
  | "hospital_hvac"
  | "corporate_hvac"
  | "robotic_duct";

export type ServiceTier = "basic" | "standard" | "premium" | "enterprise";

export interface ServiceTierPrice {
  tier: ServiceTier;
  name: string;
  priceUsd?: number;
  priceInr?: number;
  description: string;
  features: string[];
  estimatedDurationMinutes: number;
}

// ── Pricing Calculator ────────────────────────────────────

export interface PricingInput {
  market: Market;
  squareFootage: number;
  furnaceCount: number;
  ventCount: number;
  category: ServiceCategory;
  addDryerVent?: boolean;
}

export interface PricingResult {
  tier: ServiceTier;
  basePrice: number;
  currency: Currency;
  lineItems: PricingLineItem[];
  totalPrice: number;
  estimatedDurationMinutes: number;
}

export interface PricingLineItem {
  label: string;
  price: number;
  currency: Currency;
}

// ── Booking ───────────────────────────────────────────────

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "dispatched"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface TimeSlot {
  id: string;
  date: string; // ISO 8601 date
  startTime: string; // HH:mm
  endTime: string; // HH:mm (2-hour window)
  available: boolean;
}

export interface CreateBookingRequest {
  customerId?: string; // optional for guest checkout
  serviceCategory: ServiceCategory;
  tier: ServiceTier;
  addressId: string;
  timeSlotId: string;
  pricingResult: PricingResult;
  notes?: string;
}

export interface Booking {
  id: string;
  status: BookingStatus;
  customerId: string;
  serviceCategory: ServiceCategory;
  tier: ServiceTier;
  address: Address;
  timeSlot: TimeSlot;
  pricingResult: PricingResult;
  technicianId?: string;
  passportUrl?: string; // Digital Duct Health Passport™ URL
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// ── Customer ──────────────────────────────────────────────

export interface Customer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  market: Market;
  addresses: Address[];
  createdAt: string;
}

export interface Address {
  id: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string; // US state or Indian state
  postalCode: string;
  country: string;
  squareFootage?: number;
  furnaceCount?: number;
  ventCount?: number;
}

// ── Technician / Dispatch ─────────────────────────────────

export type TechnicianStatus = "available" | "dispatched" | "on_job" | "off_duty";

export interface Technician {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  market: Market;
  status: TechnicianStatus;
  currentLocation?: Coordinates;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface DispatchRoute {
  id: string;
  technicianId: string;
  bookings: Booking[];
  estimatedStartTime: string;
  date: string;
}

// ── Digital Duct Health Passport™ ────────────────────────

export interface DuctPassport {
  id: string;
  bookingId: string;
  customerId: string;
  address: Address;
  serviceDate: string;
  technicianId: string;
  cleanlinessRating: 1 | 2 | 3 | 4 | 5;
  beforeVideoUrl?: string;
  afterVideoUrl?: string;
  inspectionNotes: string;
  thumbnailUrl?: string;
  passportUrl: string; // permanent shareable link
  createdAt: string;
}

// ── Enterprise / AMC ──────────────────────────────────────

export type AamcContractStatus = "active" | "pending_renewal" | "expired" | "cancelled";

export interface AamcContract {
  id: string;
  enterpriseId: string;
  sites: EnterpriseLocation[];
  startDate: string;
  endDate: string;
  status: AamcContractStatus;
  totalAnnualValueInr: number;
  gstNumber: string;
}

export interface EnterpriseLocation {
  id: string;
  name: string;
  address: Address;
  hvacUnits: number;
  lastServiceDate?: string;
  nextServiceDate?: string;
}

// ── Compliance ────────────────────────────────────────────

export type ComplianceCertType = "fssai" | "fire_safety" | "nadca";

export interface ComplianceCert {
  id: string;
  bookingId: string;
  type: ComplianceCertType;
  issuedAt: string;
  validUntil: string;
  downloadUrl: string;
}

// ── API Response Wrappers ────────────────────────────────

export interface ApiResponse<T> {
  data: T;
  meta?: Record<string, unknown>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}
