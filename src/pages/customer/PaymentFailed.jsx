// frontend/pages/customer/PaymentFailed.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { XCircle, ArrowLeft, HelpCircle, RefreshCcw } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";

export default function PaymentFailed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { error, booking } = location.state || {};

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleTryAgain = () => {
    if (booking?._id) {
      navigate(`/payment/${booking._id}`);
    } else {
      navigate("/search");
    }
  };

  const handleContactSupport = () => {
    toast.success("Redirecting to support...", {
      duration: 2000,
      style: {
        background: "#16a34a",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "600",
      },
    });
    setTimeout(() => {
      navigate("/support");
    }, 2000);
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
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          {/* Error Icon */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center">
              <XCircle className="w-12 h-12 text-red-600" />
            </div>
          </div>

          {/* Error Message */}
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Payment Failed
          </h2>
          <p className="text-gray-600 mb-2">
            We couldn't process your payment. Don't worry, no charges were made
            to your account.
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 mt-6">
              <p className="text-sm text-red-800 font-medium">Error: {error}</p>
            </div>
          )}

          {/* Common Reasons */}
          <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left mt-8">
            <h3 className="font-bold text-gray-900 mb-4 text-center">
              Common Reasons for Payment Failure
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Insufficient funds:</strong> Check your account
                  balance
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Card declined:</strong> Contact your bank to enable
                  online transactions
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Incorrect card details:</strong> Verify card number,
                  expiry date, and CVV
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Network issues:</strong> Check your internet
                  connection and try again
                </span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-600 font-bold">•</span>
                <span>
                  <strong>Daily transaction limit:</strong> You may have
                  exceeded your daily spending limit
                </span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleTryAgain}
              className="w-full py-4 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center space-x-2 hover:shadow-lg"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              <RefreshCcw className="w-5 h-5" />
              <span>Try Again</span>
            </button>

            <button
              onClick={handleContactSupport}
              className="w-full py-3 bg-gray-100 text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-all flex items-center justify-center space-x-2"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Contact Support</span>
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-all"
            >
              Back to Home
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@artisanpro.ng"
                className="text-blue-600 hover:underline font-medium"
              >
                support@artisanpro.ng
              </a>{" "}
              or call{" "}
              <a
                href="tel:+2348012345678"
                className="text-blue-600 hover:underline font-medium"
              >
                +234 801 234 5678
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
