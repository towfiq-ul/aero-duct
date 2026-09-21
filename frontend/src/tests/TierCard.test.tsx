import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TierCard } from "@/components/TierCard";

describe("TierCard component", () => {
  it("renders name, price, and features", () => {
    render(
      <TierCard
        name="Residential Whole-House"
        price="$299"
        description="Full HVAC return and supply vent cleaning"
        features={["HEPA negative pressure", "Borescope video", "Sanitization fog"]}
        isPopular={true}
      />
    );

    expect(screen.getByText("Residential Whole-House")).toBeInTheDocument();
    expect(screen.getByText("$299")).toBeInTheDocument();
    expect(screen.getByText("Most Popular")).toBeInTheDocument();
    expect(screen.getByText("HEPA negative pressure")).toBeInTheDocument();
  });

  it("triggers onSelect callback when clicked", () => {
    const handleSelect = vi.fn();
    render(
      <TierCard
        name="Dryer Vent Clean"
        price="$129"
        description="Clears lint blockage"
        onSelect={handleSelect}
      />
    );

    fireEvent.click(screen.getByText("Select Package"));
    expect(handleSelect).toHaveBeenCalledTimes(1);
  });
});
