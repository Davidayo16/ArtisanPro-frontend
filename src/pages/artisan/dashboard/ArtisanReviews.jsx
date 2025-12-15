import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Star,
  MessageSquare,
  Reply,
  AlertTriangle,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  CheckCircle,
  Clock,
  Eye,
  Send,
  ThumbsUp,
  Award,
  Loader2,
} from "lucide-react";
import { useReviewStore } from "../../../stores/reviewStore";
import { format } from "date-fns";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    gradient: "linear-gradient(135deg, #224e8c 0%, #2a5ca8 100%)",
  },
  success: { 50: "#f0fdf4", 500: "#22c55e", 600: "#16a34a" },
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
const StatCard = ({ icon: Icon, label, value, change, trend, color }) => (
  <div
    className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 group cursor-pointer hover:shadow-lg"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div
        className="p-2 sm:p-3 rounded-lg sm:rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color }} />
      </div>
      {trend && (
        <div
          className="flex items-center space-x-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md sm:rounded-lg text-xs font-bold"
          style={{
            color: trend === "up" ? COLORS.success[600] : COLORS.danger[600],
            backgroundColor:
              trend === "up" ? COLORS.success[50] : COLORS.danger[50],
          }}
        >
          <span className="text-[10px] sm:text-xs">{change}</span>
        </div>
      )}
    </div>
    <p
      className="text-xs sm:text-sm mb-1 font-medium truncate"
      style={{ color: COLORS.gray[600] }}
    >
      {label}
    </p>
    <p
      className="text-2xl sm:text-3xl font-bold"
      style={{ color: COLORS.gray[900] }}
    >
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status, size = "sm" }) => {
  const styles = {
    replied: {
      bg: COLORS.success[50],
      text: COLORS.success[600],
      icon: CheckCircle,
    },
    unreplied: {
      bg: COLORS.warning[50],
      text: COLORS.warning[500],
      icon: Clock,
    },
  }[status] || {
    bg: COLORS.gray[50],
    text: COLORS.gray[600],
    icon: Clock,
  };

  const Icon = styles.icon;
  return (
    <div
      className={`inline-flex items-center space-x-1 sm:space-x-1.5 px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-semibold ${
        size === "md" ? "px-2 sm:px-3 py-0.5 sm:py-1" : ""
      }`}
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      <Icon className={`w-3 h-3 ${size === "md" ? "sm:w-4 sm:h-4" : ""}`} />
      <span className="whitespace-nowrap">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    </div>
  );
};

