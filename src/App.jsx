// ============================================
// 📁 src/App.jsx
// Production-Ready App with Protected Routes & Error Handling
// ============================================

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { setupApiErrorHandlers } from "./api/authApi";

// Public Pages
import Home from "./pages/public/Home";
import Artisans from "./pages/public/Artisans";
import ArtisanProfiles from "./pages/public/ArtisanProfiles";
import NotFound from "./pages/public/NotFound";

// Auth Pages
import Registration from "./pages/auth/Registration";
import Login from "./pages/auth/Login";
import EmailVerification from "./pages/auth/EmailVerification";
import PhoneVerification from "./pages/auth/PhoneVerification";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import ProfileWizard from "./pages/auth/ProfileWizard";
import AuthSuccess from "./pages/auth/AuthSuccess";
import BookingConfirmation from "./pages/auth/BookingConfirmation";

// Customer Pages
import Booking from "./pages/customer/Booking";
import Payment from "./pages/customer/Payment";
import PaymentSuccess from "./pages/customer/PaymentSuccess";
import PaymentCallback from "./pages/customer/PaymentCallback";
import PaymentFailed from "./pages/customer/PaymentFailed";
import BookingStatus from "./pages/customer/BookingStatus";
import ReviewJob from "./pages/customer/ReviewJob";
import LeaveReview from "./pages/customer/LeaveReview";

// Customer Dashboard
import CustomerDashboardLayout from "./layouts/CustomerDashboardLayout";
import Overview from "./pages/customer/dashboard/Overview";
import BookingHistory from "./pages/customer/dashboard/BookingHistory";
import ActiveBookings from "./pages/customer/dashboard/ActiveBookings";
import SavedArtisans from "./pages/customer/dashboard/SavedArtisans";
import CustomerReviews from "./pages/customer/dashboard/CustomerReviews";
import CustomerProfile from "./pages/customer/dashboard/CustomerProfile";
import Notifications from "./pages/customer/dashboard/Notifications";
import CustomerSettings from "./pages/customer/dashboard/CustomerSettings";
import PaymentMethods from "./pages/customer/dashboard/PaymentMethods";
import Promotions from "./pages/customer/dashboard/Promotions";
import CustomerSupport from "./pages/customer/dashboard/CustomerSupport";

// Artisan Dashboard
import ArtisanDashboardLayout from "./layouts/ArtisanDashboardLayout";
import ArtisanOverview from "./pages/artisan/dashboard/ArtisanOverview";
import ArtisanJobs from "./pages/artisan/dashboard/ArtisanJobs";
import ArtisanCalendar from "./pages/artisan/dashboard/ArtisanCalendar";
import ArtisanEarnings from "./pages/artisan/dashboard/ArtisanEarnings";
import ArtisanProfile from "./pages/artisan/dashboard/ArtisanProfile";
import ArtisanReviews from "./pages/artisan/dashboard/ArtisanReviews";
import ArtisanNotifications from "./pages/artisan/dashboard/ArtisanNotifications";
import ArtisanSettings from "./pages/artisan/dashboard/ArtisanSettings";
import ArtisanAnalytics from "./pages/artisan/dashboard/ArtisanAnalytics";
import ArtisanLocation from "./pages/artisan/dashboard/ArtisanLocation";
import CompleteJob from "./pages/artisan/dashboard/CompleteJob";

// Protected Route Components
import ProtectedArtisanRoute from "./components/ProtectedArtisanRoute";
import ProtectedCustomerRoute from "./components/ProtectedCustomerRoute";

