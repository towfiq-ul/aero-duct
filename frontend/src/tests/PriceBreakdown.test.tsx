import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { PriceBreakdown } from "@/components/PriceBreakdown";

describe("PriceBreakdown component", () => {
  it("renders subtotal, tax, and total correctly", () => {
    render(
      <PriceBreakdown
        subtotal={300}
        tax={24}
        total={324}
        taxLabel="IL State Tax (8%)"
      />
    );

    expect(screen.getByText("Base Service Flat-Rate")).toBeInTheDocument();
    expect(screen.getByText("IL State Tax (8%)")).toBeInTheDocument();
    expect(screen.getByText("Total Due")).toBeInTheDocument();
    expect(screen.getByText("$324.00")).toBeInTheDocument();
  });
});
