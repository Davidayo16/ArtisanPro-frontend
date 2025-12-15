import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Navigation,
  Circle,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  X,
  Menu,
  Crosshair,
} from "lucide-react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle as LeafletCircle,
  Popup,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useArtisanProfileStore } from "../../../stores/artisanProfileStore";
import { useNavigate } from "react-router-dom";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: "#3b82f6",
  primaryDark: "#2563eb",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
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

/* ==================== MARKER ICON FIX ==================== */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

/* ==================== MAP EVENTS COMPONENT ==================== */
function LocationMarker({ position, setPosition, radius }) {
  const map = useMapEvents({
    locationfound(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, 14);
    },
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position) {
      map.setView(position, 14);
    }
  }, [position, map]);

  return position === null ? null : (
    <>
      <Marker position={position}>
        <Popup>Your service location</Popup>
      </Marker>
      <LeafletCircle
        center={position}
        radius={radius * 1000}
        pathOptions={{
          fillColor: COLORS.primary,
          fillOpacity: 0.15,
          color: COLORS.primary,
          weight: 2,
        }}
      />
    </>
  );
}

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanLocation() {
  const navigate = useNavigate();
  const { profile, fetchMyProfile, updateBasicInfo, isUpdating } =
    useArtisanProfileStore();

  const [position, setPosition] = useState(null);
  const [radius, setRadius] = useState(25);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [toast, setToast] = useState(null);

  const mapRef = useRef();

  /* ==================== TOAST HELPER ==================== */
  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* ==================== RESPONSIVE DETECTION ==================== */
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  /* ==================== LOAD PROFILE DATA ==================== */
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setLoading(true);
        await fetchMyProfile();
      } catch (err) {
        console.error("Error loading profile:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [fetchMyProfile]);

  /* ==================== SET DATA FROM PROFILE ==================== */
  useEffect(() => {
    if (profile) {
      // Set address fields
      if (profile.location) {
        setStreet(profile.location.street || "");
        setCity(profile.location.city || "");
        setState(profile.location.state || "");
        setCountry(profile.location.country || "Nigeria");

        // Set map coordinates
        if (
          profile.location.coordinates?.coordinates &&
          Array.isArray(profile.location.coordinates.coordinates) &&
          profile.location.coordinates.coordinates.length === 2
        ) {
          const [lng, lat] = profile.location.coordinates.coordinates;
          if (lat !== 0 && lng !== 0) {
            setPosition({ lat, lng });
          }
        }
      }

      // Set service radius
      if (profile.serviceRadius) {
        setRadius(profile.serviceRadius);
      }
    }
  }, [profile]);

  /* ==================== GET CURRENT LOCATION ==================== */
  const getCurrentLocation = () => {
    setLoading(true);
    setError("");

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lng: longitude });
        reverseGeocode(latitude, longitude);
        setLoading(false);
      },
      (err) => {
        setError("Failed to get location. Please enable GPS.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  /* ==================== REVERSE GEOCODE ==================== */
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await res.json();

      // Extract address components
      if (data.address) {
        setCity(
          data.address.city || data.address.town || data.address.village || ""
        );
        setState(data.address.state || "");
        setCountry(data.address.country || "Nigeria");
        setStreet(data.address.road || "");
      }
    } catch (err) {
      console.error("Reverse geocode error:", err);
    }
  };

  /* ==================== SAVE SETTINGS TO BACKEND ==================== */
  const saveSettings = async () => {
    if (!position) {
      showToast("Please set a location on the map", "error");
      return;
    }

    if (!city || !state) {
      showToast("Please provide city and state", "error");
      return;
    }

    try {
      await updateBasicInfo({
        businessName: profile.businessName,
        bio: profile.bio,
        phone: profile.phone,
        yearsOfExperience: profile.yearsOfExperience,
        serviceRadius: radius,
        location: {
          street,
          city,
          state,
          country,
          coordinates: [position.lng, position.lat], // [longitude, latitude]
        },
      });

      showToast("Location saved successfully!", "success");
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        navigate("/artisan/dashboard");
      }, 1500);
    } catch (err) {
      console.error("Error saving location:", err);
      showToast(
        err.response?.data?.message || "Failed to save location",
        "error"
      );
    }
  };

  /* ==================== INITIAL LOCATION ==================== */
  useEffect(() => {
    if (!position && !loading && profile) {
      // If profile has no coordinates, get current location
      if (
        !profile.location?.coordinates?.coordinates ||
        profile.location.coordinates.coordinates[0] === 0
      ) {
        getCurrentLocation();
      }
    }
  }, [loading, profile]);

  const estimatedJobs = Math.round(radius * 1.68); // Roughly 1.68 jobs per km

  return (
    <div className="h-screen w-full flex flex-col bg-gray-50 overflow-hidden">
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

      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 z-30 relative">
        <div className="px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Menu className="w-5 h-5" style={{ color: COLORS.gray[700] }} />
              </button>
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900">
                  Service Location
                </h1>
                <p className="text-xs lg:text-sm text-gray-600 hidden sm:block">
                  Define your coverage area and service location
                </p>
              </div>
            </div>

            {/* Quick Stats - Desktop Only */}
            <div className="hidden lg:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Circle className="w-4 h-4" style={{ color: COLORS.primary }} />
                <span className="font-medium text-gray-700">
                  {radius} km radius
                </span>
              </div>
              <div className="h-6 w-px bg-gray-300" />
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color: COLORS.success }} />
                <span className="font-medium text-gray-700">
                  ~{estimatedJobs} jobs in area
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Sidebar Panel */}
        <aside
          className={`
            ${
              sidebarOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0 lg:w-0"
            }
            ${isMobile ? "fixed inset-y-0 left-0 z-40 w-80" : "relative"}
            lg:w-96 bg-white border-r border-gray-200 transition-all duration-300 ease-in-out
            flex flex-col
          `}
        >
          {/* Sidebar Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">
              Location Settings
            </h2>
            {isMobile && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            )}
          </div>

          {/* Sidebar Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Service Radius */}
            <div>
              <label className="text-sm font-semibold mb-3 block text-gray-900">
                Service Radius
              </label>
              <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {radius} km
                  </span>
                  <span className="text-xs text-gray-500">Coverage Area</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={radius}
                  onChange={(e) => setRadius(Number(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, ${COLORS.primary} 0%, ${COLORS.primary} ${radius}%, ${COLORS.gray[200]} ${radius}%, ${COLORS.gray[200]} 100%)`,
                  }}
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>5 km (Local)</span>
                  <span>100 km (Regional)</span>
                </div>
              </div>
            </div>

            {/* Address Fields */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold mb-2 block text-gray-900">
                  Street Address (Optional)
                </label>
                <input
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="e.g., 15 Allen Avenue"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-900">
                    City *
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g., Lagos"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold mb-2 block text-gray-900">
                    State *
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    placeholder="e.g., Lagos State"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={getCurrentLocation}
                disabled={loading}
                className="w-full py-2.5 px-4 border border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Getting location...
                  </>
                ) : (
                  <>
                    <Crosshair className="w-4 h-4" />
                    Use Current Location
                  </>
                )}
              </button>
            </div>

            {/* Position Info */}
            {position && (
              <div className="bg-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Latitude</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {position.lat.toFixed(6)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-600">Longitude</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {position.lng.toFixed(6)}
                  </span>
                </div>
              </div>
            )}

            {/* Coverage Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-green-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  ~{estimatedJobs}
                </div>
                <div className="text-xs text-green-700 mt-1">
                  Available Jobs
                </div>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {(Math.PI * radius * radius).toFixed(0)}
                </div>
                <div className="text-xs text-purple-700 mt-1">km² Coverage</div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer - Save Button */}
          <div className="p-6 border-t border-gray-200">
            <button
              onClick={saveSettings}
              disabled={isUpdating || !position || !city || !state}
              className="w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: COLORS.primary }}
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-5 h-5" />
                  Location Saved!
                </>
              ) : (
                <>
                  <Save className="w-5 h-5" />
                  Save Location
                </>
              )}
            </button>
          </div>
        </aside>

        {/* Mobile Overlay */}
        {isMobile && sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Map Container */}
        <div className="flex-1 relative z-10">
          {loading && !position ? (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-20">
              <div className="text-center">
                <Loader2
                  className="w-10 h-10 animate-spin mx-auto mb-4"
                  style={{ color: COLORS.primary }}
                />
                <p className="text-base font-medium text-gray-900 mb-1">
                  Loading your location...
                </p>
                <p className="text-sm text-gray-600">Please wait</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 bg-white flex items-center justify-center z-20 p-6">
              <div className="text-center max-w-md">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle
                    className="w-8 h-8"
                    style={{ color: COLORS.danger }}
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Location Error
                </h3>
                <p className="text-sm text-gray-600 mb-6">{error}</p>
                <button
                  onClick={getCurrentLocation}
                  className="px-6 py-3 rounded-xl font-semibold text-white hover:shadow-lg transition-all"
                  style={{ backgroundColor: COLORS.primary }}
                >
                  Try Again
                </button>
              </div>
            </div>
          ) : (
            <MapContainer
              center={position || [6.5244, 3.3792]}
              zoom={position ? 14 : 10}
              className="h-full w-full"
              ref={mapRef}
              zoomControl={!isMobile}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              />
              <LocationMarker
                position={position}
                setPosition={(pos) => {
                  setPosition(pos);
                  reverseGeocode(pos.lat, pos.lng);
                }}
                radius={radius}
              />
            </MapContainer>
          )}

          {/* Floating Stats - Mobile Only */}
          {isMobile && position && (
            <div className="absolute bottom-4 left-4 right-4 bg-white rounded-2xl shadow-xl p-4 z-20">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: COLORS.primary }}
                  >
                    {radius} km
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Service Radius
                  </div>
                </div>
                <div>
                  <div
                    className="text-2xl font-bold"
                    style={{ color: COLORS.success }}
                  >
                    ~{estimatedJobs}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    Jobs Available
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Recenter Button */}
          {position && (
            <button
              onClick={() => mapRef.current?.setView(position, 14)}
              className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-3 hover:shadow-xl transition-all z-20"
            >
              <Navigation
                className="w-5 h-5"
                style={{ color: COLORS.primary }}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
