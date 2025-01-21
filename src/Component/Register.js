import React, { useState } from "react";
import axios from "axios";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            const response = await axios.post(
                "https://your-instance.service-now.com/api/now/table/sys_user",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Basic YOUR_CREDENTIALS",
                    },
                }
            );
            setSuccess("Registration successful! Please log in.");
        } catch (err) {
            setError("Registration failed. Try again.");
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {success && <p style={{ color: "green" }}>{success}</p>}
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
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default Register;