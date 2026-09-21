import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Select } from "@/components/Select";

describe("Select component", () => {
  const options = [
    { value: "chi", label: "Chicago City" },
    { value: "nap", label: "Naperville" },
    { value: "evn", label: "Evanston" },
  ];

  it("renders with options and changes value", () => {
    const handleChange = vi.fn();
    render(<Select label="Service Market" options={options} onChange={handleChange} />);

    expect(screen.getByLabelText(/Service Market/i)).toBeInTheDocument();
    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "nap" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
