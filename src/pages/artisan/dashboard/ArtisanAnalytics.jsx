import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Clock,
  Star,
  DollarSign,
  Download,
  Activity,
  ArrowUpRight,
  AlertCircle,
  Loader2,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useArtisanProfileStore } from "../../../stores/artisanProfileStore";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: "#3b82f6",
  success: "#16a34a",
  warning: "#f59e0b",
  danger: "#dc2626",
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },
  chart: {
    blue: "#3b82f6",
    green: "#10b981",
    yellow: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
  },
};

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanAnalytics() {
  const {
    analytics,
    topServices,
    selectedPeriod,
    isLoadingAnalytics,
    isLoadingTopServices,
    isExporting,
    error,
    fetchAnalytics,
    fetchTopServices,
    exportAnalytics,
    setAnalyticsPeriod,
    clearError,
  } = useArtisanProfileStore();

  const [dateRange, setDateRange] = useState("30");

  // Fetch analytics on mount and when period changes
  useEffect(() => {
    fetchAnalytics(parseInt(dateRange));
    fetchTopServices(5);
  }, []);

  // Handle date range change
  const handleDateRangeChange = (days) => {
    setDateRange(days);
    setAnalyticsPeriod(parseInt(days));
  };

  // Handle export
  const handleExport = async () => {
    try {
      await exportAnalytics(parseInt(dateRange));
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}k`;
    }
    return `₦${amount}`;
  };

  /* ==================== COMPONENTS ==================== */

  const MetricCard = ({ icon: Icon, label, value, change, color, trend }) => (
    <div className="group bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-lg transition-all hover:-translate-y-1">
      <div className="flex items-center justify-between mb-3">
        <div
          className="p-2.5 rounded-xl group-hover:scale-110 transition-transform"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <div
            className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full ${
              trend === "up"
                ? "bg-green-50 text-green-600"
                : "bg-red-50 text-red-600"
            }`}
          >
            <ArrowUpRight className="w-3 h-3" />
            <span>{change}%</span>
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-sm mt-1 text-gray-600">{label}</p>
    </div>
  );

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{" "}
              {entry.name === "Earnings"
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const LoadingState = () => (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Loading analytics...</p>
      </div>
    </div>
  );

  const ErrorState = () => (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 border border-red-200 max-w-md">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
          Failed to Load Analytics
        </h3>
        <p className="text-gray-600 text-center mb-4">{error}</p>
        <button
          onClick={() => {
            clearError();
            fetchAnalytics(parseInt(dateRange));
          }}
          className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  const EmptyState = () => (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="text-center">
        <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          No Analytics Data Yet
        </h3>
        <p className="text-gray-600">
          Complete some jobs to see your analytics dashboard.
        </p>
      </div>
    </div>
  );

  /* ==================== RENDER STATES ==================== */

  if (isLoadingAnalytics) return <LoadingState />;
  if (error) return <ErrorState />;
  if (!analytics || !analytics.summary) return <EmptyState />;

  const { trend, summary, jobStatus, serviceBreakdown, detailedRatings } =
    analytics;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="mt-2 text-base text-gray-600">
              Track performance with real-time insights
            </p>
          </div>
          <div className="flex gap-3">
            <select
              value={dateRange}
              onChange={(e) => handleDateRangeChange(e.target.value)}
              disabled={isLoadingAnalytics}
              className="px-4 py-2.5 rounded-xl border border-gray-300 font-medium text-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-white disabled:opacity-50"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className="px-5 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm flex items-center gap-2 transition-all hover:bg-blue-700 hover:shadow-lg disabled:opacity-60"
            >
              <Download
                className={`w-4 h-4 ${isExporting ? "animate-bounce" : ""}`}
              />
              {isExporting ? "Exporting..." : "Export"}
            </button>
          </div>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <MetricCard
            icon={DollarSign}
            label="Total Earnings"
            value={formatCurrency(summary.totalEarnings)}
            color={COLORS.chart.blue}
          />
          <MetricCard
            icon={Activity}
            label="Total Jobs"
            value={summary.totalJobs}
            color={COLORS.chart.green}
          />
          <MetricCard
            icon={Star}
            label="Average Rating"
            value={`${summary.avgRating.toFixed(1)} ★`}
            color={COLORS.chart.yellow}
          />
          <MetricCard
            icon={Clock}
            label="Total Reviews"
            value={summary.totalReviews}
            color={COLORS.chart.purple}
          />
          <MetricCard
            icon={TrendingUp}
            label="Completion Rate"
            value={`${summary.completionRate}%`}
            color={COLORS.success}
          />
        </div>

        {/* Detailed Ratings */}
        {detailedRatings && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Detailed Ratings
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(detailedRatings).map(([key, value]) => (
                <div key={key} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {value.toFixed(1)}
                  </div>
                  <div className="text-sm text-gray-600 capitalize mt-1">
                    {key}
                  </div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.round(value)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Earnings Trend */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Earnings Trend
            </h3>
            {trend && trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                    tickFormatter={(value) => formatCurrency(value)}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="earnings"
                    stroke={COLORS.chart.blue}
                    strokeWidth={3}
                    dot={{ fill: COLORS.chart.blue, r: 4 }}
                    activeDot={{ r: 6 }}
                    name="Earnings"
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No earnings data available
              </div>
            )}
          </div>

          {/* Job Status */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">Job Status</h3>
            {jobStatus && jobStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={jobStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    label={(entry) => `${entry.name}: ${entry.value}`}
                  >
                    {jobStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No job status data available
              </div>
            )}
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Jobs per Day */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Jobs per Day
            </h3>
            {trend && trend.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="day"
                    stroke="#9ca3af"
                    style={{ fontSize: "12px" }}
                  />
                  <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="jobs"
                    fill={COLORS.chart.green}
                    radius={[8, 8, 0, 0]}
                    name="Jobs"
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No jobs data available
              </div>
            )}
          </div>

          {/* Service Breakdown */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Service Breakdown
            </h3>
            {serviceBreakdown && serviceBreakdown.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={serviceBreakdown}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={(entry) => `${entry.name} ${entry.value}%`}
                  >
                    {serviceBreakdown.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">
                No service data available
              </div>
            )}
          </div>
        </div>

        {/* Job Status Over Time */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <h3 className="font-bold text-xl mb-4 text-gray-900">
            Job Status Over Time
          </h3>
          {trend && trend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="day"
                  stroke="#9ca3af"
                  style={{ fontSize: "12px" }}
                />
                <YAxis stroke="#9ca3af" style={{ fontSize: "12px" }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar
                  dataKey="completed"
                  stackId="a"
                  fill={COLORS.success}
                  name="Completed"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="pending"
                  stackId="a"
                  fill={COLORS.warning}
                  name="Pending"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="cancelled"
                  stackId="a"
                  fill={COLORS.danger}
                  name="Cancelled"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              No job status data available
            </div>
          )}
        </div>

        {/* Top Services Table */}
        {topServices && topServices.length > 0 && (
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-xl mb-4 text-gray-900">
              Top Performing Services
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Service
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Total Jobs
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Revenue
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Avg Price
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {topServices.map((service, index) => (
                    <tr
                      key={service._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-2 h-2 rounded-full"
                            style={{
                              backgroundColor:
                                COLORS.chart[
                                  Object.keys(COLORS.chart)[
                                    index % Object.keys(COLORS.chart).length
                                  ]
                                ],
                            }}
                          />
                          <span className="font-medium text-gray-900">
                            {service.serviceName}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {service.totalBookings}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(service.totalRevenue)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-700">
                        {formatCurrency(service.avgPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
