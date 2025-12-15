import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Star,
  Filter,
  X,
  Map,
  Grid,
  ChevronDown,
  Heart,
  Clock,
  Shield,
  Award,
  Zap,
  Loader,
  AlertCircle,
  Navigation,
  MapPin,
  Phone,
  MessageCircle,
} from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useArtisanStore } from "../../stores/artisanStore";
import { useCustomerDashboardStore } from "../../stores/customerDashboardStore";
import { useAuthStore } from "../../stores/authStore";
import { formatArtisanPrice } from "../../utils/formatArtisanPrice";

// Fix Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function Artisans() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const {
    artisans,
    totalArtisans,
    totalPages,
    currentPage,
    isLoading,
    error,
    filters,
    sortBy,
    services,
    categories,
    isLoadingServices,
    fetchArtisans,
    fetchServices,
    fetchCategories,
    setFilter,
    clearFilters,
    setPage,
    nextPage,
    prevPage,
    setSortBy,
    getSortedArtisans,
    getUserLocation,
    clearLocation,
    clearError,
  } = useArtisanStore();

  const {
    addSavedArtisan,
    removeSavedArtisan,
    savedArtisans,
    fetchSavedArtisans,
  } = useCustomerDashboardStore();

  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchInput, setSearchInput] = useState("");
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  useEffect(() => {
    fetchArtisans();
    fetchServices();
    fetchCategories();
    fetchSavedArtisans();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.searchTerm) {
        setFilter("searchTerm", searchInput);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const sortedArtisans = getSortedArtisans();

  const isSaved = (artisanId) => {
    return savedArtisans.some((a) => a.id === artisanId);
  };

  const toggleSaveArtisan = async (artisanId) => {
    const wasSaved = isSaved(artisanId);

    if (wasSaved) {
      const { savedArtisans } = useCustomerDashboardStore.getState();
      useCustomerDashboardStore.setState({
        savedArtisans: savedArtisans.filter((a) => a.id !== artisanId),
      });

      const result = await removeSavedArtisan(artisanId);
      if (!result.success) {
        useCustomerDashboardStore.setState({ savedArtisans });
      }
    } else {
      const { savedArtisans } = useCustomerDashboardStore.getState();
      const artisan = artisans.find((a) => a._id === artisanId);

      useCustomerDashboardStore.setState({
        savedArtisans: [
          ...savedArtisans,
          {
            id: artisanId,
            firstName: artisan?.firstName,
            lastName: artisan?.lastName,
            profilePhoto: artisan?.profilePhoto,
          },
        ],
      });

      const result = await addSavedArtisan(artisanId);
      if (!result.success) {
        useCustomerDashboardStore.setState({ savedArtisans });
      }
    }
  };

  const handleNearMe = async () => {
    setIsGettingLocation(true);
    try {
      await getUserLocation();
    } catch (error) {
      alert(
        error.message ||
          "Could not get your location. Please enable location services."
      );
    } finally {
      setIsGettingLocation(false);
    }
  };

  const getBadgeIcon = (badge) => {
    const icons = {
      top_rated: <Award className="w-3 h-3" />,
      verified: <Shield className="w-3 h-3" />,
      quick_response: <Zap className="w-3 h-3" />,
      new_artisan: <Star className="w-3 h-3" />,
    };
    return icons[badge] || null;
  };

  const getBadgeColor = (badge) => {
    const colors = {
      top_rated: "bg-yellow-100 text-yellow-700",
      verified: "bg-blue-100 text-blue-700",
      quick_response: "bg-green-100 text-green-700",
      new_artisan: "bg-purple-100 text-purple-700",
    };
    return colors[badge] || "bg-gray-100 text-gray-700";
  };

  const getBadgeLabel = (badge) => {
    const labels = {
      top_rated: "Top Rated",
      verified: "Verified",
      quick_response: "Quick Response",
      new_artisan: "New",
    };
    return labels[badge] || badge;
  };

  const getArtisanName = (artisan) => {
    return (
      `${artisan.firstName || ""} ${artisan.lastName || ""}`.trim() || "Artisan"
    );
  };

 const getArtisanImage = (artisan) => {
   const photo = artisan.profilePhoto;

   // Google or external image — make it rectangular and sharp
   if (photo && photo.startsWith("http")) {
     return `https://images.weserv.nl/?url=${encodeURIComponent(
       photo
     )}&w=800&h=600&fit=cover`;
     // No &mask=circle → perfectly rectangular
   }

   // Uploaded image from your server
   if (photo && photo !== "default-avatar.png") {
     return `${import.meta.env.VITE_API_URL || ""}/uploads/${photo}`;
   }

   // Fallback avatar — also rectangular
   return `https://ui-avatars.com/api/?name=${encodeURIComponent(
     getArtisanName(artisan)
   )}&background=2a5ca8&color=fff&size=800&bold=true`;
 };
  const FilterSidebar = () => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-gray-900">Filters</h3>
        <button
          onClick={() => setShowFilters(false)}
          className="lg:hidden text-gray-500 hover:text-gray-700"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Category
        </label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value)}
          disabled={isLoadingServices}
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Service
        </label>
        <select
          className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={filters.service}
          onChange={(e) => setFilter("service", e.target.value)}
          disabled={isLoadingServices}
        >
          <option value="">All Services</option>
          {services.map((service) => (
            <option key={service._id} value={service._id}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Location
        </label>
        {filters.latitude && filters.longitude ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-lg">
              <span className="text-xs text-green-700 flex items-center gap-1.5">
                <Navigation className="w-3.5 h-3.5" />
                Using your location
              </span>
              <button
                onClick={clearLocation}
                className="text-xs text-red-600 hover:text-red-800 font-medium"
              >
                Clear
              </button>
            </div>
            <div>
              <label className="block text-xs text-gray-600 mb-1">
                Radius: {filters.radius}km
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.radius}
                onChange={(e) => setFilter("radius", e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={handleNearMe}
            disabled={isGettingLocation}
            className="w-full py-2 px-3 text-sm text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            style={{
              backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
            }}
          >
            {isGettingLocation ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Getting location...
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                Find Near Me
              </>
            )}
          </button>
        )}
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-900 mb-2">
          Rating
        </label>
        <div className="space-y-1.5">
          {["", "5", "4", "3"].map((rating) => (
            <label
              key={rating || "all"}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="radio"
                name="rating"
                value={rating}
                checked={filters.minRating === rating}
                onChange={(e) => setFilter("minRating", e.target.value)}
                className="w-4 h-4 text-blue-600"
              />
              <div className="flex items-center space-x-1">
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-700">
                  {rating ? `${rating}+ Stars` : "All"}
                </span>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.availability}
            onChange={(e) => setFilter("availability", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Available Now</span>
        </label>

        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={filters.verified}
            onChange={(e) => setFilter("verified", e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded"
          />
          <span className="text-sm text-gray-700">Verified Only</span>
        </label>
      </div>

      <button
        onClick={clearFilters}
        className="w-full py-2 px-3 text-sm border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
      >
        Clear All
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header — FIXED TO SHOW USER WHEN LOGGED IN */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <Link to="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="ArtisanPro NG"
                className="w-16 h-16 lg:w-20 lg:h-20 object-contain"
              />
            </Link>

            <div className="hidden lg:flex items-center gap-6">
              {isAuthenticated && user ? (
                <button
                  onClick={() =>
                    navigate(
                      user.role === "artisan"
                        ? "/artisan/dashboard"
                        : "/customer/dashboard"
                    )
                  }
                  className="flex items-center gap-3 hover:bg-gray-100 px-4 py-2 rounded-xl transition"
                >
                  <img
                    src={
                      user.profilePhoto
                        ? `https://images.weserv.nl/?url=${encodeURIComponent(
                            user.profilePhoto
                          )}&w=96&h=96&fit=cover&mask=circle`
                        : "/images/customer-avatar.jpg"
                    }
                    alt={user.firstName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                    onError={(e) =>
                      (e.target.src = "/images/customer-avatar.jpg")
                    }
                  />
                  <div className="text-left">
                    <p className="font-medium text-gray-900">
                      Hi, {user.firstName || "User"}
                    </p>
                    <p className="text-xs text-gray-500">Dashboard</p>
                  </div>
                </button>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2"
                  >
                    Login
                  </Link>
                  <button
                    className="text-white px-6 py-2.5 rounded-xl text-sm font-semibold"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #224e8c, #2a5ca8)",
                    }}
                  >
                    Sign Up
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden p-2"
            >
              <Filter className="w-5 h-5 text-gray-700" />
            </button>
          </div>

          <div className="py-3">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search artisans or services..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                />
              </div>
              <button
                onClick={handleNearMe}
                disabled={isGettingLocation}
                className="text-white px-5 py-2.5 rounded-lg font-semibold text-sm disabled:opacity-50 flex items-center justify-center gap-2 whitespace-nowrap"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                {isGettingLocation ? (
                  <Loader className="w-4 h-4 animate-spin" />
                ) : (
                  <Navigation className="w-4 h-4" />
                )}
                <span className="hidden sm:inline">Near Me</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Quick Categories */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex overflow-x-auto space-x-2 pb-2 scrollbar-hide">
            <button
              className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
                !filters.category
                  ? "bg-gray-200 "
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() => setFilter("category", "")}
            >
              All
            </button>
            {categories.slice(0, 10).map((cat) => (
              <button
                key={cat._id}
                className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium text-xs transition-all ${
                  filters.category === cat._id
                    ? "bg-gray-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("category", cat._id)}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-800">{error}</p>
            </div>
            <button
              onClick={clearError}
              className="text-red-600 hover:text-red-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6">
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </aside>

          {showFilters && (
            <div
              className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={() => setShowFilters(false)}
            >
              <div
                className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-white overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4">
                  <FilterSidebar />
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 min-w-0">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-gray-900">
                    {totalArtisans} Artisans
                  </h2>
                  <p className="text-xs text-gray-600">
                    Page {currentPage} of {totalPages}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded ${
                        viewMode === "grid" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <Grid className="w-4 h-4 text-gray-700" />
                    </button>
                    <button
                      onClick={() => setViewMode("map")}
                      className={`p-1.5 rounded ${
                        viewMode === "map" ? "bg-white shadow-sm" : ""
                      }`}
                    >
                      <Map className="w-4 h-4 text-gray-700" />
                    </button>
                  </div>

                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-3 py-1.5 pr-8 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-xs font-medium"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="rating">Top Rated</option>
                      <option value="price-low">Price: Low</option>
                      <option value="price-high">Price: High</option>
                      <option
                        value="distance"
                        disabled={!filters.latitude || !filters.longitude}
                      >
                        Nearest{" "}
                        {(!filters.latitude || !filters.longitude) &&
                          "(Enable location)"}
                      </option>
                      <option value="most-booked">Most Booked</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : sortedArtisans.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  No Artisans Found
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Try adjusting your filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
                >
                  Clear Filters
                </button>
              </div>
            ) : viewMode === "grid" ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                  {sortedArtisans.map((artisan) => {
                    const price = formatArtisanPrice(artisan.services);
                    const location = [
                      artisan.location?.city,
                      artisan.location?.state,
                    ]
                      .filter(Boolean)
                      .join(", ");

                    return (
                      <div
                        key={artisan._id}
                        className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
                      >
                        <div className="relative">
                          <img
                            src={getArtisanImage(artisan)}
                            alt={getArtisanName(artisan)}
                            className="w-full h-48 object-cover"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                getArtisanName(artisan)
                              )}&background=2a5ca8&color=fff&size=800&bold=true&format=svg`;
                            }}
                          />
                          <button
                            onClick={() => toggleSaveArtisan(artisan._id)}
                            className={`absolute top-2 right-2 p-1.5 rounded-full shadow-lg transition-all ${
                              isSaved(artisan._id)
                                ? "bg-red-500 text-white"
                                : "bg-white text-gray-700 hover:bg-red-50"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${
                                isSaved(artisan._id) ? "fill-current" : ""
                              }`}
                            />
                          </button>
                          {artisan.isAvailableNow && (
                            <div className="absolute bottom-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
                              <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                              Available
                            </div>
                          )}
                        </div>

                        <div className="p-4">
                          <div className="mb-3">
                            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                              {getArtisanName(artisan)}
                            </h3>

                            <div className="flex items-center gap-2 text-sm mb-2">
                              <div className="flex items-center gap-1">
                                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-bold text-gray-900">
                                  {artisan.averageRating?.toFixed(1) || "N/A"}
                                </span>
                              </div>
                              <span className="text-gray-600">
                                ({artisan.totalReviews || 0})
                              </span>
                              {location && (
                                <>
                                  <span className="text-gray-400">•</span>
                                  <div className="flex items-center gap-1 text-gray-600">
                                    <MapPin className="w-3 h-3" />
                                    <span className="truncate">{location}</span>
                                  </div>
                                </>
                              )}
                            </div>

                            {artisan.yearsOfExperience > 0 && (
                              <p className="text-xs text-gray-600 mb-2">
                                {artisan.yearsOfExperience}{" "}
                                {artisan.yearsOfExperience === 1
                                  ? "year"
                                  : "years"}{" "}
                                experience
                              </p>
                            )}

                            {artisan.bio && (
                              <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                                {artisan.bio}
                              </p>
                            )}
                          </div>

                          <p className="text-xs text-gray-600 mb-3 truncate">
                            {artisan.services?.map((s) => s.name).join(", ") ||
                              "Services unavailable"}
                          </p>

                          {artisan.badges && artisan.badges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {artisan.badges.slice(0, 3).map((badge) => (
                                <span
                                  key={badge}
                                  className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getBadgeColor(
                                    badge
                                  )}`}
                                >
                                  {getBadgeIcon(badge)}
                                  <span>{getBadgeLabel(badge)}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                            {/* {price ? (
                              <div>
                                <p className="text-lg font-bold text-gray-900">
                                  {price}
                                </p>
                              </div>
                            ) : (
                              <div></div>
                            )} */}
                            <button
                              onClick={() =>
                                navigate(`/artisan/${artisan._id}`)
                              }
                              className="px-5 py-2 rounded-lg text-white text-sm font-semibold hover:shadow-md transition-all"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, #224e8c, #2a5ca8)",
                              }}
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-6 flex items-center justify-center gap-1.5">
                    <button
                      onClick={prevPage}
                      disabled={currentPage === 1}
                      className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                        currentPage === 1
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Prev
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
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
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                            currentPage === pageNum
                              ? "text-white"
                              : "border border-gray-300 text-gray-700 hover:bg-gray-50"
                          }`}
                          style={
                            currentPage === pageNum
                              ? {
                                  backgroundImage:
                                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                                }
                              : {}
                          }
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={nextPage}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1.5 border rounded-lg text-xs font-medium transition-colors ${
                        currentPage === totalPages
                          ? "border-gray-300 text-gray-400 cursor-not-allowed"
                          : "border-gray-300 text-gray-700 hover:bg-gray-50"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <MapContainer
                  center={[9.082, 8.6753]}
                  zoom={6}
                  style={{ height: "600px", width: "100%" }}
                  className="relative z-0"
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap"
                  />

                  {sortedArtisans.map((artisan) => {
                    const coords = artisan.location?.coordinates?.coordinates;
                    if (!coords || coords.length !== 2) return null;

                    const [lng, lat] = coords;

                    return (
                      <Marker key={artisan._id} position={[lat, lng]}>
                        <Popup>
                          <div className="min-w-[220px]">
                            <div className="flex items-center gap-2 mb-2">
                              <img
                                src={getArtisanImage(artisan)}
                                alt={getArtisanName(artisan)}
                                className="w-10 h-10  object-cover"
                                onError={(e) => {
                                  e.target.src =
                                    "https://ui-avatars.com/api/?name=" +
                                    encodeURIComponent(
                                      getArtisanName(artisan)
                                    ) +
                                    "&background=2a5ca8&color=fff&size=80";
                                }}
                              />
                              <div>
                                <h4 className="font-bold text-sm text-gray-900">
                                  {getArtisanName(artisan)}
                                </h4>
                                <p className="text-xs text-gray-600">
                                  {artisan.services[0]?.name || "Artisan"}
                                </p>
                              </div>
                            </div>

                            {artisan.isAvailableNow && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-2">
                                <div className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                Available Now
                              </span>
                            )}

                            <div className="flex items-center gap-1.5 mb-2">
                              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                              <span className="font-bold text-sm">
                                {artisan.averageRating?.toFixed(1) || "N/A"}
                              </span>
                              <span className="text-xs text-gray-600">
                                ({artisan.totalReviews || 0})
                              </span>
                            </div>

                            {artisan.totalJobsCompleted > 0 && (
                              <p className="text-xs text-gray-700 mb-3">
                                {artisan.totalJobsCompleted} jobs completed
                              </p>
                            )}

                            <button
                              onClick={() =>
                                navigate(`/artisan/${artisan._id}`)
                              }
                              className="w-full text-white py-1.5 rounded-lg text-xs font-semibold hover:shadow-md transition-all"
                              style={{
                                backgroundImage:
                                  "linear-gradient(to right, #224e8c, #2a5ca8)",
                              }}
                            >
                              View Profile
                            </button>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </MapContainer>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
