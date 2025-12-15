import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  Camera,
  Save,
  X,
  Plus,
  Trash2,
  DollarSign,
  Clock,
  AlertTriangle, // 🔥 ADD THIS LINE
  Upload,
  Star,
  Award,
  Briefcase,
  TrendingUp,
  Users,
  Shield,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  ImageIcon,
  Edit2,
  Loader,
  ChevronDown,
} from "lucide-react";
import { useArtisanProfileStore } from "../../../stores/artisanProfileStore";

import LoadingDashboard from './../../../components/dashboard/LoadingDashboard';
import { useAuthStore } from "../../../stores/authStore";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: { 50: "#f0fdf4", 600: "#059669" },
  warning: { 50: "#fffbeb", 500: "#f59e0b" },
  danger: { 50: "#fef2f2", 600: "#dc2626" },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },
};

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 border"
    style={{ borderColor: COLORS.gray[200] }}
  >
    <div className="flex items-center space-x-2 sm:space-x-3">
      <div
        className="p-1.5 sm:p-2 rounded-lg"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-4 h-4 sm:w-5 sm:h-5" style={{ color }} />
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-xs font-medium truncate"
          style={{ color: COLORS.gray[600] }}
        >
          {label}
        </p>
        <p
          className="text-base sm:text-lg font-bold truncate"
          style={{ color: COLORS.gray[900] }}
        >
          {value}
        </p>
      </div>
    </div>
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanProfile() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showAddServiceModal, setShowAddServiceModal] = useState(false);
  const [showEditServiceModal, setShowEditServiceModal] = useState(false);
  const [showAddPortfolioModal, setShowAddPortfolioModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  // Working hours state
  const [workingHoursForm, setWorkingHoursForm] = useState({
    monday: { start: "08:00", end: "18:00", isAvailable: true },
    tuesday: { start: "08:00", end: "18:00", isAvailable: true },
    wednesday: { start: "08:00", end: "18:00", isAvailable: true },
    thursday: { start: "08:00", end: "18:00", isAvailable: true },
    friday: { start: "08:00", end: "18:00", isAvailable: true },
    saturday: { start: "09:00", end: "16:00", isAvailable: true },
    sunday: { start: "08:00", end: "18:00", isAvailable: false },
  });
  // Bank details state
  const [showBankModal, setShowBankModal] = useState(false);
  const [bankForm, setBankForm] = useState({
    accountName: "",
    accountNumber: "",
    bankName: "",
    bankCode: "",
  });
  const [toast, setToast] = useState(null);
  // Fullscreen lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Active image state for each portfolio item
  const [activeImages, setActiveImages] = useState({});

  const fileInputRef = useRef(null);
  const portfolioFileInputRef = useRef(null);
  const idFileInputRef = useRef(null);

  // Portfolio form state
  const [portfolioForm, setPortfolioForm] = useState({
    title: "",
    description: "",
    completedDate: "",
  });
  const [portfolioFiles, setPortfolioFiles] = useState(null);

  // Service form state
  const [serviceForm, setServiceForm] = useState({
    categoryId: "",
    serviceId: "",
    enabled: true,
    customDescription: "",
    specialNotes: "",
  });
  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: "",
    message: "",
    itemName: "",
    onConfirm: null,
    isLoading: false,
  });
  // Store state
