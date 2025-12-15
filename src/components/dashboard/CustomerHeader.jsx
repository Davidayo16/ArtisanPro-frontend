import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bell,
  Search,
  ChevronDown,
  User,
  Settings,
  HelpCircle,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { authApi } from "../../api/authApi";
import { useAuthStore } from "../../stores/authStore";
import { useNotificationStore } from "../../stores/notificationStore";
import {
  getNotificationMeta,
  getActionUrl,
  formatNotificationTime,
} from "../../utils/notificationHelpers";

export default function CustomerHeader({
  sidebarCollapsed,
  setSidebarCollapsed,
  setSidebarOpen,
  sidebarOpen,
}) {
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Real user from auth store
  const { user } = useAuthStore();

  // Real notifications from store
  const {
    notifications,
    unreadCount,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotificationStore();

  // Fetch unread count on mount
  useEffect(() => {
    fetchUnreadCount();
  }, [fetchUnreadCount]);

  // Fetch recent notifications when dropdown opens
  useEffect(() => {
    if (showNotifications && notifications.length === 0) {
      fetchNotifications({ limit: 10 });
    }
  }, [showNotifications, notifications.length, fetchNotifications]);

  // Display name & email fallback
  const displayName = user
    ? `${user.firstName || user.firstName + " " + user.lastName}`.trim() ||
      user.email.split("@")[0]
    : "Customer";

  const displayEmail = user?.email || "Loading...";

  // Handle Google profile photo safely
  const rawGooglePhoto = user?.profilePhoto;
  const profileImage = rawGooglePhoto
    ? `https://images.weserv.nl/?url=${encodeURIComponent(
        rawGooglePhoto
      )}&w=96&h=96&fit=cover&mask=circle`
    : "/images/customer-avatar.jpg"; // fallback image

  // Only show first 5 notifications
  const recentNotifications = notifications.slice(0, 5);

  // Handle notification click (same logic as Artisan)
  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    setShowNotifications(false);

    const targetUrl = getActionUrl(notification);
    navigate(targetUrl);

    if (window.location.pathname === targetUrl) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    fetchUnreadCount();
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      useAuthStore.getState().logout();
      window.location.href = "/login";
    } catch (err) {
      useAuthStore.getState().logout();
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-[60] transition-all duration-300">
      <div className="px-3 sm:px-3 lg:px-3 h-16 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
              setShowNotifications(false);
              setShowProfileMenu(false);
            }}
            className="lg:hidden p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>

          {/* Desktop Sidebar Toggle */}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex p-2.5 hover:bg-gray-100 rounded-lg transition-all duration-200 items-center justify-center"
            aria-label={
              sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
            }
          >
            {sidebarCollapsed ? (
              <PanelLeftOpen className="w-5 h-5 text-gray-700" />
            ) : (
              <PanelLeftClose className="w-5 h-5 text-gray-700" />
            )}
          </button>

          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="/images/logo.png"
              alt="ArtisanPro"
              className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
            />
          </Link>
        </div>

        {/* Search Bar - Desktop Only */}
        <div className="hidden md:flex flex-1 max-w-xl mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search artisans, services, bookings..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
              }}
              className="relative p-2 hover:bg-gray-100 rounded-lg transition-all"
              aria-label={`${unreadCount} unread notifications`}
            >
              <Bell className="w-6 h-6 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount > 99 ? "99+" : unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <>
                <div
                  className="fixed inset-0 top-16 z-30"
                  onClick={() => setShowNotifications(false)}
                />
                <div className="fixed top-16 right-2 left-2 sm:absolute sm:right-0 sm:left-auto sm:top-auto mt-0 sm:mt-2 w-auto sm:w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40 animate-slideDown">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Notifications</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {recentNotifications.length === 0 ? (
                      <div className="p-8 text-center">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm text-gray-600">
                          No notifications yet
                        </p>
                      </div>
                    ) : (
                      recentNotifications.map((notif) => {
                        const meta = getNotificationMeta(notif.type);
                        const Icon = meta.icon;
                        return (
                          <button
                            key={notif._id}
                            onClick={() => handleNotificationClick(notif)}
                            className={`w-full p-4 border-b border-gray-100 hover:bg-gray-50 text-left transition-all ${
                              !notif.isRead ? "bg-blue-50" : ""
                            }`}
                          >
                            <div className="flex items-start space-x-3">
                              <div
                                className="p-2 rounded-lg flex-shrink-0"
                                style={{
                                  backgroundColor: !notif.isRead
                                    ? meta.color.bg
                                    : "#f3f4f6",
                                }}
                              >
                                <Icon
                                  className="w-5 h-5"
                                  style={{
                                    color: !notif.isRead
                                      ? meta.color.text
                                      : "#6b7280",
                                  }}
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2">
                                  <p className="font-semibold text-sm text-gray-900">
                                    {notif.title}
                                  </p>
                                  {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-blue-600"></span>
                                  )}
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  {formatNotificationTime(notif.createdAt)}
                                </p>
                              </div>
                            </div>
                          </button>
                        );
                      })
                    )}
                  </div>

                  <div className="p-3 border-t border-gray-200 text-center">
                    <Link
                      to="/customer/dashboard/notifications"
                      onClick={() => setShowNotifications(false)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View All Notifications
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 sm:space-x-3 p-2 hover:bg-gray-100 rounded-lg transition-all"
            >
              <img
                src={profileImage}
                alt="Profile"
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-gray-200"
                onError={(e) => {
                  e.target.src = "/images/customer-avatar.jpg";
                }}
              />
              <div className="hidden sm:block text-left">
                <p className="font-semibold text-sm text-gray-900 truncate max-w-32">
                  {displayName}
                </p>
                <p className="text-xs text-gray-600">Customer</p>
              </div>
              <ChevronDown
                className={`w-4 h-4 text-gray-600 hidden sm:block transition-transform ${
                  showProfileMenu ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Menu */}
            {showProfileMenu && (
              <>
                <div
                  className="fixed inset-0 top-16 z-30"
                  onClick={() => setShowProfileMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-40 animate-slideDown">
                  <div className="p-4 border-b border-gray-200">
                    <p className="font-bold text-gray-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {displayEmail}
                    </p>
                  </div>
                  <div className="py-2">
                    <Link
                      to="/customer/dashboard/profile"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <User className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">My Profile</span>
                    </Link>
                    <Link
                      to="/customer/dashboard/settings"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <Settings className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">Settings</span>
                    </Link>
                    <Link
                      to="/customer/dashboard/support"
                      className="flex items-center space-x-3 px-4 py-2 hover:bg-gray-50 transition"
                      onClick={() => setShowProfileMenu(false)}
                    >
                      <HelpCircle className="w-4 h-4 text-gray-600" />
                      <span className="text-sm text-gray-700">
                        Help & Support
                      </span>
                    </Link>
                  </div>
                  <div className="border-t border-gray-200 py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 hover:bg-red-50 text-left"
                    >
                      <LogOut className="w-4 h-4 text-red-600" />
                      <span className="text-sm text-red-600 font-medium">
                        Logout
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}
