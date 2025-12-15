// frontend/pages/artisan/Jobs.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle,
  Loader,
  MapPin,
  DollarSign,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  Check,
  XCircle,
  Play,
  Timer,
  Package,
  Hourglass,
  Activity,
  Repeat,
} from "lucide-react";
import { useBookingStore } from "../../../stores/bookingStore";
import toast, { Toaster } from "react-hot-toast";

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

const StatCard = ({ icon: Icon, label, value, change, trend }) => (
  <div
    className="bg-white rounded-2xl p-4 sm:p-6 transition-all duration-300 group cursor-pointer min-w-0"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-3 sm:mb-4 min-w-0">
      <div
        className="p-2 sm:p-3 rounded-xl group-hover:scale-110 transition-transform duration-200 flex-shrink-0"
        style={{ backgroundColor: COLORS.primary[50] }}
      >
        <Icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: COLORS.primary[600] }} />
      </div>
      {trend === "up" && (
        <div
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold flex-shrink-0"
          style={{
            color: COLORS.success[600],
            backgroundColor: COLORS.success[50],
          }}
        >
          <span>{change}</span>
        </div>
      )}
    </div>
    <p className="text-xs sm:text-sm mb-1 font-medium truncate min-w-0" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
    <p className="text-2xl sm:text-3xl font-bold truncate min-w-0" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
  </div>
);

const StatusBadge = ({ status }) => {
  const styles = {
    pending: {
      bg: COLORS.warning[50],
      text: COLORS.warning[500],
      icon: Hourglass,
    },
    accepted: {
      bg: COLORS.primary[50],
      text: COLORS.primary[600],
      icon: CheckCircle,
    },
    confirmed: {
      bg: COLORS.primary[50],
      text: COLORS.primary[600],
      icon: CheckCircle,
    },
    negotiating: {
      bg: "#fff4e6",
      text: "#f97316",
      icon: MessageSquare,
    },
    in_progress: {
      bg: COLORS.primary[50],
      text: COLORS.primary[600],
      icon: Loader,
    },
    completed: {
      bg: COLORS.success[50],
      text: COLORS.success[600],
      icon: CheckCircle,
    },
    cancelled: { bg: COLORS.gray[100], text: COLORS.gray[600], icon: XCircle },
    declined: {
      bg: COLORS.danger[50],
      text: COLORS.danger[600],
      icon: XCircle,
    },
  }[status] || { bg: COLORS.gray[50], text: COLORS.gray[600], icon: Package };

  const Icon = styles.icon;
  return (
    <div
      className="inline-flex items-center space-x-1.5 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      <Icon
        className={`w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0 ${status === "in_progress" ? "animate-spin" : ""} ${
          status === "pending" ? "animate-pulse" : ""
        }`}
      />
      <span className="truncate">
        {status.charAt(0).toUpperCase() + status.slice(1).replace("_", " ")}
      </span>
    </div>
  );
};

const CountdownTimer = ({ secondsLeft }) => {
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const isUrgent = secondsLeft < 60;

  return (
    <div
      className={`flex items-center space-x-1 px-2 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-bold ${
        isUrgent ? "animate-pulse" : ""
      }`}
      style={{
        backgroundColor: isUrgent ? COLORS.danger[50] : COLORS.warning[50],
        color: isUrgent ? COLORS.danger[600] : COLORS.warning[500],
      }}
    >
      <Timer className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
      <span className="whitespace-nowrap">
        {minutes}:{seconds.toString().padStart(2, "0")}
      </span>
    </div>
  );
};