const {
  profile,
  myServices,
  allServices,
  allServiceCategories,
  portfolio,
  isLoading,
  isUpdating,
  isUploadingPhoto,
  isUploadingPortfolio,
  isUploadingDocument,
  isFetchingServices,
  isFetchingCategories,
  error,
  successMessage,
  fetchMyProfile,
  updateBasicInfo,
  uploadProfilePhoto,
  uploadIdDocument,
  updateWorkingHours, // 🔥 ADD THIS
  updateBankDetails, // 🔥 ADD THIS
  fetchMyServices,
  addService,
  updateService,
  removeService,
  toggleService,
  fetchMyPortfolio,
  addPortfolioItemWithImages,
  deletePortfolioItem,
  fetchServiceCategories,
  fetchAllServices,
  clearError,
  clearSuccess,
} = useArtisanProfileStore();

  /* ---------------------- INITIAL LOAD ---------------------- */
  /* ---------------------- INITIAL LOAD ---------------------- */
  useEffect(() => {
    const loadData = async () => {
      await Promise.all([
        fetchMyProfile(),
        fetchMyServices(),
        fetchMyPortfolio(),
        fetchServiceCategories(),
      ]);
    };
    loadData();
  }, []);

  // Load working hours when profile loads
  useEffect(() => {
    if (profile?.workingHours) {
      setWorkingHoursForm(profile.workingHours);
    }
    if (profile?.bankDetails) {
      setBankForm({
        accountName: profile.bankDetails.accountName || "",
        accountNumber: profile.bankDetails.accountNumber || "",
        bankName: profile.bankDetails.bankName || "",
        bankCode: profile.bankDetails.bankCode || "",
      });
    }
  }, [profile]);

  /* ---------------------- TOASTS ---------------------- */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  useEffect(() => {
    if (successMessage) {
      showToast(successMessage, "success");
      clearSuccess();
    }
  }, [successMessage, clearSuccess]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
      clearError();
    }
  }, [error, clearError]);
  /* ---------------------- KEYBOARD NAVIGATION FOR LIGHTBOX ---------------------- */
  useEffect(() => {
    if (!lightboxOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightboxImage();
      if (e.key === "ArrowLeft") prevLightboxImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, lightboxImages.length]);

  /* ---------------------- PROFILE PHOTO ---------------------- */
  const handleProfilePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast("Please upload an image", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("Image must be < 5MB", "error");
      return;
    }

    try {
      await uploadProfilePhoto(file);
    } catch (err) {
      // Error handled by store
    }
  };

  /* ---------------------- PORTFOLIO UPLOAD ---------------------- */
  const handlePortfolioFilesChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setPortfolioFiles(Array.from(files)); // Convert to array!
    }
  };

  const handlePortfolioSubmit = async () => {
    if (!portfolioForm.title || !portfolioForm.description) {
      showToast("Please fill title and description", "error");
      return;
    }

    if (!portfolioFiles || portfolioFiles.length === 0) {
      showToast("Please select at least one image", "error");
      return;
    }
    console.log("📤 Files to upload:", portfolioFiles);
    console.log("📤 Number of files:", portfolioFiles.length);
    console.log(
      "📤 File names:",
      Array.from(portfolioFiles).map((f) => f.name)
    );

    try {
      await addPortfolioItemWithImages(portfolioForm, portfolioFiles);

      // Reset form
      setPortfolioForm({ title: "", description: "", completedDate: "" });
      setPortfolioFiles(null);
      if (portfolioFileInputRef.current) {
        portfolioFileInputRef.current.value = ""; // Clear file input
      }
      setShowAddPortfolioModal(false);
    } catch (err) {
      // Error handled by store
    }
  };

  /* ---------------------- ID DOCUMENT ---------------------- */
  const handleIdDocumentUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      await uploadIdDocument(file);
    } catch (err) {
      // Error handled by store
    }
  };

  /* ---------------------- SERVICE MODAL ---------------------- */
  const openAddServiceModal = async () => {
    setEditingService(null);
    setServiceForm({
      categoryId: "",
      serviceId: "",
      enabled: true,
      customDescription: "",
      specialNotes: "",
    });
    setShowAddServiceModal(true);
  };

  const openEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      categoryId: service.category?._id || "",
      serviceId: service.serviceId || service._id,
      enabled: service.enabled,
      customDescription: service.customDescription || "",
      specialNotes: service.specialNotes || "",
    });
    setShowEditServiceModal(true);
  };

  // Load services when category changes
  useEffect(() => {
    if (serviceForm.categoryId && showAddServiceModal) {
      fetchAllServices(serviceForm.categoryId);
    }
  }, [serviceForm.categoryId, showAddServiceModal]);

  const saveService = async () => {
    try {
      if (editingService) {
        await updateService(editingService._id, {
          customDescription: serviceForm.customDescription,
          specialNotes: serviceForm.specialNotes,
        });
      } else {
        if (!serviceForm.serviceId) {
          showToast("Please select a service", "error");
          return;
        }
        await addService({
          serviceId: serviceForm.serviceId,
          enabled: serviceForm.enabled,
          customDescription: serviceForm.customDescription,
          specialNotes: serviceForm.specialNotes,
        });
      }
      setShowAddServiceModal(false);
      setShowEditServiceModal(false);
      setEditingService(null);
      setServiceForm({
        categoryId: "",
        serviceId: "",
        enabled: true,
        customDescription: "",
        specialNotes: "",
      });
    } catch (err) {
      // Error handled by store
    }
  };

  /* ---------------------- SAVE PROFILE ---------------------- */
  const handleSaveProfile = async () => {
    try {
      await updateBasicInfo({
        businessName: profile.businessName,
        bio: profile.bio,
        phone: profile.phone,
        yearsOfExperience: profile.yearsOfExperience,
        location: profile.location,
        serviceRadius: profile.serviceRadius,
      });
    } catch (err) {
      // Error handled by store
    }
  };
  /* ---------------------- SAVE WORKING HOURS ---------------------- */
  const handleSaveWorkingHours = async () => {
    try {
      await updateWorkingHours({
        workingHours: workingHoursForm,
        serviceRadius: profile.serviceRadius,
      });
    } catch (err) {
      // Error handled by store
    }
  };
  /* ---------------------- BANK DETAILS ---------------------- */
  const openBankModal = () => {
    if (profile?.bankDetails) {
      setBankForm({
        accountName: profile.bankDetails.accountName || "",
        accountNumber: profile.bankDetails.accountNumber || "",
        bankName: profile.bankDetails.bankName || "",
        bankCode: profile.bankDetails.bankCode || "",
      });
    }
    setShowBankModal(true);
  };

