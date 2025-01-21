import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

function App() {
    const [authToken, setAuthToken] = useState("");

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login setAuthToken={setAuthToken} />} />
                <Route path="/register" element={<Register />} />
                <Route
                    path="/dashboard"
                    element={<Dashboard authToken={authToken} />}
                />
            </Routes>
        </Router>
    );
}

export default App;