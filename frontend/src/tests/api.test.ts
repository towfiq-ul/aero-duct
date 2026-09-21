import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  getServiceArea,
  getAllServiceAreas,
  getServices,
  getService,
  calculatePrice,
  calculatePriceAsync,
  createBooking,
  fetchPassport,
  submitChecklist,
} from "../lib/api";

describe("lib/api", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("retrieves service area synchronously", () => {
    const area = getServiceArea("chicago");
    expect(area).toBeDefined();
    expect(area.name).toContain("Chicago");
    expect(area.feeMultiplier).toBe(1.0);
  });

  it("retrieves all service areas and services synchronously", () => {
    const areas = getAllServiceAreas();
    expect(areas.length).toBeGreaterThan(0);
    const services = getServices();
    expect(services.length).toBeGreaterThan(0);
    const single = getService(services[0].id);
    expect(single.id).toBe(services[0].id);
  });

  it("throws for unknown service area", () => {
    expect(() => getServiceArea("non-existent-area")).toThrow("Unknown area");
  });

  it("calculates price correctly with IL tax rate", () => {
    const quote = calculatePrice("chicago", ["res-air-duct"]);
    expect(quote.subtotal).toBeGreaterThan(0);
    expect(quote.taxRate).toBe(0.08);
    expect(quote.taxLabel).toBe("Sales Tax (8%)");
    expect(quote.total).toBe(parseFloat((quote.subtotal + quote.tax).toFixed(2)));
  });

  it("calculatePriceAsync returns valid breakdown using fallback when network fails", async () => {
    // global fetch fails or rejects
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

    const result = await calculatePriceAsync("chicago", ["res-air-duct"]);
    expect(result.subtotal).toBeGreaterThan(0);
    expect(result.total).toBeGreaterThan(result.subtotal);
  });

  it("createBooking generates confirmation record on fallback", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

    const res = await createBooking({
      customerName: "Jane Doe",
      email: "jane@example.com",
      phone: "312-555-0199",
      address: "200 E Randolph St",
      serviceAreaId: "chicago-city",
      selectedPackage: "standard",
      preferredDate: "2026-10-01",
      arrivalWindow: "08:00 AM - 10:00 AM",
    });

    expect(res.id).toBeDefined();
    expect(res.referenceNumber).toMatch(/^AERO-\d{6}$/);
    expect(res.status).toBe("confirmed");
  });

  it("fetchPassport returns valid compliance report on fallback", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

    const passport = await fetchPassport("AD-12345");
    expect(passport.id).toBe("AD-12345");
    expect(passport.cfmPreClean).toBe(820);
    expect(passport.cfmPostClean).toBe(1240);
    expect(passport.airQualityRating).toBe("A+");
    expect(passport.beforeAfterRecords.length).toBeGreaterThanOrEqual(2);
  });

  it("submitChecklist submits and returns passport ID", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));

    const res = await submitChecklist("b-123", { cfmPost: 1200 });
    expect(res.success).toBe(true);
    expect(res.passportId).toMatch(/^AD-\d+$/);
  });
});
