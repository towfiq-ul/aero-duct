import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "@/components/Input";

describe("Input component", () => {
  it("renders with label and accepts text input", () => {
    const handleChange = vi.fn();
    render(<Input label="Customer Email" onChange={handleChange} placeholder="test@example.com" />);

    expect(screen.getByLabelText(/Customer Email/i)).toBeInTheDocument();
    const input = screen.getByPlaceholderText("test@example.com");
    fireEvent.change(input, { target: { value: "john@example.com" } });
    expect(handleChange).toHaveBeenCalled();
  });

  it("displays error message when error prop is provided", () => {
    render(<Input label="Phone" error="Invalid phone number" />);
    expect(screen.getByText("Invalid phone number")).toBeInTheDocument();
  });

  it("displays helper text when helperText prop is provided", () => {
    render(<Input label="Address" helperText="Include apartment or suite number" />);
    expect(screen.getByText("Include apartment or suite number")).toBeInTheDocument();
  });
});
