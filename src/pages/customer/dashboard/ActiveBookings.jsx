// ============================================
// 📁 frontend/pages/customer/ActiveBookings.jsx
// FIXED: Backend filtering + optimized performance
// ============================================

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  Star,
  CheckCircle,
  Loader,
  MapPin,
  MessageSquare,
  Hourglass,
  XCircle,
  Loader2,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useCustomerBookingStore } from "../../../stores/customerBookingStore";

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
const StatCard = React.memo(({ icon: Icon, label, value, change, trend }) => (
  <div
    className="bg-white rounded-2xl p-6 transition-all duration-300 group cursor-pointer"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: COLORS.primary[50] }}
      >
        <Icon className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
      </div>
      {trend === "up" && change && (
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
    <p className="text-sm mb-1 font-medium" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
    <p className="text-3xl font-bold" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
  </div>
));

const StatusBadge = React.memo(({ status }) => {
  const statusMap = {
    pending: {
      bg: COLORS.warning[50],
      text: COLORS.warning[500],
      icon: Hourglass,
      label: "Pending",
    },
    accepted: {
      bg: COLORS.primary[50],
      text: COLORS.primary[600],
      icon: CheckCircle,
      label: "Accepted",
    },
    confirmed: {
      bg: COLORS.success[50],
      text: COLORS.success[600],
      icon: CheckCircle,
      label: "Confirmed",
    },
    negotiating: {
      bg: COLORS.warning[50],
      text: COLORS.warning[500],
      icon: MessageSquare,
      label: "Negotiating",
    },
    in_progress: {
      bg: COLORS.primary[50],
      text: COLORS.primary[600],
      icon: Loader,
      label: "In Progress",
    },
    completed: {
      bg: COLORS.success[50],
      text: COLORS.success[600],
      icon: CheckCircle,
      label: "Completed",
    },
    cancelled: {
      bg: COLORS.gray[100],
      text: COLORS.gray[600],
      icon: XCircle,
      label: "Cancelled",
    },
    declined: {
      bg: COLORS.danger[50],
      text: COLORS.danger[600],
      icon: XCircle,
      label: "Declined",
    },
  };

  const style = statusMap[status] || {
    bg: COLORS.gray[50],
    text: COLORS.gray[600],
    icon: Package,
    label: status,
  };
  const Icon = style.icon;

  return (
    <div
      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-semibold"
      style={{ backgroundColor: style.bg, color: style.text }}
    >
      <Icon
        className={`w-4 h-4 ${status === "in_progress" ? "animate-spin" : ""} ${
          status === "pending" ? "animate-pulse" : ""
        }`}
      />
      <span>{style.label}</span>
    </div>
  );
});

