import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BrowserRouter } from "react-router-dom";
import { Button } from "@/components/Button";

describe("Button component", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("handles onClick callback", () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Action</Button>);
    fireEvent.click(screen.getByText("Action"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("renders as a link when href is provided", () => {
    render(
      <BrowserRouter>
        <Button href="/pricing">Pricing Link</Button>
      </BrowserRouter>
    );
    const link = screen.getByRole("link", { name: "Pricing Link" });
    expect(link).toHaveAttribute("href", "/pricing");
  });

  it("respects disabled state", () => {
    render(<Button disabled>Disabled Action</Button>);
    const btn = screen.getByText("Disabled Action");
    expect(btn).toBeDisabled();
  });
});