export default function ArtisanJobs() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const {
    bookings,
    loading,
    pagination,
    selectedBooking,
    showProposeModal,
    showDeclineModal,
    declineReason,
    proposeAmount,
    proposeMessage,
    fetchBookings,
    setSelected,
    openPropose,
    closePropose,
    openDecline,
    closeDecline,
    setDeclineReason,
    setProposeAmount,
    setProposeMessage,
    accept,
    decline,
    proposePrice,
    startJob,
    acceptCounterOffer,
    actionLoading,
    stats,
    fetchStats,
  } = useBookingStore();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const controller = new AbortController();

    const statusMap = {
      pending: "pending",
      active: "active",
      history: "history",
      recurring: undefined,
    };

    fetchBookings({
      status: statusMap[activeTab],
      page: pagination.page,
      search: debouncedSearch,
      signal: controller.signal,
    });

    return () => {
      controller.abort();
    };
  }, [activeTab, pagination.page, debouncedSearch]);

  useEffect(() => {
    fetchStats();
  }, []);

  const pendingCount = stats.pending || 0;
  const activeCount = stats.active || 0;
  const completedCount = stats.completed || 0;

  const handlePageChange = (newPage) => {
    fetchBookings({
      status: activeTab === "recurring" ? undefined : activeTab,
      page: newPage,
      search: debouncedSearch,
    });
  };

  useEffect(() => {
    if (selectedBooking || showProposeModal || showDeclineModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedBooking, showProposeModal, showDeclineModal]);

  const formatPrice = (amt) => `₦${(amt || 0).toLocaleString()}`;

  return (
    <div className="space-y-4 sm:space-y-6 max-w-full overflow-x-hidden">
      <Toaster position="top-center" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 min-w-0 w-full">
        <div className="min-w-0 flex-1 w-full">
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold truncate break-words"
            style={{ color: COLORS.gray[900] }}
          >
            My Jobs
          </h1>
          <p
            className="mt-1 text-sm truncate break-words"
            style={{ color: COLORS.gray[600] }}
          >
            Manage all your job requests and bookings
          </p>
        </div>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid grid-cols-1 min-[400px]:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        <StatCard
          icon={Hourglass}
          label="Pending Requests"
          value={pendingCount}
        />
        <StatCard icon={Activity} label="Active Jobs" value={activeCount} />
        <StatCard
          icon={CheckCircle}
          label="Completed"
          value={completedCount}
          trend="up"
          change="+8%"
        />
        <StatCard icon={Repeat} label="Recurring" value={0} />
      </div>

      {/* Tabs */}
      {/* Tabs */}
      {/* Tabs */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-1.5 sm:p-2 w-full overflow-x-auto scrollbar-hide"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex space-x-1.5 sm:space-x-2">
          {[
            {
              id: "pending",
              label: "Pending",
              fullLabel: "Pending Requests",
              count: pendingCount,
            },
            {
              id: "active",
              label: "Active",
              fullLabel: "Active Jobs",
              count: activeCount,
            },
            
            {
              id: "history",
              label: "History",
              fullLabel: "Job History",
              count: completedCount,
            },
            {
              id: "recurring",
              label: "Recurring",
              fullLabel: "Recurring",
              count: 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
              }}
              className={`flex items-center justify-center space-x-1.5 sm:space-x-2 px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <span className="hidden sm:inline">{tab.fullLabel}</span>
              <span className="sm:hidden">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className="px-1.5 sm:px-2 py-0.5 rounded-full text-xs font-bold min-w-[20px] text-center"
                  style={{
                    backgroundColor:
                      activeTab === tab.id
                        ? COLORS.primary[600]
                        : COLORS.gray[200],
                    color: activeTab === tab.id ? "white" : COLORS.gray[700],
                  }}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>
      {/* Search */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5"
            style={{ color: COLORS.gray[400] }}
          />
          <input
            type="text"
            placeholder="Search customer, service..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 sm:pl-10 pr-3 sm:pr-4 py-2 sm:py-2.5 border rounded-lg focus:outline-none focus:ring-2 text-sm sm:text-base"
            style={{ borderColor: COLORS.gray[200] }}
          />
        </div>
      </div>

      {/* Job List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 animate-pulse"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div className="flex gap-3 sm:gap-6">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-full flex-shrink-0"></div>
                  <div className="flex-1 space-y-2 sm:space-y-3 min-w-0">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div
            className="bg-white rounded-xl sm:rounded-2xl p-8 sm:p-12 text-center"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <Package
              className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4"
              style={{ color: COLORS.gray[400] }}
            />
            <h3
              className="text-lg sm:text-xl font-bold"
              style={{ color: COLORS.gray[900] }}
            >
              {activeTab === "recurring"
                ? "Recurring jobs coming soon"
                : "No jobs in this category"}
            </h3>
          </div>
        ) : (
          bookings.map((job) => (
            <div
              key={job._id}
              className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-6 transition-all duration-300"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div className="flex flex-col gap-3 sm:gap-4 lg:gap-6">
                {/* Top Row: Customer Info + Status */}
                <div className="flex flex-col gap-3 min-w-0">
                  {/* Customer */}
                  <div className="flex items-start gap-2 sm:gap-3 lg:gap-4 min-w-0">
                    <img
                      src={
                        job.customerPhoto ||
                        `https://ui-avatars.com/api/?name=${job.customerName}&background=3b82f6&color=fff&size=150`
                      }
                      alt={job.customerName}
                      className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover border-2 flex-shrink-0"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-bold text-sm sm:text-base lg:text-lg truncate"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {job.customerName}
                      </h3>
                      <p
                        className="text-xs sm:text-sm truncate"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {job.serviceName}
                      </p>
                      <div className="flex items-center gap-1 sm:gap-2 mt-1 sm:mt-2">
                        <MapPin
                          className="w-3 h-3 flex-shrink-0"
                          style={{ color: COLORS.gray[400] }}
                        />
                        <span
                          className="text-xs truncate"
                          style={{ color: COLORS.gray[500] }}
                        >
                          {job.distance ? `${job.distance.toFixed(1)} km` : "—"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge & Ref */}
                  <div className="flex items-center justify-between gap-2 flex-wrap min-w-0">
                    <p
                      className="text-xs font-medium truncate"
                      style={{ color: COLORS.gray[500] }}
                    >
                      Ref: {job.bookingNumber}
                    </p>
                    <StatusBadge status={job.status} />
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-2 sm:space-y-3 min-w-0">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {/* Scheduled */}
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium mb-1"
                        style={{ color: COLORS.gray[500] }}
                      >
                        Scheduled
                      </p>
                      <div className="flex items-center space-x-1.5 sm:space-x-2">
                        <Calendar
                          className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                          style={{ color: COLORS.gray[400] }}
                        />
                        <span
                          className="text-xs sm:text-sm truncate"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {new Date(job.scheduledDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1.5 sm:space-x-2 mt-1">
                        <Clock
                          className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0"
                          style={{ color: COLORS.gray[400] }}
                        />
                        <span
                          className="text-xs sm:text-sm truncate"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {job.scheduledTime}
                        </span>
                      </div>
                    </div>

                    {/* Price */}
                    <div className="min-w-0">
                      <p
                        className="text-xs font-medium mb-1 truncate"
                        style={{ color: COLORS.gray[500] }}
                      >
                        {job.agreedPrice
                          ? "Agreed Price"
                          : job.finalPrice
                          ? "Final Price"
                          : "Amount"}
                      </p>
                      <p
                        className="text-base sm:text-lg font-bold truncate"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {formatPrice(
                          job.agreedPrice ||
                            job.finalPrice ||
                            job.estimatedPrice
                        )}
                      </p>
                      {job.status === "negotiating" &&
                        job.negotiation?.rounds && (
                          <p className="text-xs text-orange-600 font-medium mt-1">
                            Negotiating
                          </p>
                        )}
                      {job.agreedPrice &&
                        job.estimatedPrice !== job.agreedPrice && (
                          <p className="text-xs text-gray-500 line-through truncate">
                            {formatPrice(job.estimatedPrice)}
                          </p>
                        )}
                    </div>
                  </div>

                  {/* Countdown Timer */}
                  {job.status === "pending" && job.timeLeftSeconds > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-red-50 border border-red-200 rounded-lg p-2 sm:p-3">
                      <p className="text-xs font-semibold text-red-800">
                        Accept within 2 minutes or auto-decline
                      </p>
                      <CountdownTimer secondsLeft={job.timeLeftSeconds} />
                    </div>
                  )}

                  {/* Negotiation status */}
                  {job.status === "negotiating" &&
                    job.negotiation?.rounds &&
                    (() => {
                      const rounds = job.negotiation.rounds;
                      const latestRound = rounds[rounds.length - 1];
                      const isCustomerCounter =
                        latestRound?.proposedBy === "customer";

                      if (!isCustomerCounter) return null;

                      return (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-2 sm:p-3">
                          <p className="text-xs font-semibold text-orange-800 mb-1 sm:mb-2">
                            Customer sent counter-offer
                          </p>
                          <p className="text-base sm:text-lg font-bold text-orange-900 truncate">
                            {formatPrice(
                              latestRound.amount || latestRound.proposedAmount
                            )}
                          </p>
                        </div>
                      );
                    })()}
                </div>

                {/* Actions */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 min-w-0">
                  {job.status === "pending" && (
                    <>
                      <button
                        onClick={() => accept(job._id)}
                        disabled={actionLoading}
                        className={`col-span-2 sm:col-span-1 sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        style={{ backgroundColor: "#059669", color: "white" }}
                      >
                        {actionLoading ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin flex-shrink-0" />
                            <span>Processing...</span>
                          </>
                        ) : (
                          <>
                            <Check className="w-4 h-4 flex-shrink-0" />
                            <span>Accept</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => openDecline(job)}
                        disabled={actionLoading}
                        className={`sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <XCircle className="w-4 h-4 flex-shrink-0" />
                        <span>Decline</span>
                      </button>

                      <button
                        onClick={() => openPropose(job)}
                        disabled={actionLoading}
                        className={`sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                          actionLoading ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <DollarSign className="w-4 h-4 flex-shrink-0" />
                        <span className="hidden sm:inline">Propose Price</span>
                        <span className="sm:hidden">Propose</span>
                      </button>
                    </>
                  )}

                  {job.status === "negotiating" &&
                    (() => {
                      const rounds = job.negotiation?.rounds || [];
                      const latestRound = rounds[rounds.length - 1];
                      const isCustomerCounter =
                        latestRound?.proposedBy === "customer";

                      return (
                        <>
                          {isCustomerCounter ? (
                            <>
                              <button
                                onClick={() => acceptCounterOffer(job._id)}
                                disabled={actionLoading}
                                className={`col-span-2 sm:col-span-1 sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                                  actionLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                style={{
                                  backgroundColor: "#059669",
                                  color: "white",
                                }}
                              >
                                {actionLoading ? (
                                  <>
                                    <Loader className="w-4 h-4 animate-spin flex-shrink-0" />
                                    <span className="truncate">
                                      Processing...
                                    </span>
                                  </>
                                ) : (
                                  <>
                                    <Check className="w-4 h-4 flex-shrink-0" />
                                    <span className="truncate">
                                      Accept{" "}
                                      {formatPrice(
                                        latestRound.amount ||
                                          latestRound.proposedAmount
                                      )}
                                    </span>
                                  </>
                                )}
                              </button>

                              <button
                                onClick={() => openPropose(job)}
                                disabled={actionLoading}
                                className={`sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-blue-50 text-blue-600 rounded-lg font-semibold hover:bg-blue-100 transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                                  actionLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <DollarSign className="w-4 h-4 flex-shrink-0" />
                                <span className="hidden sm:inline">
                                  Counter Again
                                </span>
                                <span className="sm:hidden">Counter</span>
                              </button>

                              <button
                                onClick={() => openDecline(job)}
                                disabled={actionLoading}
                                className={`sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-red-600 border border-red-200 rounded-lg font-semibold hover:bg-red-50 transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                                  actionLoading
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                              >
                                <XCircle className="w-4 h-4 flex-shrink-0" />
                                <span>Decline</span>
                              </button>
                            </>
                          ) : (
                            <div className="col-span-2 bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 flex-1">
                              <div className="flex items-center space-x-1.5 sm:space-x-2">
                                <Loader className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 animate-spin flex-shrink-0" />
                                <p className="text-xs text-blue-700 font-medium">
                                  Waiting for customer's response...
                                </p>
                              </div>
                              <p className="text-xs sm:text-sm font-bold text-blue-900 mt-1 sm:mt-2 truncate">
                                Your offer:{" "}
                                {formatPrice(
                                  latestRound.amount ||
                                    latestRound.proposedAmount
                                )}
                              </p>
                            </div>
                          )}
                        </>
                      );
                    })()}
                  {["accepted", "confirmed"].includes(job.status) && (
                    <button
                      onClick={() => startJob(job._id)}
                      disabled={actionLoading}
                      className={`col-span-2 sm:col-span-1 sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                        actionLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{
                        backgroundColor: COLORS.primary[600],
                        color: "white",
                      }}
                    >
                      {actionLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin flex-shrink-0" />
                          <span>Starting...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 flex-shrink-0" />
                          <span>Start Job</span>
                        </>
                      )}
                    </button>
                  )}

                  {job.status === "in_progress" && (
                    <button
                      onClick={() =>
                        navigate(`/artisan/dashboard/complete-job/${job._id}`)
                      }
                      disabled={actionLoading}
                      className={`col-span-2 sm:col-span-1 sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm ${
                        actionLoading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      style={{ backgroundColor: "#059669", color: "white" }}
                    >
                      <CheckCircle className="w-4 h-4 flex-shrink-0" />
                      <span>Complete</span>
                    </button>
                  )}

                  <button className="sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-50 text-gray-700 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 flex items-center justify-center space-x-1.5 sm:space-x-2 text-sm">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span>Chat</span>
                  </button>

                  <button
                    onClick={() => setSelected(job)}
                    className="sm:flex-1 px-3 sm:px-4 py-2 sm:py-2.5 bg-white text-primary-600 border border-gray-200 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 text-sm"
                  >
                    Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div
          className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 flex items-center justify-between gap-2"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <button
            onClick={() => handlePageChange(Math.max(1, pagination.page - 1))}
            disabled={pagination.page === 1}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all ${
              pagination.page === 1
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <ChevronLeft className="w-4 h-4 flex-shrink-0" />
            <span className="hidden sm:inline">Previous</span>
          </button>
          <div className="flex space-x-1 sm:space-x-2 overflow-x-auto scrollbar-hide">
            {Array.from({ length: pagination.pages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
                  pagination.page === i + 1
                    ? "bg-primary-50 text-primary-600"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() =>
              handlePageChange(Math.min(pagination.pages, pagination.page + 1))
            }
            disabled={pagination.page === pagination.pages}
            className={`px-3 sm:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm flex items-center space-x-1 sm:space-x-2 transition-all ${
              pagination.page === pagination.pages
                ? "text-gray-400 cursor-not-allowed"
                : "hover:bg-gray-100"
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 flex-shrink-0" />
          </button>
        </div>
      )}

      {/* Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center z-10"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="min-w-0 flex-1 mr-3 sm:mr-4">
                <h2
                  className="text-lg sm:text-2xl font-bold truncate"
                  style={{ color: COLORS.gray[900] }}
                >
                  Job Details
                </h2>
                <p
                  className="text-xs sm:text-sm truncate"
                  style={{ color: COLORS.gray[600] }}
                >
                  {selectedBooking.bookingNumber}
                </p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all flex-shrink-0"
              >
                <X
                  className="w-4 h-4 sm:w-5 sm:h-5"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {selectedBooking.status === "pending" &&
                selectedBooking.timeLeftSeconds > 0 && (
                  <div className="bg-red-50 border-2 border-red-300 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3 animate-pulse">
                    <div>
                      <p className="font-bold text-red-900 flex items-center space-x-2 text-sm sm:text-base">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                        <span>Time Sensitive Request</span>
                      </p>
                      <p className="text-xs sm:text-sm text-red-700 mt-1">
                        Auto-decline in 2 minutes if not accepted
                      </p>
                    </div>
                    <CountdownTimer
                      secondsLeft={selectedBooking.timeLeftSeconds}
                    />
                  </div>
                )}

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Customer Information
                </h3>
                <div className="flex items-center space-x-3 sm:space-x-4 mb-4">
                  <img
                    src={
                      selectedBooking.customerPhoto ||
                      `https://ui-avatars.com/api/?name=${selectedBooking.customerName}&background=3b82f6&color=fff&size=150`
                    }
                    alt={selectedBooking.customerName}
                    className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-gray-900 text-base sm:text-lg truncate">
                      {selectedBooking.customerName}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedBooking.customerEmail}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {selectedBooking.customerPhone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                  Service Details
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Service</p>
                    <p className="font-semibold text-gray-900 text-sm sm:text-base">
                      {selectedBooking.serviceName}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      Description
                    </p>
                    <p className="text-gray-700 break-words text-sm sm:text-base">
                      {selectedBooking.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Date</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {new Date(
                          selectedBooking.scheduledDate
                        ).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500">Time</p>
                      <p className="font-semibold text-gray-900 text-sm sm:text-base">
                        {selectedBooking.scheduledTime}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">Location</p>
                    <p className="text-gray-700 break-words text-sm sm:text-base">
                      {selectedBooking.location.address}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600">
                      {selectedBooking.location.city},{" "}
                      {selectedBooking.location.state}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs sm:text-sm text-gray-500">
                      {selectedBooking.agreedPrice
                        ? "Agreed Price"
                        : selectedBooking.finalPrice
                        ? "Final Price"
                        : "Estimated Price"}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">
                      {formatPrice(
                        selectedBooking.agreedPrice ||
                          selectedBooking.finalPrice ||
                          selectedBooking.estimatedPrice
                      )}
                    </p>
                    {selectedBooking.agreedPrice &&
                      selectedBooking.estimatedPrice !==
                        selectedBooking.agreedPrice && (
                        <p className="text-xs text-gray-500 mt-1">
                          Original:{" "}
                          {formatPrice(selectedBooking.estimatedPrice)}
                        </p>
                      )}
                  </div>
                </div>
              </div>

              {/* Photos */}
              {selectedBooking.photos && selectedBooking.photos.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                  <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                    Customer Photos
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                    {selectedBooking.photos
                      .filter(
                        (photo) =>
                          photo && (photo.url || typeof photo === "string")
                      )
                      .map((photo, idx) => (
                        <img
                          key={idx}
                          src={typeof photo === "string" ? photo : photo.url}
                          alt={`Photo ${idx + 1}`}
                          className="w-full h-24 sm:h-32 object-cover rounded-lg"
                        />
                      ))}
                  </div>
                </div>
              )}

              {/* Negotiation History */}
              {selectedBooking.negotiation?.rounds &&
                selectedBooking.negotiation.rounds.length > 0 && (
                  <div className="bg-gray-50 rounded-xl p-4 sm:p-6">
                    <h3 className="font-bold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">
                      Negotiation History
                    </h3>
                    <div className="space-y-2 sm:space-y-3">
                      {selectedBooking.negotiation.rounds.map((round, idx) => (
                        <div
                          key={idx}
                          className={`p-3 sm:p-4 rounded-lg ${
                            round.proposedBy === "artisan"
                              ? "bg-blue-50 border-l-4 border-blue-600"
                              : "bg-green-50 border-l-4 border-green-600"
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
                            <span className="font-semibold text-gray-900 text-sm sm:text-base">
                              {round.proposedBy === "artisan"
                                ? "You"
                                : "Customer"}
                            </span>
                            <span className="text-xs sm:text-sm text-gray-600">
                              Round {idx + 1}
                            </span>
                          </div>
                          <p className="text-xl sm:text-2xl font-bold text-gray-900">
                            {formatPrice(round.amount || round.proposedAmount)}
                          </p>
                          {round.message && (
                            <p className="text-xs sm:text-sm text-gray-700 mt-2 break-words">
                              "{round.message}"
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Propose Modal */}
      {showProposeModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-xl w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3
                className="text-base sm:text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Propose Custom Price
              </h3>
              <button
                onClick={closePropose}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <X
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>
            <div className="mb-3 sm:mb-4 p-3 sm:p-4 bg-gray-50 rounded-lg">
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                Original Request
              </p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900">
                {formatPrice(selectedBooking.estimatedPrice)}
              </p>
            </div>
            <input
              type="number"
              placeholder="Your proposed amount (₦)"
              value={proposeAmount}
              onChange={(e) => setProposeAmount(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg mb-2 sm:mb-3 text-sm sm:text-base"
              style={{ borderColor: COLORS.gray[200] }}
            />
            <textarea
              placeholder="Message (optional)"
              value={proposeMessage}
              onChange={(e) => setProposeMessage(e.target.value)}
              className="w-full p-2.5 sm:p-3 border rounded-lg mb-3 sm:mb-4 h-20 sm:h-24 text-sm sm:text-base"
              style={{ borderColor: COLORS.gray[200] }}
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={closePropose}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => proposePrice()}
                disabled={actionLoading}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Proposal</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedBooking && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[110] p-3 sm:p-4">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-md w-full p-4 sm:p-6">
            <div className="flex justify-between items-center mb-3 sm:mb-4">
              <h3
                className="text-base sm:text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Decline Job Request
              </h3>
              <button
                onClick={closeDecline}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center flex-shrink-0"
              >
                <X
                  className="w-3 h-3 sm:w-4 sm:h-4"
                  style={{ color: COLORS.gray[600] }}
                />
              </button>
            </div>
            <p
              className="text-xs sm:text-sm mb-3 sm:mb-4"
              style={{ color: COLORS.gray[600] }}
            >
              Please provide a reason for declining this job. This helps us
              improve the platform.
            </p>
            <textarea
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
              placeholder="e.g., Already booked, Too far..."
              className="w-full p-2.5 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 mb-3 sm:mb-4 text-sm sm:text-base"
              style={{ borderColor: COLORS.gray[200] }}
              rows={4}
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={closeDecline}
                className="flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => decline()}
                disabled={actionLoading}
                className={`flex-1 px-4 sm:px-6 py-2 sm:py-2.5 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${
                  actionLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {actionLoading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Declining...</span>
                  </>
                ) : (
                  <span>Confirm Decline</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}