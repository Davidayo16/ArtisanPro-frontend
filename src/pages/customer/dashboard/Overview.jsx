// ============================================
// 📁 pages/customer/dashboard/Overview.jsx
// OPTIMIZED: Add React.useMemo for expensive calculations
// ============================================

import React, { useEffect, useMemo } from "react"; // 🔥 ADD useMemo
import { Link } from "react-router-dom";
import {
  Calendar,
  DollarSign,
  Star,
  Activity,
  Clock,
  ChevronRight,
  MapPin,
  CheckCircle,
  Zap,
  ArrowUpRight,
  Heart,
  HelpCircle,
} from "lucide-react";
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useCustomerDashboardStore } from "../../../stores/customerDashboardStore";
import { useAuthStore } from "../../../stores/authStore";

// ... (Keep all your COLORS, CHART_CONFIG, and reusable components the same)

const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    gradient: "linear-gradient(135deg, #224e8c 0%, #2a5ca8 100%)",
  },
  success: {
    50: "#f0fdf4",
    500: "#22c55e",
    600: "#16a34a",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    500: "#6b7280",
    600: "#4b5563",
    900: "#111827",
  },
  chart: {
    blue: "#3b82f6",
    amber: "#f59e0b",
    emerald: "#10b981",
    purple: "#8b5cf6",
    orange: "#f97316",
  },
};

const CHART_CONFIG = {
  height: {
    mobile: 250,
    desktop: 280,
  },
  margin: {
    area: { top: 10, right: 0, left: -25, bottom: 0 },
    pie: { top: 0, right: 0, left: 0, bottom: 0 },
  },
  animation: 1200,
};

// 🔥 OPTIMIZATION: Wrap StatCard in React.memo
const StatCard = React.memo(({ stat }) => {
  const Icon = stat.icon;
  return (
    <div
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border group cursor-pointer"
      style={{ borderColor: COLORS.gray[100] }}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
          style={{ backgroundColor: COLORS.primary[50] }}
        >
          <Icon className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
        </div>
        {stat.trend === "up" && (
          <div
            className="flex items-center space-x-1 px-2 py-1 rounded-lg"
            style={{
              color: COLORS.success[600],
              backgroundColor: COLORS.success[50],
            }}
          >
            <ArrowUpRight className="w-4 h-4" />
            <span className="text-xs font-bold">{stat.change}</span>
          </div>
        )}
      </div>
      <p
        className="text-sm mb-1 font-medium"
        style={{ color: COLORS.gray[600] }}
      >
        {stat.label}
      </p>
      <p
        className="text-3xl font-bold mb-1"
        style={{ color: COLORS.gray[900] }}
      >
        {stat.value}
      </p>
      {stat.trend === "neutral" && (
        <p className="text-sm" style={{ color: COLORS.gray[500] }}>
          {stat.change}
        </p>
      )}
    </div>
  );
});

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="px-4 py-3 rounded-xl shadow-2xl border bg-white"
      style={{ borderColor: COLORS.primary[200] }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: COLORS.gray[900] }}>
        {label || payload[0].payload.month}
      </p>
      <p className="text-lg font-bold" style={{ color: COLORS.primary[600] }}>
        {payload[0].value} {payload[0].name || "bookings"}
      </p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;

  return (
    <div
      className="bg-white px-4 py-3 rounded-xl shadow-2xl border"
      style={{ borderColor: COLORS.gray[200] }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: COLORS.gray[900] }}>
        {payload[0].name}
      </p>
      <p
        className="text-xl font-bold mb-1"
        style={{ color: payload[0].payload.color }}
      >
        ₦{payload[0].value.toLocaleString()}
      </p>
      <p className="text-xs" style={{ color: COLORS.gray[600] }}>
        {payload[0].payload.percentage}% of total
      </p>
    </div>
  );
};

