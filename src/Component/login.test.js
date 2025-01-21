import { render, fireEvent, screen } from "@testing-library/react";
import Login from "./Login";

test("renders login form", () => {
    render(<Login setAuthToken={() => {}} />);
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
});

test("handles login button click", () => {
    render(<Login setAuthToken={() => {}} />);
    fireEvent.click(screen.getByText("Login"));
});