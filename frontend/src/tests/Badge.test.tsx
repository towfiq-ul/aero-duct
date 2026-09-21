import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { Badge } from "@/components/Badge";

describe("Badge component", () => {
  it("renders text content", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("supports different status variants", () => {
    const { rerender } = render(<Badge variant="success">Completed</Badge>);
    expect(screen.getByText("Completed")).toBeInTheDocument();

    rerender(<Badge variant="destructive">Failed</Badge>);
    expect(screen.getByText("Failed")).toBeInTheDocument();

    rerender(<Badge variant="warning">Pending</Badge>);
    expect(screen.getByText("Pending")).toBeInTheDocument();
  });
});
