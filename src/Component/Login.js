import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // Clear previous errors
        setError("");
        setLoading(true);

        try {
            // Send login request
            const response = await axios.post(
                "https://your-instance.service-now.com/api/now/v1/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );

            // Save the auth token using the parent state setter
            setAuthToken(response.data.result.auth_token);

            // Show success feedback
            alert("Login successful!");
        } catch (err) {
            // Handle login errors
            console.error("Login error:", err);
            setError(
                err.response?.data?.error?.message || 
                "Login failed. Please check your credentials and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Login</h2>
            {error && <p style={styles.error}>{error}</p>}

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={styles.input}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
            />

            <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                style={loading || !email || !password ? styles.disabledButton : styles.button}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
        </div>
    );
};

// Styles for the Login component
const styles = {
    container: {
        padding: "20px",
        maxWidth: "400px",
        margin: "50px auto",
        border: "1px solid #ddd",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        textAlign: "center",
        marginBottom: "20px",
        color: "#333",
    },
    input: {
        display: "block",
        width: "100%",
        padding: "10px",
        marginBottom: "15px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        fontSize: "16px",
    },
    button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007BFF",
        color: "white",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
    },
    disabledButton: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#cccccc",
        color: "#666",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "not-allowed",
    },
    error: {
        color: "red",
        marginBottom: "10px",
        textAlign: "center",
    },
};

export default Login;