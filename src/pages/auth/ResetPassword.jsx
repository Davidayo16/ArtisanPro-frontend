import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  Lock,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Shield,
  Check,
  X,
  KeyRound,
  ArrowLeft,
} from "lucide-react";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token"); // Get reset token from URL

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [countdown, setCountdown] = useState(3);

  // Password Requirements State
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  // Check token validity on mount
  useEffect(() => {
    // FOR TESTING: Accept any access (with or without token)
    // In production, uncomment the validation below:

    // if (!token) {
    //   setTokenValid(false);
    //   setError("Invalid or missing reset token");
    // } else {
    //   // Call your backend to validate the token
    //   // const response = await fetch('/api/auth/validate-reset-token', { ... });
    //   setTokenValid(true);
    // }

    // FOR NOW: Always valid for testing
    setTokenValid(true);
  }, [token]);

  // Password validation
  useEffect(() => {
    setRequirements({
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  }, [password]);

  // Countdown for redirect
  useEffect(() => {
    if (success && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (success && countdown === 0) {
      navigate("/login", {
        state: {
          message:
            "Password reset successful! Please login with your new password.",
        },
      });
    }
  }, [success, countdown, navigate]);

  const allRequirementsMet = Object.values(requirements).every(Boolean);
  const passwordsMatch =
    password && confirmPassword && password === confirmPassword;

  const getPasswordStrength = () => {
    const metCount = Object.values(requirements).filter(Boolean).length;
    if (metCount <= 2) return { label: "Weak", color: "red", width: "33%" };
    if (metCount <= 4)
      return { label: "Medium", color: "yellow", width: "66%" };
    return { label: "Strong", color: "green", width: "100%" };
  };

  const strength = getPasswordStrength();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (!allRequirementsMet) {
      setError("Please meet all password requirements");
      return;
    }

    if (!passwordsMatch) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call to reset password
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock: Success
      setSuccess(true);
    } catch (err) {
      setError("Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Invalid Token Screen
  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Reset Link
          </h1>
          <p className="text-gray-600 mb-6">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full py-3 rounded-xl text-white font-semibold"
            style={{
              backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
            }}
          >
            Request New Link
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={() => navigate("/login")}
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
              <KeyRound className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {success ? "Password Reset!" : "Reset Your Password"}
            </h1>
            <p className="text-gray-600">
              {success
                ? "Your password has been successfully reset"
                : "Enter your new password below"}
            </p>
          </div>

          {/* Success State */}
          {success ? (
            <div className="space-y-6">
              <div className="p-6 bg-green-50 border border-green-200 rounded-xl text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="font-semibold text-green-900 mb-2 text-lg">
                  All Set!
                </h3>
                <p className="text-green-700 text-sm mb-4">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>
                <p className="text-sm text-green-600 font-medium">
                  Redirecting to login in {countdown}...
                </p>
              </div>

              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Go to Login Now
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

              {/* New Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition-all"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="mt-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-600">
                        Password Strength
                      </span>
                      <span
                        className={`text-xs font-semibold text-${strength.color}-600`}
                      >
                        {strength.label}
                      </span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full bg-${strength.color}-500 transition-all duration-300`}
                        style={{ width: strength.width }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Password Requirements */}
              <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Password must contain:
                </p>
                {[
                  { key: "length", label: "At least 8 characters" },
                  { key: "uppercase", label: "One uppercase letter (A-Z)" },
                  { key: "lowercase", label: "One lowercase letter (a-z)" },
                  { key: "number", label: "One number (0-9)" },
                  { key: "special", label: "One special character (!@#$%...)" },
                ].map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-2">
                    {requirements[key] ? (
                      <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    )}
                    <span
                      className={`text-sm ${
                        requirements[key]
                          ? "text-green-700 font-medium"
                          : "text-gray-600"
                      }`}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    className={`w-full pl-10 pr-12 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                      confirmPassword && !passwordsMatch
                        ? "border-red-500 bg-red-50 focus:border-red-600"
                        : "border-gray-300 focus:border-blue-600 focus:bg-blue-50"
                    }`}
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {confirmPassword && !passwordsMatch && (
                  <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>Passwords do not match</span>
                  </p>
                )}
                {confirmPassword && passwordsMatch && (
                  <p className="mt-2 text-sm text-green-600 flex items-center space-x-1">
                    <CheckCircle className="w-4 h-4" />
                    <span>Passwords match</span>
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                onClick={handleSubmit}
                disabled={
                  isLoading ||
                  !allRequirementsMet ||
                  !passwordsMatch ||
                  !password ||
                  !confirmPassword
                }
                className="w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Resetting Password...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-5 h-5" />
                    <span>Reset Password</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* Security Notice */}
          {!success && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-start space-x-3 text-sm text-gray-600">
                <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p>
                  For your security, you'll be automatically logged out of all
                  devices after resetting your password. You'll need to log in
                  again with your new password.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Help Section */}
        {!success && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Having trouble?{" "}
              <button
                onClick={() => navigate("/forgot-password")}
                className="text-blue-600 hover:underline font-medium"
              >
                Request a new reset link
              </button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
