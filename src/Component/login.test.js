import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import axios from "axios";
import Login from "./Login";

// Mock the axios library
jest.mock("axios");

describe("Login Component", () => {
    const setAuthTokenMock = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks(); // Clear mocks before each test
    });

    test("renders login form with email and password fields", () => {
        render(<Login setAuthToken={setAuthTokenMock} />);
        expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
        expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
        expect(screen.getByText("Login")).toBeInTheDocument();
    });

    test("shows error message if login fails", async () => {
        // Mock the API call to return an error
        axios.post.mockRejectedValue({
            response: {
                data: { error: { message: "Invalid credentials" } },
            },
        });

        render(<Login setAuthToken={setAuthTokenMock} />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "wrongpassword" },
        });

        // Click the login button
        fireEvent.click(screen.getByText("Login"));

        // Wait for the error message to appear
        await waitFor(() =>
            expect(
                screen.getByText("Login failed. Please check your credentials.")
            ).toBeInTheDocument()
        );

        // Ensure axios.post was called with correct arguments
        expect(axios.post).toHaveBeenCalledWith(
            "https://your-instance.service-now.com/api/now/v1/login",
            {
                email: "test@example.com",
                password: "wrongpassword",
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
    });

    test("calls setAuthToken on successful login", async () => {
        // Mock the API call to return a success response
        axios.post.mockResolvedValue({
            data: { result: { auth_token: "mockAuthToken123" } },
        });

        render(<Login setAuthToken={setAuthTokenMock} />);

        // Simulate user input
        fireEvent.change(screen.getByPlaceholderText("Email"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(screen.getByPlaceholderText("Password"), {
            target: { value: "password123" },
        });

        // Click the login button
        fireEvent.click(screen.getByText("Login"));

        // Wait for the mockAuthToken to be set
        await waitFor(() => expect(setAuthTokenMock).toHaveBeenCalledWith("mockAuthToken123"));

        // Ensure axios.post was called with correct arguments
        expect(axios.post).toHaveBeenCalledWith(
            "https://your-instance.service-now.com/api/now/v1/login",
            {
                email: "test@example.com",
                password: "password123",
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );

        // Ensure the success alert is shown
        expect(screen.queryByText("Login successful!")).toBeInTheDocument();
    });

    test("does not call login API if fields are empty", () => {
        render(<Login setAuthToken={setAuthTokenMock} />);

        // Click the login button without entering credentials
        fireEvent.click(screen.getByText("Login"));

        // Ensure axios.post is not called
        expect(axios.post).not.toHaveBeenCalled();
    });
});