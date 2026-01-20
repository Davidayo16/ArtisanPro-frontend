import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  Check,
  Shield,
  ArrowRight,
} from "lucide-react";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import toast from "react-hot-toast";

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const res = await authApi.login(formData);
      localStorage.setItem("token", res.token);

      if (res.user.role === "artisan") {
        try {
          const profileStatusRes = await authApi.getProfileStatus();
          const profileData = profileStatusRes.data || profileStatusRes;

          setAuth({
            ...res,
            profileStatus: profileData,
          });

          if (profileData.hasCompletedInitialSetup) {
            navigate("/artisan/dashboard");
          } else {
            navigate("/complete-profile");
          }
        } catch (err) {
          console.error("Profile status fetch error:", err);
          navigate("/complete-profile");
        }
      } else {
        setAuth(res);
        navigate("/customer/dashboard");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider) => {
    if (provider === "Google") {
      window.location.href = `${
        import.meta.env.VITE_API_URL
      }/auth/google/artisan`;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex text-white">
      {/* LEFT SIDE - IMAGE WITH DARK OVERLAY */}
      {/* <div
        className="hidden lg:block lg:w-2/5 bg-cover bg-center bg-no-repeat relative border-r border-white/5"
        style={{
          backgroundImage: `url('/images/side.jpg')`,
        }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div> */}

      {/* RIGHT SIDE - DARK FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-lg">
          <Link to="/" className="lg:hidden flex justify-center mb-8">
            <img
              src="/images/logo.png"
              alt="ArtisanPro NG"
              className="w-24 h-24 object-contain"
            />
          </Link>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl p-8 backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                Sign In
              </h2>
              <p className="text-gray-500">
                Enter your credentials to access your account
              </p>
            </div>

            {/* Social Login - Adjusted for Dark Mode */}
            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => handleSocialLogin("Google")}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all font-medium text-gray-300"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div className="flex-1 border-t border-white/5"></div>
              <span className="text-xs text-gray-600 font-bold tracking-widest uppercase">
                OR
              </span>
              <div className="flex-1 border-t border-white/5"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (errors.email) setErrors({ ...errors, email: "" });
                    }}
                    className={`w-full pl-10 pr-4 py-3 bg-white/[0.02] border rounded-xl focus:outline-none transition-all text-white ${
                      errors.email
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-blue-500/40"
                    }`}
                    placeholder="you@example.com"
                  />
                  {formData.email &&
                    validateEmail(formData.email) &&
                    !errors.email && (
                      <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500" />
                    )}
                  {errors.email && (
                    <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-blue-500 hover:text-blue-400 font-medium"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (errors.password)
                        setErrors({ ...errors, password: "" });
                    }}
                    className={`w-full pl-10 pr-12 py-3 bg-white/[0.02] border rounded-xl focus:outline-none transition-all text-white ${
                      errors.password
                        ? "border-red-500/50 focus:border-red-500"
                        : "border-white/10 focus:border-blue-500/40"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-gray-400"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1 flex items-center space-x-1">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* ORIGINAL BUTTON GRADIENT PRESERVED */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all flex items-center justify-center space-x-2 ${
                  isLoading
                    ? "bg-gray-700 cursor-not-allowed"
                    : "hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
                }`}
                style={{
                  backgroundImage: isLoading
                    ? "none"
                    : "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing In...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="text-white hover:text-blue-400 font-semibold border-b border-white/20 pb-0.5 ml-1 transition-colors"
                >
                  Create Account
                </Link>
              </p>
            </div>

            <div className="mt-8 pt-6 border-t border-white/5">
              <p className="text-[10px] text-center text-gray-600 leading-relaxed uppercase tracking-tighter">
                By signing in, you agree to our{" "}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600 text-[10px] uppercase tracking-[0.2em] font-bold">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-blue-500" />
              <span>Secure Login</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-blue-500" />
              <span>256-bit SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
