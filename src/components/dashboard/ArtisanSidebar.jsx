import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  Briefcase,
  Calendar,
  DollarSign,
  User,
  Star,
  MessageSquare,
  Bell,
  TrendingUp,
  Megaphone,
  MapPin,
  HelpCircle,
  Settings,
} from "lucide-react";
import { useNotificationStore } from "../../stores/notificationStore";
import { useBookingStore } from "../../stores/bookingStore";

export default function ArtisanSidebar({ collapsed, mobile }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Get real notification count
  const { unreadCount, fetchUnreadCount } = useNotificationStore();

  // Get real job counts
  const { bookings } = useBookingStore();
  const pendingJobsCount = bookings.filter(
    (b) => b.status === "pending"
  ).length;

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      path: "/artisan/dashboard",
    },

    {
      id: "jobs",
      label: "Jobs",
      icon: Briefcase,
      path: "/artisan/dashboard/jobs",
      badge: pendingJobsCount > 0 ? pendingJobsCount : null,
    },
    {
      id: "calendar",
      label: "Calendar",
      icon: Calendar,
      path: "/artisan/dashboard/calendar",
    },
    // {
    //   id: "earnings",
    //   label: "Earnings",
    //   icon: DollarSign,
    //   path: "/artisan/dashboard/earnings",
    // },
    {
      id: "profile",
      label: "Profile",
      icon: User,
      path: "/artisan/dashboard/profile",
    },
    {
      id: "reviews",
      label: "Reviews",
      icon: Star,
      path: "/artisan/dashboard/reviews",
      badge: null, // Can be updated with real review count later
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/artisan/dashboard/notifications",
      badge: unreadCount > 0 ? unreadCount : null,
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: TrendingUp,
      path: "/artisan/dashboard/analytics",
    },
    // {
    //   id: "messages",
    //   label: "Messages",
    //   icon: MessageSquare,
    //   path: "/artisan/dashboard/messages",
    //   badge: null, // Can be updated with real message count later
    // },

    // {
    //   id: "marketing",
    //   label: "Marketing",
    //   icon: Megaphone,
    //   path: "/artisan/dashboard/marketing",
    // },
    {
      id: "location",
      label: "Location",
      icon: MapPin,
      path: "/artisan/dashboard/location",
    },
    // {
    //   id: "support",
    //   label: "Support",
    //   icon: HelpCircle,
    //   path: "/artisan/dashboard/support",
    // },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/artisan/dashboard/settings",
    },
  ];

  return (
    <aside
      className={`${
        mobile ? "w-full" : "hidden lg:block fixed left-0 top-16 bottom-0"
      } bg-white border-r border-gray-200 transition-all duration-300 ease-in-out overflow-y-auto ${
        collapsed ? "w-[70px]" : "w-[250px]"
      }`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 #f1f5f9",
      }}
    >
      <nav className="p-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`
                w-full flex items-center 
                ${collapsed ? "justify-center px-2.5" : "justify-start px-3"} 
                py-3 rounded-xl transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-gray-100 text-blue-600 shadow-sm"
                    : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
                }
              `}
              title={collapsed && !mobile ? item.label : ""}
            >
              {/* Icon */}
              <div
                className="flex items-center justify-center"
                style={{ width: "20px", height: "20px" }}
              >
                <Icon
                  className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                    isActive
                      ? "text-blue-600"
                      : "text-gray-600 group-hover:text-blue-600"
                  }`}
                />
              </div>

              {/* Label */}
              {(!collapsed || mobile) && (
                <span
                  className={`font-medium text-sm flex-1 text-left transition-all duration-200 ml-3 ${
                    collapsed ? "opacity-0 w-0" : "opacity-100"
                  }`}
                >
                  {item.label}
                </span>
              )}

              {/* Badge */}
              {item.badge && (
                <>
                  {collapsed && !mobile ? (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse">
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  ) : (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold transition-all duration-200 ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Branding */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-200 mt-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 text-center">
            <p className="text-xs font-semibold text-gray-700 mb-1">
              Go Premium!
            </p>
            <button className="text-xs text-blue-600 hover:text-blue-700 font-bold transition-colors duration-200">
              Upgrade Now
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        aside::-webkit-scrollbar {
          width: 6px;
        }
        aside::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        aside::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 3px;
        }
        aside::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </aside>
  );
}