const LegendItem = React.memo(({ service }) => (
  <div className="group cursor-pointer">
    <div className="flex items-center justify-between mb-1.5">
      <div className="flex items-center space-x-2">
        <div
          className="w-3 h-3 rounded-full shadow-sm"
          style={{ backgroundColor: service.color }}
        />
        <span
          className="text-sm font-semibold group-hover:text-blue-600 transition-colors"
          style={{ color: COLORS.gray[900] }}
        >
          {service.name}
        </span>
      </div>
      <div className="flex items-center space-x-2">
        <span className="text-sm font-bold" style={{ color: service.color }}>
          ₦{(service.value / 1000).toFixed(0)}k
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: COLORS.gray[500] }}
        >
          {service.percentage}%
        </span>
      </div>
    </div>
    <div
      className="h-1.5 rounded-full overflow-hidden"
      style={{ backgroundColor: COLORS.gray[100] }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${service.percentage}%`,
          backgroundColor: service.color,
        }}
      />
    </div>
  </div>
));

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
      ))}
    </div>
  </div>
);

// 🔥 OPTIMIZATION: Memoize formatTimeAgo function
const formatTimeAgo = (date) => {
  const seconds = Math.floor((new Date() - date) / 1000);
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
    }
  }
  return "Just now";
};

export default function Overview() {
  const { user } = useAuthStore();
  const {
    stats,
    bookingTrends,
    spendingByService,
    upcomingBookings,
    recentActivity,
    isLoading,
    error,
    fetchDashboard,
  } = useCustomerDashboardStore();

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  // 🔥 OPTIMIZATION 1: Memoize stats array (only recalculate when stats change)
  const statsArray = useMemo(
    () => [
      {
        label: "Total Bookings",
        value: stats.totalBookings.toString(),
        change: stats.bookingsChange,
        trend: stats.bookingsChange.startsWith("+") ? "up" : "neutral",
        icon: Calendar,
      },
      {
        label: "Active Jobs",
        value: stats.activeJobs.toString(),
        change: `${stats.pendingJobs} pending`,
        trend: "neutral",
        icon: Activity,
      },
      {
        label: "Total Spent",
        value: `₦${stats.totalSpent.toLocaleString()}`,
        change: stats.spendingChange,
        trend: stats.spendingChange.startsWith("+") ? "up" : "neutral",
        icon: DollarSign,
      },
      {
        label: "Avg Rating Given",
        value: stats.averageRatingGiven.toFixed(1),
        change: `${stats.totalReviewsGiven} reviews`,
        trend: "neutral",
        icon: Star,
      },
    ],
    [stats] // Only recalculate when stats object changes
  );

  // 🔥 OPTIMIZATION 2: Memoize chart data
  const professionalPalette = useMemo(
    () => ["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#f59e0b"],
    []
  );

  const spendingWithColors = useMemo(
    () =>
      spendingByService.map((service, index) => ({
        ...service,
        color: professionalPalette[index] || COLORS.gray[400],
      })),
    [spendingByService, professionalPalette]
  );

  // 🔥 OPTIMIZATION 3: Memoize formatted upcoming bookings
  const formattedUpcoming = useMemo(
    () =>
      upcomingBookings.map((booking) => ({
        ...booking,
        date: new Date(booking.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        }),
        status: booking.status === "confirmed" ? "Confirmed" : "Pending",
      })),
    [upcomingBookings]
  );

  // 🔥 OPTIMIZATION 4: Memoize activity with icons
  const activityWithIcons = useMemo(() => {
    const iconMap = {
      completed: {
        icon: CheckCircle,
        iconColor: "text-success-600",
        bgColor: "bg-success-50",
      },
      payment: {
        icon: DollarSign,
        iconColor: "text-primary-600",
        bgColor: "bg-primary-50",
      },
      review: {
        icon: Star,
        iconColor: "text-warning-500",
        bgColor: "bg-warning-50",
      },
      booking: {
        icon: Calendar,
        iconColor: "text-primary-600",
        bgColor: "bg-primary-50",
      },
    };

    return recentActivity.map((activity) => ({
      ...activity,
      ...iconMap[activity.type],
      time: formatTimeAgo(new Date(activity.time)),
    }));
  }, [recentActivity]);

  // 🔥 Show loading skeleton ONLY on first load (when no data exists)
  if (isLoading && statsArray[0].value === "0") {
    return <LoadingSkeleton />;
  }

  if (error && statsArray[0].value === "0") {
    return (
      <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
        <p className="text-red-600 font-semibold mb-2">
          Failed to load dashboard
        </p>
        <p className="text-red-500 text-sm mb-4">{error}</p>
        <button
          onClick={() => fetchDashboard(true)}
          className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 🔥 Show loading indicator in corner while refreshing */}
      {isLoading && (
        <div className="fixed top-20 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-medium">Updating...</span>
        </div>
      )}
      {/* Welcome Header */}
      <div
        className="rounded-2xl shadow-lg p-6 lg:p-8 text-white relative overflow-hidden"
        style={{ backgroundImage: COLORS.primary.gradient }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full -ml-24 -mb-24" />
        </div>

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-2">
              Welcome back, {user?.firstName || "Customer"}! 👋
            </h1>
            <p className="text-blue-100">
              Here's what's happening with your bookings today
            </p>
          </div>
          <Link
            to="/search"
            className="bg-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-200 inline-flex items-center justify-center space-x-2 whitespace-nowrap hover:scale-105"
            style={{ color: COLORS.primary[600] }}
          >
            <span>Book Artisan</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsArray.map((stat, index) => (
          <StatCard key={index} stat={stat} />
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Booking Trends Chart */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-shadow duration-300"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-lg font-bold flex items-center space-x-2"
                style={{ color: COLORS.gray[900] }}
              >
                <Activity
                  className="w-5 h-5"
                  style={{ color: COLORS.primary[600] }}
                />
                <span>Booking Trends</span>
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.gray[600] }}>
                Last 6 months performance
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-2xl font-bold"
                style={{ color: COLORS.primary[600] }}
              >
                {bookingTrends[bookingTrends.length - 1]?.bookings || 0}
              </p>
              <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                This month
              </p>
            </div>
          </div>
          <div
            className="w-full -mr-4"
            style={{ height: CHART_CONFIG.height.desktop }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingTrends} margin={CHART_CONFIG.margin.area}>
                <defs>
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor={COLORS.primary[500]}
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor={COLORS.primary[500]}
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={COLORS.gray[200]}
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke={COLORS.gray[500]}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  stroke={COLORS.gray[500]}
                  tick={{ fontSize: 12, fontWeight: 600 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke: COLORS.primary[500],
                    strokeWidth: 1,
                    strokeDasharray: "5 5",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bookings"
                  stroke={COLORS.primary[500]}
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  animationDuration={CHART_CONFIG.animation}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Spending by Service Pie Chart */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border hover:shadow-xl transition-shadow duration-300"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3
                className="text-lg font-bold flex items-center space-x-2"
                style={{ color: COLORS.gray[900] }}
              >
                <DollarSign
                  className="w-5 h-5"
                  style={{ color: COLORS.primary[600] }}
                />
                <span>Spending by Service</span>
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.gray[600] }}>
                Total:{" "}
                <span className="font-bold" style={{ color: COLORS.gray[900] }}>
                  ₦{stats.totalSpent.toLocaleString()}
                </span>
              </p>
            </div>
          </div>
          {spendingWithColors.length > 0 ? (
            <>
              <div className="w-full" style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart margin={CHART_CONFIG.margin.pie}>
                    <defs>
                      {spendingWithColors.map((entry, index) => (
                        <React.Fragment key={index}>
                          <linearGradient
                            id={`pieGradient${index}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={entry.color}
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={entry.color}
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                          <filter id={`shadow${index}`}>
                            <feDropShadow
                              dx="0"
                              dy="2"
                              stdDeviation="3"
                              floodOpacity="0.3"
                            />
                          </filter>
                        </React.Fragment>
                      ))}
                    </defs>
                    <Pie
                      data={spendingWithColors}
                      cx="50%"
                      cy="50%"
                      innerRadius="58%"
                      outerRadius="88%"
                      paddingAngle={4}
                      dataKey="value"
                      animationDuration={CHART_CONFIG.animation}
                      animationBegin={0}
                    >
                      {spendingWithColors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={`url(#pieGradient${index})`}
                          filter={`url(#shadow${index})`}
                          strokeWidth={2}
                          stroke="#fff"
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<PieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {spendingWithColors.map((service, index) => (
                  <LegendItem key={index} service={service} />
                ))}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No spending data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Bookings & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upcoming Bookings */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg font-bold flex items-center space-x-2"
              style={{ color: COLORS.gray[900] }}
            >
              <Calendar
                className="w-5 h-5"
                style={{ color: COLORS.success[600] }}
              />
              <span>Upcoming Bookings</span>
            </h3>
            <Link
              to="/customer/dashboard/active"
              className="font-medium text-sm flex items-center space-x-1 transition-colors duration-200 hover:opacity-80"
              style={{ color: COLORS.primary[600] }}
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          {formattedUpcoming.length > 0 ? (
            <div className="space-y-4">
              {formattedUpcoming.map((booking) => (
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                  style={{ borderColor: COLORS.gray[100] }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = COLORS.primary[200])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = COLORS.gray[100])
                  }
                >
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="relative">
                      <img
                        src={booking.artisanPhoto}
                        alt={booking.artisan}
                        className="w-14 h-14 rounded-full object-cover border-2 transition-colors duration-200"
                        style={{ borderColor: COLORS.gray[200] }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ backgroundColor: COLORS.success[500] }}
                      >
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p
                        className="font-bold group-hover:text-blue-600 transition-colors duration-200"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {booking.artisan}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {booking.service}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <div
                          className="flex items-center space-x-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">
                            {booking.date}, {booking.time}
                          </span>
                        </div>
                        <div
                          className="flex items-center space-x-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{booking.location}</span>
                        </div>
                        <div
                          className="flex items-center space-x-1"
                          style={{ color: COLORS.warning[500] }}
                        >
                          <Star
                            className="w-3.5 h-3.5"
                            style={{ fill: COLORS.warning[500] }}
                          />
                          <span className="text-xs font-bold">
                            {booking.artisanRating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className="px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap"
                      style={
                        booking.status === "Confirmed"
                          ? {
                              backgroundColor: COLORS.success[50],
                              color: COLORS.success[600],
                            }
                          : {
                              backgroundColor: COLORS.warning[50],
                              color: COLORS.warning[500],
                            }
                      }
                    >
                      {booking.status}
                    </span>
                    <button
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      aria-label="View booking details"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No upcoming bookings</p>
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div
          className="bg-white rounded-2xl shadow-lg p-6 border"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <h3
            className="text-lg font-bold mb-6 flex items-center space-x-2"
            style={{ color: COLORS.gray[900] }}
          >
            <Zap className="w-5 h-5" style={{ color: COLORS.warning[500] }} />
            <span>Recent Activity</span>
          </h3>
          {activityWithIcons.length > 0 ? (
            <div className="space-y-4">
              {activityWithIcons.slice(0, 8).map((activity) => {
                const Icon = activity.icon;
                const iconColorMap = {
                  "text-success-600": COLORS.success[600],
                  "text-primary-600": COLORS.primary[600],
                  "text-warning-500": COLORS.warning[500],
                };
                const bgColorMap = {
                  "bg-success-50": COLORS.success[50],
                  "bg-primary-50": COLORS.primary[50],
                  "bg-warning-50": COLORS.warning[50],
                };
                return (
                  <div
                    key={activity.id}
                    className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                    style={{ borderColor: COLORS.gray[100] }}
                  >
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: bgColorMap[activity.bgColor] }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: iconColorMap[activity.iconColor] }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {activity.title}
                      </p>
                      {activity.artisan && (
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {activity.artisan}
                        </p>
                      )}
                      {activity.amount && (
                        <p
                          className="text-xs font-bold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          ₦{activity.amount.toLocaleString()}
                        </p>
                      )}
                      {activity.service && (
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {activity.service}
                        </p>
                      )}
                      {activity.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          {[...Array(activity.rating)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-3 h-3"
                              style={{
                                fill: COLORS.warning[500],
                                color: COLORS.warning[500],
                              }}
                            />
                          ))}
                        </div>
                      )}
                      <p
                        className="text-xs mt-1"
                        style={{ color: COLORS.gray[500] }}
                      >
                        {activity.time}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-400">
              <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div
        className="rounded-2xl shadow-lg p-6 border relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary[50]} 0%, #e0e7ff 100%)`,
          borderColor: COLORS.primary[100],
        }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-200 rounded-full opacity-20 -mr-32 -mt-32" />
        <div className="relative z-10">
          <h3
            className="text-lg font-bold mb-4 flex items-center space-x-2"
            style={{ color: COLORS.gray[900] }}
          >
            <Zap className="w-5 h-5" style={{ color: COLORS.primary[600] }} />
            <span>Quick Actions</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { to: "/search", icon: Calendar, label: "Book Now" },
              {
                to: "/customer/dashboard/history",
                icon: Clock,
                label: "History",
              },
              { to: "/customer/dashboard/saved", icon: Heart, label: "Saved" },
              {
                to: "/customer/dashboard/support",
                icon: HelpCircle,
                label: "Support",
              },
            ].map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={idx}
                  to={action.to}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 text-center group hover:scale-105"
                  aria-label={action.label}
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {action.label}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
