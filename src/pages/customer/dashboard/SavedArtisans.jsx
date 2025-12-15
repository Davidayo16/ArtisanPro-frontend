import React, {
  useState,
  useMemo,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerDashboardStore } from "../../../stores/customerDashboardStore";
import {
  Search,
  Heart,
  Star,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Award,
  Shield,
  Zap,
  Filter,
  X,
  TrendingUp,
  Clock,
  DollarSign,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  CheckCircle,
   Loader2,
} from "lucide-react";

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
    className="bg-white rounded-2xl p-4 sm:p-6 transition-all duration-300 group cursor-pointer"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-3 sm:mb-4">
      <div
        className="p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: COLORS.primary[50] }}
      >
        <Icon
          className="w-5 h-5 sm:w-6 sm:h-6"
          style={{ color: COLORS.primary[600] }}
        />
      </div>
      {trend === "up" && (
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
    <p
      className="text-xs sm:text-sm mb-1 font-medium"
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
    {trend === "neutral" && change && (
      <p
        className="text-xs sm:text-sm mt-1"
        style={{ color: COLORS.gray[500] }}
      >
        {change}
      </p>
    )}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function SavedArtisans() {
  const navigate = useNavigate();

  // Zustand store
  const {
    savedArtisans,
    savedArtisansTotal,
    savedArtisansPage,
    savedArtisansPages,
    savedArtisansHasMore,
    isSavedArtisansLoading,
    savedArtisansError,
    savedArtisansFilters,
    savedArtisansSortBy,
    fetchSavedArtisans,
    loadMoreSavedArtisans,
    setSavedArtisansFilters,
    setSavedArtisansSortBy,
    searchSavedArtisans,
    removeSavedArtisan,
    clearSavedArtisansError,
  } = useCustomerDashboardStore();

  /* ---------------------- STATE ---------------------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedArtisan, setSelectedArtisan] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ratingFilter, setRatingFilter] = useState("");
  const [distanceFilter, setDistanceFilter] = useState("");
  const itemsPerPage = 6;
  /* ---------------------- DEBOUNCED SEARCH ---------------------- */
  const searchTimeoutRef = useRef(null);

  const handleSearchChange = useCallback(
    (value) => {
      setSearchQuery(value);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      // Debounce search by 500ms
      searchTimeoutRef.current = setTimeout(() => {
        searchSavedArtisans(value);
      }, 500);
    },
    [searchSavedArtisans]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  /* ---------------------- FETCH DATA ON MOUNT ---------------------- */
  /* ---------------------- FETCH DATA ON MOUNT ---------------------- */
  useEffect(() => {
    fetchSavedArtisans({ forceRefresh: false });
  }, []);

  /* ---------------------- CALCULATIONS ---------------------- */
  /* ---------------------- CALCULATIONS (MEMOIZED) ---------------------- */
  const totalSaved = savedArtisansTotal; // Use total from backend

  const categories = useMemo(() => {
    return [...new Set(savedArtisans.map((a) => a.service))];
  }, [savedArtisans]);

  const totalBooked = useMemo(() => {
    return savedArtisans.reduce((sum, a) => sum + a.totalBooked, 0);
  }, [savedArtisans]);

  const avgRating = useMemo(() => {
    return savedArtisans.length > 0
      ? savedArtisans.reduce((sum, a) => sum + a.rating, 0) /
          savedArtisans.length
      : 0;
  }, [savedArtisans]);
  /* ---------------------- FILTER / SORT ---------------------- */
  /* ---------------------- NO CLIENT-SIDE FILTERING NEEDED ---------------------- */
  // All filtering, sorting, and pagination now done by backend!
  const current = savedArtisans; // Backend already returns paginated
  /* ---------------------- HANDLERS (MEMOIZED) ---------------------- */
  const handleCategoryChange = useCallback(
    async (category) => {
      setSelectedCategory(category);
      await setSavedArtisansFilters({
        category: category === "all" ? null : category,
      });
    },
    [setSavedArtisansFilters]
  );

  const handleSortChange = useCallback(
    async (sortValue) => {
      setSortBy(sortValue);
      await setSavedArtisansSortBy(sortValue);
    },
    [setSavedArtisansSortBy]
  );

  const handleRatingFilterChange = useCallback(
    async (value) => {
      setRatingFilter(value);
      await setSavedArtisansFilters({
        minRating: value ? parseFloat(value) : null,
      });
    },
    [setSavedArtisansFilters]
  );

  const handleDistanceFilterChange = useCallback(
    async (value) => {
      setDistanceFilter(value);
      await setSavedArtisansFilters({
        maxDistance: value ? parseFloat(value) : null,
      });
    },
    [setSavedArtisansFilters]
  );

  const handleClearFilters = useCallback(async () => {
    setRatingFilter("");
    setDistanceFilter("");
    await setSavedArtisansFilters({
      minRating: null,
      maxDistance: null,
    });
  }, [setSavedArtisansFilters]);

  /* ---------------------- HANDLERS ---------------------- */
 const handleRemove = useCallback(
   async (artisan) => {
     if (window.confirm(`Remove ${artisan.name} from saved artisans?`)) {
       const result = await removeSavedArtisan(artisan.id);

       if (result.success) {
         if (selectedArtisan?.id === artisan.id) {
           setSelectedArtisan(null);
         }
         alert(result.message);
       } else {
         alert(result.message);
       }
     }
   },
   [removeSavedArtisan, selectedArtisan]
 );

  const getBadgeIcon = (badge) => {
    switch (badge) {
      case "Top Rated":
        return <Award className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "Verified":
        return <Shield className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "Quick Response":
        return <Zap className="w-3 h-3 sm:w-4 sm:h-4" />;
      case "Licensed":
        return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge) => {
    switch (badge) {
      case "Top Rated":
        return { bg: "#fef3c7", text: "#92400e" };
      case "Verified":
        return { bg: COLORS.primary[50], text: COLORS.primary[600] };
      case "Quick Response":
        return { bg: COLORS.success[50], text: COLORS.success[600] };
      case "Licensed":
        return { bg: "#e0e7ff", text: "#4338ca" };
      default:
        return { bg: COLORS.gray[100], text: COLORS.gray[600] };
    }
  };

  const getAvailabilityStyle = (availability) => {
    switch (availability) {
      case "Available Now":
        return { bg: COLORS.success[50], text: COLORS.success[600] };
      case "Available Today":
        return { bg: COLORS.primary[50], text: COLORS.primary[600] };
      case "Available Tomorrow":
        return { bg: "#e0e7ff", text: "#4338ca" };
      case "Busy":
        return { bg: COLORS.danger[50], text: COLORS.danger[600] };
      default:
        return { bg: COLORS.gray[100], text: COLORS.gray[600] };
    }
  };

  const clearFilters = () => {
    setRatingFilter("");
    setDistanceFilter("");
  };

  /* ---------------------- LOADING STATE ---------------------- */
  if (isSavedArtisansLoading) {
    return (
         <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
           <div className="text-center">
             <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
             <p className="text-gray-600 font-medium">Loading saved artisans...</p>
           </div>
         </div>
    );
  }

  /* ---------------------- ERROR STATE ---------------------- */
  if (savedArtisansError) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-red-600 text-2xl">!</span>
          </div>
          <h3 className="text-lg font-bold text-red-900 mb-2">
            Error Loading Data
          </h3>
          <p className="text-red-700 mb-4">{savedArtisansError}</p>
          <button
            onClick={() => {
              clearSavedArtisansError();
              fetchSavedArtisans(true);
            }}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div>
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Saved Artisans
          </h1>
          <p className="mt-1 text-sm" style={{ color: COLORS.gray[600] }}>
            Your favorite professionals, ready to book
          </p>
        </div>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Heart}
          label="Saved Artisans"
          value={totalSaved}
          trend="neutral"
        />
        <StatCard
          icon={Calendar}
          label="Total Bookings"
          value={totalBooked}
          trend="neutral"
          change="From saved list"
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={avgRating.toFixed(1)}
          trend="neutral"
          change="Excellent quality"
        />
        <StatCard
          icon={Briefcase}
          label="Categories"
          value={categories.length}
          trend="neutral"
        />
      </div>

      {/* Search & Category Filter */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex flex-col gap-3 sm:gap-4">
          {/* Search Bar */}
          <div className="relative w-full">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
              style={{ color: COLORS.gray[400] }}
            />
            <input
              type="text"
              placeholder="Search artisans..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-9 sm:pl-10 pr-4 py-2 sm:py-2.5 text-sm border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.gray[200] }}
            />
          </div>

          {/* Category Buttons */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
            <button
              onClick={() => handleCategoryChange("all")}
              className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${
                selectedCategory === "all"
                  ? "bg-primary-50 text-primary-600"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100"
              }`}
            >
              All ({savedArtisans.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm transition-all flex-shrink-0 ${
                  selectedCategory === cat
                    ? "bg-primary-50 text-primary-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {cat} ({savedArtisans.filter((a) => a.service === cat).length})
              </button>
            ))}
          </div>

          {/* Filters Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center space-x-2 px-4 py-2 border-2 rounded-lg font-medium transition-all text-sm"
            style={{
              borderColor: COLORS.gray[300],
              color: COLORS.gray[700],
            }}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {(ratingFilter || distanceFilter) && (
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Minimum Rating
                </label>
                <select
                  value={ratingFilter}
                  onChange={(e) => handleRatingFilterChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.7">4.7+ Stars</option>
                  <option value="4.9">4.9+ Stars</option>
                  <option value="5.0">5.0 Stars Only</option>
                </select>
              </div>

              <div>
                <label
                  className="block text-xs sm:text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Maximum Distance
                </label>
                <select
                  value={distanceFilter}
                  onChange={(e) => handleDistanceFilterChange(e.target.value)}
                  className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <option value="">Any Distance</option>
                  <option value="2">Within 2 km</option>
                  <option value="5">Within 5 km</option>
                  <option value="10">Within 10 km</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 text-xs sm:text-sm font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
                style={{ color: COLORS.gray[700] }}
              >
                <X className="w-4 h-4" />
                <span>Clear Filters</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Sort */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <span
          className="text-xs sm:text-sm font-semibold block mb-3"
          style={{ color: COLORS.gray[700] }}
        >
          Sort By:
        </span>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {[
            { v: "date-desc", l: "Recently Saved" },
            { v: "rating-high", l: "Highest Rated" },
            { v: "distance", l: "Nearest" },
            { v: "price-low", l: "Lowest Price" },
            { v: "most-booked", l: "Most Booked" },
          ].map((o) => (
            <button
              key={o.v}
              onClick={() => handleSortChange(o.v)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
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

      {/* Results Summary */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <p className="text-xs sm:text-sm" style={{ color: COLORS.gray[600] }}>
          Showing{" "}
          <span className="font-bold" style={{ color: COLORS.gray[900] }}>
            {savedArtisans.length}
          </span>{" "}
          of{" "}
          <span className="font-bold" style={{ color: COLORS.gray[900] }}>
            {savedArtisansTotal}
          </span>{" "}
          saved artisans (Page {savedArtisansPage} of {savedArtisansPages})
        </p>
      </div>

      {/* Artisan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        {current.length === 0 ? (
          <div
            className="col-span-full bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <Heart
                className="w-6 h-6 sm:w-8 sm:h-8"
                style={{ color: COLORS.gray[400] }}
              />
            </div>
            <h3
              className="text-lg sm:text-xl font-bold"
              style={{ color: COLORS.gray[900] }}
            >
              No saved artisans yet
            </h3>
            <p className="mt-1 text-sm" style={{ color: COLORS.gray[600] }}>
              Start saving your favorite professionals
            </p>
          </div>
        ) : (
          current.map((artisan) => {
            const availStyle = getAvailabilityStyle(artisan.availability);
            return (
              <div
                key={artisan.id}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4 gap-2">
                  <div className="flex items-start space-x-3 min-w-0 flex-1">
                    <img
                      src={artisan.photo}
                      alt={artisan.name}
                      className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 flex-shrink-0"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                    <div className="min-w-0 flex-1">
                      <h3
                        className="font-bold text-sm sm:text-lg truncate"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {artisan.name}
                      </h3>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {artisan.service}
                      </p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3 h-3 ${
                              i < Math.floor(artisan.rating)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                        <span
                          className="text-xs font-bold ml-1"
                          style={{ color: COLORS.gray[700] }}
                        >
                          {artisan.rating}
                        </span>
                        <span
                          className="text-xs"
                          style={{ color: COLORS.gray[500] }}
                        >
                          ({artisan.reviews})
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(artisan)}
                    className="p-2 rounded-full hover:bg-red-50 transition-all flex-shrink-0"
                  >
                    <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-red-500 text-red-500" />
                  </button>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-4">
                  {artisan.badges.map((badge) => {
                    const badgeStyle = getBadgeColor(badge);
                    return (
                      <span
                        key={badge}
                        className="px-2 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
                        style={{
                          backgroundColor: badgeStyle.bg,
                          color: badgeStyle.text,
                        }}
                      >
                        {getBadgeIcon(badge)}
                        <span className="text-xs">{badge}</span>
                      </span>
                    );
                  })}
                </div>

                {/* Info */}
                <div className="space-y-2 sm:space-y-3 mb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <MapPin
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        style={{ color: COLORS.gray[400] }}
                      />
                      <span
                        className="text-xs sm:text-sm truncate"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {artisan.distance} away
                      </span>
                    </div>
                    <div
                      className="px-2 py-1 rounded-lg text-xs font-semibold flex-shrink-0"
                      style={{
                        backgroundColor: availStyle.bg,
                        color: availStyle.text,
                      }}
                    >
                      {artisan.availability}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Clock
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        style={{ color: COLORS.gray[400] }}
                      />
                      <span
                        className="text-xs sm:text-sm truncate"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {artisan.responseTime} response
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <DollarSign
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        style={{ color: COLORS.gray[400] }}
                      />
                      <span
                        className="text-xs sm:text-sm font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {artisan.hourlyRate}/hr
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center space-x-2 min-w-0">
                      <Briefcase
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                        style={{ color: COLORS.gray[400] }}
                      />
                      <span
                        className="text-xs sm:text-sm truncate"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {artisan.jobsCompleted} jobs
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 flex-shrink-0">
                      <TrendingUp
                        className="w-3.5 h-3.5 sm:w-4 sm:h-4"
                        style={{ color: COLORS.success[600] }}
                      />
                      <span
                        className="text-xs sm:text-sm font-semibold"
                        style={{ color: COLORS.success[600] }}
                      >
                        {artisan.completionRate}% rate
                      </span>
                    </div>
                  </div>
                </div>

                {/* Specialties */}
                <div className="mb-4">
                  <p
                    className="text-xs font-medium mb-2"
                    style={{ color: COLORS.gray[500] }}
                  >
                    Specialties
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {artisan.specialties.map((specialty, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: COLORS.gray[100],
                          color: COLORS.gray[700],
                        }}
                      >
                        {specialty}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Booking History */}
                {artisan.totalBooked > 0 && (
                  <div
                    className="mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: COLORS.primary[50] }}
                  >
                    <p
                      className="text-xs font-semibold"
                      style={{ color: COLORS.primary[600] }}
                    >
                      You've booked {artisan.totalBooked}x
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: COLORS.primary[600] }}
                    >
                      Last: {artisan.lastBooked}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      navigate("/booking", {
                        state: { artisan, selectedService: null },
                      })
                    }
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all text-xs sm:text-sm"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #224e8c, #2a5ca8)",
                    }}
                  >
                    Book Now
                  </button>
                  <button
                    onClick={() => setSelectedArtisan(artisan)}
                    className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all text-xs sm:text-sm"
                    style={{
                      borderColor: COLORS.gray[300],
                      color: COLORS.gray[700],
                    }}
                  >
                    View Details
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {/* Load More Button */}
      {savedArtisansHasMore && (
        <div
          className="bg-white rounded-xl sm:rounded-2xl p-4 flex justify-center"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <button
            onClick={loadMoreSavedArtisans}
            disabled={isSavedArtisansLoading}
            className="px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
            }}
          >
            {isSavedArtisansLoading
              ? "Loading..."
              : `Load More (${
                  savedArtisansTotal - savedArtisans.length
                } remaining)`}
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedArtisan && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full my-4 sm:my-8 max-h-[95vh] overflow-hidden flex flex-col">
            <div
              className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center z-10 rounded-t-xl sm:rounded-t-2xl flex-shrink-0"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="min-w-0 flex-1 mr-2">
                <h2
                  className="text-lg sm:text-2xl font-bold truncate"
                  style={{ color: COLORS.gray[900] }}
                >
                  {selectedArtisan.name}
                </h2>
                <p
                  className="text-xs sm:text-sm truncate"
                  style={{ color: COLORS.gray[600] }}
                >
                  {selectedArtisan.service} Specialist
                </p>
              </div>
              <button
                onClick={() => setSelectedArtisan(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
              {/* Profile Overview */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  <img
                    src={selectedArtisan.photo}
                    alt={selectedArtisan.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 flex-shrink-0"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                  <div className="flex-1 min-w-0 w-full">
                    <h3
                      className="font-bold text-lg sm:text-xl mb-2 truncate"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {selectedArtisan.name}
                    </h3>
                    <div className="flex items-center space-x-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                            i < Math.floor(selectedArtisan.rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                      <span
                        className="text-xs sm:text-sm font-bold ml-1"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {selectedArtisan.rating}
                      </span>
                      <span
                        className="text-xs sm:text-sm"
                        style={{ color: COLORS.gray[500] }}
                      >
                        ({selectedArtisan.reviews} reviews)
                      </span>
                    </div>

                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {selectedArtisan.badges.map((badge) => {
                        const badgeStyle = getBadgeColor(badge);
                        return (
                          <span
                            key={badge}
                            className="px-2 sm:px-3 py-1 rounded-full text-xs font-semibold flex items-center space-x-1"
                            style={{
                              backgroundColor: badgeStyle.bg,
                              color: badgeStyle.text,
                            }}
                          >
                            {getBadgeIcon(badge)}
                            <span>{badge}</span>
                          </span>
                        );
                      })}
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-2 sm:space-y-3">
                      <div className="flex items-center space-x-2">
                        <Phone
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          style={{ color: COLORS.gray[400] }}
                        />
                        <span
                          className="text-xs sm:text-sm break-all"
                          style={{ color: COLORS.gray[700] }}
                        >
                          {selectedArtisan.phone}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail
                          className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0"
                          style={{ color: COLORS.gray[400] }}
                        />
                        <span
                          className="text-xs sm:text-sm break-all"
                          style={{ color: COLORS.gray[700] }}
                        >
                          {selectedArtisan.email}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                <div className="bg-blue-50 rounded-lg p-3 sm:p-4 text-center">
                  <Briefcase
                    className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <p
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: COLORS.primary[600] }}
                  >
                    {selectedArtisan.jobsCompleted}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                    Jobs Done
                  </p>
                </div>
                <div className="bg-green-50 rounded-lg p-3 sm:p-4 text-center">
                  <TrendingUp
                    className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2"
                    style={{ color: COLORS.success[600] }}
                  />
                  <p
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: COLORS.success[600] }}
                  >
                    {selectedArtisan.completionRate}%
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                    Success Rate
                  </p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 sm:p-4 text-center">
                  <Clock
                    className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2"
                    style={{ color: "#9333ea" }}
                  />
                  <p
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: "#9333ea" }}
                  >
                    {selectedArtisan.responseTime}
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                    Response
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 text-center">
                  <Award
                    className="w-5 h-5 sm:w-6 sm:h-6 mx-auto mb-2"
                    style={{ color: "#f59e0b" }}
                  />
                  <p
                    className="text-xl sm:text-2xl font-bold"
                    style={{ color: "#f59e0b" }}
                  >
                    {selectedArtisan.yearsExperience}y
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                    Experience
                  </p>
                </div>
              </div>

              {/* Specialties */}
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Specialties
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedArtisan.specialties.map((specialty, i) => (
                    <span
                      key={i}
                      className="px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm"
                      style={{
                        backgroundColor: COLORS.primary[50],
                        color: COLORS.primary[600],
                      }}
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Pricing */}
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Pricing
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Hourly Rate
                    </span>
                    <span
                      className="text-xl sm:text-2xl font-bold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {selectedArtisan.hourlyRate}
                    </span>
                  </div>
                </div>
              </div>

              {/* Availability */}
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Availability
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Current Status
                    </span>
                    <span
                      className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
                      style={{
                        backgroundColor: getAvailabilityStyle(
                          selectedArtisan.availability
                        ).bg,
                        color: getAvailabilityStyle(
                          selectedArtisan.availability
                        ).text,
                      }}
                    >
                      {selectedArtisan.availability}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking History */}
              {selectedArtisan.totalBooked > 0 && (
                <div>
                  <h3
                    className="text-base sm:text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Your Booking History
                  </h3>
                  <div
                    className="bg-blue-50 border rounded-xl p-4"
                    style={{ borderColor: "#93c5fd" }}
                  >
                    <p
                      className="text-xs sm:text-sm font-semibold mb-1"
                      style={{ color: COLORS.primary[600] }}
                    >
                      You've worked with {selectedArtisan.name}{" "}
                      {selectedArtisan.totalBooked} time
                      {selectedArtisan.totalBooked > 1 ? "s" : ""}
                    </p>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.primary[600] }}
                    >
                      Last booking: {selectedArtisan.lastBooked}
                    </p>
                  </div>
                </div>
              )}

              {/* Saved Info */}
              <div>
                <h3
                  className="text-base sm:text-lg font-bold mb-3"
                  style={{ color: COLORS.gray[900] }}
                >
                  Saved Information
                </h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center justify-between">
                    <span
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Date Saved
                    </span>
                    <span
                      className="text-xs sm:text-sm font-semibold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {selectedArtisan.savedDate}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions - Sticky Bottom */}
            <div
              className="sticky bottom-0 bg-white border-t p-4 sm:p-6 flex flex-col sm:flex-row gap-2 sm:gap-3 flex-shrink-0"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <button
                onClick={() => {
                  setSelectedArtisan(null);
                  navigate("/booking", {
                    state: {
                      artisan: selectedArtisan,
                      selectedService: null,
                    },
                  });
                }}
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all text-sm"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Book Now
              </button>
              <button
                className="flex-1 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2 text-sm"
                style={{
                  borderColor: COLORS.gray[300],
                  color: COLORS.gray[700],
                }}
              >
                <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>Message</span>
              </button>
              <button
                onClick={() => handleRemove(selectedArtisan)}
                className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all text-sm"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
