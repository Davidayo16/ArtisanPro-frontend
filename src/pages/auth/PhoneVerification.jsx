import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Smartphone,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Clock,
  Shield,
  AlertCircle,
  Edit3,
} from "lucide-react";

export default function PhoneVerification() {
  const navigate = useNavigate();
  const location = useLocation();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const inputRefs = useRef([]);

  // Get data from location state or defaults
  const email = location.state?.email || "user@example.com";
  const userType = location.state?.userType || "customer";
  const initialPhone = location.state?.phone || "+234 XXX XXX XXXX";

  useEffect(() => {
    setPhoneNumber(initialPhone);
  }, [initialPhone]);

  useEffect(() => {
    // Countdown timer
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  useEffect(() => {
    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleChange = (index, value) => {
    // Only allow numbers
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields filled
    if (newOtp.every((digit) => digit !== "") && index === 5) {
      handleVerify(newOtp.join(""));
    }
  };

  const handleKeyDown = (index, e) => {
    // Handle backspace
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    // Handle paste
    if (e.key === "v" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, "").slice(0, 6).split("");
        const newOtp = [...otp];
        digits.forEach((digit, i) => {
          if (i < 6) newOtp[i] = digit;
        });
        setOtp(newOtp);
        if (digits.length === 6) {
          handleVerify(newOtp.join(""));
        }
      });
    }
  };

  const handleVerify = async (code = otp.join("")) => {
    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock validation (replace with real API)
      if (code === "123456") {
        setSuccess(true);
        setTimeout(() => {
          // Route based on user type
          if (userType === "artisan") {
            navigate("/artisan-dashboard", {
              state: { email, phone: phoneNumber, isNewUser: true },
            });
          } else {
            navigate("/customer-dashboard", {
              state: { email, phone: phoneNumber, isNewUser: true },
            });
          }
        }, 1500);
      } else {
        setError("Invalid verification code. Please try again.");
        setOtp(["", "", "", "", "", ""]);
        inputRefs.current[0]?.focus();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(60);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Show success message
      const successMsg = document.getElementById("resend-success");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        setTimeout(() => successMsg.classList.add("hidden"), 3000);
      }

      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to resend code. Please try again.");
      setCanResend(true);
    }
  };

  const handlePhoneUpdate = async () => {
    if (!phoneNumber.trim()) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // Simulate API call to update phone and resend OTP
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setIsEditingPhone(false);
      setCanResend(false);
      setResendTimer(60);
      setOtp(["", "", "", "", "", ""]);

      // Show success message
      const successMsg = document.getElementById("phone-updated-success");
      if (successMsg) {
        successMsg.classList.remove("hidden");
        setTimeout(() => successMsg.classList.add("hidden"), 3000);
      }

      inputRefs.current[0]?.focus();
    } catch (err) {
      setError("Failed to update phone number. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const maskPhoneNumber = (phone) => {
    if (phone.length <= 4) return phone;
    const firstPart = phone.slice(0, 4);
    const lastPart = phone.slice(-4);
    const masked = "X".repeat(phone.length - 8);
    return `${firstPart}${masked}${lastPart}`;
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
          <span className="font-medium">Back</span>
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Smartphone className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Phone
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code via SMS to
            </p>

            {/* Phone Display/Edit */}
            {!isEditingPhone ? (
              <div className="mt-3 flex items-center justify-center space-x-2">
                <span className="font-semibold text-gray-900 text-lg">
                  {maskPhoneNumber(phoneNumber)}
                </span>
                <button
                  onClick={() => setIsEditingPhone(true)}
                  className="text-blue-600 hover:text-blue-700 p-1 rounded-lg hover:bg-blue-50 transition-colors"
                  title="Change phone number"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+234 XXX XXX XXXX"
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-600 focus:bg-blue-50 transition-all text-center font-semibold"
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handlePhoneUpdate}
                    disabled={isLoading}
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Updating..." : "Update & Resend"}
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setPhoneNumber(initialPhone);
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Success State */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in">
              <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-green-900 font-semibold">
                  Phone Verified Successfully!
                </p>
                <p className="text-green-700 text-sm">
                  Redirecting to dashboard...
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Resend Success Message */}
          <div
            id="resend-success"
            className="hidden mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl flex items-center space-x-3 animate-fade-in"
          >
            <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <p className="text-blue-800 text-sm">
              Verification code sent successfully!
            </p>
          </div>

          {/* Phone Updated Success Message */}
          <div
            id="phone-updated-success"
            className="hidden mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3 animate-fade-in"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 text-sm">
              Phone number updated! New code sent.
            </p>
          </div>

          {/* OTP Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-900 mb-4 text-center">
              Enter Verification Code
            </label>
            <div className="flex justify-center space-x-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  disabled={isLoading || success || isEditingPhone}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                    error
                      ? "border-red-500 bg-red-50"
                      : success
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 focus:border-blue-600 focus:bg-blue-50"
                  } ${
                    isLoading || success || isEditingPhone
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Verify Button */}
          <button
            onClick={() => handleVerify()}
            disabled={
              otp.some((digit) => !digit) ||
              isLoading ||
              success ||
              isEditingPhone
            }
            className="w-full py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            style={{
              backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
            }}
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Verified!</span>
              </>
            ) : (
              <span>Verify Phone Number</span>
            )}
          </button>

          {/* Resend Section */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">
              Didn't receive the code?
            </p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isEditingPhone}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center space-x-2 mx-auto group disabled:opacity-50"
              >
                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
                <span>Resend Code</span>
              </button>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-gray-500 text-sm">
                <Clock className="w-4 h-4" />
                <span>
                  Resend in{" "}
                  <span className="font-semibold">{resendTimer}s</span>
                </span>
              </div>
            )}
          </div>

          {/* Security Notice */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="mb-2">
                  This code will expire in{" "}
                  <span className="font-semibold">10 minutes</span>. For
                  security, never share this code with anyone.
                </p>
                <p className="text-xs text-gray-500">
                  Standard SMS rates may apply depending on your carrier.
                </p>
              </div>
            </div>
          </div>

          {/* Skip Link (Optional - for testing) */}
          {userType === "customer" && (
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/customer-dashboard")}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Skip for now{" "}
                <span className="text-gray-400">
                  (verify later in settings)
                </span>
              </button>
            </div>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-6 space-y-3">
          <p className="text-center text-sm text-gray-600">
            Need help?{" "}
            <Link
              to="/contact"
              className="text-blue-600 hover:underline font-medium"
            >
              Contact Support
            </Link>
          </p>

          {/* Progress Indicator */}
          <div className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
              <CheckCircle className="w-4 h-4 text-blue-600" />
              <span>Email verified</span>
              <span className="text-gray-400">→</span>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
                <span className="font-medium text-gray-900">
                  Phone verification
                </span>
              </div>
              <span className="text-gray-400">→</span>
              <span className="text-gray-400">Dashboard</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
