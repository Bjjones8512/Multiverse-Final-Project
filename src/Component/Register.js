import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async () => {
        setError("");
        setSuccess("");

        // Basic validation
        if (!email || !password || !confirmPassword) {
            setError("All fields are required.");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(
                "https://your-instance.service-now.com/api/now/table/sys_user",
                {
                    user_name: email,
                    user_password: password,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Basic YOUR_CREDENTIALS", // Replace YOUR_CREDENTIALS with a Base64-encoded username:password pair
                    },
                }
            );

            if (response.status === 201) {
                setSuccess("Registration successful! Please log in.");
                setEmail("");
                setPassword("");
                setConfirmPassword("");
            } else {
                setError("Unexpected error occurred. Please try again.");
            }
        } catch (err) {
            console.error("Registration error:", err);
            setError(
                err.response?.data?.error?.message || 
                "Registration failed. Please ensure the email is unique."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Register</h2>
            {success && <p style={styles.success}>{success}</p>}
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
            <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={styles.input}
            />
            <button
                onClick={handleRegister}
                disabled={loading}
                style={loading ? styles.disabledButton : styles.button}
            >
                {loading ? "Registering..." : "Register"}
            </button>
        </div>
    );
};

// Styles for the Register component
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
        backgroundColor: "#28a745",
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
    success: {
        color: "green",
        marginBottom: "10px",
        textAlign: "center",
    },
    error: {
        color: "red",
        marginBottom: "10px",
        textAlign: "center",
    },
};

export default Register;