import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import LoadingSkeleton from "../components/LoadingSkeleton";

describe("LoadingSkeleton", () => {
  it("renders with default rectangular styling", () => {
    const { container } = render(<LoadingSkeleton data-testid="skeleton" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("animate-pulse");
    expect(el).toHaveClass("rounded-lg");
  });

  it("renders circular variant", () => {
    const { container } = render(<LoadingSkeleton variant="circular" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("rounded-full");
  });

  it("renders text variant", () => {
    const { container } = render(<LoadingSkeleton variant="text" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("h-4");
  });

  it("renders card preset", () => {
    const { container } = render(<LoadingSkeleton variant="card" data-testid="card-skeleton" />);
    const el = container.firstChild as HTMLElement;
    expect(el).toHaveClass("rounded-2xl");
    expect(el.querySelectorAll(".animate-pulse").length).toBe(4);
  });
});
