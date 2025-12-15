import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  ThumbsUp,
  MessageSquare,
  Edit,
  Trash2,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
  User,
  Award,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  Loader,
} from "lucide-react";
import { useReviewStore } from "../../../stores/reviewStore";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: { 50: "#f0fdf4", 600: "#16a34a" },
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
const StatCard = ({ icon: Icon, label, value, change, trend }) => (
  <div
    className="bg-white rounded-2xl p-6 transition-all duration-300 group cursor-pointer"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: COLORS.primary[50] }}
      >
        <Icon className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
      </div>
      {trend === "up" && change && (
        <div
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold"
          style={{
            color: COLORS.success[600],
            backgroundColor: COLORS.success[50],
          }}
        >
          <span>{change}</span>
        </div>
      )}
    </div>
    <p className="text-sm mb-1 font-medium" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
    <p className="text-3xl font-bold" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
    {trend === "neutral" && change && (
      <p className="text-sm mt-1" style={{ color: COLORS.gray[500] }}>
        {change}
      </p>
    )}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function CustomerReviews() {
  const navigate = useNavigate();

  // Review Store
  const {
    reviews,
    stats,
    ratingDistribution,
    isLoading,
    error,
    successMessage,
    fetchCustomerReviews,
    updateCustomerReview,
    deleteCustomerReview,
    clearError,
    clearSuccess,
  } = useReviewStore();

  /* ---------------------- STATE ---------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const [editingReview, setEditingReview] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const itemsPerPage = 5;
  /* ---------------------- DEBOUNCED SEARCH ---------------------- */
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = useCallback((value) => {
    setSearchQuery(value);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  // Fetch reviews on mount
  useEffect(() => {
    fetchCustomerReviews(false); // Don't force refresh on mount
  }, []);

  /* ---------------------- HELPER FUNCTIONS ---------------------- */
  const getArtisanName = (reviewee) => {
    if (!reviewee) return "Artisan";
    return (
      reviewee.businessName ||
      `${reviewee.firstName || ""} ${reviewee.lastName || ""}`.trim() ||
      "Artisan"
    );
  };

  const getArtisanPhoto = (reviewee) => {
    if (!reviewee)
      return "https://ui-avatars.com/api/?name=Artisan&background=2a5ca8&color=fff";

    if (reviewee.profilePhoto && reviewee.profilePhoto.startsWith("http")) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(
        reviewee.profilePhoto
      )}&w=150&h=150&fit=cover&mask=circle`;
    }

    if (
      reviewee.profilePhoto &&
      reviewee.profilePhoto !== "default-avatar.png"
    ) {
      return `${import.meta.env.VITE_API_URL || ""}/uploads/${
        reviewee.profilePhoto
      }`;
    }

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      getArtisanName(reviewee)
    )}&background=2a5ca8&color=fff`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getServiceName = (booking) => {
    if (!booking) return "Service";
    return booking.service?.name || "Service";
  };

  /* ---------------------- FILTER / SORT ---------------------- */
 const getFilteredReviews = useMemo(() => {
   let list = [...reviews];

   if (ratingFilter !== "all") {
     const rating = parseInt(ratingFilter);
     list = list.filter((r) => r.rating === rating);
   }

   if (searchQuery.trim()) {
     const q = searchQuery.toLowerCase();
     list = list.filter(
       (r) =>
         getArtisanName(r.reviewee).toLowerCase().includes(q) ||
         getServiceName(r.booking).toLowerCase().includes(q) ||
         r.comment?.toLowerCase().includes(q)
     );
   }

   if (dateRange.from || dateRange.to) {
     list = list.filter((r) => {
       const d = new Date(r.createdAt);
       const from = dateRange.from ? new Date(dateRange.from) : new Date(0);
       const to = dateRange.to ? new Date(dateRange.to) : new Date();
       return d >= from && d <= to;
     });
   }

   return list;
 }, [reviews, ratingFilter, searchQuery, dateRange]);

const sorted = useMemo(() => {
  const copy = [...getFilteredReviews]; // ✅ CREATE THE COPY HERE

  switch (sortBy) {
    case "date-desc":
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case "date-asc":
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case "rating-high":
      copy.sort((a, b) => b.rating - a.rating);
      break;
    case "rating-low":
      copy.sort((a, b) => a.rating - b.rating);
      break;
    case "helpful":
      copy.sort((a, b) => (b.helpfulCount || 0) - (a.helpfulCount || 0));
      break;
    default:
      break;
  }

  return copy;
}, [getFilteredReviews, sortBy]);
const { totalPages, current } = useMemo(() => {
  const pages = Math.ceil(sorted.length / itemsPerPage);
  const items = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  return { totalPages: pages, current: items };
}, [sorted, currentPage, itemsPerPage]);

  /* ---------------------- HANDLERS ---------------------- */
const handleEdit = useCallback((review) => {
  setEditingReview({
    ...review,
    editComment: review.comment || "",
    editRating: review.rating,
    editCategories: review.detailedRatings || {
      quality: 5,
      professionalism: 5,
      timeliness: 5,
      communication: 5,
      value: 5,
    },
  });
}, []);

  const handleSaveEdit = useCallback(async () => {
    try {
      await updateCustomerReview(editingReview._id, {
        rating: editingReview.editRating,
        detailedRatings: editingReview.editCategories,
        comment: editingReview.editComment,
      });
      setEditingReview(null);
      fetchCustomerReviews(true); // Force refresh
    } catch (error) {
      console.error("Failed to update review:", error);
    }
  }, [editingReview, updateCustomerReview, fetchCustomerReviews]);

 const handleDelete = useCallback(
   async (review) => {
     if (window.confirm("Delete this review? This action cannot be undone.")) {
       try {
         await deleteCustomerReview(review._id);
         fetchCustomerReviews(true); // Force refresh
       } catch (error) {
         console.error("Failed to delete review:", error);
       }
     }
   },
   [deleteCustomerReview, fetchCustomerReviews]
 );

  const clearFilters = () => {
    setDateRange({ from: "", to: "" });
    setRatingFilter("all");
    setSearchQuery("");
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{successMessage}</p>
          </div>
          <button onClick={clearSuccess}>
            <X className="w-4 h-4 text-green-600" />
          </button>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
          <button onClick={clearError}>
            <X className="w-4 h-4 text-red-600" />
          </button>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            My Reviews
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Reviews you've written for artisans
          </p>
        </div>
      </div>

      {isLoading && reviews.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              icon={MessageSquare}
              label="Total Reviews"
              value={stats.totalReviews || 0}
              trend="up"
              change={
                stats.reviewsThisMonth > 0
                  ? `+${stats.reviewsThisMonth} this month`
                  : null
              }
            />
            <StatCard
              icon={Star}
              label="Avg Rating Given"
              value={stats.averageRating || "0.0"}
              trend="neutral"
              change="Out of 5.0"
            />
            <StatCard
              icon={Award}
              label="5-Star Reviews"
              value={stats.fiveStarReviews || 0}
              trend="neutral"
              change={`${stats.fiveStarPercentage || 0}% of total`}
            />
            <StatCard
              icon={ThumbsUp}
              label="Total Helpful"
              value={stats.totalHelpful || 0}
              trend="up"
              change={
                stats.helpfulThisWeek > 0
                  ? `+${stats.helpfulThisWeek} this week`
                  : null
              }
            />
          </div>

          {ratingDistribution.length > 0 && (
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <h3
                className="text-lg font-bold mb-4"
                style={{ color: COLORS.gray[900] }}
              >
                Your Rating Distribution
              </h3>
              <div className="space-y-3">
                {ratingDistribution.map(({ star, count, percentage }) => (
                  <div key={star} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1 w-20">
                      <span
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {star}
                      </span>
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    </div>
                    <div className="flex-1">
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div
                          className="h-3 rounded-full transition-all duration-500"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: "orange",
                          }}
                        />
                      </div>
                    </div>
                    <span
                      className="text-sm font-medium w-16 text-right"
                      style={{ color: COLORS.gray[700] }}
                    >
                      {count} ({percentage}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                  style={{ color: COLORS.gray[400] }}
                />
                <input
                  type="text"
                  placeholder="Search by artisan, service, or review content..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>

              <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
                {["all", "5", "4", "3", "2", "1"].map((rating) => (
                  <button
                    key={rating}
                    onClick={() => setRatingFilter(rating)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap flex items-center space-x-1 ${
                      ratingFilter === rating
                        ? "bg-primary-50 text-primary-600"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {rating === "all" ? (
                      <span>All Reviews</span>
                    ) : (
                      <>
                        <span>{rating}</span>
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </>
                    )}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 px-4 py-2.5 border-2 rounded-lg font-medium transition-all"
                style={{
                  borderColor: COLORS.gray[300],
                  color: COLORS.gray[700],
                }}
              >
                <Filter className="w-5 h-5" />
                <span>Filters</span>
                {(dateRange.from || dateRange.to) && (
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: COLORS.primary[600] }}
                  />
                )}
              </button>
            </div>

            {showFilters && (
              <div
                className="mt-4 pt-4 border-t"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Date From
                    </label>
                    <input
                      type="date"
                      value={dateRange.from}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, from: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-sm font-semibold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Date To
                    </label>
                    <input
                      type="date"
                      value={dateRange.to}
                      onChange={(e) =>
                        setDateRange({ ...dateRange, to: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
                    style={{ color: COLORS.gray[700] }}
                  >
                    <X className="w-4 h-4" />
                    <span>Clear Filters</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          <div
            className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.gray[700] }}
            >
              Sort By:
            </span>
            <div className="flex flex-wrap gap-2">
              {[
                { v: "date-desc", l: "Newest First" },
                { v: "date-asc", l: "Oldest First" },
                { v: "rating-high", l: "Highest Rating" },
                { v: "rating-low", l: "Lowest Rating" },
                { v: "helpful", l: "Most Helpful" },
              ].map((o) => (
                <button
                  key={o.v}
                  onClick={() => setSortBy(o.v)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    sortBy === o.v
                      ? "bg-primary-50 text-primary-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          <div
            className="bg-white rounded-2xl p-4"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <p className="text-sm" style={{ color: COLORS.gray[600] }}>
              Showing{" "}
              <span className="font-bold" style={{ color: COLORS.gray[900] }}>
                {current.length}
              </span>{" "}
              of{" "}
              <span className="font-bold" style={{ color: COLORS.gray[900] }}>
                {sorted.length}
              </span>{" "}
              reviews
            </p>
          </div>

          <div className="space-y-4">
            {current.length === 0 ? (
              <div
                className="bg-white rounded-2xl p-12 text-center"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <MessageSquare
                    className="w-8 h-8"
                    style={{ color: COLORS.gray[400] }}
                  />
                </div>
                <h3
                  className="text-xl font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  No reviews found
                </h3>
                <p className="mt-1" style={{ color: COLORS.gray[600] }}>
                  Try adjusting your filters or search query
                </p>
              </div>
            ) : (
              current.map((review) => (
                <div
                  key={review._id}
                  className="bg-white rounded-2xl p-6 transition-all duration-300"
                  style={{ border: `1px solid ${COLORS.gray[100]}` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-3 flex-1">
                      <img
                        src={getArtisanPhoto(review.reviewee)}
                        alt={getArtisanName(review.reviewee)}
                        className="w-12 h-12 rounded-full object-cover border-2"
                        style={{ borderColor: COLORS.gray[200] }}
                        onError={(e) => {
                          e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                            getArtisanName(review.reviewee)
                          )}&background=2a5ca8&color=fff`;
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {getArtisanName(review.reviewee)}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {getServiceName(review.booking)}
                        </p>
                        <div className="flex items-center space-x-3 mt-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[500] }}
                          >
                            {formatDate(review.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                        title="Edit review"
                      >
                        <Edit
                          className="w-5 h-5"
                          style={{ color: COLORS.gray[600] }}
                        />
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
                        className="p-2 rounded-lg hover:bg-red-50 transition-all"
                        title="Delete review"
                      >
                        <Trash2 className="w-5 h-5 text-red-600" />
                      </button>
                    </div>
                  </div>
                  {review.comment && (
                    <p
                      className="text-base leading-relaxed mb-4"
                      style={{ color: COLORS.gray[700] }}
                    >
                      {review.comment}
                    </p>
                  )}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                      {review.photos.map((photo, i) => (
                        <img
                          key={i}
                          src={photo.url || photo}
                          alt={`Review ${i + 1}`}
                          className="w-24 h-24 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                          onClick={() =>
                            window.open(photo.url || photo, "_blank")
                          }
                        />
                      ))}
                    </div>
                  )}
                  {review.detailedRatings && (
                    <div
                      className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-4 p-4 rounded-lg"
                      style={{ backgroundColor: COLORS.gray[50] }}
                    >
                      {Object.entries(review.detailedRatings).map(
                        ([key, value]) => (
                          <div key={key} className="text-center">
                            <p
                              className="text-xs font-medium mb-1 capitalize"
                              style={{ color: COLORS.gray[600] }}
                            >
                              {key}
                            </p>
                            <div className="flex items-center justify-center space-x-1">
                              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                              <span
                                className="text-sm font-bold"
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
                  {review.response && review.response.text && (
                    <div
                      className="border-l-4 pl-4 py-2 mb-4"
                      style={{ borderColor: COLORS.primary[600] }}
                    >
                      <div className="flex items-center space-x-2 mb-2">
                        <User
                          className="w-4 h-4"
                          style={{ color: COLORS.primary[600] }}
                        />
                        <span
                          className="text-sm font-semibold"
                          style={{ color: COLORS.primary[600] }}
                        >
                          Response from {getArtisanName(review.reviewee)}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: COLORS.gray[500] }}
                        >
                          {formatDate(review.response.respondedAt)}
                        </span>
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {review.response.text}
                      </p>
                    </div>
                  )}
                  <div
                    className="flex items-center justify-between pt-4 border-t"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className="flex items-center space-x-2 text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        <ThumbsUp className="w-4 h-4" />
                        <span>{review.helpfulCount || 0} found helpful</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedReview(review)}
                      className="text-sm font-medium hover:underline"
                      style={{ color: COLORS.primary[600] }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div
              className="bg-white rounded-2xl p-4 flex items-center justify-between"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                  currentPage === 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
              <div className="flex space-x-2">
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                      currentPage === i + 1
                        ? "bg-primary-50 text-primary-600"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                  currentPage === totalPages
                    ? "text-gray-400 cursor-not-allowed"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      )}

      {selectedReview && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{
                    color: COLORS.gray[900], // RIGHT AFTER THE selectedReview && ( line // ADD THIS TO THE END OF YOUR CustomerReviews.jsx FILE
                  }}
                >
                  Review Details
                </h2>
                <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                  {getArtisanName(selectedReview.reviewee)} •{" "}
                  {formatDate(selectedReview.createdAt)}
                </p>
              </div>
              <button
                onClick={() => setSelectedReview(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={getArtisanPhoto(selectedReview.reviewee)}
                  alt={getArtisanName(selectedReview.reviewee)}
                  className="w-16 h-16 rounded-full object-cover border-2"
                  style={{ borderColor: COLORS.gray[200] }}
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                      getArtisanName(selectedReview.reviewee)
                    )}&background=2a5ca8&color=fff`;
                  }}
                />
                <div>
                  <h3
                    className="font-bold text-xl"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {getArtisanName(selectedReview.reviewee)}
                  </h3>
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                    {getServiceName(selectedReview.booking)} Specialist
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-6 text-center">
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: COLORS.gray[600] }}
                >
                  Your Overall Rating
                </p>
                <div className="flex items-center justify-center space-x-2 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-8 h-8 ${
                        i < selectedReview.rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <p
                  className="text-3xl font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  {selectedReview.rating}.0 / 5.0
                </p>
              </div>

              {selectedReview.detailedRatings && (
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Detailed Ratings
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(selectedReview.detailedRatings).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className="flex items-center justify-between"
                        >
                          <span
                            className="text-sm font-medium capitalize"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {key}
                          </span>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`w-4 h-4 ${
                                    i < value
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                            <span
                              className="text-sm font-bold w-8 text-right"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {value}.0
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              {selectedReview.comment && (
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Your Review
                  </h3>
                  <p
                    className="text-base leading-relaxed"
                    style={{ color: COLORS.gray[700] }}
                  >
                    {selectedReview.comment}
                  </p>
                </div>
              )}

              {selectedReview.photos && selectedReview.photos.length > 0 && (
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Photos
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {selectedReview.photos.map((photo, i) => (
                      <img
                        key={i}
                        src={photo.url || photo}
                        alt={`Review ${i + 1}`}
                        className="w-full h-48 rounded-lg object-cover cursor-pointer hover:opacity-80 transition-opacity"
                        onClick={() =>
                          window.open(photo.url || photo, "_blank")
                        }
                      />
                    ))}
                  </div>
                </div>
              )}

              {selectedReview.response && selectedReview.response.text && (
                <div
                  className="bg-blue-50 border rounded-xl p-4"
                  style={{ borderColor: "#93c5fd" }}
                >
                  <div className="flex items-center space-x-2 mb-2">
                    <User
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                    <span
                      className="text-sm font-semibold"
                      style={{ color: COLORS.primary[600] }}
                    >
                      Response from {getArtisanName(selectedReview.reviewee)}
                    </span>
                  </div>
                  <p
                    className="text-sm mb-2"
                    style={{ color: COLORS.gray[700] }}
                  >
                    {selectedReview.response.text}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                    {formatDate(selectedReview.response.respondedAt)}
                  </p>
                </div>
              )}

              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <ThumbsUp
                    className="w-5 h-5"
                    style={{ color: COLORS.success[600] }}
                  />
                  <span
                    className="text-2xl font-bold"
                    style={{ color: COLORS.success[600] }}
                  >
                    {selectedReview.helpfulCount || 0}
                  </span>
                </div>
                <p className="text-sm" style={{ color: COLORS.success[600] }}>
                  people found this review helpful
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    handleEdit(selectedReview);
                    setSelectedReview(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  <Edit className="w-5 h-5" />
                  <span>Edit Review</span>
                </button>
                <button
                  onClick={() => {
                    handleDelete(selectedReview);
                    setSelectedReview(null);
                  }}
                  className="px-6 py-3 rounded-lg border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all"
                >
                  Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {editingReview && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  Edit Review
                </h2>
                <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                  Update your review for{" "}
                  {getArtisanName(editingReview.reviewee)}
                </p>
              </div>
              <button
                onClick={() => setEditingReview(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Overall Rating
                </label>
                <div className="flex items-center space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() =>
                        setEditingReview({ ...editingReview, editRating: star })
                      }
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-10 h-10 ${
                          star <= editingReview.editRating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Detailed Ratings
                </label>
                <div className="space-y-4">
                  {Object.entries(editingReview.editCategories).map(
                    ([key, value]) => (
                      <div key={key}>
                        <p
                          className="text-sm font-medium mb-2 capitalize"
                          style={{ color: COLORS.gray[700] }}
                        >
                          {key}
                        </p>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() =>
                                setEditingReview({
                                  ...editingReview,
                                  editCategories: {
                                    ...editingReview.editCategories,
                                    [key]: star,
                                  },
                                })
                              }
                              className="transition-transform hover:scale-110"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= value
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Your Review
                </label>
                <textarea
                  value={editingReview.editComment}
                  onChange={(e) =>
                    setEditingReview({
                      ...editingReview,
                      editComment: e.target.value,
                    })
                  }
                  rows="6"
                  placeholder="Share your experience..."
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 resize-none"
                  style={{ borderColor: COLORS.gray[200] }}
                />
                <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
                  {editingReview.editComment.length} characters
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setEditingReview(null)}
                  className="flex-1 px-6 py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
