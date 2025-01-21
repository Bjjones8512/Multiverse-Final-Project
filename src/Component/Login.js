import React, { useState } from "react";
import axios from "axios";

const Login = ({ setAuthToken }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                "https://your-instance.service-now.com/api/now/v1/login",
                { email, password },
                {
                    headers: { "Content-Type": "application/json" },
                }
            );
            setAuthToken(response.data.result.auth_token);
            alert("Login successful!");
        } catch (err) {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <div>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
};

export default Login;