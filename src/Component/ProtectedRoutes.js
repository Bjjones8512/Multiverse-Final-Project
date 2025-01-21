import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, authToken }) => {
    return authToken ? children : <Navigate to="/" />;
};

export default ProtectedRoute;