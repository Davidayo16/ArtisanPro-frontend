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

      console.log("📝 Registering with data:", {
        ...registrationData,
        password: "***",
      });

      const response = await authApi.register(registrationData);

      if (response.success) {
        setAuth({ user: response.user, token: response.token });
        localStorage.setItem("token", response.token);

        toast.success("Registration successful! Please verify your email.", {
          duration: 3000,
        });

        console.log("✅ Navigating to /verify-email with:", {
          email: formData.email,
          userType: userType,
        });

        setTimeout(() => {
          navigate("/verify-email", {
            state: {
              email: formData.email,
              userType: userType,
            },
          });
        }, 1500);
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(errorMessage, { duration: 4000 });
      setErrors({ submit: errorMessage });
    } finally {
      setIsSubmitting(false);
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    if (userType === "customer") {
      authApi.googleAuthCustomer();
    } else {
      authApi.googleAuthArtisan();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Toaster position="top-center" reverseOrder={false} />

      {/* LEFT SIDE - IMAGE (Hidden on mobile) */}
      <div
        className="hidden lg:block lg:w-2/5 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('/images/side.jpg')`,
        }}
        aria-hidden="true"
      />

      {/* RIGHT SIDE - FORM */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-12 w-full overflow-y-auto">
        <div className="w-full max-w-xl my-4 sm:my-0">
          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex justify-center mb-6 sm:mb-8">
            <img
              src="/images/logo.png"
              alt="ArtisanPro NG"
              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
            />
          </Link>

          <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-5 sm:p-6 md:p-8">
            <div className="mb-6 sm:mb-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                Join ArtisanPro NG today
              </p>
            </div>

            {/* User Type Toggle */}
            <div className="mb-5 sm:mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                I want to:
              </label>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setUserType("customer")}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    userType === "customer"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <User
                    className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                      userType === "customer"
                        ? "text-blue-600"
                        : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-semibold text-xs sm:text-sm ${
                      userType === "customer"
                        ? "text-blue-600"
                        : "text-gray-700"
                    }`}
                  >
                    Hire Artisans
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    I need services
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setUserType("artisan")}
                  className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all ${
                    userType === "artisan"
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Briefcase
                    className={`w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-1 sm:mb-2 ${
                      userType === "artisan" ? "text-blue-600" : "text-gray-400"
                    }`}
                  />
                  <p
                    className={`font-semibold text-xs sm:text-sm ${
                      userType === "artisan" ? "text-blue-600" : "text-gray-700"
                    }`}
                  >
                    Work as Artisan
                  </p>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">
                    I provide services
                  </p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Google Login */}
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleAuth}
                  className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl hover:border-gray-300 hover:bg-gray-50 transition-all font-medium text-sm sm:text-base text-gray-700"
                >
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span>Continue with Google</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1 border-t border-gray-200"></div>
                <span className="text-xs sm:text-sm text-gray-500 font-medium">
                  OR
                </span>
                <div className="flex-1 border-t border-gray-200"></div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all ${
                      errors.firstName
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) =>
                      setFormData({ ...formData, lastName: e.target.value })
                    }
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all ${
                      errors.lastName
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className={`w-full pl-9 sm:pl-10 pr-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all ${
                      errors.email
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="john@example.com"
                  />
                  {formData.email && validateEmail(formData.email) && (
                    <Check className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <div className="relative flex">
                  <div className="flex items-center px-2 sm:px-3 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-lg sm:rounded-l-xl">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1 sm:mr-2" />
                    <span className="text-xs sm:text-sm text-gray-700 font-medium">
                      +234
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-r-lg sm:rounded-r-xl focus:outline-none transition-all ${
                      errors.phone
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="8012345678"
                  />
                </div>
                {errors.phone && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.phone}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all ${
                      errors.password
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                </div>
                {formData.password && (
                  <div className="mt-2">
                    <div className="flex items-center space-x-2 mb-1">
                      <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          style={{
                            width: `${(passwordStrength.strength / 4) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span
                        className={`text-xs font-medium ${passwordStrength.color.replace(
                          "bg-",
                          "text-"
                        )}`}
                      >
                        {passwordStrength.text}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Use 8+ characters with letters, numbers & symbols
                    </p>
                  </div>
                )}
                {errors.password && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.password}
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className={`w-full pl-9 sm:pl-10 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all ${
                      errors.confirmPassword
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                    ) : (
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    )}
                  </button>
                  {formData.confirmPassword &&
                    formData.password === formData.confirmPassword && (
                      <Check className="absolute right-10 sm:right-12 top-1/2 transform -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                    )}
                </div>
                {errors.confirmPassword && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Terms */}
              <div>
                <label className="flex items-start space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) =>
                      setFormData({ ...formData, agreeTerms: e.target.checked })
                    }
                    className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                  />
                  <span className="text-xs sm:text-sm text-gray-700">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.agreeTerms}
                  </p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 sm:py-3.5 rounded-lg sm:rounded-xl text-white font-semibold text-base sm:text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </button>

              <p className="text-center text-xs sm:text-sm text-gray-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="text-blue-600 hover:underline font-semibold"
                >
                  Sign In
                </Link>
              </p>
            </form>
          </div>

          {/* Trust Badges */}
          <div className="mt-6 sm:mt-8 flex items-center justify-center space-x-4 sm:space-x-6 text-gray-500 text-xs sm:text-sm">
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Lock className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Encrypted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
