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

  describe("Admin APIs (offline / fallback)", () => {
    it("fetches and updates admin configuration", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
      const { fetchAdminConfig, updateAdminConfig } = await import("../lib/api");

      const config = await fetchAdminConfig();
      expect(config).toBeDefined();
      expect(config.contactEmail).toBeDefined();
      expect(config.stripeEnabled).toBe(true);

      const ok = await updateAdminConfig({
        ...config,
        contactEmail: "admin-updated@aeroduct.com",
      });
      expect(ok).toBe(true);

      const updated = await fetchAdminConfig();
      expect(updated.contactEmail).toBe("admin-updated@aeroduct.com");
    });

    it("performs CRUD operations on admin service areas", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
      const {
        fetchAdminServiceAreas,
        saveAdminServiceArea,
        deleteAdminServiceArea,
      } = await import("../lib/api");

      const initialAreas = await fetchAdminServiceAreas();
      expect(initialAreas.length).toBeGreaterThan(0);

      const newArea = {
        id: "test-zone",
        name: "Test Suburb",
        description: "Test Zone Description",
        feeMultiplier: 1.25,
        active: true,
        zipCodes: ["60001", "60002"],
      };

      await saveAdminServiceArea(newArea);
      const afterSave = await fetchAdminServiceAreas();
      const found = afterSave.find((a) => a.id === "test-zone");
      expect(found).toBeDefined();
      expect(found?.feeMultiplier).toBe(1.25);

      await deleteAdminServiceArea("test-zone");
      const afterDelete = await fetchAdminServiceAreas();
      expect(afterDelete.find((a) => a.id === "test-zone")).toBeUndefined();
    });

    it("performs CRUD operations on admin services and faqs", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
      const {
        fetchAdminServices,
        saveAdminService,
        deleteAdminService,
        fetchAdminFAQs,
        saveAdminFAQ,
        deleteAdminFAQ,
      } = await import("../lib/api");

      // Services
      const services = await fetchAdminServices();
      expect(services.length).toBeGreaterThan(0);

      const newSvc = {
        id: "test-blower-clean",
        name: "Blower Wheel Restoration",
        category: "residential" as const,
        price: "$175",
        duration: "1 Hour",
        description: "Deep motor cleaning",
        features: ["Motor disassembly", "Blade sanitation"],
        isPackage: false,
      };

      await saveAdminService(newSvc);
      let updatedSvcs = await fetchAdminServices();
      expect(updatedSvcs.find((s) => s.id === "test-blower-clean")).toBeDefined();

      await deleteAdminService("test-blower-clean");
      updatedSvcs = await fetchAdminServices();
      expect(updatedSvcs.find((s) => s.id === "test-blower-clean")).toBeUndefined();

      // FAQs
      const faqs = await fetchAdminFAQs();
      expect(faqs.length).toBeGreaterThan(0);

      const newFaq = {
        id: "faq-test-1",
        question: "Is your sanitizer EPA registered?",
        answer: "Yes, 100% botanical EPA registered hospital disinfectant.",
      };

      await saveAdminFAQ(newFaq);
      let updatedFaqs = await fetchAdminFAQs();
      expect(updatedFaqs.find((f) => f.id === "faq-test-1")).toBeDefined();

      await deleteAdminFAQ("faq-test-1");
      updatedFaqs = await fetchAdminFAQs();
      expect(updatedFaqs.find((f) => f.id === "faq-test-1")).toBeUndefined();
    });
  });

  describe("Authentication and Technician APIs", () => {
    it("handles login, signup, and reset password gracefully on fallback", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
      const { loginUser, signupUser, resetPasswordUser } = await import("../lib/api");

      const loginRes = await loginUser("tech@aeroduct.com", "password123");
      expect(loginRes.token).toBeDefined();
      expect(loginRes.user.email).toBe("tech@aeroduct.com");

      const signupRes = await signupUser({
        name: "Test User",
        email: "new@example.com",
        phone: "555-1234",
        password: "securepassword",
      });
      expect(signupRes.token).toBeDefined();
      expect(signupRes.user.firstName).toBe("Test");
      expect(signupRes.user.lastName).toBe("User");

      const resetRes = await resetPasswordUser("dummy-token", "newpassword123");
      expect(resetRes.success).toBe(true);
    });

    it("fetches available slots and technician dispatch on fallback", async () => {
      vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
      const { fetchAvailableSlots, fetchTechnicianDispatch } = await import("../lib/api");

      const slots = await fetchAvailableSlots("2026-10-01", "chicago");
      expect(slots.length).toBeGreaterThan(0);
      expect(slots[0].time).toBeDefined();

      const jobs = await fetchTechnicianDispatch("tech-1");
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0].id).toBeDefined();
    });
  });
});

