// src/pages/artisan/dashboard/ArtisanOverview.jsx
import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { artisanApi } from "../../../api/artisanApi";
import { useAuthStore } from "../../../stores/authStore";
import LoadingDashboard from "../../../components/dashboard/LoadingDashboard";

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
  TrendingUp,
  Briefcase,
  Timer,
  Target,
  Flame,
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
const dashboardCache = {
  data: null,
  timestamp: null,
  TTL: 5 * 60 * 1000, // 5 minutes
};

// ==================== DESIGN SYSTEM ====================
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
  jobStatus: {
    completed: "#059669",
    active: "#2563eb",
    cancelled: "#6b7280",
    disputed: "#d97706",
  },
};

const CHART_CONFIG = {
  height: 280,
  margin: {
    area: { top: 10, right: 0, left: -25, bottom: 0 },
    pie: { top: 0, right: 0, left: 0, bottom: 0 },
  },
  animation: 1200,
};

// ==================== PURE JS DATE HELPERS ====================
const formatDate = (isoString) => {
  const d = new Date(isoString);
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
  return `${months[d.getMonth()]} ${d.getDate()}`;
};

const timeAgo = (isoString) => {
  const seconds = Math.floor(
    (Date.now() - new Date(isoString).getTime()) / 1000
  );
  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
  };
  for (const [unit, secs] of Object.entries(intervals)) {
    const count = Math.floor(seconds / secs);
    if (count >= 1) return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
  }
  return "Just now";
};

// ==================== REUSABLE COMPONENTS ====================
const StatCard = ({ stat }) => {
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
};

const PerformanceMetric = ({ icon: Icon, label, value, color }) => (
  <div className="flex items-center space-x-3 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
    <div className="p-2.5 rounded-lg" style={{ backgroundColor: `${color}15` }}>
      <Icon className="w-5 h-5" style={{ color }} />
    </div>
    <div>
      <p className="text-xs font-medium text-gray-600">{label}</p>
      <p className="text-lg font-bold" style={{ color: COLORS.gray[900] }}>
        {value}
      </p>
    </div>
  </div>
);

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl shadow-2xl border bg-white"
      style={{ borderColor: COLORS.primary[200] }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: COLORS.gray[900] }}>
        {label || payload[0].payload.month}
      </p>
      <p className="text-lg font-bold" style={{ color: COLORS.primary[600] }}>
        ₦{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
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
        {payload[0].value} jobs
      </p>
      <p className="text-xs" style={{ color: COLORS.gray[600] }}>
        {payload[0].payload.percentage}% of total
      </p>
    </div>
  );
};

const LegendItem = ({ service }) => (
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
          {service.value}
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
);

// ==================== EMPTY STATES ====================
const EmptyChart = ({ title, message, icon: Icon }) => (
  <div className="flex flex-col items-center justify-center h-full text-center p-8">
    <div className="p-4 rounded-full bg-gray-100 mb-4">
      <Icon className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-lg font-semibold text-gray-700 mb-1">{title}</p>
    <p className="text-sm text-gray-500 max-w-xs">{message}</p>
  </div>
);

const EmptyActivity = () => (
  <div className="text-center py-12">
    <div className="p-4 rounded-full bg-gray-100 inline-flex mb-4">
      <Zap className="w-8 h-8 text-gray-400" />
    </div>
    <p className="text-lg font-semibold text-gray-700 mb-1">No Activity Yet</p>
    <p className="text-sm text-gray-500">
      Your recent jobs and payments will appear here
    </p>
  </div>
);

