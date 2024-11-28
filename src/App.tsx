// src/App.tsx
import React, { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider, useUserContext } from './context/UserContext';

import Home from "./pages/Home";
import Signup from "./Auth/Signup";
import Login from "./Auth/Login";
import Logout from "./Auth/Logout";
import ForgotPassword from "./Auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import VerifyOTP from "./Auth/Verify-otp";
import Profile from "./pages/Profile";
import Payment from "./pages/Payment/payment";
import Maintenance from "./pages/Maintenance/maintenance";
import { RequestStatus } from "./pages/Maintenance";

// Define types for props
interface ProtectedRouteProps {
  children: ReactNode;
  rolesRequired: string[]; // Accepting an array of roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, rolesRequired }) => {
  const { role } = useUserContext();

  if (!role) {
    return <Navigate to="/login" />;
  }

  if (!rolesRequired.includes(role)) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOTP />} />
          
          {/* Protected Routes */}
          {/* Dashboard can be accessed by both user and admin */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute rolesRequired={['user', 'admin']}><Dashboard /></ProtectedRoute>}
          />
          <Route
            path="/profile"
            element={<ProtectedRoute rolesRequired={['user']}><Profile /></ProtectedRoute>}
          />
          
          {/* Admin-Only Routes */}
          <Route
            path="/maintenance"
            element={<ProtectedRoute rolesRequired={['admin']}><Maintenance /></ProtectedRoute>}
          />
          <Route
            path="/request-status"
            element={<ProtectedRoute rolesRequired={['admin']}><RequestStatus /></ProtectedRoute>}
          />
          
          {/* General Pages */}
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;
