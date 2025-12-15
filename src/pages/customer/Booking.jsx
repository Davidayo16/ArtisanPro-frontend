import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Upload,
  X,
  Video,
  ChevronRight,
  ChevronLeft,
  Star,
  Shield,
  CheckCircle,
  AlertCircle,
  Zap,
  Phone,
  MessageSquare,
  Info,
  Loader2,
  Briefcase,
} from "lucide-react";
import { useBookingCreateStore } from "../../stores/useBookingCreateStore";
import { useAuthStore } from "../../stores/authStore";

export default function Booking() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const artisanFromState = location.state?.artisan;

  const {
    artisan,
    formData,
    selectedDate,
    selectedTime,
    uploadedFiles,
    loading,
    error,
    setArtisan,
    updateForm,
    setDate,
    setTime,
    addFiles,
    removeFile,
    createBooking,
    calculatePrice,
    clearError,
  } = useBookingCreateStore();

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});

  // === OPTIONAL: Restore draft on page refresh ===
  useEffect(() => {
    const draft = localStorage.getItem("pendingBookingDraft");
    if (!artisanFromState && draft) {
      const { artisan, selectedService } = JSON.parse(draft);
      setArtisan(artisan);
      if (selectedService) {
        updateForm({ selectedServiceId: selectedService._id });
      }
      clearError();
      localStorage.removeItem("pendingBookingDraft");
    }
  }, [artisanFromState, setArtisan, updateForm, clearError]);

  // === INITIAL LOAD LOGIC ===

  useEffect(() => {
    if (artisanFromState) {
      console.log("🔍 RAW ARTISAN DATA:", artisanFromState);
      console.log("🔍 SERVICES BEFORE TRANSFORM:", artisanFromState.services);

      // ✅ CHECK: Are services already flat or nested?
      const firstService = artisanFromState.services?.[0];
      const isAlreadyFlat = firstService && !firstService.service; // If no nested 'service' property, it's flat

      console.log("🔍 IS ALREADY FLAT?", isAlreadyFlat);

      let transformedArtisan;

      if (isAlreadyFlat) {
        // Services are already flat, use as-is
        transformedArtisan = artisanFromState;
        console.log("✅ USING FLAT STRUCTURE AS-IS");
      } else {
        // Services are nested, need to transform
        transformedArtisan = {
          ...artisanFromState,
          services: artisanFromState.services?.map((s) => ({
            _id: s._id,
            name: s.service?.name,
            slug: s.service?.slug,
            pricingModel: s.service?.pricingModel,
            pricingConfig: s.service?.pricingConfig,
            icon: s.service?.icon,
            category: s.service?.category?._id || s.service?.category,
            customPricingConfig: s.customPricingConfig,
            enabled: s.enabled,
          })),
        };
        console.log("✅ TRANSFORMED FROM NESTED TO FLAT");
      }

      console.log("✅ FINAL SERVICES:", transformedArtisan.services);
      console.log(
        "✅ FIRST SERVICE CATEGORY:",
        transformedArtisan.services?.[0]?.category
      );

      setArtisan(transformedArtisan);

      if (location.state?.selectedService) {
        updateForm({ selectedServiceId: location.state.selectedService._id });
      }
      clearError();
    } else if (error) {
      toast.error(error);
    } else {
      toast.error("No artisan selected. Please search and select one.");
      setTimeout(() => navigate("/search"), 2000);
    }
  }, [
    artisanFromState,
    location.state,
    error,
    setArtisan,
    updateForm,
    clearError,
    navigate,
  ]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentStep]);

  // === EARLY RETURN: 3 STATES ===
  if (!artisan && loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading artisan details...</p>
        </div>
      </div>
    );
  }

  if (!artisan && error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Oops! Something went wrong
          </h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                clearError();
                window.location.reload();
              }}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
            >
              Retry
            </button>
            <button
              onClick={() => navigate("/search")}
              className="px-5 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!artisan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-6 text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Artisan Selected
          </h3>
          <p className="text-gray-600 mb-4">
            Please go back and pick an artisan first.
          </p>
          <button
            onClick={() => navigate("/search")}
            className="w-full px-5 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700"
          >
            Find Artisans
          </button>
        </div>
      </div>
    );
  }

  // === MAIN UI STARTS HERE ===
  const artisanName = `${artisan.firstName || ""} ${
    artisan.lastName || ""
  }`.trim();

  const timeSlots = [
    "08:00 AM",
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const urgencyOptions = [
    {
      value: "normal",
      label: "Normal",
      desc: "Schedule within 2-3 days",
      icon: Calendar,
      color: "blue",
    },
    {
      value: "urgent",
      label: "Urgent",
      desc: "Need service today",
      icon: Zap,
      color: "orange",
    },
    {
      value: "emergency",
      label: "Emergency",
      desc: "Need help now!",
      icon: AlertCircle,
      color: "red",
    },
  ];

  const formatPrice = (service) => {
    if (!service) return "Contact for price";

    const { pricingModel, pricingConfig } = service;
    const custom = service.customPricingConfig;

    if (custom?.basePrice) return `₦${custom.basePrice.toLocaleString()}`;

    switch (pricingModel) {
      case "simple_fixed":
        return `₦${(pricingConfig.basePrice || 0).toLocaleString()}`;
      case "inspection_required":
        return `₦${(
          pricingConfig.inspectionFee || 0
        ).toLocaleString()} (inspection)`;
      case "hourly":
        return `₦${(pricingConfig.hourlyRate || 0).toLocaleString()}/hr`;
      case "range":
        const min = pricingConfig.priceRange?.min || 0;
        const max = pricingConfig.priceRange?.max || 0;
        return max
          ? `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`
          : `₦${min.toLocaleString()}+`;
      default:
        return "Contact for price";
    }
  };

  const pricing = calculatePrice(); // ← Uses Zustand store

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith("image") ? "image" : "video",
      name: file.name,
    }));
    addFiles(newFiles);
  };

  const validateStep = (step) => {
    const newErrors = {};
    if (step === 1) {
      if (!formData.serviceType)
        newErrors.serviceType = "Please select a service";
      if (!formData.selectedServiceId)
        newErrors.subService = "Please select a specific service";
      if (!formData.description.trim())
        newErrors.description = "Please describe your issue";
      if (formData.description.length < 20)
        newErrors.description =
          "Please provide more details (min 20 characters)";
    }
    if (step === 2) {
      if (!selectedDate) newErrors.selectedDate = "Please select a date";
      if (!selectedTime) newErrors.selectedTime = "Please select a time";
    }
    if (step === 3) {
      if (!formData.location.address.trim())
        newErrors.address = "Please enter your address";
      if (!formData.contactPhone.trim())
        newErrors.contactPhone = "Please enter your phone number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) setCurrentStep(currentStep + 1);
  };
  const handleBack = () => {
    setCurrentStep(currentStep - 1);
    setErrors({});
  };
const handleSubmit = async () => {
  if (!validateStep(3)) return;

  try {
    toast.loading("Creating booking...", { id: "booking-create" });
    const booking = await createBooking();
    toast.dismiss("booking-create"); // ✅ Add this line

    toast.success("Booking request sent successfully!", {
      duration: 3000,
      style: {
        background: "#16a34a",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "600",
      },
    });

    setTimeout(() => {
      navigate(`/booking-status/${booking._id}`);
    }, 1000);
  } catch (err) {
    console.error("Booking creation failed:", err);
    toast.dismiss("booking-create"); // ✅ Add this line

    toast.error(err.message || "Failed to create booking", {
      duration: 4000,
      style: {
        background: "#dc2626",
        color: "#fff",
        padding: "16px",
        borderRadius: "12px",
        fontWeight: "600",
      },
    });
  }
};
  const totalSteps = 4;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Secure Booking
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold text-gray-900">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-gray-600">
              {currentStep === 1 && "Service Details"}
              {currentStep === 2 && "Schedule"}
              {currentStep === 3 && "Contact & Location"}
              {currentStep === 4 && "Review & Confirm"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step < currentStep
                      ? "bg-green-500 text-white"
                      : step === currentStep
                      ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {step < currentStep ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    step
                  )}
                </div>
                {step < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 transition-all ${
                      step < currentStep ? "bg-green-500" : "bg-gray-200"
                    }`}
                  ></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              {/* STEP 1: Service Details */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      What do you need help with?
                    </h2>
                    <p className="text-gray-600">
                      Provide details so {artisanName} can prepare properly
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Service Category *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) => {
                        updateForm({
                          serviceType: e.target.value, // ← This should be category ID, not name
                          selectedServiceId: "",
                        });
                        setErrors({ ...errors, serviceType: "" });
                      }}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                    >
                      <option value="">Select service category</option>
                      {artisan.serviceCategories?.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {/* ☝️ CHANGED: value={cat._id} instead of cat.name */}
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.serviceType && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.serviceType}
                      </p>
                    )}
                  </div>

                  {formData.serviceType && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-3">
                        Select Service *
                      </label>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {artisan.services
                          ?.filter((s) => {
                            // ✅ NOW THIS WILL WORK: category is at root level
                            const serviceCatId = s.category; // No longer s.service?.category

                            if (!serviceCatId) {
                              console.log(
                                `[FILTER] Service "${s.name}" has no category ID → skipped`
                              );
                              return false;
                            }

                            // Direct ID comparison
                            const isMatch =
                              serviceCatId === formData.serviceType;

                            console.log(
                              `%c[FILTER] Service: "${s.name}" | Cat ID: ${serviceCatId} | Selected: "${formData.serviceType}" | Match: ${isMatch}`,
                              isMatch ? "color: green" : "color: red"
                            );

                            return isMatch;
                          })
                          .map((service) => (
                            <button
                              key={service._id}
                              type="button"
                              onClick={() => {
                                updateForm({ selectedServiceId: service._id });
                                setErrors({ ...errors, subService: "" });
                              }}
                              className={`p-4 rounded-xl border-2 transition-all text-left flex items-start gap-3 ${
                                formData.selectedServiceId === service._id
                                  ? "border-blue-600 bg-blue-50"
                                  : "border-gray-200 hover:border-blue-300"
                              }`}
                            >
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                {service.icon &&
                                service.icon !== "default-service-icon.png" ? (
                                  <img
                                    src={`/icons/services/${service.icon}`}
                                    alt={service.name}
                                    className="w-full h-full object-cover rounded-lg"
                                  />
                                ) : (
                                  <Briefcase className="w-5 h-5 text-gray-500" />
                                )}
                              </div>
                              <div>
                                <p
                                  className={`font-semibold text-sm ${
                                    formData.selectedServiceId === service._id
                                      ? "text-blue-600"
                                      : "text-gray-900"
                                  }`}
                                >
                                  {service.name || "Unnamed Service"}
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                  {formatPrice(service)}
                                </p>
                              </div>
                            </button>
                          ))}

                        {/* Empty State */}
                        {artisan.services?.filter(
                          (s) => s.category === formData.serviceType
                        ).length === 0 && (
                          <p className="col-span-2 text-center text-gray-500 py-8">
                            No services found for this category
                          </p>
                        )}
                      </div>

                      {errors.subService && (
                        <p className="text-sm text-red-500 mt-1">
                          {errors.subService}
                        </p>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Describe Your Issue * (Be specific)
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => {
                        updateForm({ description: e.target.value });
                        setErrors({ ...errors, description: "" });
                      }}
                      rows="5"
                      maxLength="500"
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all resize-none ${
                        errors.description
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                      placeholder="Example: Kitchen sink is leaking under the counter. Water drips constantly even when tap is off. Started 2 days ago..."
                    ></textarea>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {formData.description.length < 20
                          ? `${
                              20 - formData.description.length
                            } more characters needed`
                          : "Good! Detailed description helps"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formData.description.length}/500
                      </span>
                    </div>
                    {errors.description && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.description}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Photos/Videos (Optional, but helpful)
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-500 transition-all">
                      {uploadedFiles.length === 0 ? (
                        <>
                          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <label className="cursor-pointer">
                            <span className="text-blue-600 hover:underline font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-600">
                              {" "}
                              or drag and drop
                            </span>
                            <input
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              onChange={handleFileUpload}
                              className="hidden"
                            />
                          </label>
                          <p className="text-xs text-gray-500 mt-2">
                            PNG, JPG, MP4 up to 10MB each (Max 5 files)
                          </p>
                        </>
                      ) : (
                        <div className="space-y-3">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                            >
                              <div className="flex items-center space-x-3">
                                {file.type === "image" ? (
                                  <img
                                    src={file.preview}
                                    alt=""
                                    className="w-12 h-12 rounded object-cover"
                                  />
                                ) : (
                                  <div className="w-12 h-12 rounded bg-blue-100 flex items-center justify-center">
                                    <Video className="w-6 h-6 text-blue-600" />
                                  </div>
                                )}
                                <span className="text-sm text-gray-700 font-medium">
                                  {file.name}
                                </span>
                              </div>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </div>
                          ))}
                          {uploadedFiles.length < 5 && (
                            <label className="cursor-pointer block">
                              <div className="py-3 px-4 border-2 border-dashed border-blue-300 rounded-lg text-blue-600 hover:bg-blue-50 transition-all text-center font-medium">
                                + Add More Files
                              </div>
                              <input
                                type="file"
                                accept="image/*,video/*"
                                multiple
                                onChange={handleFileUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      How urgent is this?
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {urgencyOptions.map((option) => {
                        const Icon = option.icon;
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() =>
                              updateForm({ urgency: option.value })
                            }
                            className={`p-4 rounded-xl border-2 transition-all text-left ${
                              formData.urgency === option.value
                                ? `border-${option.color}-600 bg-${option.color}-50`
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <Icon
                              className={`w-6 h-6 mb-2 ${
                                formData.urgency === option.value
                                  ? `text-${option.color}-600`
                                  : "text-gray-400"
                              }`}
                            />
                            <p
                              className={`font-semibold text-sm mb-1 ${
                                formData.urgency === option.value
                                  ? `text-${option.color}-600`
                                  : "text-gray-900"
                              }`}
                            >
                              {option.label}
                            </p>
                            <p className="text-xs text-gray-600">
                              {option.desc}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Schedule */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      When do you need service?
                    </h2>
                    <p className="text-gray-600">
                      {formData.urgency === "emergency"
                        ? "We'll notify the artisan immediately"
                        : "Choose your preferred date and time"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Date *
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => {
                        setDate(e.target.value);
                        setErrors({ ...errors, selectedDate: "" });
                      }}
                      min={new Date().toISOString().split("T")[0]}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                        errors.selectedDate
                          ? "border-red-500"
                          : "border-gray-200 focus:border-blue-500"
                      }`}
                    />
                    {errors.selectedDate && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.selectedDate}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-3">
                      Select Time *
                    </label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          type="button"
                          onClick={() => {
                            setTime(time);
                            setErrors({ ...errors, selectedTime: "" });
                          }}
                          className={`p-3 rounded-xl border-2 transition-all font-medium text-sm ${
                            selectedTime === time
                              ? "border-blue-600 bg-blue-50 text-blue-600"
                              : "border-gray-200 hover:border-blue-300 text-gray-700"
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                    {errors.selectedTime && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.selectedTime}
                      </p>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-blue-900 mb-1">
                          Flexible Scheduling
                        </p>
                        <p className="text-xs text-blue-700">
                          The artisan has 2 minutes to respond. You'll receive a
                          notification once they accept or propose a price.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Location */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Where should we come?
                    </h2>
                    <p className="text-gray-600">
                      Provide accurate location details
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Street Address *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        value={formData.location.address}
                        onChange={(e) => {
                          updateForm({
                            location: {
                              ...formData.location,
                              address: e.target.value,
                            },
                          });
                          setErrors({ ...errors, address: "" });
                        }}
                        className={`w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none transition-all ${
                          errors.address
                            ? "border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="e.g., 10 Admiralty Way, Lekki Phase 1"
                      />
                    </div>
                    {errors.address && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        value={formData.location.city}
                        onChange={(e) =>
                          updateForm({
                            location: {
                              ...formData.location,
                              city: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="Lagos"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        State *
                      </label>
                      <input
                        type="text"
                        value={formData.location.state}
                        onChange={(e) =>
                          updateForm({
                            location: {
                              ...formData.location,
                              state: e.target.value,
                            },
                          })
                        }
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                        placeholder="Lagos"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Nearby Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.location.landmark}
                      onChange={(e) =>
                        updateForm({
                          location: {
                            ...formData.location,
                            landmark: e.target.value,
                          },
                        })
                      }
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                      placeholder="e.g., Opposite Chicken Republic"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Contact Phone Number *
                    </label>
                    <div className="relative flex">
                      <div className="flex items-center px-3 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-xl">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-700 font-medium">+234</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.contactPhone}
                        onChange={(e) => {
                          updateForm({ contactPhone: e.target.value });
                          setErrors({ ...errors, contactPhone: "" });
                        }}
                        className={`flex-1 px-4 py-3 border-2 rounded-r-xl focus:outline-none transition-all ${
                          errors.contactPhone
                            ? "border-red-500"
                            : "border-gray-200 focus:border-blue-500"
                        }`}
                        placeholder="8012345678"
                      />
                    </div>
                    {errors.contactPhone && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.contactPhone}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Alternate Phone (Optional)
                    </label>
                    <div className="relative flex">
                      <div className="flex items-center px-3 bg-gray-50 border-2 border-r-0 border-gray-200 rounded-l-xl">
                        <Phone className="w-5 h-5 text-gray-400 mr-2" />
                        <span className="text-gray-700 font-medium">+234</span>
                      </div>
                      <input
                        type="tel"
                        value={formData.alternatePhone}
                        onChange={(e) =>
                          updateForm({ alternatePhone: e.target.value })
                        }
                        className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-r-xl focus:outline-none focus:border-blue-500"
                        placeholder="9012345678"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      Special Instructions (Optional)
                    </label>
                    <textarea
                      value={formData.specialInstructions}
                      onChange={(e) =>
                        updateForm({ specialInstructions: e.target.value })
                      }
                      rows="3"
                      maxLength="200"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none"
                      placeholder="e.g., Ring doorbell twice, park on the right side..."
                    ></textarea>
                    <span className="text-xs text-gray-500">
                      {formData.specialInstructions.length}/200
                    </span>
                  </div>
                </div>
              )}

              {/* STEP 4: Review & Confirm */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Review Your Booking
                    </h2>
                    <p className="text-gray-600">
                      Please confirm all details are correct
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">SERVICE</p>
                        <p className="font-semibold text-gray-900">
                          {formData.serviceType} -{" "}
                          {
                            artisan.services?.find(
                              (s) => s._id === formData.selectedServiceId
                            )?.service?.name
                          }
                        </p>
                      </div>
                      <button
                        onClick={() => setCurrentStep(1)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">DESCRIPTION</p>
                      <p className="text-sm text-gray-700">
                        {formData.description}
                      </p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-2">
                          ATTACHMENTS ({uploadedFiles.length})
                        </p>
                        <div className="flex space-x-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="w-16 h-16 rounded-lg overflow-hidden"
                            >
                              {file.type === "image" ? (
                                <img
                                  src={file.preview}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-blue-600" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">URGENCY</p>
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${
                          formData.urgency === "emergency"
                            ? "bg-red-100 text-red-700"
                            : formData.urgency === "urgent"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {formData.urgency.charAt(0).toUpperCase() +
                          formData.urgency.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">SCHEDULE</p>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {new Date(selectedDate).toLocaleDateString(
                                "en-US",
                                {
                                  weekday: "short",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <span className="font-semibold text-gray-900">
                              {selectedTime}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentStep(2)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-xs text-gray-500 mb-1">LOCATION</p>
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {formData.location.address}
                            </p>
                            <p className="text-sm text-gray-600">
                              {formData.location.city},{" "}
                              {formData.location.state}
                            </p>
                            {formData.location.landmark && (
                              <p className="text-xs text-gray-500 mt-1">
                                Near: {formData.location.landmark}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setCurrentStep(3)}
                        className="text-blue-600 hover:underline text-sm font-medium"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="pt-3 border-t border-gray-200">
                      <p className="text-xs text-gray-500 mb-1">CONTACT</p>
                      <div className="flex items-center space-x-2">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <span className="font-semibold text-gray-900">
                          +234 {formData.contactPhone}
                        </span>
                      </div>
                      {formData.alternatePhone && (
                        <div className="flex items-center space-x-2 mt-1">
                          <Phone className="w-5 h-5 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            +234 {formData.alternatePhone}
                          </span>
                        </div>
                      )}
                    </div>
                    {formData.specialInstructions && (
                      <div className="pt-3 border-t border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                          SPECIAL INSTRUCTIONS
                        </p>
                        <p className="text-sm text-gray-700">
                          {formData.specialInstructions}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                        required
                      />
                      <label
                        htmlFor="agreeTerms"
                        className="text-sm text-gray-700"
                      >
                        I agree that the information provided is accurate and I
                        understand the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:underline font-medium"
                        >
                          cancellation policy
                        </a>
                        . Payment will be held in escrow until job completion.
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex gap-3 pt-6 border-t border-gray-200 mt-8">
                {currentStep > 1 && (
                  <button
                    onClick={handleBack}
                    disabled={loading}
                    className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                    <span>Back</span>
                  </button>
                )}
                <button
                  onClick={currentStep === 4 ? handleSubmit : handleNext}
                  disabled={loading}
                  className="flex-1 px-6 py-3 rounded-xl text-white font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <span>
                        {currentStep === 4
                          ? "Submit Booking Request"
                          : "Continue"}
                      </span>
                      {currentStep < 4 && <ChevronRight className="w-5 h-5" />}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={artisan.profilePhoto || "/images/default-avatar.jpg"}
                  alt={artisanName}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold text-gray-900">{artisanName}</h3>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm text-gray-900">
                      {artisan.averageRating?.toFixed(1) || "N/A"}
                    </span>
                    <span className="text-sm text-gray-600">
                      ({artisan.totalReviews || 0})
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-gray-900">Price Estimate</h4>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Base Service Fee</span>
                    <span className="font-semibold text-gray-900">
                      ₦{pricing.basePrice.toLocaleString()}
                    </span>
                  </div>
                  {formData.urgency !== "normal" && (
                    <div className="flex justify-between text-sm">
                      <span className="text-orange-600 flex items-center space-x-1">
                        <Zap className="w-4 h-4" />
                        <span>
                          {formData.urgency === "urgent"
                            ? "Urgent"
                            : "Emergency"}{" "}
                          Fee
                        </span>
                      </span>
                      <span className="font-semibold text-orange-600">
                        Included
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Platform Fee (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₦{pricing.platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex justify-between">
                      <span className="font-bold text-gray-900">Total</span>
                      <span className="font-bold text-xl text-blue-600">
                        ₦{pricing.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Secure escrow payment</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>Money-back guarantee</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-700">
                  <Clock className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>24/7 customer support</span>
                </div>
              </div>

              <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start space-x-2">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-yellow-900 mb-1">
                      2-Minute Response Window
                    </p>
                    <p className="text-xs text-yellow-700">
                      The artisan has 2 minutes to accept, propose a price, or
                      decline. You'll only be charged if they accept.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Need help?</p>
                <div className="flex gap-2">
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center space-x-1">
                    <Phone className="w-4 h-4" />
                    <span>Call</span>
                  </button>
                  <button className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all flex items-center justify-center space-x-1">
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
