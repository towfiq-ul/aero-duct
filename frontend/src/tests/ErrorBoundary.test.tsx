import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import ErrorBoundary from "../components/ErrorBoundary";

const ProblemChild = () => {
  throw new Error("Test Crash");
};

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText("Safe Content")).toBeInTheDocument();
  });

  it("renders fallback UI when error is thrown", () => {
    // Suppress console.error in test output for intentional crash
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("Test Crash")).toBeInTheDocument();
    expect(screen.getByText("Try Again")).toBeInTheDocument();

    spy.mockRestore();
  });

  it("renders custom fallback prop when provided", () => {
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom Error Screen</div>}>
        <ProblemChild />
      </ErrorBoundary>
    );

    expect(screen.getByText("Custom Error Screen")).toBeInTheDocument();
    spy.mockRestore();
  });
});
