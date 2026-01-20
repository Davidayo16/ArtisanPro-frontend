import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  Eye,
  EyeOff,
  Check,
  Shield,
  Lock,
  User,
  Mail,
  Phone,
  Briefcase,
  ArrowRight,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { authApi } from "../../api/authApi";

export default function Registration() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setLoading = useAuthStore((state) => state.setLoading);

  const [userType, setUserType] = useState("customer");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, text: "", color: "" };
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const levels = [
      { strength: 0, text: "", color: "" },
      { strength: 1, text: "Weak", color: "bg-red-500" },
      { strength: 2, text: "Fair", color: "bg-yellow-500" },
      { strength: 3, text: "Good", color: "bg-blue-500" },
      { strength: 4, text: "Strong", color: "bg-green-500" },
    ];
    return levels[strength];
  };

  const passwordStrength = getPasswordStrength(formData.password);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) =>
    /^[0-9]{10,11}$/.test(phone.replace(/\s/g, ""));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!validateEmail(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Invalid phone number (10-11 digits)";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.agreeTerms)
      newErrors.agreeTerms = "You must agree to the terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setIsSubmitting(true);
    setLoading(true);

    try {
      const registrationData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        role: userType,
      };

      const response = await authApi.register(registrationData);

      if (response.success) {
        setAuth({ user: response.user, token: response.token });
        localStorage.setItem("token", response.token);
        toast.success("Registration successful! Please verify your email.");
        setTimeout(() => {
          navigate("/verify-email", {
            state: { email: formData.email, userType: userType },
          });
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Registration failed.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    userType === "customer"
      ? authApi.googleAuthCustomer()
      : authApi.googleAuthArtisan();
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col lg:flex-row text-white">
      <Toaster position="top-center" reverseOrder={false} />

      {/* LEFT SIDE - IMAGE */}
      {/* <div
        className="hidden lg:block lg:w-2/5 bg-cover bg-center bg-no-repeat relative border-r border-white/5"
        style={{ backgroundImage: `url('/images/side.jpg')` }}
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-black/40" />
      </div> */}

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 w-full overflow-y-auto">
        <div className="w-full max-w-xl my-4 sm:my-0">
          <Link to="/" className="lg:hidden flex justify-center mb-6">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="w-20 h-20 object-contain"
            />
          </Link>

          <div className="bg-white/[0.03] border border-white/10 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-light tracking-tight text-white mb-2">
                Create Account
              </h2>
              <p className="text-gray-500">Join ArtisanPro NG today</p>
            </div>

            {/* User Type Toggle - Dark Mode */}
            <div className="mb-8">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("customer")}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                    userType === "customer"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <User
                    className={`w-6 h-6 mb-2 ${userType === "customer" ? "text-blue-500" : "text-gray-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${userType === "customer" ? "text-white" : "text-gray-400"}`}
                  >
                    Hire Artisans
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("artisan")}
                  className={`p-4 rounded-xl border transition-all flex flex-col items-center ${
                    userType === "artisan"
                      ? "border-blue-500 bg-blue-500/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <Briefcase
                    className={`w-6 h-6 mb-2 ${userType === "artisan" ? "text-blue-500" : "text-gray-500"}`}
                  />
                  <span
                    className={`text-sm font-semibold ${userType === "artisan" ? "text-white" : "text-gray-400"}`}
                  >
                    Work as Artisan
                  </span>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <button
                type="button"
                onClick={handleGoogleAuth}
                className="w-full flex items-center justify-center space-x-3 px-4 py-3 border border-white/10 rounded-xl hover:bg-white/5 transition-all text-gray-300 font-medium"
              >
                <img
                  src="https://www.google.com/favicon.ico"
                  alt="G"
                  className="w-5 h-5"
                />
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center space-x-4">
                <div className="flex-1 border-t border-white/5"></div>
                <span className="text-xs text-gray-600 font-bold tracking-widest uppercase">
                  OR
                </span>
                <div className="flex-1 border-t border-white/5"></div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className="w-full px-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="Doe"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="john@example.com"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Phone
                </label>
                <div className="relative flex">
                  <div className="flex items-center px-3 bg-white/5 border border-r-0 border-white/10 rounded-l-xl text-gray-400 text-sm font-medium">
                    +234
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="flex-1 px-4 py-3 bg-white/[0.02] border border-white/10 rounded-r-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="8012345678"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-10 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="Password"
                  />
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-10 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-xl focus:border-blue-500/40 focus:outline-none transition-all text-white"
                    placeholder="Confirm"
                  />
                </div>
              </div>

              {/* Terms Checkbox */}
              <label className="flex items-start space-x-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeTerms: e.target.checked })
                  }
                  className="w-4 h-4 mt-1 bg-white/5 border-white/10 rounded text-blue-600 focus:ring-0"
                />
                <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed">
                  I agree to the{" "}
                  <Link to="/terms" className="text-white hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-white hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              {/* SIGN IN BUTTON - LEAVE AS IS */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-white font-semibold text-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 hover:shadow-lg hover:shadow-blue-900/20 active:scale-[0.98]"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                <span>
                  {isSubmitting ? "Creating Account..." : "Create Account"}
                </span>
                {!isSubmitting && <ArrowRight className="w-5 h-5" />}
              </button>

              <p className="text-center text-sm text-gray-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-white hover:text-blue-400 font-semibold border-b border-white/20 pb-0.5 ml-1 transition-colors"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-6 text-gray-600 text-[10px] uppercase tracking-widest font-bold">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 h-3 text-blue-500" />
              <span>Secure Register</span>
            </div>
            <div className="flex items-center space-x-2">
              <Lock className="w-3 h-3 text-blue-500" />
              <span>AES-256 SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
