import React, { useState, useEffect } from "react";
import CustomerSidebar from "../components/dashboard/CustomerSidebar";
import CustomerHeader from "../components/dashboard/CustomerHeader";
import { X } from "lucide-react";

export default function CustomerDashboardLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [children]);

  // Prevent body scroll when mobile sidebar is open
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [sidebarOpen]);

  // Handle escape key to close mobile sidebar
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && sidebarOpen) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [sidebarOpen]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header - FIXED: Added sidebarOpen prop */}
      <CustomerHeader
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        setSidebarOpen={setSidebarOpen}
        sidebarOpen={sidebarOpen}
      />

      <div className="flex">
        {/* Sidebar - Desktop */}
        <CustomerSidebar collapsed={sidebarCollapsed} />

        {/* Sidebar - Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 z-40 transition-opacity duration-300 ease-in-out"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(2px)",
            }}
            onClick={() => setSidebarOpen(false)}
          >
            <div
              className="absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out"
              onClick={(e) => e.stopPropagation()}
              style={{
                transform: sidebarOpen ? "translateX(0)" : "translateX(-100%)",
              }}
            >
              {/* Mobile Sidebar Header */}
              <div
                className="p-4 border-b border-gray-200 flex items-center justify-between"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                <div className="flex items-center space-x-2">
                  <img
                    src="/images/logo.png"
                    alt="ArtisanPro"
                    className="w-10 h-10 object-contain"
                  />
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>

              {/* Mobile Sidebar Content */}
              <div className="overflow-y-auto h-[calc(100vh-73px)]">
                <CustomerSidebar mobile />
              </div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main
          className={`flex-1 min-w-0 transition-all duration-300 ease-in-out ${
            sidebarCollapsed ? "lg:ml-[70px]" : "lg:ml-[250px]"
          }`}
        >
          <div className="p-4 sm:p-6 lg:p-8 mt-16 min-h-screen">
            {/* Content wrapper for animations */}
            <div className="animate-fadeIn">{children}</div>
          </div>
        </main>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