/* ==================== MAIN COMPONENT ==================== */
export default function ActiveBookings() {
  const navigate = useNavigate();

  const { bookings, stats, loading, pagination, fetchBookings, fetchStats } =
    useCustomerBookingStore();

  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("soonest");

  /* ---------------------- DEBOUNCE SEARCH ---------------------- */
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  /* ---------------------- FETCH ON FILTER/SEARCH CHANGE ---------------------- */
  useEffect(() => {
    const controller = new AbortController();

    // Map frontend "all" to backend undefined
    const backendStatus = statusFilter === "all" ? undefined : statusFilter;

    fetchBookings({
      status: backendStatus,
      search: debouncedSearch,
      page: 1,
      limit: 50, // Fetch more for client-side sorting/pagination
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [statusFilter, debouncedSearch]);

  /* ---------------------- FETCH STATS ON MOUNT ---------------------- */
  useEffect(() => {
    fetchStats();
  }, []);

  /* ---------------------- FORMAT HELPERS ---------------------- */
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return `${
        months[date.getMonth()]
      } ${date.getDate()}, ${date.getFullYear()}`;
    } catch {
      return "N/A";
    }
  };

  const formatAmount = (booking) => {
    const amount = booking.agreedPrice || booking.estimatedPrice || 0;
    return `₦${amount.toLocaleString()}`;
  };

  const getArtisanName = (artisan) => {
    if (!artisan) return "Unknown";
    return (
      `${artisan.firstName || ""} ${artisan.lastName || ""}`.trim() || "Unknown"
    );
  };

  /* ---------------------- SORTING (Client-side for UX) ---------------------- */
  const sortedBookings = useMemo(() => {
    const copy = [...bookings];
    switch (sortBy) {
      case "soonest":
        copy.sort(
          (a, b) =>
            new Date(a.scheduledDate).getTime() -
            new Date(b.scheduledDate).getTime()
        );
        break;
      case "amount-high":
        copy.sort(
          (a, b) =>
            (b.agreedPrice || b.estimatedPrice || 0) -
            (a.agreedPrice || a.estimatedPrice || 0)
        );
        break;
      case "recent":
        copy.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      default:
        break;
    }
    return copy;
  }, [bookings, sortBy]);

  /* ---------------------- PAGINATION (Client-side for UX) ---------------------- */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { totalPages, currentPageData } = useMemo(() => {
    const pages = Math.ceil(sortedBookings.length / itemsPerPage);
    const data = sortedBookings.slice(
      (currentPage - 1) * itemsPerPage,
      currentPage * itemsPerPage
    );
    return { totalPages: pages, currentPageData: data };
  }, [sortedBookings, currentPage, itemsPerPage]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, debouncedSearch, sortBy]);

  /* ---------------------- HANDLERS ---------------------- */
  const handleViewDetails = (booking) => {
    navigate(`/booking-status/${booking._id}`);
  };

  const handleChat = (booking) => {
    navigate(`/chat/${booking._id}`);
  };

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1
              className="text-2xl sm:text-3xl font-bold"
              style={{ color: COLORS.gray[900] }}
            >
              My Bookings
            </h1>
            <p className="mt-1" style={{ color: COLORS.gray[600] }}>
              Track and manage your service requests
            </p>
          </div>
          <button
            onClick={() => navigate("/artisans")}
            className="px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
            style={{
              background: "linear-gradient(to right, #224e8c, #2a5ca8)",
            }}
          >
            Book New Service
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Package}
            label="Total Bookings"
            value={stats.total}
            trend="neutral"
          />
          <StatCard
            icon={Hourglass}
            label="Pending"
            value={stats.pending}
            trend="neutral"
          />
          <StatCard
            icon={Loader}
            label="Active"
            value={stats.active}
            trend="neutral"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={stats.completed}
            trend="neutral"
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
                placeholder="Search by artisan, service, or booking number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                style={{ borderColor: COLORS.gray[200] }}
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {[
                { value: "all", label: "All" },
                { value: "pending", label: "Pending" },
                { value: "accepted", label: "Accepted" },
                { value: "confirmed", label: "Confirmed" },
                { value: "in_progress", label: "In Progress" },
                { value: "completed", label: "Completed" },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setStatusFilter(opt.value)}
                  className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    statusFilter === opt.value
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Sort */}
        <div
          className="bg-white rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <span
            className="text-sm font-semibold"
            style={{ color: COLORS.gray[700] }}
          >
            Sort By:
          </span>
          <div className="flex gap-2">
            {[
              { v: "soonest", l: "Soonest" },
              { v: "amount-high", l: "Highest Price" },
              { v: "recent", l: "Most Recent" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setSortBy(o.v)}
                className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  sortBy === o.v
                    ? "bg-blue-50 text-blue-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-6 animate-pulse"
                  style={{ border: `1px solid ${COLORS.gray[100]}` }}
                >
                  <div className="flex gap-6">
                    <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : currentPageData.length === 0 ? (
            <div
              className="bg-white rounded-2xl p-12 text-center"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                <Package
                  className="w-8 h-8"
                  style={{ color: COLORS.gray[400] }}
                />
              </div>
              <h3
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                No bookings found
              </h3>
              <p className="mt-1 mb-4" style={{ color: COLORS.gray[600] }}>
                {searchQuery || statusFilter !== "all"
                  ? "Try adjusting your filters"
                  : "Book an artisan to get started"}
              </p>
              <button
                onClick={() => navigate("/artisans")}
                className="px-6 py-2.5 rounded-lg font-semibold text-white"
                style={{
                  background: "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Browse Artisans
              </button>
            </div>
          ) : (
            currentPageData.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-md"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Artisan Info */}
                  <div className="flex items-start gap-4 lg:w-1/3">
                    <img
                      src={
                        b.artisan?.profilePhoto ||
                        "https://i.pravatar.cc/150?img=8"
                      }
                      alt={getArtisanName(b.artisan)}
                      className="w-16 h-16 rounded-full object-cover border-2"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                    <div className="flex-1">
                      <h3
                        className="font-bold text-lg"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {getArtisanName(b.artisan)}
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {b.service?.name || "Service"}
                      </p>
                      {b.artisan?.averageRating && (
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span
                            className="text-sm font-medium"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {b.artisan.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Booking Details */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p
                          className="text-xs font-medium"
                          style={{ color: COLORS.gray[500] }}
                        >
                          Booking #
                        </p>
                        <p
                          className="text-sm font-bold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {b.bookingNumber}
                        </p>
                      </div>
                      <StatusBadge status={b.status} />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          Scheduled
                        </p>
                        <div className="flex items-center space-x-2">
                          <Calendar
                            className="w-4 h-4"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {formatDate(b.scheduledDate)}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1">
                          <Clock
                            className="w-4 h-4"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {b.scheduledTime}
                          </span>
                        </div>
                      </div>
                      <div>
                        <p
                          className="text-xs font-medium mb-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          Amount
                        </p>
                        <p
                          className="text-lg font-bold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {formatAmount(b)}
                        </p>
                        {b.paymentStatus === "paid" && (
                          <p className="text-xs font-semibold text-green-600 mt-1">
                            ✓ Paid
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Status-specific info */}
                    {b.status === "pending" && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-yellow-800">
                          Waiting for artisan to respond
                        </p>
                      </div>
                    )}

                    {b.status === "negotiating" && (
                      <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-orange-800">
                          Price negotiation in progress
                        </p>
                      </div>
                    )}

                    {b.status === "accepted" && (
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                        <p className="text-xs font-semibold text-blue-800">
                          Accepted! Proceed to payment
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="lg:w-1/4 space-y-2">
                    <button
                      onClick={() => handleViewDetails(b)}
                      className="w-full px-6 py-2.5 rounded-lg font-semibold text-white transition-all duration-200"
                      style={{
                        background:
                          "linear-gradient(to right, #224e8c, #2a5ca8)",
                      }}
                    >
                      View Details
                    </button>

                    <button
                      onClick={() => handleChat(b)}
                      className="w-full px-6 py-2.5 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-2"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="bg-white rounded-2xl p-4 flex items-center justify-between"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                    currentPage === i + 1
                      ? "bg-blue-50 text-blue-600"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "hover:bg-gray-100"
              }`}
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