const handleSaveBankDetails = async () => {
  console.log("🔍 Bank Form Data:", bankForm);

  // Validation
  if (!bankForm.accountName.trim()) {
    console.log("❌ Account name missing");
    showToast("Account name is required", "error");
    return;
  }
  if (!bankForm.accountNumber.trim()) {
    console.log("❌ Account number missing");
    showToast("Account number is required", "error");
    return;
  }

  console.log("🔍 Account number:", bankForm.accountNumber);
  console.log("🔍 Test result:", /^\d{10}$/.test(bankForm.accountNumber));

  if (!/^\d{10}$/.test(bankForm.accountNumber)) {
    console.log("❌ Account number validation failed");
    showToast("Account number must be 10 digits", "error");
    return;
  }
  if (!bankForm.bankName.trim()) {
    console.log("❌ Bank name missing");
    showToast("Bank name is required", "error");
    return;
  }

  console.log("✅ All validations passed, calling API...");

  try {
    await updateBankDetails({
      accountName: bankForm.accountName,
      accountNumber: bankForm.accountNumber,
      bankName: bankForm.bankName,
      bankCode: bankForm.bankCode,
    });
    console.log("✅ Bank details saved successfully");
    setShowBankModal(false);
  } catch (err) {
    console.error("❌ Error saving bank details:", err);
    // Error handled by store
  }
};

  /* ---------------------- HELPERS ---------------------- */
  const getBadgeColor = (badge) => {
    const map = {
      top_rated: "bg-yellow-100 text-yellow-700 border-yellow-300",
      verified: "bg-blue-100 text-blue-700 border-blue-300",
      quick_response: "bg-green-100 text-green-700 border-green-300",
      new_artisan: "bg-purple-100 text-purple-700 border-purple-300",
    };
    return map[badge] || "bg-gray-100 text-gray-700 border-gray-300";
  };

  const getStatusBadge = (status) => {
    const styles = {
      verified: {
        bg: "bg-green-100",
        text: "text-green-700",
        icon: CheckCircle,
        label: "Verified",
      },
      pending: {
        bg: "bg-yellow-100",
        text: "text-yellow-700",
        icon: Clock,
        label: "Pending",
      },
      rejected: {
        bg: "bg-red-100",
        text: "text-red-700",
        icon: AlertCircle,
        label: "Rejected",
      },
    }[status] || {
      bg: "bg-gray-100",
      text: "text-gray-700",
      icon: AlertCircle,
      label: "Not Uploaded",
    };

    const Icon = styles.icon;
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-bold ${styles.bg} ${styles.text} flex items-center space-x-1`}
      >
        <Icon className="w-3 h-3" />
        <span>{styles.label}</span>
      </span>
    );
  };

  const formatResponseTime = (minutes) => {
    if (!minutes) return "N/A";
    return minutes < 60
      ? `${minutes.toFixed(1)} min`
      : `${(minutes / 60).toFixed(1)} hr`;
  };
  /* ---------------------- PORTFOLIO IMAGE FUNCTIONS ---------------------- */
  const setActiveImage = (portfolioId, imageIndex) => {
    setActiveImages((prev) => ({
      ...prev,
      [portfolioId]: imageIndex,
    }));
  };

  const openLightbox = (images, startIndex) => {
    setLightboxImages(images);
    setLightboxIndex(startIndex);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = "unset";
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex(
      (prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length
    );
  };
  const canReceiveJobs = useAuthStore(
    (state) => state.profileStatus.canReceiveJobs
  );

  // 🔥 CONSOLE LOG TO DEBUG
  const profileStatus = useAuthStore((state) => state.profileStatus);
  useEffect(() => {
    console.log("🎨 FRONTEND - ArtisanProfile Component:");
    console.log("📊 profileStatus:", profileStatus);
    console.log("✅ canReceiveJobs:", canReceiveJobs);
    console.log("📋 myServices count:", myServices.length);
  }, [profileStatus, canReceiveJobs, myServices.length]);

  // Confirmation Modal Handler
  const openConfirmModal = (config) => {
    setConfirmModal({
      isOpen: true,
      title: config.title,
      message: config.message,
      itemName: config.itemName || "",
      onConfirm: config.onConfirm,
      isLoading: false,
    });
  };

  const closeConfirmModal = () => {
    if (!confirmModal.isLoading) {
      setConfirmModal({
        isOpen: false,
        title: "",
        message: "",
        itemName: "",
        onConfirm: null,
        isLoading: false,
      });
    }
  };

  const handleConfirm = async () => {
    setConfirmModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await confirmModal.onConfirm();
      closeConfirmModal();
    } catch (error) {
      setConfirmModal((prev) => ({ ...prev, isLoading: false }));
    }
  };

  /* ---------------------- LOADING STATE ---------------------- */
  if (isLoading && !profile) {
    return <LoadingDashboard />;
  }

  if (!isLoading && !profile) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-16 h-16 mx-auto text-red-500 mb-4" />
        <p className="text-gray-600 text-lg">Failed to load profile</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-6 pb-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-20 right-4 z-[999] ${
            toast.type === "error" ? "bg-red-600" : "bg-green-600"
          } text-white px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2`}
        >
          {toast.type === "error" ? (
            <AlertCircle className="w-5 h-5" />
          ) : (
            <CheckCircle className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            My Profile
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Manage your profile, services, and verification documents
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Star}
          label="Rating"
          value={profile.averageRating?.toFixed(1) || "0.0"}
          color={COLORS.warning[500]}
        />
        <StatCard
          icon={Briefcase}
          label="Total Jobs"
          value={profile.totalJobsCompleted || 0}
          color={COLORS.primary[600]}
        />
        <StatCard
          icon={Clock}
          label="Response Time"
          value={formatResponseTime(profile.responseTime)}
          color={COLORS.success[600]}
        />
        <StatCard
          icon={Users}
          label="Total Reviews"
          value={profile.totalReviews || 0}
          color={COLORS.primary[600]}
        />
      </div>
      {/* Warning if can't receive jobs */}
      {/* Warning if can't receive jobs */}
      {profile && !canReceiveJobs && (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-2xl p-6">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-bold text-yellow-900 mb-2">
                Profile Incomplete - Can't Receive Jobs Yet
              </h3>

              {/* Show missing profile fields */}
              {profileStatus?.missingRequired?.length > 0 && (
                <div className="mb-3">
                  <p className="text-sm text-yellow-800 mb-2">
                    Missing required fields:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profileStatus.missingRequired.map((field) => (
                      <span
                        key={field}
                        className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium"
                      >
                        {field === "businessName"
                          ? "Business Name"
                          : field === "yearsOfExperience"
                          ? "Years of Experience"
                          : field === "bankDetails"
                          ? "Bank Details"
                          : field === "workingHours"
                          ? "Working Hours"
                          : field.charAt(0).toUpperCase() + field.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Show services status */}
              {myServices.length === 0 && (
                <p className="text-sm text-yellow-800 mb-3">
                  ⚠️ You also need to add at least one service
                </p>
              )}

              {/* Progress */}
              <p className="text-xs text-yellow-700 mb-3">
                Profile completion: {profileStatus?.completionPercentage || 0}%
              </p>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {profileStatus?.missingRequired?.includes("phone") ||
                profileStatus?.missingRequired?.includes("businessName") ||
                profileStatus?.missingRequired?.includes("bio") ||
                profileStatus?.missingRequired?.includes("yearsOfExperience") ||
                profileStatus?.missingRequired?.includes("location") ? (
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition"
                  >
                    Complete Profile Info
                  </button>
                ) : null}

                {profileStatus?.missingRequired?.includes("workingHours") && (
                  <button
                    onClick={() => setActiveTab("availability")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition"
                  >
                    Set Working Hours
                  </button>
                )}

                {profileStatus?.missingRequired?.includes("bankDetails") && (
                  <button
                    onClick={() => setActiveTab("verification")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition"
                  >
                    Add Bank Details
                  </button>
                )}

                {myServices.length === 0 && (
                  <button
                    onClick={() => setActiveTab("services")}
                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition"
                  >
                    Add Services
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Tabs */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-1.5 w-full sm:p-2 "
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex overflow-x-auto space-x-1.5 sm:space-x-2 scrollbar-hide snap-x snap-mandatory">
          {[
            { id: "profile", label: "Profile Info", icon: User },
            { id: "services", label: "Services", icon: DollarSign },
            { id: "availability", label: "Availability", icon: Clock },
            { id: "portfolio", label: "Portfolio", icon: ImageIcon },
            { id: "verification", label: "Verification", icon: Shield },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-xs sm:text-sm transition-all whitespace-nowrap snap-start flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==================== PROFILE TAB ==================== */}
      {activeTab === "profile" && (
        <div
          className="bg-white rounded-2xl p-6 space-y-6"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          {/* Photo */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="relative flex-shrink-0">
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-white/75 rounded-full flex items-center justify-center z-10">
                  <Loader className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              )}
              <img
                src={profile.profilePhoto || "/images/default-avatar.png"}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4"
                style={{ borderColor: COLORS.gray[200] }}
              />
              <label
                htmlFor="profile-photo"
                className="absolute bottom-0 right-0 p-2 sm:p-3 rounded-full cursor-pointer bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:scale-110 transition"
              >
                <Camera className="w-4 h-4 sm:w-5 sm:h-5" />
                <input
                  ref={fileInputRef}
                  id="profile-photo"
                  type="file"
                  accept="image/*"
                  onChange={handleProfilePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
            <div className="text-center sm:text-left">
              <p className="font-semibold">Upload a professional photo</p>
              <p className="text-sm text-gray-500">JPG, PNG • Max 5MB</p>
            </div>
          </div>

          {/* Badges */}
          {profile.badges?.length > 0 && (
            <div>
              <p className="font-semibold mb-3">Earned Badges</p>
              <div className="flex flex-wrap gap-3">
                {profile.badges.map((b) => (
                  <span
                    key={b}
                    className={`px-4 py-2 rounded-full text-sm font-bold border-2 flex items-center gap-2 ${getBadgeColor(
                      b
                    )}`}
                  >
                    <Award className="w-4 h-4" />
                    {b
                      .replace(/_/g, " ")
                      .replace(/\b\w/g, (l) => l.toUpperCase())}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div
            className="border-t pt-6"
            style={{ borderColor: COLORS.gray[200] }}
          />

          {/* Editable Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">Business Name</label>
              <input
                type="text"
                value={profile.businessName || ""}
                onChange={(e) =>
                  useArtisanProfileStore.setState({
                    profile: { ...profile, businessName: e.target.value },
                  })
                }
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                style={{ borderColor: COLORS.gray[200] }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">Phone</label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={profile.phone || ""}
                  onChange={(e) =>
                    useArtisanProfileStore.setState({
                      profile: { ...profile, phone: e.target.value },
                    })
                  }
                  className="w-full pl-12 pr-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block font-semibold mb-2">Bio</label>
            <textarea
              value={profile.bio || ""}
              onChange={(e) =>
                useArtisanProfileStore.setState({
                  profile: { ...profile, bio: e.target.value },
                })
              }
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 resize-none"
              style={{ borderColor: COLORS.gray[200] }}
            />
            <p className="text-xs text-gray-500 text-right">
              {(profile.bio || "").length}/500
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold mb-2">
                Experience (years)
              </label>
              <input
                type="number"
                value={profile.yearsOfExperience || 0}
                onChange={(e) =>
                  useArtisanProfileStore.setState({
                    profile: {
                      ...profile,
                      yearsOfExperience: parseInt(e.target.value) || 0,
                    },
                  })
                }
                className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                style={{ borderColor: COLORS.gray[200] }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-2">
                Service Radius (km)
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={profile.serviceRadius || 10}
                  onChange={(e) =>
                    useArtisanProfileStore.setState({
                      profile: {
                        ...profile,
                        serviceRadius: parseInt(e.target.value),
                      },
                    })
                  }
                  className="flex-1"
                />
                <span className="px-4 py-2 bg-blue-50 text-blue-600 font-bold rounded-lg min-w-20 text-center">
                  {profile.serviceRadius || 10} km
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={handleSaveProfile}
            disabled={isUpdating}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isUpdating ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      )}

      {/* ==================== SERVICES TAB ==================== */}
      {activeTab === "services" && (
        <div className="space-y-6">
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold">Your Services</h3>
                <p className="text-sm text-gray-600">
                  {myServices.length} service(s)
                </p>
              </div>
              <button
                onClick={openAddServiceModal}
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center gap-2 hover:shadow"
              >
                <Plus className="w-4 h-4" />
                Add Service
              </button>
            </div>

            {myServices.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No services added yet
              </div>
            ) : (
              <div className="space-y-4">
                {myServices.map((service) => (
                  <div
                    key={service._id}
                    className="border rounded-xl p-4 sm:p-5 flex flex-col md:flex-row md:items-start md:justify-between gap-3 sm:gap-4"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-semibold">{service.name}</h4>
                        <span className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                          {service.category?.name}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {service.customDescription ||
                          service.description ||
                          "No description"}
                      </p>
                      {service.specialNotes && (
                        <p className="text-xs italic text-gray-500 mt-2">
                          Note: {service.specialNotes}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                      <button
                        onClick={() =>
                          toggleService(service._id, !service.enabled)
                        }
                        disabled={isUpdating}
                        className={`px-4 py-2 rounded-lg text-xs font-medium ${
                          service.enabled
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {service.enabled ? "Enabled" : "Disabled"}
                      </button>
                      <button
                        onClick={() => openEditService(service)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={() =>
                          openConfirmModal({
                            title: "Delete Service",
                            message:
                              "This will permanently remove this service from your profile. Customers will no longer be able to book this service.",
                            itemName: service.name,
                            onConfirm: () => removeService(service._id),
                          })
                        }
                        disabled={isUpdating}
                        className="p-2 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {/* ==================== AVAILABILITY TAB ==================== */}
      {activeTab === "availability" && (
        <div
          className="bg-white rounded-2xl p-6 space-y-6"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <div>
            <h3 className="text-lg font-bold mb-2">Working Hours</h3>
            <p className="text-sm text-gray-600">
              Set your availability schedule for each day
            </p>
          </div>

          <div className="space-y-3">
            {Object.entries(workingHoursForm).map(([day, schedule]) => (
              <div
                key={day}
                className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl"
              >
                {/* Day checkbox */}
                <div className="flex items-center space-x-3 sm:w-40">
                  <input
                    type="checkbox"
                    checked={schedule.isAvailable}
                    onChange={(e) => {
                      setWorkingHoursForm({
                        ...workingHoursForm,
                        [day]: {
                          ...schedule,
                          isAvailable: e.target.checked,
                        },
                      });
                    }}
                    className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="font-semibold text-gray-900 capitalize">
                    {day}
                  </span>
                </div>

                {/* Time inputs */}
                {schedule.isAvailable ? (
                  <div className="flex items-center space-x-2 flex-1">
                    <input
                      type="time"
                      value={schedule.start}
                      onChange={(e) => {
                        setWorkingHoursForm({
                          ...workingHoursForm,
                          [day]: { ...schedule, start: e.target.value },
                        });
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                    <span className="text-gray-500 font-medium">to</span>
                    <input
                      type="time"
                      value={schedule.end}
                      onChange={(e) => {
                        setWorkingHoursForm({
                          ...workingHoursForm,
                          [day]: { ...schedule, end: e.target.value },
                        });
                      }}
                      className="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm sm:flex-1">
                    Closed
                  </span>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveWorkingHours}
            disabled={isUpdating}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isUpdating ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            <span>{isUpdating ? "Saving..." : "Save Working Hours"}</span>
          </button>
        </div>
      )}

      {/* ==================== PORTFOLIO TAB ==================== */}
      {activeTab === "portfolio" && (
        <div
          className="bg-white rounded-2xl p-6"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold">Portfolio Showcase</h3>
              <p className="text-sm text-gray-600">
                {portfolio.length} item(s)
              </p>
            </div>
            <button
              onClick={() => setShowAddPortfolioModal(true)}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg flex items-center gap-2 hover:shadow"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </div>

          {portfolio.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No portfolio items yet
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {portfolio.map((item) => {
                const activeIndex = activeImages[item._id] || 0;
                const mainImage = item.images?.[activeIndex];

                return (
                  <div
                    key={item._id}
                    className="rounded-xl overflow-hidden border bg-white"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    {/* Main Image */}
                    <div className="relative">
                      <img
                        src={
                          mainImage?.url || "https://via.placeholder.com/400"
                        }
                        alt={item.title}
                        className="w-full h-56 object-cover cursor-zoom-in hover:opacity-95 transition"
                        onClick={() =>
                          openLightbox(item.images || [], activeIndex)
                        }
                      />

                      {/* Image Counter Badge */}
                      {item.images?.length > 1 && (
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {activeIndex + 1} / {item.images.length}
                        </div>
                      )}

                      {/* Delete Button */}
                      <button
                        onClick={() =>
                          openConfirmModal({
                            title: "Delete Portfolio Item",
                            message:
                              "This will permanently remove this item from your portfolio. All images will be deleted.",
                            itemName: item.title,
                            onConfirm: () => deletePortfolioItem(item._id),
                          })
                        }
                        className="absolute top-3 left-3 p-2 bg-white rounded-full hover:bg-red-50 transition shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </button>
                    </div>

                    {/* Thumbnails */}
                    {item.images?.length > 1 && (
                      <div
                        className="p-3 bg-gray-50 border-t"
                        style={{ borderColor: COLORS.gray[200] }}
                      >
                        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                          {item.images.map((img, idx) => (
                            <img
                              key={idx}
                              src={img.url}
                              alt={`${item.title} ${idx + 1}`}
                              className={`w-16 h-16 object-cover rounded-lg cursor-pointer flex-shrink-0 transition ${
                                idx === activeIndex
                                  ? "ring-4 ring-blue-500 scale-105"
                                  : "ring-2 ring-gray-200 hover:ring-blue-300 hover:scale-105"
                              }`}
                              onClick={() => setActiveImage(item._id, idx)}
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-lg mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {item.description}
                      </p>
                      {item.completedDate && (
                        <p className="text-xs text-gray-500 mt-2">
                          Completed:{" "}
                          {new Date(item.completedDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ==================== VERIFICATION TAB ==================== */}
      {activeTab === "verification" && (
        <div className="space-y-6">
          {/* Government ID */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-blue-600" />
                <div>
                  <h3 className="font-semibold">Government ID</h3>
                  <p className="text-sm text-gray-600">Verify your identity</p>
                </div>
              </div>
              {getStatusBadge(profile.verification?.status || "not_uploaded")}
            </div>
            <label className="text-sm font-medium text-blue-600 hover:underline cursor-pointer">
              {isUploadingDocument
                ? "Uploading..."
                : profile.verification?.idDocument
                ? "Replace Document"
                : "Upload ID"}
              <input
                ref={idFileInputRef}
                type="file"
                accept=".pdf,.jpg,.png"
                onChange={handleIdDocumentUpload}
                className="hidden"
                disabled={isUploadingDocument}
              />
            </label>
          </div>
          {/* Bank Details */}
          {/* Bank Details */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <CreditCard className="w-6 h-6 text-green-600" />
                <div>
                  <h3 className="font-semibold">Bank Account</h3>
                  <p className="text-sm text-gray-600">
                    For receiving payments
                  </p>
                </div>
              </div>
              {profile.bankDetails?.accountNumber
                ? getStatusBadge("verified")
                : getStatusBadge("pending")}
            </div>

            {profile.bankDetails?.accountNumber && (
              <div className="space-y-3 mb-4 text-sm">
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Account Name:</span>
                  <span className="font-medium">
                    {profile.bankDetails.accountName}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Account Number:</span>
                  <span className="font-medium">
                    {profile.bankDetails.accountNumber}
                  </span>
                </div>
                <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600">Bank:</span>
                  <span className="font-medium">
                    {profile.bankDetails.bankName}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={openBankModal}
              className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
            >
              {profile.bankDetails?.accountNumber
                ? "Update Bank Details"
                : "Add Bank Details"}
            </button>
          </div>
        </div>
      )}

      {/* ==================== SERVICE MODAL ==================== */}
      {(showAddServiceModal || showEditServiceModal) && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center  z-[130] ">
              <h3 className="text-xl font-bold">
                {editingService ? "Edit" : "Add"} Service
              </h3>
              <button
                onClick={() => {
                  setShowAddServiceModal(false);
                  setShowEditServiceModal(false);
                  setEditingService(null);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              {!editingService && (
                <>
                  <div>
                    <label className="block font-semibold mb-2">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        value={serviceForm.categoryId}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            categoryId: e.target.value,
                            serviceId: "",
                          })
                        }
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 appearance-none"
                        style={{ borderColor: COLORS.gray[200] }}
                        disabled={isFetchingCategories}
                      >
                        <option value="">Select a category</option>
                        {allServiceCategories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">
                      Service *
                    </label>
                    <div className="relative">
                      <select
                        value={serviceForm.serviceId}
                        onChange={(e) =>
                          setServiceForm({
                            ...serviceForm,
                            serviceId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 appearance-none"
                        style={{ borderColor: COLORS.gray[200] }}
                        disabled={!serviceForm.categoryId || isFetchingServices}
                      >
                        <option value="">Select a service</option>
                        {allServices.map((service) => (
                          <option key={service._id} value={service._id}>
                            {service.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                    </div>
                    {!serviceForm.categoryId && (
                      <p className="text-xs text-gray-500 mt-1">
                        Select a category first
                      </p>
                    )}
                  </div>
                </>
              )}

              <div>
                <label className="block font-semibold mb-2">
                  Custom Description
                </label>
                <textarea
                  value={serviceForm.customDescription}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      customDescription: e.target.value,
                    })
                  }
                  rows={3}
                  maxLength={500}
                  placeholder="Customize how you describe this service to customers"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 resize-none"
                  style={{ borderColor: COLORS.gray[200] }}
                />
                <p className="text-xs text-gray-500 text-right">
                  {serviceForm.customDescription.length}/500
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Special Notes
                </label>
                <textarea
                  value={serviceForm.specialNotes}
                  onChange={(e) =>
                    setServiceForm({
                      ...serviceForm,
                      specialNotes: e.target.value,
                    })
                  }
                  rows={2}
                  maxLength={200}
                  placeholder="Any special requirements or notes"
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 resize-none"
                  style={{ borderColor: COLORS.gray[200] }}
                />
                <p className="text-xs text-gray-500 text-right">
                  {serviceForm.specialNotes.length}/200
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddServiceModal(false);
                    setShowEditServiceModal(false);
                  }}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={saveService}
                  disabled={
                    isUpdating || (!editingService && !serviceForm.serviceId)
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== PORTFOLIO MODAL ==================== */}
      {showAddPortfolioModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
              <h3 className="text-xl font-bold">Add Portfolio Item</h3>
              <button
                onClick={() => {
                  setShowAddPortfolioModal(false);
                  setPortfolioForm({
                    title: "",
                    description: "",
                    completedDate: "",
                  });
                  setPortfolioFiles(null);
                }}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-2">Title *</label>
                <input
                  type="text"
                  placeholder="e.g., Modern Kitchen Renovation"
                  value={portfolioForm.title}
                  onChange={(e) =>
                    setPortfolioForm({
                      ...portfolioForm,
                      title: e.target.value,
                    })
                  }
                  maxLength={100}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                  disabled={isUploadingPortfolio}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the project, challenges, and results"
                  value={portfolioForm.description}
                  onChange={(e) =>
                    setPortfolioForm({
                      ...portfolioForm,
                      description: e.target.value,
                    })
                  }
                  rows={4}
                  maxLength={500}
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 resize-none"
                  style={{ borderColor: COLORS.gray[200] }}
                  disabled={isUploadingPortfolio}
                />
                <p className="text-xs text-gray-500 text-right">
                  {portfolioForm.description.length}/500
                </p>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Completion Date
                </label>
                <input
                  type="date"
                  value={portfolioForm.completedDate}
                  onChange={(e) =>
                    setPortfolioForm({
                      ...portfolioForm,
                      completedDate: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                  disabled={isUploadingPortfolio}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">Images *</label>
                <input
                  ref={portfolioFileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePortfolioFilesChange}
                  className="hidden"
                  disabled={isUploadingPortfolio}
                />

                {/* Image Preview Area */}
                {portfolioFiles && portfolioFiles.length > 0 ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from(portfolioFiles).map((file, index) => (
                        <div
                          key={index}
                          className="relative border-2 rounded-lg overflow-hidden"
                          style={{ borderColor: COLORS.gray[200] }}
                        >
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white text-xs p-2 truncate">
                            {file.name}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => portfolioFileInputRef.current?.click()}
                        className="flex-1 py-2 border-2 border-blue-500 text-blue-600 rounded-lg font-medium hover:bg-blue-50"
                        disabled={isUploadingPortfolio}
                      >
                        Change Images
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPortfolioFiles(null);
                          if (portfolioFileInputRef.current) {
                            portfolioFileInputRef.current.value = "";
                          }
                        }}
                        className="px-4 py-2 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100"
                        disabled={isUploadingPortfolio}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() =>
                      !isUploadingPortfolio &&
                      portfolioFileInputRef.current?.click()
                    }
                    className="border-2 border-dashed rounded-xl p-10 text-center cursor-pointer hover:border-blue-500 transition"
                    style={{ borderColor: COLORS.gray[300] }}
                  >
                    {isUploadingPortfolio ? (
                      <Loader className="w-12 h-12 mx-auto animate-spin text-blue-600" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="font-medium">Click to upload images</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Multiple images • Max 10MB each
                        </p>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowAddPortfolioModal(false);
                    setPortfolioForm({
                      title: "",
                      description: "",
                      completedDate: "",
                    });
                    setPortfolioFiles(null);
                    if (portfolioFileInputRef.current)
                      portfolioFileInputRef.current.value = "";
                  }}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold"
                  disabled={isUploadingPortfolio}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePortfolioSubmit}
                  disabled={
                    isUploadingPortfolio ||
                    !portfolioForm.title ||
                    !portfolioForm.description ||
                    !portfolioFiles
                  }
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUploadingPortfolio ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>
                        Upload{" "}
                        {portfolioFiles ? `(${portfolioFiles.length})` : ""}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================== BANK DETAILS MODAL ==================== */}
      {showBankModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-[130]">
              <h3 className="text-xl font-bold">
                {profile.bankDetails?.accountNumber ? "Edit" : "Add"} Bank
                Details
              </h3>
              <button
                onClick={() => setShowBankModal(false)}
                disabled={isUpdating}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block font-semibold mb-2">
                  Account Name *
                </label>
                <input
                  type="text"
                  value={bankForm.accountName}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, accountName: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="John Doe"
                  disabled={isUpdating}
                />
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Account Number *
                </label>
                <input
                  type="text"
                  maxLength="10"
                  value={bankForm.accountNumber}
                  onChange={(e) =>
                    setBankForm({
                      ...bankForm,
                      accountNumber: e.target.value.replace(/\D/g, ""),
                    })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="0123456789"
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-500 mt-1">Must be 10 digits</p>
              </div>

              <div>
                <label className="block font-semibold mb-2">Bank Name *</label>
                <div className="relative">
                  <select
                    value={bankForm.bankName}
                    onChange={(e) =>
                      setBankForm({ ...bankForm, bankName: e.target.value })
                    }
                    className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500 appearance-none"
                    style={{ borderColor: COLORS.gray[200] }}
                    disabled={isUpdating}
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
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-2">
                  Bank Code (Optional)
                </label>
                <input
                  type="text"
                  value={bankForm.bankCode}
                  onChange={(e) =>
                    setBankForm({ ...bankForm, bankCode: e.target.value })
                  }
                  className="w-full px-4 py-3 border-2 rounded-xl focus:border-blue-500"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="e.g., 044"
                  disabled={isUpdating}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowBankModal(false)}
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-gray-100 rounded-xl font-semibold disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveBankDetails}
                  disabled={isUpdating}
                  className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isUpdating ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ==================== LIGHTBOX MODAL ==================== */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-[9999] flex items-center justify-center"
          onClick={closeLightbox}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition z-10"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm font-medium">
            {lightboxIndex + 1} / {lightboxImages.length}
          </div>

          {/* Previous Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevLightboxImage();
              }}
              className="absolute left-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              <ChevronDown className="w-6 h-6 -rotate-90" />
            </button>
          )}

          {/* Main Image */}
          <img
            src={lightboxImages[lightboxIndex]?.url}
            alt="Fullscreen"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Next Button */}
          {lightboxImages.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextLightboxImage();
              }}
              className="absolute right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition"
            >
              <ChevronDown className="w-6 h-6 rotate-90" />
            </button>
          )}

          {/* Keyboard Hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/60 text-sm">
            Press ESC to close{" "}
            {lightboxImages.length > 1 && "• Use arrow keys to navigate"}
          </div>
        </div>
      )}
      {/* ==================== CONFIRMATION MODAL ==================== */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={confirmModal.isLoading ? null : closeConfirmModal}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full">
            {/* Header */}
            <div className="flex items-start justify-between p-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-red-100">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">
                  {confirmModal.title}
                </h3>
              </div>
              {!confirmModal.isLoading && (
                <button
                  onClick={closeConfirmModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="px-6 pb-6">
              <p className="text-gray-600 mb-4">{confirmModal.message}</p>

              {confirmModal.itemName && (
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-gray-500 mb-1">
                    Item to be deleted:
                  </p>
                  <p className="font-semibold text-gray-900 break-words">
                    {confirmModal.itemName}
                  </p>
                </div>
              )}

              <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-red-800">
                  <strong>Warning:</strong> This action cannot be undone.
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={closeConfirmModal}
                  disabled={confirmModal.isLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={confirmModal.isLoading}
                  className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {confirmModal.isLoading ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    "Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
      
      
