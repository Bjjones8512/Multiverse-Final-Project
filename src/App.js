import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken") || "");

    // Save token to localStorage whenever it changes
    useEffect(() => {
        if (authToken) {
            localStorage.setItem("authToken", authToken);
        } else {
            localStorage.removeItem("authToken");
        }
    }, [authToken]);

    // Component to protect routes
    const ProtectedRoute = ({ children }) => {
        return authToken ? children : <Navigate to="/" />;
    };

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard authToken={authToken} />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
}

export default App;