import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Search, Menu, X } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";

export default function PublicHeader() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useState("Detecting location...");

  // Smart location detection — better accuracy + Kogi fix
  useEffect(() => {
    const detectLocation = async () => {
      if (!("geolocation" in navigator)) {
        setLocation("Lagos");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}&addressdetails=1&zoom=10`
            );
            const data = await res.json();

            const state =
              data.address.state || data.address.region || data.address.county;
            const city =
              data.address.city || data.address.town || data.address.village;

            // Prioritize state for Nigeria (e.g., Kogi, Lagos, Abuja FCT)
            const finalLocation = state || city || "Nigeria";
            setLocation(finalLocation);
          } catch (err) {
            console.log("Geocode failed:", err);
            setLocation("Lagos");
          }
        },
        () => {
          setLocation("Lagos"); // Permission denied or timeout
        },
        { timeout: 8000, maximumAge: 600000 }
      );
    };

    detectLocation();
  }, []);

  // SAME MAGIC AS ARTISAN HEADER — Google photo + fallback
  const rawGooglePhoto = user?.profilePhoto;
  const profileImage = rawGooglePhoto
    ? `https://images.weserv.nl/?url=${encodeURIComponent(
        rawGooglePhoto
      )}&w=96&h=96&fit=cover&mask=circle`
    : "/images/customer-avatar.jpg";

  const displayName = user
    ? `${user.firstName || ""} ${user.lastName || ""}`.trim() ||
      user.email.split("@")[0]
    : "Guest";

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) {
      navigate(
        `/search?q=${encodeURIComponent(q)}&location=${encodeURIComponent(
          location
        )}`
      );
      setMobileMenuOpen(false);
    }
  };

  const goToDashboard = () => {
    const path =
      user?.role === "artisan" ? "/artisan/dashboard" : "/customer/dashboard";
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img
              src="/images/logo.png"
              alt="ArtisanPro"
              className="w-12 h-12 lg:w-14 lg:h-14 object-contain"
            />
            <span className="hidden sm:block font-bold text-xl text-gray-900">
              ArtisanPro
            </span>
          </Link>

          {/* Desktop Search */}
          <form
            onSubmit={handleSearch}
            className="hidden lg:flex flex-1 max-w-md mx-8"
          >
            <div className="relative w-full">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                name="search"
                type="text"
                placeholder="Plumber, electrician, AC repair..."
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoComplete="off"
              />
            </div>
          </form>

          {/* Desktop Right */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Location — No chevron! */}
            <div className="flex items-center gap-2 text-gray-700">
              <MapPin size={18} className="text-blue-600" />
              <span className="text-sm font-medium">{location}</span>
            </div>

            {isAuthenticated ? (
              <button
                onClick={goToDashboard}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-gray-100 transition group"
              >
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) =>
                    (e.target.src = "/images/customer-avatar.jpg")
                  }
                />
                <div className="text-left">
                  <p className="font-medium text-gray-900">
                    Hi, {user.firstName || "User"}
                  </p>
                  <p className="text-xs text-gray-500">View Dashboard</p>
                </div>
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-700 hover:text-blue-600 px-4 py-2"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="group relative px-6 py-2.5 text-white font-semibold text-sm rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
                  style={{
                    background: "linear-gradient(135deg, #224e8c, #2a5ca8)",
                  }}
                >
                  <span className="relative z-10">Sign Up Free</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                      animation: "shimmer 2s infinite",
                    }}
                  />
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <div className="flex lg:hidden items-center gap-3">
            {isAuthenticated ? (
              <button onClick={goToDashboard}>
                <img
                  src={profileImage}
                  alt={displayName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200"
                  onError={(e) =>
                    (e.target.src = "/images/customer-avatar.jpg")
                  }
                />
              </button>
            ) : (
              <Link
                to="/register"
                className="group relative px-4 py-2 text-white font-bold text-sm rounded-lg overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #224e8c, #2a5ca8)",
                }}
              >
                <span className="relative z-10">Sign Up</span>
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    animation: "shimmer 2s infinite",
                  }}
                />
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white">
          <div className="px-4 py-5 space-y-4">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  name="search"
                  type="text"
                  placeholder="Search services..."
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </form>

            <div className="flex items-center gap-2 px-4 py-3">
              <MapPin size={18} className="text-blue-600" />
              <span className="font-medium">{location}</span>
            </div>

            {isAuthenticated ? (
              <button
                onClick={goToDashboard}
                className="w-full text-left px-4 py-3 font-medium hover:bg-gray-50 rounded-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <Link
                to="/login"
                className="block w-full text-left px-4 py-3 font-medium hover:bg-gray-50 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </header>
  );
}
