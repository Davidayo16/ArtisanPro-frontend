// frontend/pages/customer/CustomerNotifications.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell,
  CheckCircle,
  AlertCircle,
  Info,
  DollarSign,
  Calendar,
  MessageSquare,
  Star,
  Gift,
  MapPin,
  Package,
  Clock,
  Search,
  Check,
  Trash2,
  Settings,
  ChevronRight,
  TrendingUp,
  Award,
  Loader,
} from "lucide-react";
import { useNotificationStore } from "../../../stores/notificationStore";
import {
  getNotificationMeta,
  getActionUrl,
  groupNotificationsByDate,
  formatNotificationTime,
} from "../../../utils/notificationHelpers";

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
  warning: { 50: "#fffbeb", 500: "#f59e0b", 600: "#d97706" },
  danger: { 50: "#fef2f2", 600: "#dc2626" },
  info: { 50: "#eff6ff", 600: "#2563eb" },
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
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-3 rounded-xl" style={{ backgroundColor: color.bg }}>
        <Icon className="w-6 h-6" style={{ color: color.text }} />
      </div>
    </div>
    <p className="text-3xl font-bold mb-1" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
    <p className="text-sm font-medium" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function CustomerNotifications() {
  const navigate = useNavigate();

  /* ---------------------- STATE ---------------------- */
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedNotifications, setSelectedNotifications] = useState([]);

  /* ---------------------- ZUSTAND STORE ---------------------- */
  const {
    notifications,
    unreadCount,
    loading,
    pagination,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteSelected,
  } = useNotificationStore();

  /* ---------------------- FETCH ON MOUNT ---------------------- */
  useEffect(() => {
    const controller = new AbortController();

    fetchNotifications({
      page: 1,
      limit: 50, // Load more for client-side filtering
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchNotifications]);

  /* ---------------------- CALCULATIONS ---------------------- */
  const todayCount = notifications.filter(
    (n) => new Date(n.createdAt) > new Date(Date.now() - 24 * 60 * 60000)
  ).length;

  const thisWeekCount = notifications.filter(
    (n) => new Date(n.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60000)
  ).length;

  const bookingNotifCount = notifications.filter((n) =>
    n.type?.includes("booking")
  ).length;

  const paymentNotifCount = notifications.filter(
    (n) => n.type === "payment_successful" || n.type === "payment_failed"
  ).length;

  const messageNotifCount = notifications.filter((n) =>
    n.type?.includes("message")
  ).length;

  /* ---------------------- FILTER ---------------------- */
  const getFilteredNotifications = () => {
    let list = [...notifications];

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "unread") {
        list = list.filter((n) => !n.isRead);
      } else if (activeTab === "booking") {
        list = list.filter((n) => n.type?.includes("booking"));
      } else if (activeTab === "payment") {
        list = list.filter(
          (n) =>
            n.type === "payment_successful" ||
            n.type === "payment_failed" ||
            n.type === "refund_processed"
        );
      } else if (activeTab === "message") {
        list = list.filter((n) => n.type?.includes("message"));
      }
    }

    // Filter by search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (n) =>
          n.title?.toLowerCase().includes(q) ||
          n.message?.toLowerCase().includes(q)
      );
    }

    return list;
  };

  const filtered = getFilteredNotifications();

  // Group by date
  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filtered),
    [filtered]
  );

  /* ---------------------- HANDLERS ---------------------- */
  const handleNotificationClick = async (notification) => {
    // Mark as read and navigate
    if (!notification.isRead) {
      markAsRead(notification._id);
    }
    navigate(getActionUrl(notification));
  };

  const handleMarkAllAsRead = () => {
    if (window.confirm("Mark all notifications as read?")) {
      markAllAsRead();
    }
  };

  const handleDelete = (e, id) => {
    e.stopPropagation(); // Prevent navigation
    if (window.confirm("Delete this notification?")) {
      deleteNotification(id);
    }
  };

  const handleSelectNotification = (e, id) => {
    e.stopPropagation(); // Prevent navigation
    setSelectedNotifications((prev) =>
      prev.includes(id) ? prev.filter((n) => n !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedNotifications.length === 0) return;
    if (
      window.confirm(
        `Delete ${selectedNotifications.length} selected notification(s)?`
      )
    ) {
      deleteSelected(selectedNotifications);
      setSelectedNotifications([]);
    }
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Notifications
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Stay updated with your bookings and activities
          </p>
        </div>
        <button
          onClick={() => navigate("/customer/dashboard/settings")}
          className="px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
          style={{
            borderColor: COLORS.gray[300],
            color: COLORS.gray[700],
          }}
        >
          <Settings className="w-5 h-5" />
          <span>Preferences</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={Bell}
          label="Unread"
          value={unreadCount}
          color={{ bg: COLORS.danger[50], text: COLORS.danger[600] }}
        />
        <StatCard
          icon={Clock}
          label="Today"
          value={todayCount}
          color={{ bg: COLORS.primary[50], text: COLORS.primary[600] }}
        />
        <StatCard
          icon={Package}
          label="Total"
          value={notifications.length}
          color={{ bg: COLORS.gray[100], text: COLORS.gray[600] }}
        />
        <StatCard
          icon={TrendingUp}
          label="This Week"
          value={thisWeekCount}
          color={{ bg: COLORS.success[50], text: COLORS.success[600] }}
        />
      </div>

      {/* Search & Filters */}
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
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
              style={{ borderColor: COLORS.gray[200] }}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
            {[
              { id: "all", label: "All", count: notifications.length },
              { id: "unread", label: "Unread", count: unreadCount },
              { id: "booking", label: "Bookings", count: bookingNotifCount },
              { id: "payment", label: "Payments", count: paymentNotifCount },
              { id: "message", label: "Messages", count: messageNotifCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-primary-50 text-primary-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      {filtered.length > 0 && (
        <div
          className="bg-white rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <div className="flex items-center space-x-4">
            {selectedNotifications.length > 0 && (
              <span
                className="text-sm font-medium"
                style={{ color: COLORS.gray[700] }}
              >
                {selectedNotifications.length} selected
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="px-4 py-2 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all text-sm flex items-center space-x-2"
                style={{
                  borderColor: COLORS.gray[300],
                  color: COLORS.gray[700],
                }}
              >
                <Check className="w-4 h-4" />
                <span>Mark All Read</span>
              </button>
            )}
            {selectedNotifications.length > 0 && (
              <button
                onClick={handleDeleteSelected}
                className="px-4 py-2 rounded-lg border-2 border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all text-sm flex items-center space-x-2"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Selected</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Notifications List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader
            className="w-8 h-8 animate-spin"
            style={{ color: COLORS.primary[600] }}
          />
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedNotifications).map(([period, notifs]) => {
            if (notifs.length === 0) return null;

            const periodLabels = {
              today: "Today",
              yesterday: "Yesterday",
              thisWeek: "This Week",
              older: "Older",
            };

            return (
              <div key={period}>
                <h3
                  className="text-sm font-bold mb-3 uppercase tracking-wide"
                  style={{ color: COLORS.gray[500] }}
                >
                  {periodLabels[period]}
                </h3>
                <div className="space-y-3">
                  {notifs.map((notification) => {
                    const meta = getNotificationMeta(notification.type);
                    const Icon = meta.icon;
                    const isSelected = selectedNotifications.includes(
                      notification._id
                    );

                    return (
                      <div
                        key={notification._id}
                        onClick={() => handleNotificationClick(notification)}
                        className={`bg-white rounded-xl p-4 transition-all duration-300 hover:shadow-md cursor-pointer ${
                          !notification.isRead ? "border-l-4" : ""
                        }`}
                        style={{
                          border: `1px solid ${COLORS.gray[100]}`,
                          borderLeftColor: !notification.isRead
                            ? meta.color.text
                            : COLORS.gray[100],
                        }}
                      >
                        <div className="flex items-start gap-4">
                          {/* Checkbox */}
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) =>
                              handleSelectNotification(e, notification._id)
                            }
                            onClick={(e) => e.stopPropagation()}
                            className="mt-1 w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                          />

                          {/* Icon */}
                          <div
                            className="p-3 rounded-xl flex-shrink-0"
                            style={{ backgroundColor: meta.color.bg }}
                          >
                            <Icon
                              className="w-5 h-5"
                              style={{ color: meta.color.text }}
                            />
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <h4
                                    className="font-bold text-base"
                                    style={{ color: COLORS.gray[900] }}
                                  >
                                    {notification.title}
                                  </h4>
                                  {!notification.isRead && (
                                    <span
                                      className="w-2 h-2 rounded-full"
                                      style={{
                                        backgroundColor: COLORS.primary[600],
                                      }}
                                    />
                                  )}
                                </div>
                                <p
                                  className="text-xs font-medium mb-2"
                                  style={{ color: meta.color.text }}
                                >
                                  {meta.category}
                                </p>
                              </div>
                              <span
                                className="text-xs whitespace-nowrap"
                                style={{ color: COLORS.gray[500] }}
                              >
                                {formatNotificationTime(notification.createdAt)}
                              </span>
                            </div>

                            <p
                              className="text-sm mb-3 leading-relaxed"
                              style={{ color: COLORS.gray[700] }}
                            >
                              {notification.message}
                            </p>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                              <span
                                className="text-sm font-semibold flex items-center space-x-1"
                                style={{ color: COLORS.primary[600] }}
                              >
                                <span>{meta.actionText}</span>
                                <ChevronRight className="w-4 h-4" />
                              </span>
                              <button
                                onClick={(e) =>
                                  handleDelete(e, notification._id)
                                }
                                className="text-sm font-medium hover:underline"
                                style={{ color: COLORS.danger[600] }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div
              className="bg-white rounded-2xl p-12 text-center"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="w-8 h-8" style={{ color: COLORS.gray[400] }} />
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                No notifications found
              </h3>
              <p className="mt-1" style={{ color: COLORS.gray[600] }}>
                {searchQuery
                  ? "Try adjusting your search"
                  : "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