const QuickReplyTemplates = ({ onSelect }) => (
  <div className="space-y-2 mb-4">
    <p className="text-xs font-medium text-gray-500 mb-2">Quick Replies:</p>
    {[
      "Thank you so much for your feedback! Happy to help anytime.",
      "We're glad you had a great experience. Thanks for choosing us!",
      "Sorry for any inconvenience. We're here to make it right.",
      "Your satisfaction is our priority. Thank you for the kind words!",
      "Appreciate your patience and understanding!",
    ].map((template, index) => (
      <button
        key={index}
        onClick={() => onSelect(template)}
        className="w-full text-left p-2 sm:p-3 rounded-lg border hover:bg-blue-50 transition-colors text-xs sm:text-sm"
        style={{ borderColor: COLORS.primary[200], color: COLORS.gray[700] }}
      >
        {template}
      </button>
    ))}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanReviews() {
  /* ---------------------- ZUSTAND STORE ---------------------- */
  const {
    reviews,
    stats,
    isLoading,
    isSubmittingReply,
    isFlagging,
    error,
    successMessage,
    fetchArtisanReceivedReviews,
    respondToReview,
    flagReview,
    getFilteredReviews,
    sortReviews,
    clearError,
    clearSuccess,
  } = useReviewStore();

  /* ---------------------- LOCAL STATE ---------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [replyingReview, setReplyingReview] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  /* ---------------------- FETCH REVIEWS ON MOUNT ---------------------- */
  useEffect(() => {
    fetchArtisanReceivedReviews({ page: 1, limit: 100 }); // Fetch all for client-side filtering
  }, [fetchArtisanReceivedReviews]);

  /* ---------------------- FILTER / SEARCH / SORT ---------------------- */
  const filtered = useMemo(() => {
    return getFilteredReviews(filterType, searchQuery);
  }, [reviews, filterType, searchQuery, getFilteredReviews]);

  const sorted = useMemo(() => {
    return sortReviews(filtered, sortBy);
  }, [filtered, sortBy, sortReviews]);

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const current = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------------- HANDLERS ---------------------- */
  const handleReply = (review) => {
    setReplyingReview(review);
    setReplyText(review.response?.text || "");
  };

  const submitReply = async () => {
    if (!replyText.trim() || !replyingReview) return;

    try {
      await respondToReview(replyingReview._id, replyText);
      setReplyingReview(null);
      setReplyText("");
    } catch (error) {
      // Error is handled in the store
    }
  };

  const reportReview = async (review) => {
    const reason = window.prompt(
      "Please provide a reason for flagging this review:"
    );
    if (!reason) return;

    try {
      await flagReview(review._id, reason);
    } catch (error) {
      // Error is handled in the store
    }
  };

  const clearFilters = () => {
    setFilterType("all");
    setSearchQuery("");
    setCurrentPage(1);
  };

  /* ---------------------- FORMAT HELPERS ---------------------- */
  const formatDate = (date) => {
    try {
      return format(new Date(date), "MMM dd, yyyy");
    } catch {
      return "N/A";
    }
  };

  const formatTime = (date) => {
    try {
      return format(new Date(date), "h:mm a");
    } catch {
      return "";
    }
  };

  const getCustomerName = (review) => {
    const firstName = review.reviewer?.firstName || "";
    const lastName = review.reviewer?.lastName || "";
    return `${firstName} ${lastName}`.trim() || "Anonymous";
  };

  const getServiceName = (review) => {
    return review.booking?.service?.name || "Service";
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-4 sm:space-y-6 px-2 sm:px-0">
      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm">{successMessage}</span>
          <button onClick={clearSuccess}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg flex items-center justify-between">
          <span className="text-sm">{error}</span>
          <button onClick={clearError}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Customer Reviews
          </h1>
          <p
            className="mt-1 text-xs sm:text-sm"
            style={{ color: COLORS.gray[600] }}
          >
            See what your customers are saying about your work
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={MessageSquare}
          label="Total Reviews"
          value={stats.totalReviews}
          change="+3"
          trend="up"
          color={COLORS.primary[600]}
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={stats.averageRating}
          change="4.8"
          trend="up"
          color={COLORS.warning[500]}
        />
        <StatCard
          icon={CheckCircle}
          label="Response"
          value={`${stats.responseRate}%`}
          change="90%"
          trend={stats.responseRate >= 90 ? "up" : undefined}
          color={COLORS.success[600]}
        />
        <StatCard
          icon={Award}
          label="5-Star"
          value={`${stats.fiveStarPercentage}%`}
          change="total"
          trend="up"
          color={COLORS.primary[600]}
        />
      </div>

      {/* Search & Filters */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 pointer-events-none"
              style={{ color: COLORS.gray[400] }}
            />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 border rounded-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:border-blue-500"
              style={{ borderColor: COLORS.gray[200] }}
            />
          </div>

          {/* Filter Buttons - Horizontal Scroll on Mobile */}
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
            <style jsx>{`
              .scrollbar-hide::-webkit-scrollbar {
                display: none;
              }
              .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
              }
            `}</style>
            <div className="flex gap-2 scrollbar-hide">
              {[
                { value: "all", label: "All", icon: null },
                { value: "5stars", label: "5★", icon: Star },
                { value: "4stars", label: "4★", icon: Star },
                { value: "unreplied", label: "Unreplied", icon: Clock },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setFilterType(opt.value)}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap flex items-center space-x-1 flex-shrink-0 ${
                    filterType === opt.value
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt.icon && (
                    <opt.icon
                      className={`w-3 h-3 sm:w-4 sm:h-4 ${
                        filterType === opt.value ? "fill-current" : ""
                      }`}
                    />
                  )}
                  <span>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sort Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-2 rounded-lg font-medium transition-all text-sm sm:text-base w-full sm:w-auto"
            style={{
              borderColor: COLORS.gray[300],
              color: COLORS.gray[700],
            }}
          >
            <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Sort</span>
          </button>
        </div>

        {/* Sort Options Dropdown */}
        {showFilters && (
          <div
            className="mt-4 pt-4 border-t"
            style={{ borderColor: COLORS.gray[200] }}
          >
            <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:justify-center">
              {[
                { v: "date-desc", l: "Newest" },
                { v: "date-asc", l: "Oldest" },
                { v: "rating-high", l: "Highest" },
                { v: "rating-low", l: "Lowest" },
                { v: "replied-first", l: "Replied" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => {
                    setSortBy(o.v);
                    setShowFilters(false);
                  }}
                  className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    sortBy === o.v
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex flex-wrap items-center gap-2 sm:space-x-4">
          <p className="text-xs sm:text-sm" style={{ color: COLORS.gray[600] }}>
            Showing{" "}
            <span className="font-bold" style={{ color: COLORS.gray[900] }}>
              {current.length}
            </span>{" "}
            of{" "}
            <span className="font-bold" style={{ color: COLORS.gray[900] }}>
              {sorted.length}
            </span>
          </p>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="flex items-center space-x-1 text-xs sm:text-sm font-medium hover:underline"
              style={{ color: COLORS.primary[600] }}
            >
              <X className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
        {filterType !== "all" && (
          <button
            onClick={clearFilters}
            className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 w-full sm:w-auto"
            style={{ color: COLORS.gray[700] }}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            <span>Clear Filters</span>
          </button>
        )}
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12 sm:py-20">
          <Loader2
            className="w-6 h-6 sm:w-8 sm:h-8 animate-spin"
            style={{ color: COLORS.primary[600] }}
          />
        </div>
      )}

      {/* Reviews List */}
      {!isLoading && (
        <div className="space-y-3 sm:space-y-4">
          {current.length === 0 ? (
            <div
              className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 sm:mb-6 rounded-full bg-blue-50 flex items-center justify-center">
                <Star
                  className="w-6 h-6 sm:w-8 sm:h-8"
                  style={{ color: COLORS.primary[600] }}
                />
              </div>
              <h3
                className="text-lg sm:text-xl font-bold mb-2"
                style={{ color: COLORS.gray[900] }}
              >
                No reviews found
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6 px-4">
                {searchQuery || filterType !== "all"
                  ? "Try adjusting your filters or search query."
                  : "Your customers haven't left any reviews yet."}
              </p>
              <button
                onClick={clearFilters}
                className="px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold transition-all flex items-center justify-center space-x-2 mx-auto text-sm sm:text-base"
                style={{
                  backgroundImage: COLORS.primary.gradient,
                  color: "white",
                }}
              >
                <X className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Clear Filters</span>
              </button>
            </div>
          ) : (
            current.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-md cursor-pointer"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
                onClick={() => setSelectedReview(review)}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex items-start space-x-3 sm:space-x-4 flex-1 min-w-0">
                    <img
                      src={
                        review.reviewer?.profilePhoto ||
                        "https://i.pravatar.cc/150?img=12"
                      }
                      alt={getCustomerName(review)}
                      className="w-10 h-10 sm:w-14 sm:h-14 rounded-full object-cover border-2 flex-shrink-0"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-1">
                        <h3
                          className="font-bold text-base sm:text-lg truncate"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {getCustomerName(review)}
                        </h3>
                        <StatusBadge
                          status={
                            review.response?.text ? "replied" : "unreplied"
                          }
                          size="md"
                        />
                      </div>
                      <p
                        className="text-xs sm:text-sm mb-2 truncate"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {getServiceName(review)}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <div className="flex items-center space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                i < review.rating
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <div className="flex items-center space-x-2 text-xs sm:text-sm">
                          <Calendar
                            className="w-3 h-3 sm:w-4 sm:h-4"
                            style={{ color: COLORS.gray[500] }}
                          />
                          <span
                            style={{ color: COLORS.gray[500] }}
                            className="truncate"
                          >
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 sm:space-x-2 flex-shrink-0">
                    {!review.response?.text && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReply(review);
                        }}
                        className="p-1.5 sm:p-2 rounded-lg hover:bg-blue-50 transition-colors"
                        style={{ color: COLORS.primary[600] }}
                        title="Reply"
                      >
                        <Reply className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        reportReview(review);
                      }}
                      className="p-1.5 sm:p-2 rounded-lg hover:bg-red-50 transition-colors"
                      style={{ color: COLORS.danger[600] }}
                      title="Report"
                      disabled={isFlagging}
                    >
                      <AlertTriangle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Review Content */}
                <p
                  className="text-sm sm:text-base leading-relaxed mb-4"
                  style={{ color: COLORS.gray[700] }}
                >
                  {review.comment}
                </p>

                {/* Photos */}
                {review.photos && review.photos.length > 0 && (
                  <div className="flex gap-2 sm:gap-3 mb-4 overflow-x-auto pb-2">
                    {review.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo.url}
                        alt={`Review ${i + 1}`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover flex-shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(photo.url, "_blank");
                        }}
                      />
                    ))}
                  </div>
                )}

                {/* Rating Categories */}
                {review.detailedRatings && (
                  <div
                    className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-3 mb-4 p-3 sm:p-4 rounded-lg"
                    style={{ backgroundColor: COLORS.gray[50] }}
                  >
                    {Object.entries(review.detailedRatings).map(
                      ([key, value]) => (
                        <div key={key} className="text-center">
                          <p
                            className="text-[10px] sm:text-xs font-medium mb-1 capitalize truncate"
                            style={{ color: COLORS.gray[600] }}
                            title={key.replace(/_/g, " ")}
                          >
                            {key.replace(/_/g, " ")}
                          </p>
                          <div className="flex items-center justify-center space-x-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span
                              className="text-xs sm:text-sm font-bold"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {value}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                {/* Your Reply */}
                {review.response?.text && (
                  <div
                    className="border-l-4 pl-3 sm:pl-4 py-2 sm:py-3 mb-4 rounded-r-lg"
                    style={{
                      borderColor: COLORS.primary[600],
                      backgroundColor: COLORS.primary[50],
                    }}
                  >
                    <div className="flex items-center space-x-2 mb-2">
                      <Reply
                        className="w-3 h-3 sm:w-4 sm:h-4"
                        style={{ color: COLORS.primary[600] }}
                      />
                      <span
                        className="text-xs sm:text-sm font-semibold"
                        style={{ color: COLORS.primary[600] }}
                      >
                        Your reply
                      </span>
                      <span
                        className="text-[10px] sm:text-xs"
                        style={{ color: COLORS.gray[500] }}
                      >
                        {formatDate(review.response.respondedAt)}
                      </span>
                    </div>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      {review.response.text}
                    </p>
                  </div>
                )}

                {/* Footer */}
                <div
                  className="flex items-center justify-between pt-3 sm:pt-4 border-t"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <button
                    className="flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm hover:text-blue-600 transition-colors"
                    style={{ color: COLORS.gray[600] }}
                  >
                    <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span>{review.helpfulCount || 0} helpful</span>
                  </button>
                  <div className="flex items-center space-x-1 sm:space-x-2">
                    <Eye
                      className="w-3 h-3 sm:w-4 sm:h-4"
                      style={{ color: COLORS.gray[500] }}
                    />
                    <span
                      className="text-[10px] sm:text-xs sm:text-sm"
                      style={{ color: COLORS.gray[500] }}
                    >
                      {review.isApproved ? "Public" : "Pending"}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={i}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                    currentPage === pageNum
                      ? "bg-blue-50 text-blue-600 shadow-sm"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all ${
              currentPage === totalPages
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 hover:text-primary-600"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Review Detail Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center z-10"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h2
                  className="text-lg sm:text-2xl font-bold truncate"
                  style={{ color: COLORS.gray[900] }}
                >
                  Review from {getCustomerName(selectedReview)}
                </h2>
                <p
                  className="text-xs sm:text-sm truncate"
                  style={{ color: COLORS.gray[600] }}
                >
                  {getServiceName(selectedReview)} •{" "}
                  {formatDate(selectedReview.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Customer Info */}
              <div className="flex items-center space-x-3 sm:space-x-4">
                <img
                  src={
                    selectedReview.reviewer?.profilePhoto ||
                    "https://i.pravatar.cc/150?img=12"
                  }
                  alt={getCustomerName(selectedReview)}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2"
                  style={{ borderColor: COLORS.gray[200] }}
                />
                <div className="flex-1 min-w-0">
                  <h3
                    className="font-bold text-lg sm:text-xl truncate"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {getCustomerName(selectedReview)}
                  </h3>
                  <p
                    className="text-xs sm:text-sm truncate"
                    style={{ color: COLORS.gray[600] }}
                  >
                    {getServiceName(selectedReview)}
                  </p>
                </div>
              </div>

              {/* Overall Rating */}
              <div className="bg-yellow-50 rounded-xl p-4 sm:p-6 text-center border border-yellow-200">
                <p
                  className="text-xs sm:text-sm font-medium mb-2 sm:mb-3"
                  style={{ color: COLORS.warning[500] }}
                >
                  Overall Rating
                </p>
                <div className="flex items-center justify-center space-x-1 mb-2 sm:mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${
                        i < selectedReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-yellow-200"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className="text-2xl sm:text-3xl font-bold"
                  style={{ color: COLORS.warning[500] }}
                >
                  {selectedReview.rating}.0
                </p>
              </div>

              {/* Review Text */}
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-2 sm:mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Customer Feedback
                </h3>
                <div
                  className="p-3 sm:p-4 rounded-lg border"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <p
                    className="text-sm sm:text-base leading-relaxed"
                    style={{ color: COLORS.gray[700] }}
                  >
                    {selectedReview.comment}
                  </p>
                </div>
              </div>

              {/* Photos */}
              {selectedReview.photos?.length > 0 && (
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold mb-2 sm:mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    {selectedReview.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo.url}
                        alt={`Photo ${i + 1}`}
                        className="w-full h-32 sm:h-48 rounded-lg object-cover cursor-pointer hover:opacity-90"
                        onClick={() => window.open(photo.url, "_blank")}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Ratings */}
              {selectedReview.detailedRatings && (
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold mb-2 sm:mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Detailed Ratings
                  </h3>
                  <div className="space-y-2 sm:space-y-3">
                    {Object.entries(selectedReview.detailedRatings).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between p-2 sm:p-3 rounded-lg"
                          style={{ backgroundColor: COLORS.gray[50] }}
                        >
                          <span
                            className="text-xs sm:text-sm font-medium capitalize"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {key}
                          </span>
                          <div className="flex items-center space-x-1 sm:space-x-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  i < value
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {/* Your Reply */}
              {selectedReview.response?.text ? (
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold mb-2 sm:mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Your Reply
                  </h3>
                  <div
                    className="p-3 sm:p-4 rounded-lg"
                    style={{
                      backgroundColor: COLORS.primary[50],
                      border: `1px solid ${COLORS.primary[100]}`,
                    }}
                  >
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      {selectedReview.response.text}
                    </p>
                    <p
                      className="text-[10px] sm:text-xs mt-2"
                      style={{ color: COLORS.gray[500] }}
                    >
                      Replied on{" "}
                      {formatDate(selectedReview.response.respondedAt)}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 sm:py-6">
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                    You haven't replied to this review yet.
                  </p>
                  <button
                    onClick={() => {
                      handleReply(selectedReview);
                      setSelectedReview(null);
                    }}
                    className="px-4 sm:px-6 py-2 rounded-lg font-semibold text-sm sm:text-base"
                    style={{
                      backgroundColor: COLORS.primary[600],
                      color: "white",
                    }}
                  >
                    Reply Now
                  </button>
                </div>
              )}

              {/* Close Button */}
              <button
                onClick={() => setSelectedReview(null)}
                className="w-full py-2 sm:py-3 rounded-lg font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyingReview && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="flex-1 min-w-0 pr-4">
                <h2
                  className="text-lg sm:text-xl font-bold truncate"
                  style={{ color: COLORS.gray[900] }}
                >
                  Reply to {getCustomerName(replyingReview)}
                </h2>
                <p
                  className="text-xs sm:text-sm truncate"
                  style={{ color: COLORS.gray[600] }}
                >
                  {replyingReview.rating} stars •{" "}
                  {getServiceName(replyingReview)}
                </p>
              </div>
              <button
                onClick={() => setReplyingReview(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <X
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-3 sm:space-y-4">
              <QuickReplyTemplates onSelect={setReplyText} />

              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Your Reply
                </label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows="4"
                  maxLength={300}
                  placeholder="Write your reply..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg focus:outline-none focus:ring-2 focus:border-blue-500 resize-none text-sm sm:text-base"
                  style={{ borderColor: COLORS.gray[200] }}
                />
                <p
                  className="text-[10px] sm:text-xs mt-1"
                  style={{ color: COLORS.gray[500] }}
                >
                  {replyText.length}/300 characters
                </p>
              </div>

              <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
                <button
                  onClick={() => setReplyingReview(null)}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  disabled={!replyText.trim() || isSubmittingReply}
                  className="flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 text-sm sm:text-base"
                  style={{
                    backgroundImage: COLORS.primary.gradient,
                    color: "white",
                  }}
                >
                  {isSubmittingReply ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>Post Reply</span>
                    </>
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
