import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  Send,
  CheckCircle,
  AlertCircle,
  Lock,
  HelpCircle,
  Shield,
} from "lucide-react";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [emailError, setEmailError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setError("");
    setEmailError("");

    if (value && !validateEmail(value)) {
      setEmailError("Please enter a valid email address");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setEmailError("");

    // Validation
    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: Check if email exists in system
      const mockEmailExists = email.includes("@"); // In real app, check backend

      if (mockEmailExists) {
        setSuccess(true);
        // Auto-redirect after 3 seconds
        setTimeout(() => {
          navigate("/login", {
            state: {
              message: "Password reset link sent. Please check your email.",
              email: email,
            },
          });
        }, 3000);
      } else {
        setError("No account found with this email address");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back to Login</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Lock className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to
              reset your password.
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="space-y-6">
              {/* Success Message */}
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl">
                <div className="flex items-start space-x-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-green-900 mb-1">
                      Reset Link Sent!
                    </h3>
                    <p className="text-green-700 text-sm">
                      We've sent a password reset link to{" "}
                      <span className="font-semibold">{email}</span>
                    </p>
                  </div>
                </div>

                {/* Instructions */}
                <div className="bg-white rounded-lg p-4 space-y-2 text-sm text-gray-700">
                  <p className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    <span>Check your inbox (and spam folder)</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    <span>Click the reset link in the email</span>
                  </p>
                  <p className="flex items-start space-x-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    <span>Create a new secure password</span>
                  </p>
                </div>
              </div>

              {/* Redirect Notice */}
              <div className="text-center text-sm text-gray-600">
                <p>Redirecting to login in a moment...</p>
              </div>

              {/* Manual Redirect */}
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
                  <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                  <p className="text-red-800 text-sm">{error}</p>
                </div>
              )}

              {/* Email Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your email"
                    className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      emailError
                        ? "border-red-500 bg-red-50 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                </div>
                {emailError && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{emailError}</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={isLoading || !email || emailError}
                className="w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Sending Link...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Send Reset Link</span>
                  </>
                )}
              </button>

              {/* Back to Login Link */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>
          )}

          {/* Security Notice */}
          {!success && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  The password reset link will expire in{" "}
                  <span className="font-semibold">15 minutes</span> for
                  security. If you don't see the email, check your spam folder.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        <div className="mt-6 space-y-4">
          {/* FAQ Quick Links */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-start space-x-3">
              <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 mb-2 text-sm">
                  Having trouble?
                </h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>Check your spam/junk folder for the reset email</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      Make sure you're using the email registered with your
                      account
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="text-blue-600">•</span>
                    <span>
                      If you don't receive the email within 5 minutes, try again
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Support */}
          <p className="text-center text-sm text-gray-600">
            Still need help?{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
