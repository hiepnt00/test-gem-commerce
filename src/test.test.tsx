import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import App from "./App.tsx";

describe("App Component", () => {
  beforeEach(() => {
    render(<App />);
    vi.useFakeTimers();
  });

  it("renders unit buttons and input", () => {
    expect(screen.getByText("%")).toBeInTheDocument();
    expect(screen.getByText("px")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("switches units when clicked", () => {
    fireEvent.click(screen.getByText("px"));
    expect(screen.getByText("px").className).toContain("active");
  });

  it("prevents value below 0 and shows tooltip", () => {
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "0" } });
    fireEvent.click(screen.getByText("-"));
    expect(screen.getByText("Value must greater than 0")).toBeInTheDocument();
  });

  it("prevents value above 100 in percent mode and shows tooltip", () => {
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("+"));
    expect(screen.getByText("Value must smaller than 100")).toBeInTheDocument();
  });

  it("allows value above 100 in pixel mode", () => {
    fireEvent.click(screen.getByText("px"));
    fireEvent.change(screen.getByRole("textbox"), { target: { value: "100" } });
    fireEvent.click(screen.getByText("+"));
    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("101");
  });
});
