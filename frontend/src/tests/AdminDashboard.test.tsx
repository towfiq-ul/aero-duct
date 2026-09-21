import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AdminDashboard from "../pages/admin/AdminDashboard";

describe("AdminDashboard Component", () => {
  beforeEach(() => {
    sessionStorage.clear();
    localStorage.clear();
    vi.restoreAllMocks();
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network Error"));
  });

  it("renders passcode lock screen when unauthenticated", () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    expect(screen.getByText(/AeroDuct Admin Portal/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter PIN/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unlock Admin Panel/i })).toBeInTheDocument();
  });

  it("authenticates via quick demo PIN link and displays master control panel", async () => {
    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    const quickDemoBtn = screen.getByText(/Quick Demo Access/i);
    fireEvent.click(quickDemoBtn);

    await waitFor(() => {
      expect(screen.getByText(/Master Control Panel/i)).toBeInTheDocument();
      expect(screen.getByText(/Operations & Catalogue Management/i)).toBeInTheDocument();
    });

    // Check tabs
    expect(screen.getByRole("button", { name: /Company & Contact/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Service Areas/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Services & Pricing/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /FAQs & Content/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Google Reviews API/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Payments & Banking/i })).toBeInTheDocument();
  });

  it("switches to Payments & Banking tab and displays Stripe & Bank info", async () => {
    sessionStorage.setItem("aeroduct_admin_auth", "true");

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Master Control Panel/i)).toBeInTheDocument();
    });

    const paymentTab = screen.getByRole("button", { name: /Payments & Banking/i });
    fireEvent.click(paymentTab);

    await waitFor(() => {
      expect(screen.getByText(/Stripe Payment Gateway/i)).toBeInTheDocument();
      expect(screen.getByText(/Commercial Bank Wire & ACH/i)).toBeInTheDocument();
      expect(screen.getByText(/Stripe Publishable Key/i)).toBeInTheDocument();
      expect(screen.getByText(/Routing \/ ABA Number/i)).toBeInTheDocument();
    });
  });

  it("switches to Google Reviews API tab and displays configuration inputs", async () => {
    sessionStorage.setItem("aeroduct_admin_auth", "true");

    render(
      <BrowserRouter>
        <AdminDashboard />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Master Control Panel/i)).toBeInTheDocument();
    });

    const reviewTab = screen.getByRole("button", { name: /Google Reviews API/i });
    fireEvent.click(reviewTab);

    await waitFor(() => {
      expect(screen.getByText("Google Cloud Places API Key")).toBeInTheDocument();
      expect(screen.getByText("Google Place ID")).toBeInTheDocument();
      expect(screen.getByText(/Minimum Rating Filter Threshold/i)).toBeInTheDocument();
    });
  });
});
