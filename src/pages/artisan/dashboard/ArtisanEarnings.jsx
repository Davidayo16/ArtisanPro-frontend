import React, { useState, useMemo } from "react";
import {
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  AlertCircle,
  FileText,
  CreditCard,
  Building2,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: { 50: "#f0fdf4", 600: "#059669" },
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

const CHART_CONFIG = {
  height: { mobile: 250, desktop: 280 },
  margin: { area: { top: 10, right: 0, left: -25, bottom: 0 } },
  animation: 1200,
};

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, change, trend, color }) => (
  <div
    className="bg-white rounded-2xl p-6 transition-all duration-300 group cursor-pointer"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between mb-4">
      <div
        className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
      {trend && (
        <div
          className="flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold"
          style={{
            color: trend === "up" ? COLORS.success[600] : COLORS.danger[600],
            backgroundColor:
              trend === "up" ? COLORS.success[50] : COLORS.danger[50],
          }}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3 h-3" />
          ) : (
            <ArrowDownLeft className="w-3 h-3" />
          )}
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
);

const StatusBadge = ({ status }) => {
  const styles = {
    completed: {
      bg: COLORS.success[50],
      text: COLORS.success[600],
      icon: CheckCircle,
    },
    pending: { bg: COLORS.warning[50], text: COLORS.warning[500], icon: Clock },
    failed: {
      bg: COLORS.danger[50],
      text: COLORS.danger[600],
      icon: AlertCircle,
    },
  }[status] || { bg: COLORS.gray[50], text: COLORS.gray[600], icon: Clock };

  const Icon = styles.icon;
  return (
    <div
      className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-sm font-semibold"
      style={{ backgroundColor: styles.bg, color: styles.text }}
    >
      <Icon className="w-4 h-4" />
      <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
    </div>
  );
};

const ChartTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div
      className="px-4 py-3 rounded-xl shadow-2xl border bg-white"
      style={{ borderColor: COLORS.primary[200] }}
    >
      <p className="text-sm font-bold mb-1" style={{ color: COLORS.gray[900] }}>
        {payload[0].payload.month || payload[0].payload.day}
      </p>
      <p className="text-lg font-bold" style={{ color: COLORS.primary[600] }}>
        ₦{payload[0].value.toLocaleString()}
      </p>
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanEarnings() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const itemsPerPage = 8;

  /* ---------------------- MOCK DATA ---------------------- */
  const earnings = useMemo(
    () => ({
      totalEarnings: 845000,
      availableBalance: 125000,
      pendingPayments: 85000,
      thisMonth: 185000,
      lastMonthChange: 18,
    }),
    []
  );

  const earningsTrends = useMemo(
    () => [
      { month: "Jan", earnings: 45000 },
      { month: "Feb", earnings: 52000 },
      { month: "Mar", earnings: 48000 },
      { month: "Apr", earnings: 65000 },
      { month: "May", earnings: 78000 },
      { month: "Jun", earnings: 85000 },
    ],
    []
  );

  const dailyEarnings = useMemo(
    () => [
      { day: "Mon", earnings: 15000 },
      { day: "Tue", earnings: 22000 },
      { day: "Wed", earnings: 18000 },
      { day: "Thu", earnings: 28000 },
      { day: "Fri", earnings: 25000 },
      { day: "Sat", earnings: 12000 },
      { day: "Sun", earnings: 8000 },
    ],
    []
  );

  const transactions = useMemo(
    () => [
      {
        id: 1,
        type: "payment",
        customer: "Sarah Johnson",
        service: "Plumbing - Leak Repair",
        amount: 18000,
        date: "Oct 28, 2025",
        time: "2:30 PM",
        status: "completed",
        reference: "TXN-001-2025",
      },
      {
        id: 2,
        type: "payment",
        customer: "David Okonkwo",
        service: "Plumbing - Tap Installation",
        amount: 12000,
        date: "Oct 27, 2025",
        time: "11:15 AM",
        status: "completed",
        reference: "TXN-002-2025",
      },
      {
        id: 3,
        type: "withdrawal",
        bankName: "GTBank",
        accountNumber: "0123456789",
        amount: 50000,
        date: "Oct 26, 2025",
        time: "9:00 AM",
        status: "completed",
        reference: "WTH-001-2025",
      },
      {
        id: 4,
        type: "payment",
        customer: "Grace Eze",
        service: "Plumbing - Pipe Replacement",
        amount: 25000,
        date: "Oct 25, 2025",
        time: "4:45 PM",
        status: "pending",
        reference: "TXN-003-2025",
      },
      {
        id: 5,
        type: "payment",
        customer: "Chinedu Okoro",
        service: "Plumbing - Drain Cleaning",
        amount: 15000,
        date: "Oct 24, 2025",
        time: "1:20 PM",
        status: "completed",
        reference: "TXN-004-2025",
      },
      {
        id: 6,
        type: "withdrawal",
        bankName: "Access Bank",
        accountNumber: "0987654321",
        amount: 100000,
        date: "Oct 23, 2025",
        time: "10:30 AM",
        status: "completed",
        reference: "WTH-002-2025",
      },
      {
        id: 7,
        type: "payment",
        customer: "Fatima Yusuf",
        service: "Plumbing - Water Heater Repair",
        amount: 30000,
        date: "Oct 22, 2025",
        time: "3:00 PM",
        status: "completed",
        reference: "TXN-005-2025",
      },
      {
        id: 8,
        type: "payment",
        customer: "Ibrahim Musa",
        service: "Plumbing - Toilet Repair",
        amount: 10000,
        date: "Oct 21, 2025",
        time: "12:00 PM",
        status: "completed",
        reference: "TXN-006-2025",
      },
    ],
    []
  );

  /* ---------------------- FILTER / SEARCH ---------------------- */
  const getFilteredTransactions = () => {
    let list = [...transactions];

    if (filterType !== "all") {
      list = list.filter((t) => t.type === filterType);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (t) =>
          t.reference.toLowerCase().includes(q) ||
          (t.customer && t.customer.toLowerCase().includes(q)) ||
          (t.service && t.service.toLowerCase().includes(q))
      );
    }

    return list;
  };

  const filtered = getFilteredTransactions();
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const current = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------------- HANDLERS ---------------------- */
  const handleWithdraw = (amount) => {
    if (amount > earnings.availableBalance) {
      alert("Insufficient balance!");
      return;
    }
    alert(`Withdrawal of ₦${amount.toLocaleString()} initiated!`);
    setShowWithdrawModal(false);
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
            Earnings & Wallet
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Track your income and manage payments
          </p>
        </div>
        <button
          onClick={() => setShowWithdrawModal(true)}
          className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 hover:shadow-lg"
          style={{
            backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
            color: "white",
          }}
        >
          <Wallet className="w-5 h-5" />
          <span>Withdraw Funds</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={DollarSign}
          label="Total Earnings"
          value={`₦${earnings.totalEarnings.toLocaleString()}`}
          change="+18%"
          trend="up"
          color={COLORS.primary[600]}
        />
        <StatCard
          icon={Wallet}
          label="Available Balance"
          value={`₦${earnings.availableBalance.toLocaleString()}`}
          color={COLORS.success[600]}
        />
        <StatCard
          icon={Clock}
          label="Pending Payments"
          value={`₦${earnings.pendingPayments.toLocaleString()}`}
          color={COLORS.warning[500]}
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={`₦${earnings.thisMonth.toLocaleString()}`}
          change="+18%"
          trend="up"
          color={COLORS.success[600]}
        />
      </div>

      {/* Tabs */}
      <div
        className="bg-white rounded-2xl p-2"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex overflow-x-auto space-x-2">
          {[
            { id: "overview", label: "Overview" },
            { id: "transactions", label: "Transactions" },
            { id: "invoices", label: "Invoices" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id);
                setCurrentPage(1);
              }}
              className={`px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-primary-50 text-primary-600 shadow-sm"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Earnings Trends */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 border"
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
                  <p
                    className="text-sm mt-1"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Last 6 months
                  </p>
                </div>
              </div>
              <div
                className="w-full -mr-4"
                style={{ height: CHART_CONFIG.height.desktop }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={earningsTrends}
                    margin={CHART_CONFIG.margin.area}
                  >
                    <defs>
                      <linearGradient
                        id="earningsGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
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
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="earnings"
                      stroke={COLORS.primary[500]}
                      strokeWidth={3}
                      fill="url(#earningsGradient)"
                      animationDuration={CHART_CONFIG.animation}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Daily Earnings (Last 7 Days) */}
            <div
              className="bg-white rounded-2xl shadow-lg p-6 border"
              style={{ borderColor: COLORS.gray[100] }}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Daily Earnings
                  </h3>
                  <p
                    className="text-sm mt-1"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Last 7 days performance
                  </p>
                </div>
              </div>
              <div
                className="w-full -mr-4"
                style={{ height: CHART_CONFIG.height.desktop }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dailyEarnings}
                    margin={CHART_CONFIG.margin.area}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke={COLORS.gray[200]}
                      vertical={false}
                    />
                    <XAxis
                      dataKey="day"
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
                    <Tooltip content={<ChartTooltip />} />
                    <Bar
                      dataKey="earnings"
                      fill={COLORS.primary[600]}
                      radius={[8, 8, 0, 0]}
                      animationDuration={CHART_CONFIG.animation}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div
            className="bg-white rounded-2xl shadow-lg p-6 border"
            style={{ borderColor: COLORS.gray[100] }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-lg font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Recent Transactions
              </h3>
              <button
                onClick={() => setActiveTab("transactions")}
                className="text-sm font-medium hover:underline"
                style={{ color: COLORS.primary[600] }}
              >
                View All
              </button>
            </div>
            <div className="space-y-3">
              {transactions.slice(0, 5).map((txn) => (
                <div
                  key={txn.id}
                  className="flex items-center justify-between p-4 rounded-xl border hover:shadow-md transition-all cursor-pointer"
                  style={{ borderColor: COLORS.gray[200] }}
                  onClick={() => setSelectedTransaction(txn)}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor:
                          txn.type === "payment"
                            ? COLORS.success[50]
                            : COLORS.primary[50],
                      }}
                    >
                      {txn.type === "payment" ? (
                        <ArrowDownLeft
                          className="w-5 h-5"
                          style={{ color: COLORS.success[600] }}
                        />
                      ) : (
                        <ArrowUpRight
                          className="w-5 h-5"
                          style={{ color: COLORS.primary[600] }}
                        />
                      )}
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {txn.type === "payment" ? txn.customer : txn.bankName}
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {txn.type === "payment"
                          ? txn.service
                          : `Account: ${txn.accountNumber}`}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: COLORS.gray[500] }}
                      >
                        {txn.date} • {txn.time}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-lg font-bold"
                      style={{
                        color:
                          txn.type === "payment"
                            ? COLORS.success[600]
                            : COLORS.danger[600],
                      }}
                    >
                      {txn.type === "payment" ? "+" : "-"}₦
                      {txn.amount.toLocaleString()}
                    </p>
                    <StatusBadge status={txn.status} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TRANSACTIONS TAB */}
      {activeTab === "transactions" && (
        <div className="space-y-6">
          {/* Search & Filter */}
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
                  placeholder="Search by customer, service, or reference..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>
              <div className="flex gap-2">
                {[
                  { value: "all", label: "All" },
                  { value: "payment", label: "Payments" },
                  { value: "withdrawal", label: "Withdrawals" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setFilterType(opt.value)}
                    className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      filterType === opt.value
                        ? "bg-primary-50 text-primary-600"
                        : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-3">
            {current.map((txn) => (
              <div
                key={txn.id}
                className="bg-white rounded-2xl p-6 border transition-all hover:shadow-md cursor-pointer"
                style={{ borderColor: COLORS.gray[100] }}
                onClick={() => setSelectedTransaction(txn)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className="p-3 rounded-xl"
                      style={{
                        backgroundColor:
                          txn.type === "payment"
                            ? COLORS.success[50]
                            : COLORS.primary[50],
                      }}
                    >
                      {txn.type === "payment" ? (
                        <ArrowDownLeft
                          className="w-6 h-6"
                          style={{ color: COLORS.success[600] }}
                        />
                      ) : (
                        <ArrowUpRight
                          className="w-6 h-6"
                          style={{ color: COLORS.primary[600] }}
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <p
                          className="font-bold"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {txn.type === "payment" ? txn.customer : txn.bankName}
                        </p>
                        <StatusBadge status={txn.status} />
                      </div>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {txn.type === "payment"
                          ? txn.service
                          : `Account: ${txn.accountNumber}`}
                      </p>
                      <p
                        className="text-xs mt-1"
                        style={{ color: COLORS.gray[500] }}
                      >
                        {txn.date} • {txn.time} • {txn.reference}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p
                      className="text-2xl font-bold mb-1"
                      style={{
                        color:
                          txn.type === "payment"
                            ? COLORS.success[600]
                            : COLORS.danger[600],
                      }}
                    >
                      {txn.type === "payment" ? "+" : "-"}₦
                      {txn.amount.toLocaleString()}
                    </p>
                    <button
                      className="text-sm font-medium hover:underline flex items-center space-x-1"
                      style={{ color: COLORS.primary[600] }}
                    >
                      <Eye className="w-4 h-4" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
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
                  currentPage === 1 ? "text-gray-400" : "hover:bg-gray-100"
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
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center space-x-2 transition-all ${
                  currentPage === totalPages
                    ? "text-gray-400"
                    : "hover:bg-gray-100"
                }`}
              >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* INVOICES TAB */}
      {activeTab === "invoices" && (
        <div
          className="bg-white rounded-2xl p-12 text-center"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <FileText
            className="w-16 h-16 mx-auto mb-4"
            style={{ color: COLORS.gray[400] }}
          />
          <h3
            className="text-xl font-bold mb-2"
            style={{ color: COLORS.gray[900] }}
          >
            Invoice Management
          </h3>
          <p className="mb-6" style={{ color: COLORS.gray[600] }}>
            Generate and manage invoices for your completed jobs
          </p>
          <button
            className="px-6 py-3 rounded-xl font-semibold transition-all"
            style={{
              backgroundColor: COLORS.primary[600],
              color: "white",
            }}
          >
            Create Invoice
          </button>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Transaction Details
              </h3>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Amount */}
              <div
                className="text-center py-6 rounded-xl"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: COLORS.gray[600] }}
                >
                  Amount
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{
                    color:
                      selectedTransaction.type === "payment"
                        ? COLORS.success[600]
                        : COLORS.danger[600],
                  }}
                >
                  {selectedTransaction.type === "payment" ? "+" : "-"}₦
                  {selectedTransaction.amount.toLocaleString()}
                </p>
              </div>

              {/* Details */}
              <div className="space-y-3">
                <div
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Type
                  </span>
                  <span
                    className="text-sm font-semibold capitalize"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {selectedTransaction.type}
                  </span>
                </div>

                <div
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Status
                  </span>
                  <StatusBadge status={selectedTransaction.status} />
                </div>

                {selectedTransaction.type === "payment" && (
                  <>
                    <div
                      className="flex justify-between py-3 border-b"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Customer
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedTransaction.customer}
                      </span>
                    </div>
                    <div
                      className="flex justify-between py-3 border-b"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Service
                      </span>
                      <span
                        className="text-sm font-semibold text-right"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedTransaction.service}
                      </span>
                    </div>
                  </>
                )}

                {selectedTransaction.type === "withdrawal" && (
                  <>
                    <div
                      className="flex justify-between py-3 border-b"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Bank
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedTransaction.bankName}
                      </span>
                    </div>
                    <div
                      className="flex justify-between py-3 border-b"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <span
                        className="text-sm font-medium"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Account
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedTransaction.accountNumber}
                      </span>
                    </div>
                  </>
                )}

                <div
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Date & Time
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {selectedTransaction.date}, {selectedTransaction.time}
                  </span>
                </div>

                <div
                  className="flex justify-between py-3 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Reference
                  </span>
                  <span
                    className="text-sm font-semibold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {selectedTransaction.reference}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    alert("Receipt downloaded!");
                  }}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                  style={{ color: COLORS.gray[700] }}
                >
                  <Download className="w-5 h-5" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Withdraw Funds
              </h3>
              <button
                onClick={() => setShowWithdrawModal(false)}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Available Balance */}
              <div
                className="text-center py-6 rounded-xl"
                style={{ backgroundColor: COLORS.success[50] }}
              >
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: COLORS.gray[600] }}
                >
                  Available Balance
                </p>
                <p
                  className="text-4xl font-bold"
                  style={{ color: COLORS.success[600] }}
                >
                  ₦{earnings.availableBalance.toLocaleString()}
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <span
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold"
                    style={{ color: COLORS.gray[600] }}
                  >
                    ₦
                  </span>
                  <input
                    type="number"
                    placeholder="0"
                    className="w-full pl-10 pr-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 text-lg font-semibold"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div className="flex justify-between mt-2">
                  {[25000, 50000, 100000].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => {
                        document.querySelector('input[type="number"]').value =
                          amount;
                      }}
                      className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold hover:bg-gray-200 transition-all"
                    >
                      ₦{amount.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bank Account */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Bank Account
                </label>
                <div
                  className="p-4 rounded-xl border-2 flex items-center justify-between"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <Building2
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <p
                        className="font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        GTBank
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        0123456789
                      </p>
                    </div>
                  </div>
                  <button
                    className="text-sm font-medium hover:underline"
                    style={{ color: COLORS.primary[600] }}
                  >
                    Change
                  </button>
                </div>
              </div>

              {/* Info */}
              <div
                className="p-4 rounded-xl border flex items-start space-x-3"
                style={{
                  backgroundColor: COLORS.primary[50],
                  borderColor: COLORS.primary[200],
                }}
              >
                <AlertCircle
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.primary[600] }}
                />
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: COLORS.primary[900] }}
                  >
                    Processing Time
                  </p>
                  <p className="text-xs" style={{ color: COLORS.primary[700] }}>
                    Funds will be credited to your account within 24 hours
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    const amount = parseInt(
                      document.querySelector('input[type="number"]').value
                    );
                    if (amount) handleWithdraw(amount);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all hover:shadow-lg"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                    color: "white",
                  }}
                >
                  Withdraw
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
