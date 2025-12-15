import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ChevronRight,
  ChevronLeft,
  Check,
  MapPin,
  Briefcase,
  Clock,
  DollarSign,
  Loader,
  Phone,
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { artisanApi } from "../../api/artisanApi";
import { authApi } from "../../api/authApi";
import { serviceApi } from "../../api/serviceApi";
import LocationPicker from "../../components/common/LocationPicker";

export default function ProfileWizard() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [formData, setFormData] = useState({
    businessName: "",
    bio: "",
    yearsOfExperience: "",
    phone: "",
    location: {
      street: "",
      city: "",
      state: "",
      country: "Nigeria",
      coordinates: [0, 0],
    },
    serviceIds: [],
    workingHours: {
      monday: { start: "08:00", end: "18:00", isAvailable: true },
      tuesday: { start: "08:00", end: "18:00", isAvailable: true },
      wednesday: { start: "08:00", end: "18:00", isAvailable: true },
      thursday: { start: "08:00", end: "18:00", isAvailable: true },
      friday: { start: "08:00", end: "18:00", isAvailable: true },
      saturday: { start: "09:00", end: "16:00", isAvailable: true },
      sunday: { start: "08:00", end: "18:00", isAvailable: false },
    },
    serviceRadius: 15,
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  });

  const [errors, setErrors] = useState({});
  const totalSteps = 4;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [categoriesRes, servicesRes] = await Promise.all([
          serviceApi.getAllCategories({ active: true }),
          serviceApi.getAllServices({ active: true }),
        ]);

        if (categoriesRes.success && Array.isArray(categoriesRes.data)) {
          setCategories(categoriesRes.data);
        }
        if (Array.isArray(servicesRes)) {
          setServices(servicesRes);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error("Failed to load data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredServices = selectedCategory
    ? services.filter((s) => s.category?._id === selectedCategory)
    : services;

  const validateStep = (step) => {
    const newErrors = {};

    if (step === 1) {
      if (!formData.businessName.trim())
        newErrors.businessName = "Business name is required";
      if (!formData.bio.trim()) newErrors.bio = "Bio is required";
      if (!formData.yearsOfExperience)
        newErrors.yearsOfExperience = "Years of experience is required";
      if (!formData.phone || !formData.phone.trim())
        newErrors.phone = "Phone number is required";
      else if (!/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, "")))
        newErrors.phone = "Invalid phone number (10-11 digits)";
      if (!formData.location.city.trim()) newErrors.city = "City is required";
      if (!formData.location.state.trim())
        newErrors.state = "State is required";
      if (
        !formData.location.coordinates ||
        formData.location.coordinates[0] === 0 ||
        formData.location.coordinates[1] === 0
      ) {
        newErrors.coordinates = "Please set your location on the map";
      }
    }

    if (step === 2) {
      if (formData.serviceIds.length === 0)
        newErrors.services = "Select at least one service";
    }

    if (step === 4) {
      if (!formData.accountName.trim())
        newErrors.accountName = "Account name is required";
      if (!formData.accountNumber.trim())
        newErrors.accountNumber = "Account number is required";
      else if (!/^\d{10}$/.test(formData.accountNumber))
        newErrors.accountNumber = "Account number must be 10 digits";
      if (!formData.bankName.trim())
        newErrors.bankName = "Bank name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleNext = async () => {
  if (!validateStep(currentStep)) {
    toast.error("Please fill all required fields");
    return;
  }

  setIsSubmitting(true);

  try {
    if (currentStep === 1) {
      await artisanApi.updateBasicInfo({
        businessName: formData.businessName,
        bio: formData.bio,
        yearsOfExperience: parseInt(formData.yearsOfExperience),
        phone: formData.phone,
        location: {
          street: formData.location.street,
          city: formData.location.city,
          state: formData.location.state,
          country: formData.location.country,
          coordinates: formData.location.coordinates,
        },
      });
      // toast.success("Basic info saved!"); // ❌ REMOVE THIS LINE
    } else if (currentStep === 2) {
      const selectedServices = services.filter((s) =>
        formData.serviceIds.includes(s._id)
      );
      const categoryIds = [
        ...new Set(
          selectedServices
            .map((s) => s.category?._id || s.category)
            .filter(Boolean)
        ),
      ];
      await artisanApi.updateServices(formData.serviceIds, categoryIds);
      // toast.success("Services updated!"); // ❌ REMOVE THIS LINE
    } else if (currentStep === 3) {
      await artisanApi.updateWorkingHours({
        workingHours: formData.workingHours,
        serviceRadius: formData.serviceRadius,
      });
      // toast.success("Working hours saved!"); // ❌ REMOVE THIS LINE
    }

    setCurrentStep(currentStep + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (error) {
    console.error("Save error:", error);
    toast.error(
      error.response?.data?.message || "Failed to save. Please try again."
    );
  } finally {
    setIsSubmitting(false);
  }
};

  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

 const handleSubmit = async () => {
   if (!validateStep(currentStep)) {
     toast.error("Please fill all required fields");
     return;
   }

   setIsSubmitting(true);

   try {
     await artisanApi.updateBankDetails({
       accountName: formData.accountName,
       accountNumber: formData.accountNumber,
       bankName: formData.bankName,
       bankCode: formData.bankCode,
     });

     const freshUserData = await authApi.getProfileStatus();
     const profileData = freshUserData.data || freshUserData;

     useAuthStore.getState().setProfileStatus({
       profileComplete: profileData.profileComplete,
       completionPercentage: profileData.completionPercentage,
       missingRequired: profileData.missingRequired || [],
       missingOptional: profileData.missingOptional || [],
       canReceiveJobs: profileData.canReceiveJobs,
     });

     toast.success("Profile completed successfully!", { duration: 1500 }); // ✅ CHANGE duration from 4000 to 1500

     setTimeout(() => {
       toast.dismiss(); // ✅ ADD THIS LINE - Dismiss all toasts before navigating
       navigate("/artisan/dashboard");
     }, 1500);
   } catch (error) {
     console.error("Submission error:", error);
     toast.error(
       error.response?.data?.message || "Failed to complete profile."
     );
   } finally {
     setIsSubmitting(false);
   }
 };

  const handleServiceToggle = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      serviceIds: prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <Loader className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 text-sm sm:text-base">
            Loading services...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12 px-3 sm:px-4 lg:px-8">
      <Toaster position="top-center" />

      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Let's set up your artisan profile to start receiving jobs
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs sm:text-sm font-medium text-gray-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full transition-all duration-500 bg-gradient-to-r from-blue-600 to-blue-400"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8">
          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Basic Information
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Tell us about your business
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  value={formData.businessName}
                  onChange={(e) =>
                    setFormData({ ...formData, businessName: e.target.value })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                    errors.businessName
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="e.g., Chidi's Plumbing Services"
                />
                {errors.businessName && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.businessName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Professional Bio *
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  rows="4"
                  maxLength="500"
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all resize-none text-sm sm:text-base ${
                    errors.bio
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="Tell customers about your experience and skills..."
                ></textarea>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Describe your expertise</span>
                  <span>{formData.bio.length}/500</span>
                </div>
                {errors.bio && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.bio}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Years of Experience *
                </label>
                <select
                  value={formData.yearsOfExperience}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      yearsOfExperience: e.target.value,
                    })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                    errors.yearsOfExperience
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select experience level</option>
                  <option value="1">Less than 1 year</option>
                  <option value="2">1-2 years</option>
                  <option value="3">3-5 years</option>
                  <option value="6">6-10 years</option>
                  <option value="10">10+ years</option>
                </select>
                {errors.yearsOfExperience && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.yearsOfExperience}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <div className="relative flex">
                  <div className="flex items-center px-2 sm:px-3 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-lg sm:rounded-l-xl">
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-1 sm:mr-2" />
                    <span className="text-sm sm:text-base text-gray-700 font-medium">
                      +234
                    </span>
                  </div>
                  <input
                    type="tel"
                    value={formData.phone || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className={`flex-1 px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-r-lg sm:rounded-r-xl focus:outline-none transition-all text-sm sm:text-base ${
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
                <p className="text-xs text-gray-500 mt-1">
                  Required for receiving job notifications via SMS
                </p>
              </div>

              <LocationPicker
                value={formData.location}
                onChange={(newLocation) =>
                  setFormData({
                    ...formData,
                    location: newLocation,
                  })
                }
                error={errors.coordinates}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    City *
                  </label>
                  <input
                    type="text"
                    value={formData.location.city}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          city: e.target.value,
                        },
                      })
                    }
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                      errors.city
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="e.g., Lagos"
                  />
                  {errors.city && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    State *
                  </label>
                  <input
                    type="text"
                    value={formData.location.state}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        location: {
                          ...formData.location,
                          state: e.target.value,
                        },
                      })
                    }
                    className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                      errors.state
                        ? "border-red-500"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                    placeholder="e.g., Lagos State"
                  />
                  {errors.state && (
                    <p className="text-xs sm:text-sm text-red-500 mt-1">
                      {errors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Street Address (Optional)
                </label>
                <input
                  type="text"
                  value={formData.location.street}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      location: {
                        ...formData.location,
                        street: e.target.value,
                      },
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm sm:text-base"
                  placeholder="e.g., 15 Allen Avenue"
                />
              </div>
            </div>
          )}

          {/* Step 2: Services */}
          {currentStep === 2 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Select Your Services
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Choose the services you offer (select at least one)
                </p>
              </div>

              {categories.length > 0 && (
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Filter by Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                  >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 max-h-80 sm:max-h-96 overflow-y-auto p-2 border-2 border-gray-200 rounded-lg sm:rounded-xl">
                  {filteredServices.length > 0 ? (
                    filteredServices.map((service) => (
                      <label
                        key={service._id}
                        className={`flex items-center space-x-2 p-2.5 sm:p-3 rounded-lg border-2 cursor-pointer transition-all ${
                          formData.serviceIds.includes(service._id)
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.serviceIds.includes(service._id)}
                          onChange={() => handleServiceToggle(service._id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span
                          className={`text-xs sm:text-sm font-medium ${
                            formData.serviceIds.includes(service._id)
                              ? "text-blue-600"
                              : "text-gray-700"
                          }`}
                        >
                          {service.name}
                        </span>
                      </label>
                    ))
                  ) : (
                    <p className="col-span-1 sm:col-span-2 text-center text-gray-500 py-8 text-sm">
                      No services available in this category
                    </p>
                  )}
                </div>
                {errors.services && (
                  <p className="text-xs sm:text-sm text-red-500 mt-2">
                    {errors.services}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Step 3: Working Hours */}
          {currentStep === 3 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Working Hours
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Set your availability schedule
                </p>
              </div>

              <div className="space-y-2">
                {Object.entries(formData.workingHours).map(
                  ([day, schedule]) => (
                    <div
                      key={day}
                      className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-2 sm:space-x-3">
                        <input
                          type="checkbox"
                          checked={schedule.isAvailable}
                          onChange={(e) => {
                            setFormData({
                              ...formData,
                              workingHours: {
                                ...formData.workingHours,
                                [day]: {
                                  ...schedule,
                                  isAvailable: e.target.checked,
                                },
                              },
                            });
                          }}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 flex-shrink-0"
                        />
                        <span className="w-20 sm:w-24 font-medium text-gray-900 capitalize text-sm sm:text-base">
                          {day}
                        </span>
                      </div>
                      {schedule.isAvailable ? (
                        <div className="flex items-center space-x-2 ml-6 sm:ml-0">
                          <input
                            type="time"
                            value={schedule.start}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                workingHours: {
                                  ...formData.workingHours,
                                  [day]: { ...schedule, start: e.target.value },
                                },
                              });
                            }}
                            className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <span className="text-gray-500 text-xs sm:text-sm">
                            to
                          </span>
                          <input
                            type="time"
                            value={schedule.end}
                            onChange={(e) => {
                              setFormData({
                                ...formData,
                                workingHours: {
                                  ...formData.workingHours,
                                  [day]: { ...schedule, end: e.target.value },
                                },
                              });
                            }}
                            className="px-2 sm:px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ) : (
                        <span className="text-gray-500 text-xs sm:text-sm ml-6 sm:ml-0">
                          Closed
                        </span>
                      )}
                    </div>
                  )
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Service Radius (km)
                </label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formData.serviceRadius}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      serviceRadius: parseInt(e.target.value) || 15,
                    })
                  }
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:outline-none focus:border-blue-500 text-sm sm:text-base"
                />
                <p className="text-xs text-gray-500 mt-1">
                  How far are you willing to travel for jobs?
                </p>
              </div>
            </div>
          )}

          {/* Step 4: Bank Details */}
          {currentStep === 4 && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1 sm:mb-2">
                  Bank Details
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  For receiving payments (required)
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={formData.accountName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountName: e.target.value })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                    errors.accountName
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="John Doe"
                />
                {errors.accountName && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.accountName}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  maxLength="10"
                  value={formData.accountNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      accountNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                    errors.accountNumber
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                  placeholder="0123456789"
                />
                {errors.accountNumber && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.accountNumber}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Bank Name *
                </label>
                <select
                  value={formData.bankName}
                  onChange={(e) =>
                    setFormData({ ...formData, bankName: e.target.value })
                  }
                  className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 border-2 rounded-lg sm:rounded-xl focus:outline-none transition-all text-sm sm:text-base ${
                    errors.bankName
                      ? "border-red-500"
                      : "border-gray-200 focus:border-blue-500"
                  }`}
                >
                  <option value="">Select your bank</option>
                  <option value="Access Bank">Access Bank</option>
                  <option value="GTBank">GTBank</option>
                  <option value="First Bank">First Bank</option>
                  <option value="UBA">UBA</option>
                  <option value="Zenith Bank">Zenith Bank</option>
                  <option value="Fidelity Bank">Fidelity Bank</option>
                  <option value="Union Bank">Union Bank</option>
                  <option value="Polaris Bank">Polaris Bank</option>
                  <option value="Wema Bank">Wema Bank</option>
                  <option value="Sterling Bank">Sterling Bank</option>
                  <option value="Stanbic IBTC">Stanbic IBTC</option>
                  <option value="Kuda Bank">Kuda Bank</option>
                  <option value="Opay">Opay</option>
                  <option value="Moniepoint">Moniepoint</option>
                </select>
                {errors.bankName && (
                  <p className="text-xs sm:text-sm text-red-500 mt-1">
                    {errors.bankName}
                  </p>
                )}
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs sm:text-sm font-semibold text-green-900 mb-1">
                      Almost Done!
                    </p>
                    <p className="text-xs text-green-700">
                      Once you submit, our team will review your profile within
                      24-48 hours. You'll receive an email notification once
                      approved.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-4 sm:pt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handleBack}
                disabled={isSubmitting}
                className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 border-2 border-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Back</span>
              </button>
            )}

            <button
              type="button"
              onClick={currentStep === totalSteps ? handleSubmit : handleNext}
              disabled={isSubmitting}
              className="w-full sm:flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              {isSubmitting ? (
                <>
                  <Loader className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : currentStep === totalSteps ? (
                <>
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span>Complete Profile</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}