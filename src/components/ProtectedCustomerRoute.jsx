// ============================================
// 📁 src/components/ProtectedCustomerRoute.jsx
// Protected Route for Customer Dashboard & Features
// ============================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function ProtectedCustomerRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  // ========== LOADING STATE ==========
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600">Verifying access...</p>
        </div>
      </div>
    );
  }

  // ========== NOT AUTHENTICATED ==========
  if (!isAuthenticated || !user) {
    console.log("❌ Customer Route: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ========== ARTISAN TRYING TO ACCESS CUSTOMER ROUTES ==========
  if (user.role === "artisan") {
    console.log(
      "❌ Customer Route: Artisan detected, redirecting to artisan dashboard"
    );
    toast.error("This page is only for customers", {
      duration: 3000,
      icon: "🚫",
    });
    return <Navigate to="/artisan/dashboard" replace />;
  }

  // ========== WRONG ROLE (NOT A CUSTOMER) ==========
  if (user.role !== "customer") {
    console.log("❌ Customer Route: Wrong role, redirecting to home");
    toast.error("Access denied", {
      duration: 3000,
      icon: "🚫",
    });
    return <Navigate to="/" replace />;
  }

  // ========== AUTHENTICATED CUSTOMER ==========
  console.log("✅ Customer Route: Access granted");
  return children;
}
