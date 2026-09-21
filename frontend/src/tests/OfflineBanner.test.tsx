import { describe, it, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import OfflineBanner from "../components/OfflineBanner";

describe("OfflineBanner", () => {
  it("does not render when online", () => {
    Object.defineProperty(navigator, "onLine", { value: true, configurable: true });
    render(<OfflineBanner />);
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("renders when offline event is triggered", () => {
    render(<OfflineBanner />);

    act(() => {
      window.dispatchEvent(new Event("offline"));
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
    expect(
      screen.getByText(/You are currently offline/i)
    ).toBeInTheDocument();

    act(() => {
      window.dispatchEvent(new Event("online"));
    });

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });
});
