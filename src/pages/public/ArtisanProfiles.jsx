import React, { useState, useEffect } from "react";
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Clock,
  Award,
  Shield,
  Zap,
  Calendar,
  MessageCircle,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Check,
  ThumbsUp,
  Flag,
  Briefcase,
  TrendingUp,
  Users,
  X,
  Upload,
  Image as ImageIcon,
  Loader2,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/common/Header";
import { useArtisanStore } from "../../stores/artisanStore";

export default function ArtisanProfiles() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Zustand store
  const {
    selectedArtisan,
    reviews,
    reviewStats,
    isLoading,
    isLoadingReviews,
    error,
    fetchArtisanById,
    fetchArtisanReviews,
    fetchReviewStats,
    isSaved,
    toggleSaveArtisan,
  } = useArtisanStore();

  const [selectedTab, setSelectedTab] = useState("about");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    service: "",
    date: "",
    time: "",
    description: "",
    photos: [],
  });

  // Fetch artisan data on mount
  useEffect(() => {
    if (id) {
      fetchArtisanById(id);
      fetchArtisanReviews(id);
      fetchReviewStats(id);
    }
  }, [id, fetchArtisanById, fetchArtisanReviews, fetchReviewStats]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Helper function to format distance
  const formatDistance = (distance) => {
    if (!distance) return null;
    const km = (distance / 1000).toFixed(1);
    return `${km} km`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000); // seconds

    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} days ago`;
    if (diff < 2592000) return `${Math.floor(diff / 604800)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Helper function to format price
  // Helper function to format price
  const formatPrice = (service) => {
    if (!service) return "Contact for price";

    // ✅ FIXED: Service is now flat, not nested
    const priceConfig = service.customPricingConfig || service.pricingConfig;

    if (priceConfig?.basePrice) {
      return `₦${priceConfig.basePrice.toLocaleString()}`;
    }

    if (priceConfig?.inspectionFee) {
      return `₦${priceConfig.inspectionFee.toLocaleString()} (inspection)`;
    }

    if (priceConfig?.estimatedRange) {
      return `₦${priceConfig.estimatedRange.min.toLocaleString()} - ₦${priceConfig.estimatedRange.max.toLocaleString()}`;
    }

    return "Contact for price";
  };
  {
    selectedTab === "services" && (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          Services & Pricing
        </h3>
        {selectedArtisan.services?.length > 0 ? (
          selectedArtisan.services.map((service) => (
            <div
              key={service._id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
            >
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900 mb-1">
                  {service.name}
                </h4>
                {service.pricingConfig?.message && (
                  <p className="text-sm text-gray-600">
                    {service.pricingConfig.message}
                  </p>
                )}
              </div>
              <div className="text-left sm:text-right">
                <p className="text-lg font-bold text-gray-900">
                  {formatPrice(service)}
                </p>
                <button
                  onClick={() => {
                    setBookingForm({
                      ...bookingForm,
                      service: service._id,
                    });
                    setShowBookingModal(true);
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                >
                  Book Now →
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center py-8">
            No services listed yet
          </p>
        )}
      </div>
    );
  }

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "top_rated":
        return <Award className="w-4 h-4" />;
      case "verified":
        return <Shield className="w-4 h-4" />;
      case "quick_response":
        return <Zap className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "top_rated":
        return "bg-yellow-100 text-yellow-700";
      case "verified":
        return "bg-blue-100 text-blue-700";
      case "quick_response":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBadgeLabel = (badge) => {
    switch (badge) {
      case "top_rated":
        return "Top Rated";
      case "verified":
        return "Verified";
      case "quick_response":
        return "Quick Response";
      case "new_artisan":
        return "New Artisan";
      default:
        return badge;
    }
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    console.log("Booking submitted:", bookingForm);
    navigate("/booking", {
      state: { artisan: selectedArtisan, bookingForm },
    });
  };

  const nextImage = () => {
    if (selectedArtisan?.portfolio?.length) {
      setCurrentImageIndex((prev) =>
        prev === selectedArtisan.portfolio.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (selectedArtisan?.portfolio?.length) {
      setCurrentImageIndex((prev) =>
        prev === 0 ? selectedArtisan.portfolio.length - 1 : prev - 1
      );
    }
  };

  // Get current day for highlighting
  const getCurrentDay = () => {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ];
    return days[new Date().getDay()];
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading artisan profile...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !selectedArtisan) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-[calc(100vh-80px)]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error || "Artisan not found"}</p>
            <button
              onClick={() => navigate("/search")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Combine first and last name
  const artisanName = `${selectedArtisan.firstName || ""} ${
    selectedArtisan.lastName || ""
  }`.trim();

  // Format location
  const location = [
    selectedArtisan.location?.city,
    selectedArtisan.location?.state,
  ]
    .filter(Boolean)
    .join(", ");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Back Button */}
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4 inline-flex"
            >
              <ChevronLeft className="w-5 h-5" />
              <span className="font-medium">Back to Search</span>
            </button>

            {/* Profile Header Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Profile Photo */}
                  <img
                    src={
                      selectedArtisan.profilePhoto ||
                      "/images/default-avatar.jpg"
                    }
                    alt={artisanName}
                    className="w-32 h-32 rounded-xl object-cover"
                  />

                  {/* Profile Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                          {artisanName}
                        </h1>
                        {selectedArtisan.businessName && (
                          <p className="text-lg text-gray-600 font-medium mb-1">
                            {selectedArtisan.businessName}
                          </p>
                        )}
                        <p className="text-lg text-gray-600">
                          {selectedArtisan.serviceCategories?.[0]?.name ||
                            "Service Professional"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleSaveArtisan(selectedArtisan._id)}
                          className={`p-2 rounded-lg transition-all ${
                            isSaved(selectedArtisan._id)
                              ? "bg-red-500 text-white"
                              : "bg-gray-100 text-gray-600 hover:bg-red-50"
                          }`}
                        >
                          <Heart
                            className={`w-5 h-5 ${
                              isSaved(selectedArtisan._id) ? "fill-current" : ""
                            }`}
                          />
                        </button>
                        <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
                          <Share2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i <
                                Math.floor(selectedArtisan.averageRating || 0)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          {selectedArtisan.averageRating?.toFixed(1) || "0.0"}
                        </span>
                        <span className="text-gray-600">
                          ({selectedArtisan.totalReviews || 0} reviews)
                        </span>
                      </div>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedArtisan.badges?.map((badge) => (
                        <span
                          key={badge}
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getBadgeColor(
                            badge
                          )}`}
                        >
                          {getBadgeIcon(badge)}
                          <span>{getBadgeLabel(badge)}</span>
                        </span>
                      ))}
                      {selectedArtisan.isAvailableNow && (
                        <span className="px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 bg-green-100 text-green-700">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span>Available Now</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      <div className="text-center sm:text-left">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedArtisan.totalJobsCompleted || 0}
                        </p>
                        <p className="text-sm text-gray-600">Jobs Completed</p>
                      </div>
                      <div className="text-center sm:text-left">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedArtisan.yearsOfExperience || 0}
                        </p>
                        <p className="text-sm text-gray-600">
                          Years Experience
                        </p>
                      </div>
                      <div className="text-center sm:text-left col-span-2 sm:col-span-1">
                        <p className="text-2xl font-bold text-gray-900">
                          {selectedArtisan.responseTime
                            ? `${selectedArtisan.responseTime} min`
                            : "N/A"}
                        </p>
                        <p className="text-sm text-gray-600">Response Time</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6 overflow-x-auto">
                  {["about", "services", "portfolio", "reviews"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSelectedTab(tab)}
                      className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap ${
                        selectedTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </nav>
              </div>

              <div className="p-6">
                {/* About Tab */}
                {selectedTab === "about" && (
                  <div className="space-y-6">
                    {/* Bio */}
                    {selectedArtisan.bio && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          About Me
                        </h3>
                        <p className="text-gray-700 leading-relaxed">
                          {selectedArtisan.bio}
                        </p>
                      </div>
                    )}

                    {/* Location */}
                    {location && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Location & Coverage
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          <span>{location}</span>
                          {selectedArtisan.distance && (
                            <>
                              <span className="text-gray-500">•</span>
                              <span className="text-gray-600">
                                {formatDistance(selectedArtisan.distance)} from
                                you
                              </span>
                            </>
                          )}
                        </div>
                        {selectedArtisan.serviceRadius && (
                          <p className="text-sm text-gray-600 mt-2">
                            Service radius: {selectedArtisan.serviceRadius} km
                          </p>
                        )}
                      </div>
                    )}

                    {/* Verification Status */}
                    {selectedArtisan.verification?.status === "verified" && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-3">
                          Verification
                        </h3>
                        <div className="flex items-center space-x-2 text-gray-700">
                          <Check className="w-5 h-5 text-green-600" />
                          <span>Identity Verified</span>
                        </div>
                      </div>
                    )}

                    {/* Working Hours */}
                    {selectedArtisan.workingHours && (
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-4">
                          Working Hours
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {Object.entries(selectedArtisan.workingHours).map(
                            ([day, hours]) => {
                              const isToday =
                                day.toLowerCase() === getCurrentDay();
                              const isAvailable = hours.isAvailable;

                              return (
                                <div
                                  key={day}
                                  className={`relative rounded-lg border-2 p-4 transition-all ${
                                    isToday
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-white hover:border-gray-300"
                                  }`}
                                >
                                  {isToday && (
                                    <div className="absolute top-2 right-2">
                                      <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                                        Today
                                      </span>
                                    </div>
                                  )}
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <div className="flex items-center space-x-2 mb-2">
                                        <Clock
                                          className={`w-4 h-4 ${
                                            isAvailable
                                              ? "text-blue-600"
                                              : "text-gray-400"
                                          }`}
                                        />
                                        <h4 className="font-semibold text-gray-900 capitalize">
                                          {day}
                                        </h4>
                                      </div>
                                      <p
                                        className={`text-sm ${
                                          isAvailable
                                            ? "text-gray-700 font-medium"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {isAvailable
                                          ? `${hours.start} - ${hours.end}`
                                          : "Closed"}
                                      </p>
                                    </div>
                                    {isAvailable && (
                                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                                    )}
                                  </div>
                                </div>
                              );
                            }
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Services Tab */}
                {selectedTab === "services" && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Services & Pricing
                    </h3>
                    {selectedArtisan.services?.length > 0 ? (
                      selectedArtisan.services.map((service) => (
                        <div
                          key={service._id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors gap-3"
                        >
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {service.name}
                            </h4>
                            {service.pricingConfig?.message && (
                              <p className="text-sm text-gray-600">
                                {service.pricingConfig.message}
                              </p>
                            )}
                          </div>
                          <div className="text-left sm:text-right">
                            <p className="text-lg font-bold text-gray-900">
                              {formatPrice(service)}
                            </p>
                            <button
                              onClick={() => {
                                setBookingForm({
                                  ...bookingForm,
                                  service: service._id,
                                });
                                setShowBookingModal(true);
                              }}
                              className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-1"
                            >
                              Book Now →
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No services listed yet
                      </p>
                    )}
                  </div>
                )}

                {/* Portfolio Tab */}
                {selectedTab === "portfolio" && (
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-4">
                      Recent Work
                    </h3>
                    {selectedArtisan.portfolio?.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {selectedArtisan.portfolio.map((item, index) => (
                          <div
                            key={item._id || index}
                            className="relative aspect-video rounded-lg overflow-hidden cursor-pointer group"
                            onClick={() => {
                              setCurrentImageIndex(index);
                              setShowImageModal(true);
                            }}
                          >
                            <img
                              src={
                                item.images?.[0]?.url ||
                                item.images?.[0] ||
                                "/images/placeholder.jpg"
                              }
                              alt={item.title || `Work ${index + 1}`}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <ImageIcon className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No portfolio items yet
                      </p>
                    )}
                  </div>
                )}

                {/* Reviews Tab */}
                {selectedTab === "reviews" && (
                  <div className="space-y-6">
                    {/* Rating Summary */}
                    {reviewStats && (
                      <div className="bg-gray-50 rounded-lg p-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
                          <div>
                            <p className="text-4xl font-bold text-gray-900 mb-1">
                              {reviewStats.averageRating?.toFixed(1) || "0.0"}
                            </p>
                            <div className="flex items-center space-x-1 mb-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i <
                                    Math.floor(reviewStats.averageRating || 0)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <p className="text-sm text-gray-600">
                              Based on {reviewStats.totalReviews || 0} reviews
                            </p>
                          </div>
                          {reviewStats.ratingDistribution && (
                            <div className="space-y-2 w-full sm:w-auto">
                              {[5, 4, 3, 2, 1].map((star) => (
                                <div
                                  key={star}
                                  className="flex items-center space-x-2"
                                >
                                  <span className="text-sm text-gray-600 w-8">
                                    {star}★
                                  </span>
                                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-yellow-400"
                                      style={{
                                        width: `${
                                          reviewStats.ratingDistribution[
                                            star
                                          ] || 0
                                        }%`,
                                      }}
                                    ></div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Individual Reviews */}
                    {isLoadingReviews ? (
                      <div className="text-center py-8">
                        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto" />
                      </div>
                    ) : reviews?.length > 0 ? (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div
                            key={review._id}
                            className="border border-gray-200 rounded-lg p-5"
                          >
                            <div className="flex items-start justify-between mb-3 flex-wrap gap-2">
                              <div className="flex items-center space-x-3">
                                <img
                                  src={
                                    review.reviewer?.profilePhoto ||
                                    "/images/default-avatar.jpg"
                                  }
                                  alt={`${
                                    review.reviewer?.firstName || "User"
                                  }`}
                                  className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
                                />
                                <div>
                                  <p className="font-semibold text-gray-900">
                                    {`${review.reviewer?.firstName || ""} ${
                                      review.reviewer?.lastName || ""
                                    }`.trim() || "Anonymous"}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(review.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1">
                                {[...Array(review.rating)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-gray-700 mb-3">
                              {review.comment}
                            </p>
                            <div className="flex items-center space-x-4">
                              <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-blue-600">
                                <ThumbsUp className="w-4 h-4" />
                                <span>
                                  Helpful ({review.helpfulCount || 0})
                                </span>
                              </button>
                              <button className="flex items-center space-x-1 text-sm text-gray-600 hover:text-red-600">
                                <Flag className="w-4 h-4" />
                                <span>Report</span>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600 text-center py-8">
                        No reviews yet
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Booking Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">
                  Book This Artisan
                </h3>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Response Time</p>
                      <p className="font-semibold text-gray-900">
                        {selectedArtisan.responseTime
                          ? `${selectedArtisan.responseTime} min`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <Briefcase className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Jobs Completed</p>
                      <p className="font-semibold text-gray-900">
                        {selectedArtisan.totalJobsCompleted || 0}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 text-gray-700">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Distance</p>
                      <p className="font-semibold text-gray-900">
                        {selectedArtisan.distance
                          ? `${formatDistance(selectedArtisan.distance)} away`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    navigate("/booking", {
                      state: {
                        artisan: selectedArtisan,
                        selectedService: null,
                      },
                    })
                  }
                  className="w-full py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all mb-3"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  Book Now
                </button>

                <button className="w-full py-3 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2">
                  <MessageCircle className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </div>

              {/* Contact Card */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Contact Information
                </h3>
                <div className="space-y-3">
                  {selectedArtisan.phone && (
                    <a
                      href={`tel:${selectedArtisan.phone}`}
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Phone className="w-5 h-5" />
                      <span>{selectedArtisan.phone}</span>
                    </a>
                  )}
                  {selectedArtisan.email && (
                    <a
                      href={`mailto:${selectedArtisan.email}`}
                      className="flex items-center space-x-3 text-gray-700 hover:text-blue-600 transition-colors"
                    >
                      <Mail className="w-5 h-5" />
                      <span>{selectedArtisan.email}</span>
                    </a>
                  )}
                </div>
              </div>

              {/* Trust & Safety */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3">
                  Trust & Safety
                </h3>
                <div className="space-y-2 text-sm text-gray-700">
                  {selectedArtisan.verification?.status === "verified" && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Identity Verified</span>
                    </div>
                  )}
                  {selectedArtisan.verification?.backgroundCheck && (
                    <div className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>Background Checked</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Insurance Covered</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="w-4 h-4 text-green-600" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">
                Book {artisanName}
              </h2>
              <button
                onClick={() => setShowBookingModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleBookingSubmit} className="p-6 space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Select Service *
                </label>
                <select
                  required
                  value={bookingForm.service}
                  onChange={(e) =>
                    setBookingForm({ ...bookingForm, service: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Choose a service...</option>
                  {selectedArtisan.services?.map((service) => (
                    <option key={service._id} value={service._id}>
                      {service.name} - {formatPrice(service)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Date *
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="date"
                      required
                      value={bookingForm.date}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, date: e.target.value })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Preferred Time *
                  </label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="time"
                      required
                      value={bookingForm.time}
                      onChange={(e) =>
                        setBookingForm({ ...bookingForm, time: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Problem Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Describe Your Problem *
                </label>
                <textarea
                  required
                  value={bookingForm.description}
                  onChange={(e) =>
                    setBookingForm({
                      ...bookingForm,
                      description: e.target.value,
                    })
                  }
                  rows="4"
                  placeholder="Please provide details about the service you need..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                ></textarea>
                <p className="text-xs text-gray-500 mt-1">
                  Be as detailed as possible to help the artisan prepare
                </p>
              </div>

              {/* Photo Upload */}
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                  Upload Photos (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500">
                    PNG, JPG up to 10MB (Max 5 photos)
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      console.log("Files uploaded:", e.target.files);
                    }}
                  />
                </div>
              </div>

              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Booking Summary
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Artisan:</span>
                    <span className="font-medium text-gray-900">
                      {artisanName}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="font-medium text-gray-900">
                      {bookingForm.service
                        ? selectedArtisan.services?.find(
                            (s) => s._id === bookingForm.service
                          )?.name || "Selected"
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-medium text-gray-900">
                      {bookingForm.date && bookingForm.time
                        ? `${bookingForm.date} at ${bookingForm.time}`
                        : "Not selected"}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-600">Response Time:</span>
                    <span className="font-medium text-green-600">
                      Within{" "}
                      {selectedArtisan.responseTime
                        ? `${selectedArtisan.responseTime} min`
                        : "24 hours"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <input
                  type="checkbox"
                  required
                  className="w-4 h-4 mt-1 text-blue-600 rounded"
                />
                <label className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Cancellation Policy
                  </a>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Gallery Modal */}
      {showImageModal && selectedArtisan.portfolio?.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button
            onClick={() => setShowImageModal(false)}
            className="absolute top-4 right-4 p-2 bg-gray-300 bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>

          <button
            onClick={prevImage}
            className="absolute left-4 p-3 bg-gray-300 bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-white" />
          </button>

          <div className="max-w-4xl w-full mt-6">
            <img
              src={
                selectedArtisan.portfolio[currentImageIndex]?.images?.[0]
                  ?.url ||
                selectedArtisan.portfolio[currentImageIndex]?.images?.[0] ||
                "/images/placeholder.jpg"
              }
              alt={
                selectedArtisan.portfolio[currentImageIndex]?.title ||
                `Work ${currentImageIndex + 1}`
              }
              className="w-full h-auto rounded-lg"
            />
            {selectedArtisan.portfolio[currentImageIndex]?.title && (
              <p className="text-white text-center mt-2">
                {selectedArtisan.portfolio[currentImageIndex].title}
              </p>
            )}
            <p className="text-white text-center mt-2">
              {currentImageIndex + 1} / {selectedArtisan.portfolio.length}
            </p>
          </div>

          <button
            onClick={nextImage}
            className="absolute right-4 p-3 bg-gray-300 bg-opacity-20 hover:bg-opacity-30 rounded-full transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
