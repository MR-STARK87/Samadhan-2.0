// frontend/src/components/ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import the custom hook

const ProtectedRoute = () => {
  const { isAuthenticated } = useAuth(); // Get auth status from context

  if (!isAuthenticated) {
    // If not logged in, redirect to the login page
    return <Navigate to="/login" />;
  }

  // If logged in, show the nested routes
  return <Outlet />;
};

export default ProtectedRoute;