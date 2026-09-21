import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Modal } from "@/components/Modal";

describe("Modal component", () => {
  it("renders when isOpen is true", () => {
    render(
      <Modal isOpen={true} onClose={vi.fn()} title="Booking Confirmation">
        <p>Your slot is confirmed.</p>
      </Modal>
    );

    expect(screen.getByText("Booking Confirmation")).toBeInTheDocument();
    expect(screen.getByText("Your slot is confirmed.")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(
      <Modal isOpen={false} onClose={vi.fn()} title="Hidden Modal">
        <p>Not visible</p>
      </Modal>
    );

    expect(screen.queryByText("Hidden Modal")).not.toBeInTheDocument();
  });

  it("calls onClose when close button or ESC key is pressed", () => {
    const handleClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={handleClose} title="Test Modal">
        <p>Modal body</p>
      </Modal>
    );

    fireEvent.click(screen.getByLabelText("Close dialog"));
    expect(handleClose).toHaveBeenCalledTimes(1);

    fireEvent.keyDown(window, { key: "Escape" });
    expect(handleClose).toHaveBeenCalledTimes(2);
  });
});