// ==================== MAIN COMPONENT ====================
export default function ArtisanOverview() {
  
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const { user } = useAuthStore();
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.role !== "artisan") return;

      // ✅ OPTIMIZATION 2: Check cache first
      const now = Date.now();
      if (
        dashboardCache.data &&
        dashboardCache.timestamp &&
        now - dashboardCache.timestamp < dashboardCache.TTL
      ) {
        console.log("Using cached dashboard data");
        setDashboard(dashboardCache.data);
        setLoading(false);
        return;
      }

      try {
        const res = await artisanApi.getDashboardOverview();

        // ✅ Cache the response
        dashboardCache.data = res.data;
        dashboardCache.timestamp = now;

        setDashboard(res.data);
        setError(null);
      } catch (err) {
        console.error("Failed to load dashboard:", err);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  // ✅ OPTIMIZATION 3: Memoize computed values properly
  const stats = useMemo(() => {
    if (!dashboard?.stats) return [];
    const s = dashboard.stats;
    return [
      {
        label: "Total Jobs Completed",
        value: s.totalJobsCompleted,
        change: s.jobsChange,
        trend: "up",
        icon: CheckCircle,
      },
      {
        label: "Active Jobs",
        value: s.activeBookings,
        change: `${s.pendingBookings} pending`,
        trend: "neutral",
        icon: Activity,
      },
      {
        label: "Total Earnings",
        value: `₦${s.totalEarnings.toLocaleString()}`,
        change: s.earningsChange,
        trend: "up",
        icon: DollarSign,
      },
      {
        label: "Average Rating",
        value: s.averageRating.toFixed(1),
        change: `${s.totalReviews} reviews`,
        trend: "neutral",
        icon: Star,
      },
    ];
  }, [dashboard?.stats]);

  const performanceMetrics = useMemo(() => {
    if (!dashboard?.performanceMetrics) return [];
    const p = dashboard.performanceMetrics;
    return [
      {
        icon: Timer,
        label: "Response Time",
        value: `${p.responseTime} min`,
        color: COLORS.primary[600],
      },
      {
        icon: Target,
        label: "Acceptance Rate",
        value: `${p.acceptanceRate}%`,
        color: COLORS.success[600],
      },
      {
        icon: CheckCircle,
        label: "Completion Rate",
        value: `${p.completionRate}%`,
        color: COLORS.success[600],
      },
      {
        icon: Flame,
        label: "Active Streak",
        value: `${p.activeStreak} days`,
        color: COLORS.warning[500],
      },
    ];
  }, [dashboard?.performanceMetrics]);

  // ✅ OPTIMIZATION 4: Use stable references
  const earningsTrends = useMemo(
    () => dashboard?.earningsTrends ?? [],
    [dashboard?.earningsTrends]
  );

  const jobStatusBreakdown = useMemo(
    () =>
      (dashboard?.jobStatusBreakdown ?? []).map((i) => ({
        ...i,
        color: COLORS.jobStatus[i.name.toLowerCase()] ?? COLORS.gray[500],
      })),
    [dashboard?.jobStatusBreakdown]
  );

  const pendingRequests = useMemo(
    () =>
      (dashboard?.pendingRequests ?? []).map((r) => ({
        ...r,
        timeLeft: r.timeLeft > 0 ? `${r.timeLeft} min` : "Expired",
        isExpiring: r.timeLeft > 0 && r.timeLeft <= 5,
        photo: r.customer.photo ?? "/images/placeholder.jpg",
      })),
    [dashboard?.pendingRequests]
  );

  const recentActivity = useMemo(
    () =>
      (dashboard?.recentActivity ?? []).map((a) => {
        const map = {
          completed: {
            Icon: CheckCircle,
            bg: COLORS.success[50],
            color: COLORS.success[600],
          },
          payment: {
            Icon: DollarSign,
            bg: COLORS.primary[50],
            color: COLORS.primary[600],
          },
          review: {
            Icon: Star,
            bg: COLORS.warning[50],
            color: COLORS.warning[500],
          },
          booking: {
            Icon: Calendar,
            bg: COLORS.primary[50],
            color: COLORS.primary[600],
          },
        }[a.type] ?? {
          Icon: Calendar,
          bg: COLORS.primary[50],
          color: COLORS.primary[600],
        };
        return { ...a, Icon: map.Icon, bgColor: map.bg, iconColor: map.color };
      }),
    [dashboard?.recentActivity]
  );

  if (loading) return <LoadingDashboard />;

  if (error || !dashboard) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-500 mb-4">
          {error || "Failed to load dashboard data"}
        </div>
        <button
          onClick={() => {
            dashboardCache.data = null; // ❌ Should use invalidateDashboardCache() instead
            window.location.reload();
          }}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Welcome - NOW USES firstName ONLY */}
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
              Welcome back, {user?.firstName || "Artisan"}!
            </h1>
            <p className="text-blue-100">
              {dashboard.stats.pendingBookings} pending •{" "}
              {dashboard.stats.activeBookings} active jobs
            </p>
          </div>
          <Link
            to="/artisan/dashboard/jobs"
            className="bg-white px-6 py-3 rounded-xl font-semibold hover:shadow-2xl transition-all duration-200 inline-flex items-center justify-center space-x-2 whitespace-nowrap hover:scale-105"
            style={{ color: COLORS.primary[600] }}
          >
            <span>View All Jobs</span>
            <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((s, i) => (
          <StatCard key={i} stat={s} />
        ))}
      </div>

      {/* Performance */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {performanceMetrics.map((m, i) => (
          <PerformanceMetric key={i} {...m} />
        ))}
      </div>

      {/* === EARNINGS TRENDS + JOB STATUS — SIDE BY SIDE, SAME STYLE === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Trends */}
        {/* Earnings Trends */}
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
                <TrendingUp
                  className="w-5 h-5"
                  style={{ color: COLORS.primary[600] }}
                />
                <span>Earnings Trends</span>
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.gray[600] }}>
                Last 6 months
              </p>
            </div>
            <div className="text-right">
              <p
                className="text-2xl font-bold"
                style={{ color: COLORS.success[600] }}
              >
                ₦{dashboard.thisMonthEarnings.toLocaleString()}
              </p>
              <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                This month
              </p>
            </div>
          </div>

          {/* === TRUE EMPTY STATE: NO CHART IF NO REAL DATA === */}
          {earningsTrends.length > 0 &&
          earningsTrends.some((m) => m.earnings > 0) ? (
            <ResponsiveContainer width="100%" height={CHART_CONFIG.height}>
              <AreaChart
                data={earningsTrends}
                margin={CHART_CONFIG.margin.area}
              >
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
                  dataKey="earnings"
                  stroke={COLORS.primary[500]}
                  strokeWidth={3}
                  fill="url(#areaGradient)"
                  animationDuration={CHART_CONFIG.animation}
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <EmptyChart
              title="No Earnings Yet"
              message="Complete your first job to see your earnings grow!"
              icon={DollarSign}
            />
          )}
        </div>

        {/* Job Status Breakdown */}
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
                <span>Job Status</span>
              </h3>
              <p className="text-sm mt-1" style={{ color: COLORS.gray[600] }}>
                Total:{" "}
                <span className="font-bold" style={{ color: COLORS.gray[900] }}>
                  {dashboard.stats.totalJobsCompleted +
                    dashboard.stats.activeBookings}
                </span>{" "}
                jobs
              </p>
            </div>
          </div>

          {jobStatusBreakdown.some((s) => s.value > 0) ? (
            <>
              <ResponsiveContainer width="100%" height={240}>
                <PieChart margin={CHART_CONFIG.margin.pie}>
                  <defs>
                    {jobStatusBreakdown
                      .filter((s) => s.value > 0)
                      .map((e, i) => (
                        <React.Fragment key={i}>
                          <linearGradient
                            id={`pieGrad${i}`}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="0%"
                              stopColor={e.color}
                              stopOpacity={1}
                            />
                            <stop
                              offset="100%"
                              stopColor={e.color}
                              stopOpacity={0.7}
                            />
                          </linearGradient>
                          <filter id={`shadow${i}`}>
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
                    data={jobStatusBreakdown.filter((s) => s.value > 0)}
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="88%"
                    paddingAngle={4}
                    dataKey="value"
                    animationDuration={CHART_CONFIG.animation}
                  >
                    {jobStatusBreakdown
                      .filter((s) => s.value > 0)
                      .map((_, i) => (
                        <Cell
                          key={`cell-${i}`}
                          fill={`url(#pieGrad${i})`}
                          filter={`url(#shadow${i})`}
                          strokeWidth={2}
                          stroke="#fff"
                        />
                      ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 mt-4">
                {jobStatusBreakdown
                  .filter((s) => s.value > 0)
                  .map((s, i) => (
                    <LegendItem key={i} service={s} />
                  ))}
              </div>
            </>
          ) : (
            <EmptyChart
              title="No Jobs Yet"
              message="Accept your first job"
              icon={Briefcase}
            />
          )}
        </div>
      </div>

      {/* Pending + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending */}
        <div
          className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-6 border"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-lg font-bold flex items-center space-x-2"
              style={{ color: COLORS.gray[900] }}
            >
              <Clock
                className="w-5 h-5"
                style={{ color: COLORS.warning[500] }}
              />
              <span>Pending Requests</span>
            </h3>
            <Link
              to="/artisan/dashboard/jobs"
              className="font-medium text-sm flex items-center space-x-1 transition-colors duration-200 hover:opacity-80"
              style={{ color: COLORS.primary[600] }}
            >
              <span>View All</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {pendingRequests.length === 0 ? (
              <p className="text-center py-8 text-gray-500">
                No pending requests
              </p>
            ) : (
              pendingRequests.map((r) => (
                <div
                  key={r.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-2 rounded-xl hover:shadow-md transition-all duration-200 cursor-pointer group"
                  style={{
                    borderColor: r.isExpiring
                      ? COLORS.warning[500]
                      : COLORS.gray[100],
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.borderColor = COLORS.warning[500])
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.borderColor = r.isExpiring
                      ? COLORS.warning[500]
                      : COLORS.gray[100])
                  }
                >
                  <div className="flex items-center space-x-4 mb-3 sm:mb-0">
                    <div className="relative">
                      <img
                        src={r.photo}
                        alt={r.customer.name}
                        className="w-14 h-14 rounded-full object-cover border-2"
                        style={{ borderColor: COLORS.gray[200] }}
                      />
                      <div
                        className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white flex items-center justify-center"
                        style={{ backgroundColor: COLORS.warning[500] }}
                      >
                        <Clock className="w-3 h-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <p
                        className="font-bold group-hover:text-blue-600 transition-colors duration-200"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {r.customer.name}
                      </p>
                      <p
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {r.service}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 mt-1">
                        <div
                          className="flex items-center space-x-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          <Clock className="w-3.5 h-3.5" />
                          <span className="text-xs">
                            {formatDate(r.date)}, {r.time}
                          </span>
                        </div>
                        <div
                          className="flex items-center space-x-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          <MapPin className="w-3.5 h-3.5" />
                          <span className="text-xs">{r.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                        r.isExpiring ? "animate-pulse" : ""
                      }`}
                      style={{
                        backgroundColor: r.isExpiring
                          ? COLORS.warning[50]
                          : COLORS.primary[50],
                        color: r.isExpiring
                          ? COLORS.warning[500]
                          : COLORS.primary[600],
                      }}
                    >
                      {r.timeLeft} left
                    </div>
                    <Link
                      to={`/artisan/jobs/${r.id}`}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
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
          {recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((a, i) => {
                const Icon = a.Icon;
                return (
                  <div
                    key={i}
                    className="flex items-start space-x-3 pb-4 border-b last:border-0 last:pb-0 hover:bg-gray-50 p-2 rounded-lg transition-colors duration-200 cursor-pointer"
                    style={{ borderColor: COLORS.gray[100] }}
                  >
                    <div
                      className="p-2 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: a.bgColor }}
                    >
                      <Icon
                        className="w-4 h-4"
                        style={{ color: a.iconColor }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p
                        className="font-semibold text-sm"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {a.title}
                      </p>
                      {a.customer && (
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {a.customer}
                        </p>
                      )}
                      {a.amount && (
                        <p
                          className="text-xs font-bold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          ₦{a.amount.toLocaleString()}
                        </p>
                      )}
                      {a.service && (
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {a.service}
                        </p>
                      )}
                      {a.rating && (
                        <div className="flex items-center space-x-1 mt-1">
                          {Array.from({ length: a.rating }).map((_, j) => (
                            <Star
                              key={j}
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
                        {timeAgo(a.time)}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <EmptyActivity />
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
              { to: "/artisan/dashboard/jobs", icon: Briefcase, label: "Jobs" },
              {
                to: "/artisan/dashboard/calendar",
                icon: Calendar,
                label: "Calendar",
              },
              {
                to: "/artisan/dashboard/earnings",
                icon: DollarSign,
                label: "Earnings",
              },
              {
                to: "/artisan/dashboard/analytics",
                icon: TrendingUp,
                label: "Analytics",
              },
            ].map((a, i) => {
              const Icon = a.icon;
              return (
                <Link
                  key={i}
                  to={a.to}
                  className="bg-white p-4 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 text-center group hover:scale-105"
                >
                  <Icon
                    className="w-6 h-6 mx-auto mb-2 group-hover:scale-110 transition-transform duration-200"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <p
                    className="text-sm font-semibold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {a.label}
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

export const invalidateDashboardCache = () => {
  dashboardCache.data = null;
  dashboardCache.timestamp = null;
};
