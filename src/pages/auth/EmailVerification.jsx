import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  RefreshCw,
  Clock,
  Shield,
  AlertCircle,
} from "lucide-react";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

export default function EmailVerification() {
    useEffect(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);
  
  const navigate = useNavigate();
  const location = useLocation();
const { updateVerificationStatus, updateUser, user, role } = useAuthStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const inputRefs = useRef([]);

  // 🔥 FIX: Get userType from multiple sources with fallback
  const email = location.state?.email || user?.email || "your email";
  const userType = location.state?.userType || role || "customer";

  console.log(
    "EmailVerification rendered with email:",
    email,
    "and userType:",
    userType
  );
  console.log("Location state:", location.state);
  console.log("User from store:", user);
  console.log("Role from store:", role);

  // Resend timer
  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  // Auto-focus first input
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
    if (newOtp.every((d) => d !== "") && index === 5)
      handleVerify(newOtp.join(""));
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // 🔥 NEW: Handle paste event
  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();

    // Only process if it's a 6-digit number
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("");
      setOtp(newOtp);
      setError("");

      // Focus the last input
      inputRefs.current[5]?.focus();

      // Auto-verify after a short delay
      setTimeout(() => {
        handleVerify(pastedData);
      }, 100);
    } else {
      toast.error("Please paste a valid 6-digit code");
    }
  };

  // Verify Email OTP
 const handleVerify = async (code = otp.join("")) => {
   if (code.length !== 6) {
     setError("Please enter all 6 digits");
     return;
   }

   setIsLoading(true);
   setError("");

   try {
     const response = await authApi.verifyEmail(code);

     console.log("🔍 Backend response:", response);

     // 🔥 Update with backend response
     if (response.success && response.user) {
       updateUser({ isEmailVerified: response.user.isEmailVerified });
       updateVerificationStatus({ isEmailVerified: true });
     }

     setSuccess(true);
     toast.success("Email verified successfully!");

     console.log("Navigating with userType:", userType);

     setTimeout(() => {
       if (userType === "artisan") {
         console.log("Redirecting to /complete-profile");
         navigate("/complete-profile", {
           state: { email, userType },
           replace: true,
         });
       } else {
         console.log("Redirecting to /customer/dashboard");
         navigate("/customer/dashboard", { replace: true });
       }
     }, 1500);
   } catch (err) {
     const msg = err.response?.data?.message || "Invalid or expired code";
     setError(msg);
     toast.error(msg);
     setOtp(["", "", "", "", "", ""]);
     inputRefs.current[0]?.focus();
   } finally {
     setIsLoading(false);
   }
 };

  // Resend OTP
  const handleResend = async () => {
    if (!canResend || isLoading) return;

    setCanResend(false);
    setResendTimer(60);
    setError("");

    try {
      await authApi.sendEmailOTP();
      toast.success("New code sent to your email!");
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to resend code";
      setError(msg);
      toast.error(msg);
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We've sent a 6-digit code to
              <br />
              <span className="font-semibold text-gray-900">{email}</span>
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <div>
                <p className="text-green-900 font-semibold">Email Verified!</p>
                <p className="text-green-700 text-sm">
                  {userType === "artisan"
                    ? "Taking you to complete your profile..."
                    : "Welcome! Redirecting to your dashboard..."}
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

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
                  onPaste={handlePaste}
                  disabled={isLoading || success}
                  className={`w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:outline-none transition-all ${
                    error
                      ? "border-red-500 bg-red-50"
                      : success
                      ? "border-green-500 bg-green-50"
                      : "border-gray-300 focus:border-blue-600 focus:bg-blue-50"
                  } ${
                    isLoading || success ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={() => handleVerify()}
            disabled={otp.some((d) => !d) || isLoading || success}
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
              <span>Verify Email</span>
            )}
          </button>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 mb-3">Didn't receive code?</p>
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={isLoading}
                className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center justify-center space-x-2 mx-auto group"
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

          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-start space-x-3 text-sm text-gray-600">
              <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <p>
                This code expires in 10 minutes. Never share it with anyone.
              </p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/register")}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              Wrong email?{" "}
              <span className="text-blue-600 font-medium hover:underline">
                Change it
              </span>
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-600 mt-6">
          Need help?{" "}
          <Link
            to="/contact"
            className="text-blue-600 hover:underline font-medium"
          >
            Contact Support
          </Link>
        </p>
      </div>
    </div>
  );
}
