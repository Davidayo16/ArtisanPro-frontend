// ============================================
// 📁 src/components/ProtectedArtisanRoute.jsx
// Enhanced Protected Route for Artisan Dashboard
// ============================================

import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { Loader2 } from "lucide-react";

export default function ProtectedArtisanRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, role, isLoading } = useAuthStore();

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
  if (!isAuthenticated) {
    console.log("❌ Artisan Route: Not authenticated, redirecting to login");
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // ========== WRONG ROLE (NOT AN ARTISAN) ==========
  if (role !== "artisan") {
    console.log("❌ Artisan Route: Wrong role, redirecting to home");
    return <Navigate to="/" replace />;
  }

  // ========== AUTHENTICATED ARTISAN ==========
  console.log("✅ Artisan Route: Access granted");
  return children;
}