export default function App() {
  // ========== SETUP API ERROR HANDLERS ==========
  useEffect(() => {
    // Setup global error handlers
    setupApiErrorHandlers();

    // ========== AUTH EXPIRED HANDLER ==========
    const handleAuthExpired = (event) => {
      toast.error(event.detail.message, {
        duration: 4000,
        icon: "🔒",
        style: {
          background: "#dc2626",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    };

    // ========== FORBIDDEN ACCESS HANDLER ==========
    const handleForbidden = (event) => {
      toast.error(event.detail.message, {
        duration: 3000,
        icon: "⛔",
        style: {
          background: "#dc2626",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    };

    // ========== RATE LIMIT HANDLER ==========
    const handleRateLimit = (event) => {
      toast.error(event.detail.message, {
        duration: 3000,
        icon: "⏰",
        style: {
          background: "#f59e0b",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    };

    // ========== SERVER ERROR HANDLER ==========
    const handleServerError = (event) => {
      toast.error(event.detail.message, {
        duration: 4000,
        icon: "🔥",
        style: {
          background: "#dc2626",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    };

    // ========== NETWORK ERROR HANDLER ==========
    const handleNetworkError = (event) => {
      toast.error(event.detail.message, {
        duration: 5000,
        icon: "📡",
        style: {
          background: "#dc2626",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
    };

    // Add event listeners
    window.addEventListener("auth:expired", handleAuthExpired);
    window.addEventListener("auth:forbidden", handleForbidden);
    window.addEventListener("api:ratelimit", handleRateLimit);
    window.addEventListener("api:servererror", handleServerError);
    window.addEventListener("api:networkerror", handleNetworkError);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("auth:expired", handleAuthExpired);
      window.removeEventListener("auth:forbidden", handleForbidden);
      window.removeEventListener("api:ratelimit", handleRateLimit);
      window.removeEventListener("api:servererror", handleServerError);
      window.removeEventListener("api:networkerror", handleNetworkError);
    };
  }, []);

  return (
    <>
      {/* Global Toast Container */}
      <Toaster
        position="top-center"
        reverseOrder={false}
        gutter={8}
        containerStyle={{
          top: 80,
        }}
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            padding: "16px",
            borderRadius: "12px",
            fontSize: "14px",
            fontWeight: "500",
          },
          success: {
            duration: 3000,
            style: {
              background: "#10b981",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#10b981",
            },
          },
          error: {
            duration: 4000,
            style: {
              background: "#dc2626",
              color: "#fff",
            },
            iconTheme: {
              primary: "#fff",
              secondary: "#dc2626",
            },
          },
        }}
      />

      <BrowserRouter>
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Artisans />} />
          <Route path="/artisans" element={<Artisans />} />
          <Route path="/artisan/:id" element={<ArtisanProfiles />} />

          {/* ==================== AUTH ROUTES ==================== */}
          <Route path="/register" element={<Registration />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify-email" element={<EmailVerification />} />
          <Route path="/phone-verification" element={<PhoneVerification />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/complete-profile" element={<ProfileWizard />} />
          <Route path="/auth/success" element={<AuthSuccess />} />

          {/* ==================== CUSTOMER ROUTES (SEMI-PROTECTED) ==================== */}
          {/* These routes are accessible but require some auth */}
          {/* ==================== CUSTOMER ROUTES (NOW PROTECTED) ==================== */}
          <Route
            path="/booking"
            element={
              <ProtectedCustomerRoute>
                <Booking />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/booking-status/:bookingId"
            element={
              <ProtectedCustomerRoute>
                <BookingStatus />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/payment/:bookingId"
            element={
              <ProtectedCustomerRoute>
                <Payment />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/payment/success"
            element={
              <ProtectedCustomerRoute>
                <PaymentSuccess />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/payment/callback"
            element={
              <ProtectedCustomerRoute>
                <PaymentCallback />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/payment/failed"
            element={
              <ProtectedCustomerRoute>
                <PaymentFailed />
              </ProtectedCustomerRoute>
            }
          />

          {/* Review Routes - Protected */}
          <Route
            path="/customer/review-job/:bookingId"
            element={
              <ProtectedCustomerRoute>
                <ReviewJob />
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/leave-review/:bookingId"
            element={
              <ProtectedCustomerRoute>
                <LeaveReview />
              </ProtectedCustomerRoute>
            }
          />

          {/* ==================== CUSTOMER DASHBOARD (PROTECTED) ==================== */}
          <Route
            path="/customer/dashboard"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <Overview />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/history"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <BookingHistory />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/active"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <ActiveBookings />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/saved"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <SavedArtisans />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/reviews"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <CustomerReviews />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/profile"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <CustomerProfile />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/notifications"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <Notifications />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/settings"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <CustomerSettings />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/payment-methods"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <PaymentMethods />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/promotions"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <Promotions />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />
          <Route
            path="/customer/dashboard/support"
            element={
              <ProtectedCustomerRoute>
                <CustomerDashboardLayout>
                  <CustomerSupport />
                </CustomerDashboardLayout>
              </ProtectedCustomerRoute>
            }
          />

          {/* ==================== ARTISAN DASHBOARD (PROTECTED) ==================== */}
          <Route
            path="/artisan/dashboard"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanOverview />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/jobs"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanJobs />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/calendar"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanCalendar />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/complete-job/:id"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <CompleteJob />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/earnings"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanEarnings />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/profile"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanProfile />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/reviews"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanReviews />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/notifications"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanNotifications />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/settings"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanSettings />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/analytics"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanAnalytics />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />
          <Route
            path="/artisan/dashboard/location"
            element={
              <ProtectedArtisanRoute>
                <ArtisanDashboardLayout>
                  <ArtisanLocation />
                </ArtisanDashboardLayout>
              </ProtectedArtisanRoute>
            }
          />

          {/* ==================== 404 NOT FOUND ==================== */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
