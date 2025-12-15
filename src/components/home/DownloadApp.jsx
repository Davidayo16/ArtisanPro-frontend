import React from "react";
import { Apple, Play, Star, CheckCircle } from "lucide-react";

export default function DownloadApp() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50">
      {/* Blob Wave Shape at Top */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-none">
        <svg
          className="relative block w-full h-20 sm:h-24"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
            className="fill-white"
          ></path>
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-gray-900">
            <div className="inline-flex items-center gap-2 bg-amber-200/60 px-4 py-2 rounded-full mb-6 border border-amber-300">
              <Star size={16} className="fill-amber-500 text-amber-600" />
              <span className="text-sm font-semibold text-gray-800">
                4.8 Rating | 50K+ Downloads
              </span>
            </div>

            <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight text-gray-900">
              Book Artisans on the Go
            </h2>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Download our mobile app and book trusted professionals in seconds.
              Get instant notifications, track your bookings, and pay
              securely—all from your phone.
            </p>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <button
                className="bg-gradient-to-br text-white px-6 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-3 group"
                style={{
                  background:
                    "linear-gradient(to bottom right, #224e8c, #2a5ca8)",
                }}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Apple size={24} className="text-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-blue-100">Download on the</p>
                  <p className="text-base font-bold">App Store</p>
                </div>
              </button>

              <button
                className="bg-gradient-to-br text-white px-6 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all shadow-lg flex items-center justify-center gap-3 group"
                style={{
                  background:
                    "linear-gradient(to bottom right, #224e8c, #2a5ca8)",
                }}
              >
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Play size={24} className="text-white fill-white" />
                </div>
                <div className="text-left">
                  <p className="text-xs text-blue-100">Get it on</p>
                  <p className="text-base font-bold">Google Play</p>
                </div>
              </button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle size={20} style={{ color: "#224e8c" }} />
                <span className="text-gray-800">Instant Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} style={{ color: "#224e8c" }} />
                <span className="text-gray-800">Real-time Tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} style={{ color: "#224e8c" }} />
                <span className="text-gray-800">Secure Payments</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={20} style={{ color: "#224e8c" }} />
                <span className="text-gray-800">24/7 Support</span>
              </div>
            </div>
          </div>

          {/* Right Phone Mockup */}
          <div className="relative lg:block hidden">
            <div className="relative z-10">
              {/* Phone Frame */}
              <div className="relative mx-auto w-72 h-[550px] bg-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-7 bg-gray-900 rounded-b-3xl z-20"></div>

                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* App Screenshot */}
                  <div className="w-full h-full bg-gradient-to-br from-blue-50 to-white p-4">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6 px-2">
                      <img
                        src="/images/logo.png"
                        alt="Logo"
                        className="h-8 w-auto object-contain"
                      />
                      <div className="flex gap-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                      </div>
                    </div>

                    {/* Search Bar */}
                    <div className="mb-4 px-2">
                      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-200 flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                        <div className="h-2 bg-gray-200 rounded flex-1"></div>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="mb-4 px-2">
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {["Plumbing", "Electrical", "Carpentry"].map(
                          (cat, i) => (
                            <div
                              key={i}
                              className="px-4 py-2 text-white rounded-lg text-xs font-semibold whitespace-nowrap shadow-sm"
                              style={{
                                background:
                                  "linear-gradient(to right, #224e8c, #2a5ca8)",
                              }}
                            >
                              {cat}
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Artisan Cards */}
                    <div className="space-y-3 px-2">
                      {[1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="bg-white rounded-xl p-3 shadow-sm border border-gray-100"
                        >
                          <div className="flex gap-3">
                            <div
                              className="w-14 h-14 rounded-lg flex-shrink-0"
                              style={{
                                background:
                                  "linear-gradient(to bottom right, #e6f0fa, #cce0f5)",
                              }}
                            ></div>
                            <div className="flex-1 min-w-0">
                              <div className="h-3 bg-gray-200 rounded w-3/4 mb-2"></div>
                              <div className="h-2 bg-gray-100 rounded w-1/2 mb-2"></div>
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, idx) => (
                                  <div
                                    key={idx}
                                    className="w-2 h-2 bg-yellow-400 rounded-full"
                                  ></div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-300/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-300/30 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
