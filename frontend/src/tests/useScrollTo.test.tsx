import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { MemoryRouter } from "react-router-dom";
import { useScrollTo } from "@/hooks/useScrollTo";

describe("useScrollTo hook", () => {
  beforeEach(() => {
    window.scrollTo = vi.fn();
    document.body.innerHTML = "";
  });

  it("scrolls with 92px offset to target element when on root path", () => {
    const el = document.createElement("div");
    el.id = "services";
    // Mock getBoundingClientRect
    el.getBoundingClientRect = vi.fn(() => ({
      top: 500,
      bottom: 600,
      left: 0,
      right: 100,
      width: 100,
      height: 100,
      x: 0,
      y: 500,
      toJSON: () => {},
    }));
    document.body.appendChild(el);

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useScrollTo(), { wrapper });
    result.current("services");

    expect(window.scrollTo).toHaveBeenCalledWith({
      top: 500 + 0 - 92,
      behavior: "smooth",
    });
  });
});
