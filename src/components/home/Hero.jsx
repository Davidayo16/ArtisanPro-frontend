import React, { useState } from "react";
import { ArrowRight, Star, CheckCircle } from "lucide-react";
 import { useNavigate } from "react-router-dom";

export default function Hero() {
  const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();

  return (
    <section className="relative min-h-screen bg-white overflow-hidden">
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        {/* Grid pattern - more visible */}
        <div
          className="absolute inset-0 opacity-50"
          style={{
            backgroundImage: `linear-gradient(rgba(34,78,140,0.08) 1.5px, transparent 1.5px),
                             linear-gradient(90deg, rgba(34,78,140,0.08) 1.5px, transparent 1.5px)`,
            backgroundSize: "48px 48px",
          }}
        ></div>

        {/* Accent circles */}
        <div className="absolute top-32 -right-32 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>

        {/* Subtle dots pattern */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(34,78,140,0.15) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-12 pb-32">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Content - 6 columns */}
          <div className="lg:col-span-6 space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
              <span className="text-sm text-blue-900 font-medium">
                10,000+ Verified Professionals
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-6xl lg:text-7xl font-bold text-gray-900 leading-none tracking-tight">
                Find Skilled
                <br />
                <span className="relative inline-block mt-2">
                  <span className="relative z-10 bg-gradient-to-r from-blue-700 to-blue-900 bg-clip-text text-transparent">
                    Artisans
                  </span>
                  <div className="absolute bottom-2 left-0 right-0 h-3 bg-blue-600/10 -rotate-1"></div>
                </span>
                <br />
                <span className="text-gray-600">Near You</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-lg">
                Connect with verified professionals for plumbing, carpentry,
                electrical work, and more. Quality service, guaranteed results.
              </p>
            </div>

            {/* CTA - Using your exact primary button style */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => navigate("/artisans")}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="group relative inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl font-semibold overflow-hidden transition-all duration-300 hover:scale-105"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                  boxShadow: "0 10px 30px -10px rgba(34, 78, 140, 0.5)",
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Find Artisans
                  <ArrowRight
                    size={20}
                    className={`transition-transform duration-300 ${
                      isHovered ? "translate-x-2" : ""
                    }`}
                  />
                </span>

                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
                  }}
                />
              </button>

              <button className="px-8 py-4 bg-white border-2 border-gray-200 text-gray-900 rounded-xl font-semibold hover:border-gray-300 hover:bg-gray-50 transition-all duration-300">
                How It Works
              </button>
            </div>

            {/* Trust Stats - Cleaner */}
            <div className="flex flex-wrap gap-8 pt-8">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-300 to-blue-400 border-2 border-white"></div>
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                    +
                  </div>
                </div>
                <div>
                  <div className="text-gray-900 font-bold">50,000+</div>
                  <div className="text-gray-500 text-sm">Happy Customers</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <div>
                  <div className="text-gray-900 font-bold">4.8/5</div>
                  <div className="text-gray-500 text-sm">Average Rating</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - 6 columns, better spacing */}
          <div className="lg:col-span-6">
            <div className="relative">
              {/* Main Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="/images/hero1.jpg"
                  alt="Professional artisan at work"
                  className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>

              {/* Floating Verification Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-2xl border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center">
                    <CheckCircle className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-gray-900">98%</div>
                    <div className="text-sm text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>

              {/* Floating Review Card */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 max-w-xs hover:scale-105 transition-transform duration-300">
                <div className="flex gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-yellow-400 text-yellow-400"
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-700 font-medium mb-2">
                  "Excellent work quality!"
                </p>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full"></div>
                  <span className="text-xs text-gray-500 font-medium">
                    Sarah M.
                  </span>
                </div>
              </div>

              {/* Stats Badge */}
              <div className="absolute bottom-20 -right-4 bg-white rounded-xl px-4 py-3 shadow-xl border border-gray-100 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">15+</div>
                  <div className="text-xs text-gray-500 font-medium">
                    Cities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fade to gray-50 for next section */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-gray-50 pointer-events-none"></div>
    </section>
  );
}
