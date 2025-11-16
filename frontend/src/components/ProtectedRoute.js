// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, role }) {
  const token = localStorage.getItem("token");

  if (!token) {
    // Not logged in → redirect to login
    return <Navigate to="/login" replace />;
  }

  // Decode JWT payload to check role
  const payload = JSON.parse(atob(token.split(".")[1]));

  if (role && payload.role !== role) {
    // If role is specified but doesn't match, redirect
    return <Navigate to={payload.role === "admin" ? "/dashboard" : "/"} replace />;
  }

  // User is authorized
  return children;
}

export default ProtectedRoute;
