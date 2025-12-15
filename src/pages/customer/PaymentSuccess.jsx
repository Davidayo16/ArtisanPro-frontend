// frontend/pages/customer/PaymentSuccess.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  MapPin,
  Star,
  Shield,
  Lock,
  Download,
  MessageSquare,
  ArrowLeft,
  Clock,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentSuccess() {
   useEffect(() => {
     toast.dismiss();
   }, []);
  const location = useLocation();
  const navigate = useNavigate();
  const { booking, payment } = location.state || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handle missing data
  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600 mb-6">
            No booking data found. Please try again or contact support.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const artisanName = `${booking.artisan?.firstName || ""} ${
    booking.artisan?.lastName || ""
  }`.trim();

  const formattedDate = new Date(booking.scheduledDate).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  const totalAmount =
    payment?.totalAmount ||
    booking.agreedPrice + Math.round(booking.agreedPrice * 0.05);

  const handleDownloadReceipt = () => {
    toast.success("Receipt download initiated!", {
      duration: 3000,
      style: {
        background: "#16a34a",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "600",
      },
    });
  };

  const handleContactArtisan = () => {
    toast.success(`Opening chat with ${artisanName}...`, {
      duration: 3000,
      style: {
        background: "#16a34a",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "600",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/")}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Home</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Secure Transaction
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
          {/* Success Header */}
          <div className="flex items-center justify-center mb-6">
            <CheckCircle className="w-16 h-16 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Payment Successful! 🎉
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-2xl mx-auto">
            Your payment of{" "}
            <span className="font-semibold">
              ₦{totalAmount.toLocaleString()}
            </span>{" "}
            is securely held in escrow by Paystack until you approve the job
            completion.
          </p>

          {/* Booking Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Booking Reference
                </p>
                <p className="font-semibold text-gray-900">
                  {booking.bookingNumber}
                </p>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Artisan
                </p>
                <div className="flex items-center space-x-3">
                  <img
                    src={
                      booking.artisan?.profilePhoto ||
                      "/images/default-avatar.jpg"
                    }
                    alt={artisanName}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900">{artisanName}</p>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-semibold">
                        {booking.artisan?.averageRating || "5.0"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Service
                </p>
                <p className="font-semibold text-gray-900">
                  {booking.service?.name}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  {booking.description}
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Schedule
                </p>
                <div className="flex items-center space-x-2 text-gray-900 mb-1">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>{formattedDate}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-900">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>{booking.scheduledTime}</span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Location
                </p>
                <div className="flex items-start space-x-2 text-gray-900">
                  <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                  <span>
                    {booking.location?.address}, {booking.location?.city}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wide mb-1">
                  Total Paid
                </p>
                <p className="font-bold text-2xl text-blue-600">
                  ₦{totalAmount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Held in escrow until approved
                </p>
              </div>
            </div>
          </div>

          {/* Escrow Instructions */}
          <div className="bg-blue-50 rounded-xl p-6 mb-8">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-gray-900 mb-2">
                  How Escrow Protects You
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Your payment is securely held by Paystack until you confirm
                  the job is complete. Here's what to do next:
                </p>
                <ol className="space-y-3 text-sm text-gray-600 list-decimal pl-4">
                  <li>
                    <span className="font-semibold">Wait for the service</span>:{" "}
                    {artisanName} will perform the service on {formattedDate} at{" "}
                    {booking.scheduledTime}.
                  </li>
                  <li>
                    <span className="font-semibold">Inspect the work</span>:
                    After the job, verify the work meets your expectations.
                  </li>
                  <li>
                    <span className="font-semibold">Release or refund</span>: If
                    satisfied, release the funds to {artisanName}. If not,
                    request a refund within 48 hours. Funds auto-release after
                    48 hours if no action is taken.
                  </li>
                </ol>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <button
              onClick={handleContactArtisan}
              className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Contact Artisan</span>
            </button>
            <button
              onClick={handleDownloadReceipt}
              className="w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <Download className="w-5 h-5" />
              <span>Download Receipt</span>
            </button>
            <button
              onClick={() => navigate(`/booking-status/${booking._id}`)}
              className="w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>View Booking</span>
            </button>
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all"
            >
              Back to Home
            </button>
          </div>

          {/* Security Badges */}
          <div className="border-t border-gray-200 pt-6 text-center">
            <p className="text-sm text-gray-700 mb-3">Secured by</p>
            <div className="flex justify-center space-x-6">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Shield className="w-5 h-5 text-green-600" />
                <span>Paystack Escrow</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Lock className="w-5 h-5 text-blue-600" />
                <span>256-bit SSL Encryption</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                <span>PCI DSS Compliant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
