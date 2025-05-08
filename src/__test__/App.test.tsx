import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import '@testing-library/jest-dom';
import App from "../App";

describe('App Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('test snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('should render with default unit as percent', () => {
    render(<App />);
    const percentButton = screen.getByText('%').parentElement;
    expect(percentButton).toHaveClass('active');
  });

  it('should switch unit from percent to pixels', () => {
    render(<App />);
    fireEvent.click(screen.getByText('px'));
    const pixelsButton = screen.getByText('px').parentElement;
    expect(pixelsButton).toHaveClass('active');
  });

  it('should increment value when "+" button is clicked', () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '1' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('+'));
    expect(input).toHaveValue('2');
  });

  it('should decrement value when "-" button is clicked', () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '2' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('-'));
    expect(input).toHaveValue('1');
  });

  it('should show tooltip when value goes below 0', () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('-'));
    expect(screen.getByText('Value must greater than 0')).toBeInTheDocument();
  });

  it('should show tooltip when value exceeds 100 in percent mode', () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '100' } });
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('+'));
    expect(screen.getByText('Value must smaller than 100')).toBeInTheDocument();
  });

  it('should clamp value to 100 when switching to percent unit', () => {
    render(<App />);
    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: '150' } });
    fireEvent.click(screen.getByText('px'));
    fireEvent.blur(input);
    fireEvent.click(screen.getByText('%'));
    expect(input).toHaveValue('100');
  });
});