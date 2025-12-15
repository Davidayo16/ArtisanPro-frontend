import React, { useState } from "react";
import {
  Gift,
  Tag,
  Trophy,
  Users,
  Clock,
  Copy,
  Check,
  Star,
  TrendingUp,
  Calendar,
  Percent,
  Zap,
  Heart,
  Share2,
  ChevronRight,
  Sparkles,
  Award,
  Crown,
  Target,
  MessageCircle,
  Mail,
  Facebook,
  X,
} from "lucide-react";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: { 50: "#f0fdf4", 600: "#16a34a", 700: "#15803d" },
  warning: { 50: "#fffbeb", 500: "#f59e0b", 600: "#d97706" },
  danger: { 50: "#fef2f2", 600: "#dc2626" },
  purple: { 50: "#faf5ff", 500: "#a855f7", 600: "#9333ea" },
  pink: { 50: "#fdf2f8", 500: "#ec4899", 600: "#db2777" },
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

/* ==================== SOCIAL ICONS ==================== */
const WhatsAppIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.297-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
  </svg>
);

const TwitterIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
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
    {subtext && (
      <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
        {subtext}
      </p>
    )}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function Promotions() {
  const [copiedCode, setCopiedCode] = useState(null);
  const [activeTab, setActiveTab] = useState("active");

  // Stats
  const stats = {
    totalSavings: "₦125,000",
    activeOffers: 8,
    loyaltyPoints: 2450,
    referralEarnings: "₦15,000",
  };

  // Active Promotions
  const activePromotions = [
    {
      id: 1,
      title: "Welcome Bonus",
      description: "Get 20% off your first booking",
      code: "WELCOME20",
      discount: "20% OFF",
      validUntil: "Dec 31, 2025",
      minSpend: "₦5,000",
      maxDiscount: "₦5,000",
      icon: Sparkles,
      color: { bg: COLORS.primary[50], text: COLORS.primary[600] },
      category: "first-time",
    },
    {
      id: 2,
      title: "Rainy Season Special",
      description: "Save on plumbing & roofing services",
      code: "RAINY15",
      discount: "15% OFF",
      validUntil: "Nov 30, 2025",
      minSpend: "₦10,000",
      maxDiscount: "₦8,000",
      icon: Zap,
      color: { bg: COLORS.warning[50], text: COLORS.warning[600] },
      category: "seasonal",
    },
    {
      id: 3,
      title: "Weekend Special",
      description: "Book on weekends and save more",
      code: "WEEKEND10",
      discount: "10% OFF",
      validUntil: "Every Weekend",
      minSpend: "₦8,000",
      maxDiscount: "₦4,000",
      icon: Calendar,
      color: { bg: COLORS.success[50], text: COLORS.success[600] },
      category: "recurring",
    },
    {
      id: 4,
      title: "Loyalty Reward",
      description: "Special discount for our valued customers",
      code: "LOYAL25",
      discount: "25% OFF",
      validUntil: "Dec 15, 2025",
      minSpend: "₦15,000",
      maxDiscount: "₦10,000",
      icon: Crown,
      color: { bg: COLORS.purple[50], text: COLORS.purple[600] },
      category: "loyalty",
    },
  ];

  // Loyalty Tiers
  const loyaltyTiers = [
    { name: "Bronze", points: 0, discount: "5%" },
    { name: "Silver", points: 1000, discount: "10%" },
    { name: "Gold", points: 2500, discount: "15%" },
    { name: "Platinum", points: 5000, discount: "20%" },
  ];

  const currentTier = loyaltyTiers.find(
    (tier, index) =>
      stats.loyaltyPoints >= tier.points &&
      (index === loyaltyTiers.length - 1 ||
        stats.loyaltyPoints < loyaltyTiers[index + 1].points)
  );

  const nextTier =
    loyaltyTiers[
      loyaltyTiers.findIndex((t) => t.name === currentTier.name) + 1
    ];

  const progressToNextTier = nextTier
    ? ((stats.loyaltyPoints - currentTier.points) /
        (nextTier.points - currentTier.points)) *
      100
    : 100;

  // Referral Program
  const referralData = {
    code: "JOHN2025",
    link: "https://artisanpro.com/ref/john2025",
    totalReferrals: 12,
    earnings: "₦15,000",
    pending: 3,
  };

  // Promotion History
  const promotionHistory = [
    {
      id: 1,
      code: "WELCOME20",
      used: "Oct 15, 2025",
      saved: "₦4,000",
      booking: "Plumbing Service",
    },
    {
      id: 2,
      code: "WEEKEND10",
      used: "Oct 20, 2025",
      saved: "₦2,500",
      booking: "Electrical Work",
    },
    {
      id: 3,
      code: "RAINY15",
      used: "Oct 25, 2025",
      saved: "₦3,500",
      booking: "Roofing Repair",
    },
  ];

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralData.link);
    setCopiedCode("referral");
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <Gift
            className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0"
            style={{ color: COLORS.primary[600] }}
          />
          <h1
            className="text-xl sm:text-2xl lg:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Promotions & Rewards
          </h1>
        </div>
        <p className="text-sm sm:text-base" style={{ color: COLORS.gray[600] }}>
          Save more on every booking with exclusive offers
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          icon={TrendingUp}
          label="Total Savings"
          value={stats.totalSavings}
          subtext="All time"
          color={{ bg: COLORS.success[50], text: COLORS.success[600] }}
        />
        <StatCard
          icon={Tag}
          label="Active Offers"
          value={stats.activeOffers}
          subtext="Available now"
          color={{ bg: COLORS.primary[50], text: COLORS.primary[600] }}
        />
        <StatCard
          icon={Trophy}
          label="Loyalty Points"
          value={stats.loyaltyPoints.toLocaleString()}
          subtext={`${currentTier.name} tier`}
          color={{ bg: COLORS.warning[50], text: COLORS.warning[600] }}
        />
        <StatCard
          icon={Users}
          label="Referral Earnings"
          value={stats.referralEarnings}
          subtext={`${referralData.totalReferrals} friends`}
          color={{ bg: COLORS.purple[50], text: COLORS.purple[600] }}
        />
      </div>

      {/* Loyalty Progress Card */}
      <div
        className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden"
        style={{ border: `2px solid ${COLORS.purple[500]}` }}
      >
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 bg-purple-200 rounded-full opacity-20 -translate-y-1/2 translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Crown
                  className="w-5 h-5 sm:w-6 sm:h-6"
                  style={{ color: COLORS.warning[600] }}
                />
                <h3
                  className="text-lg sm:text-xl font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  Loyalty Rewards
                </h3>
              </div>
              <p
                className="text-xs sm:text-sm"
                style={{ color: COLORS.gray[700] }}
              >
                Current Tier:{" "}
                <span className="font-bold">{currentTier.name}</span> •{" "}
                Discount:{" "}
                <span className="font-bold">{currentTier.discount}</span>
              </p>
            </div>
            <div
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-bold text-xs sm:text-sm self-start"
              style={{
                backgroundColor: COLORS.warning[50],
                color: COLORS.warning[600],
              }}
            >
              {stats.loyaltyPoints.toLocaleString()} pts
            </div>
          </div>

          {nextTier ? (
            <>
              <div className="mb-3">
                <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-1 xs:gap-0 text-xs sm:text-sm mb-2">
                  <span style={{ color: COLORS.gray[700] }}>
                    Progress to{" "}
                    <span className="font-bold">{nextTier.name}</span>
                  </span>
                  <span
                    className="font-bold"
                    style={{ color: COLORS.purple[600] }}
                  >
                    {nextTier.points - stats.loyaltyPoints} points needed
                  </span>
                </div>
                <div
                  className="w-full h-2.5 sm:h-3 rounded-full overflow-hidden"
                  style={{ backgroundColor: COLORS.gray[200] }}
                >
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${progressToNextTier}%`,
                      backgroundImage:
                        "linear-gradient(to right, #a855f7, #ec4899)",
                    }}
                  ></div>
                </div>
              </div>
              <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                Earn points with every booking • 100 points = ₦1 spent
              </p>
            </>
          ) : (
            <div
              className="p-3 sm:p-4 rounded-xl flex items-start sm:items-center space-x-3"
              style={{ backgroundColor: COLORS.warning[50] }}
            >
              <Trophy
                className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 sm:mt-0"
                style={{ color: COLORS.warning[600] }}
              />
              <div>
                <p
                  className="font-bold text-xs sm:text-sm"
                  style={{ color: COLORS.gray[900] }}
                >
                  You've reached the highest tier!
                </p>
                <p className="text-xs" style={{ color: COLORS.gray[700] }}>
                  Enjoy maximum rewards on all bookings
                </p>
              </div>
            </div>
          )}

          {/* Tier List */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mt-4">
            {loyaltyTiers.map((tier) => {
              const isActive = tier.name === currentTier.name;
              const isPassed = stats.loyaltyPoints >= tier.points;
              return (
                <div
                  key={tier.name}
                  className={`p-2 sm:p-3 rounded-lg sm:rounded-xl text-center transition-all duration-300 ${
                    isActive ? "ring-2 ring-purple-500" : ""
                  }`}
                  style={{
                    backgroundColor: isPassed
                      ? COLORS.purple[50]
                      : COLORS.gray[100],
                    border: `2px solid ${
                      isActive ? COLORS.purple[500] : "transparent"
                    }`,
                  }}
                >
                  <p
                    className="font-bold text-xs sm:text-sm mb-1"
                    style={{
                      color: isPassed ? COLORS.purple[600] : COLORS.gray[500],
                    }}
                  >
                    {tier.name}
                  </p>
                  <p
                    className="text-xs"
                    style={{
                      color: isPassed ? COLORS.gray[700] : COLORS.gray[500],
                    }}
                  >
                    {tier.points.toLocaleString()} pts
                  </p>
                  <p
                    className="text-xs font-bold mt-1"
                    style={{
                      color: isPassed ? COLORS.purple[600] : COLORS.gray[500],
                    }}
                  >
                    {tier.discount}
                  </p>
                  {isActive && (
                    <div className="mt-2">
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: COLORS.purple[600],
                          color: "white",
                        }}
                      >
                        Current
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="bg-white rounded-xl sm:rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="border-b" style={{ borderColor: COLORS.gray[200] }}>
          <nav className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: "active", label: "Active Offers", icon: Tag },
              { id: "referral", label: "Referral Program", icon: Users },
              { id: "history", label: "History", icon: Clock },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 sm:py-4 px-4 sm:px-6 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex items-center space-x-1.5 sm:space-x-2 flex-shrink-0 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {/* Active Offers Tab */}
          {activeTab === "active" && (
            <div className="space-y-6">
              {/* Filter Chips */}
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "All", value: "all" },
                  { label: "First-Time", value: "first-time" },
                  { label: "Seasonal", value: "seasonal" },
                  { label: "Loyalty", value: "loyalty" },
                  { label: "Recurring", value: "recurring" },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 hover:shadow-md"
                    style={{
                      backgroundColor:
                        filter.value === "all"
                          ? COLORS.primary[600]
                          : COLORS.gray[100],
                      color:
                        filter.value === "all" ? "white" : COLORS.gray[700],
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              {/* Promotion Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {activePromotions.map((promo) => {
                  const Icon = promo.icon;
                  return (
                    <div
                      key={promo.id}
                      className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-xl relative overflow-hidden group"
                      style={{ border: `2px solid ${COLORS.gray[100]}` }}
                    >
                      {/* Background Pattern */}
                      <div className="absolute top-0 right-0 w-24 h-24 sm:w-32 sm:h-32 opacity-5 transform translate-x-6 sm:translate-x-8 -translate-y-6 sm:-translate-y-8">
                        <Icon className="w-full h-full" />
                      </div>

                      <div className="relative z-10">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-3 sm:mb-4">
                          <div
                            className="p-2.5 sm:p-3 rounded-lg sm:rounded-xl"
                            style={{ backgroundColor: promo.color.bg }}
                          >
                            <Icon
                              className="w-5 h-5 sm:w-6 sm:h-6"
                              style={{ color: promo.color.text }}
                            />
                          </div>
                          <div
                            className="px-2.5 sm:px-3 py-1 rounded-full font-bold text-xs sm:text-sm"
                            style={{
                              backgroundColor: promo.color.bg,
                              color: promo.color.text,
                            }}
                          >
                            {promo.discount}
                          </div>
                        </div>

                        {/* Content */}
                        <h3
                          className="text-lg sm:text-xl font-bold mb-1.5 sm:mb-2"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {promo.title}
                        </h3>
                        <p
                          className="text-xs sm:text-sm mb-3 sm:mb-4"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {promo.description}
                        </p>

                        {/* Details */}
                        <div className="space-y-1.5 sm:space-y-2 mb-3 sm:mb-4">
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span style={{ color: COLORS.gray[600] }}>
                              Minimum spend:
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {promo.minSpend}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span style={{ color: COLORS.gray[600] }}>
                              Max discount:
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {promo.maxDiscount}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-xs sm:text-sm">
                            <span style={{ color: COLORS.gray[600] }}>
                              Valid until:
                            </span>
                            <span
                              className="font-bold"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {promo.validUntil}
                            </span>
                          </div>
                        </div>

                        {/* Promo Code - COMPACT */}
                        <div
                          className="flex items-center gap-2 p-2.5 rounded-lg"
                          style={{
                            backgroundColor: COLORS.gray[50],
                            border: `1px dashed ${COLORS.gray[300]}`,
                          }}
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-600 mb-0.5">
                              Promo Code
                            </p>
                            <p
                              className="font-mono font-bold text-sm tracking-wider truncate"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {promo.code}
                            </p>
                          </div>
                          <button
                            onClick={() => handleCopyCode(promo.code)}
                            className="px-3 py-1.5 rounded-md text-white font-medium text-xs hover:shadow transition-all flex items-center gap-1.5 flex-shrink-0"
                            style={{
                              backgroundImage:
                                "linear-gradient(to right, #224e8c, #2a5ca8)",
                            }}
                          >
                            {copiedCode === promo.code ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Terms Section */}
              <div
                className="p-4 sm:p-6 rounded-xl"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <h3
                  className="text-base sm:text-lg font-bold mb-2 sm:mb-3 flex items-center space-x-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  <Target
                    className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <span>How to Use Promo Codes</span>
                </h3>
                <div
                  className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm"
                  style={{ color: COLORS.gray[700] }}
                >
                  <p>1. Copy your preferred promo code from the offers above</p>
                  <p>2. Proceed to book any artisan service</p>
                  <p>3. Enter the promo code at checkout before payment</p>
                  <p>4. Your discount will be applied automatically</p>
                  <p
                    className="pt-2 text-xs"
                    style={{ color: COLORS.gray[600] }}
                  >
                    * Terms and conditions apply. Offers cannot be combined. One
                    promo code per booking.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Referral Program Tab */}
          {activeTab === "referral" && (
            <div className="space-y-6">
              {/* Referral Stats Card */}
              <div
                className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{ border: `2px solid ${COLORS.purple[500]}` }}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-0 mb-4 sm:mb-6">
                  <div className="flex-1">
                    <h3
                      className="text-xl sm:text-2xl font-bold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Earn ₦2,500 per Referral!
                    </h3>
                    <p
                      className="text-xs sm:text-sm"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Share the love and get rewarded when your friends join
                    </p>
                  </div>
                  <div
                    className="p-3 sm:p-4 rounded-xl self-start"
                    style={{ backgroundColor: COLORS.purple[600] }}
                  >
                    <Users className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>
                </div>

                {/* Referral Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-6">
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl">
                    <p
                      className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1"
                      style={{ color: COLORS.purple[600] }}
                    >
                      {referralData.totalReferrals}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                      Total Referrals
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl">
                    <p
                      className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1"
                      style={{ color: COLORS.success[600] }}
                    >
                      {referralData.earnings}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                      Total Earned
                    </p>
                  </div>
                  <div className="text-center p-3 sm:p-4 bg-white rounded-lg sm:rounded-xl">
                    <p
                      className="text-xl sm:text-2xl font-bold mb-0.5 sm:mb-1"
                      style={{ color: COLORS.warning[600] }}
                    >
                      {referralData.pending}
                    </p>
                    <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                      Pending
                    </p>
                  </div>
                </div>

                {/* Referral Code - COMPACT */}
                <div className="space-y-3">
                  <div>
                    <label
                      className="block text-xs sm:text-sm font-semibold mb-1.5"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Your Referral Code
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralData.code}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded-md font-mono text-sm"
                        style={{
                          borderColor: COLORS.purple[500],
                          backgroundColor: "white",
                          color: COLORS.gray[900],
                        }}
                      />
                      <button
                        onClick={() => handleCopyCode(referralData.code)}
                        className="px-3 py-2 rounded-md text-white font-medium text-xs hover:shadow transition-all flex items-center gap-1.5 flex-shrink-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, #a855f7, #ec4899)",
                        }}
                      >
                        {copiedCode === referralData.code ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className="block text-xs sm:text-sm font-semibold mb-1.5"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Your Referral Link
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={referralData.link}
                        readOnly
                        className="flex-1 px-3 py-2 border rounded-md text-xs overflow-x-auto whitespace-nowrap"
                        style={{
                          borderColor: COLORS.purple[500],
                          backgroundColor: "white",
                          color: COLORS.gray[700],
                        }}
                      />
                      <button
                        onClick={handleCopyReferralLink}
                        className="px-3 py-2 rounded-md text-white font-medium text-xs hover:shadow transition-all flex items-center gap-1.5 flex-shrink-0"
                        style={{
                          backgroundImage:
                            "linear-gradient(to right, #a855f7, #ec4899)",
                        }}
                      >
                        {copiedCode === "referral" ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* How it Works */}
              <div
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <h3
                  className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                  style={{ color: COLORS.gray[900] }}
                >
                  How Referral Works
                </h3>
                <div className="space-y-3 sm:space-y-4">
                  {[
                    {
                      step: 1,
                      title: "Share Your Link",
                      description:
                        "Send your unique referral link to friends and family",
                    },
                    {
                      step: 2,
                      title: "Friend Signs Up",
                      description:
                        "They create an account using your referral code or link",
                    },
                    {
                      step: 3,
                      title: "They Book First Service",
                      description:
                        "Your friend completes their first booking worth at least ₦5,000",
                    },
                    {
                      step: 4,
                      title: "You Both Get Rewarded",
                      description:
                        "You earn ₦2,500 and they get 20% off their first booking",
                    },
                  ].map((item) => (
                    <div
                      key={item.step}
                      className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 hover:shadow-md"
                      style={{ backgroundColor: COLORS.gray[50] }}
                    >
                      <div
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-sm sm:text-base flex-shrink-0"
                        style={{
                          backgroundColor: COLORS.purple[600],
                          color: "white",
                        }}
                      >
                        {item.step}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className="font-bold text-xs sm:text-sm mb-0.5 sm:mb-1"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {item.title}
                        </p>
                        <p
                          className="text-xs sm:text-sm"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Share Buttons - PROPER ICONS */}
              <div
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <h3
                  className="text-base sm:text-lg font-bold mb-3 sm:mb-4"
                  style={{ color: COLORS.gray[900] }}
                >
                  Share Your Code
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { name: "WhatsApp", color: "#25D366", icon: WhatsAppIcon },
                    { name: "Facebook", color: "#1877F2", icon: Facebook },
                    {
                      name: "X (Twitter)",
                      color: "#000000",
                      icon: TwitterIcon,
                    },
                    { name: "Email", color: "#EA4335", icon: Mail },
                  ].map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <button
                        key={platform.name}
                        className="p-3 sm:p-4 rounded-lg sm:rounded-xl font-semibold text-white hover:shadow-lg transition-all duration-200 flex flex-col items-center space-y-1.5 sm:space-y-2"
                        style={{ backgroundColor: platform.color }}
                      >
                        <Icon size={28} />
                        <span className="text-xs sm:text-sm">
                          {platform.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms */}
              <div
                className="p-3 sm:p-4 rounded-lg sm:rounded-xl"
                style={{ backgroundColor: COLORS.purple[50] }}
              >
                <p className="text-xs" style={{ color: COLORS.gray[700] }}>
                  <strong>Terms:</strong> Referral rewards are credited after
                  the referred friend completes their first booking. Minimum
                  booking value of ₦5,000 required. Rewards cannot be withdrawn
                  as cash but can be used for future bookings. Referrals must be
                  new users who haven't previously registered on the platform.
                </p>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6"
                style={{ border: `2px solid ${COLORS.success[600]}` }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3
                      className="text-2xl font-bold mb-1"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {stats.totalSavings}
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray[700] }}>
                      Total savings from promotions
                    </p>
                  </div>
                  <div
                    className="p-4 rounded-xl"
                    style={{ backgroundColor: COLORS.success[600] }}
                  >
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                </div>
              </div>

              {/* History List */}
              <div className="space-y-3">
                {promotionHistory.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl p-4 flex items-center justify-between transition-all duration-300 hover:shadow-md"
                    style={{ border: `1px solid ${COLORS.gray[100]}` }}
                  >
                    <div className="flex items-center space-x-4 flex-1 min-w-0">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: COLORS.success[50] }}
                      >
                        <Tag
                          className="w-6 h-6"
                          style={{ color: COLORS.success[600] }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                          <p
                            className="font-bold text-sm"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {item.code}
                          </p>
                          <span
                            className="px-2 py-0.5 rounded-full text-xs font-bold"
                            style={{
                              backgroundColor: COLORS.success[50],
                              color: COLORS.success[600],
                            }}
                          >
                            Saved {item.saved}
                          </span>
                        </div>
                        <p
                          className="text-xs truncate"
                          style={{ color: COLORS.gray[600] }}
                        >
                          Used on: {item.booking}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          {item.used}
                        </p>
                      </div>
                    </div>
                    <ChevronRight
                      className="w-5 h-5 flex-shrink-0"
                      style={{ color: COLORS.gray[400] }}
                    />
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {promotionHistory.length === 0 && (
                <div className="text-center py-12">
                  <Clock
                    className="w-16 h-16 mx-auto mb-4"
                    style={{ color: COLORS.gray[300] }}
                  />
                  <h3
                    className="text-lg font-bold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    No promotion history yet
                  </h3>
                  <p
                    className="text-sm mb-4"
                    style={{ color: COLORS.gray[600] }}
                  >
                    Start using promo codes to save on your bookings!
                  </p>
                  <button
                    onClick={() => setActiveTab("active")}
                    className="px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #224e8c, #2a5ca8)",
                    }}
                  >
                    Browse Offers
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative z-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-2xl font-bold mb-2">
                Exclusive Member Benefits
              </h3>
              <p className="text-sm opacity-90 mb-4">
                Upgrade to premium and get access to exclusive promotions,
                higher discounts, and priority support
              </p>
              <button className="px-6 py-3 bg-white text-blue-600 rounded-lg font-bold hover:shadow-xl transition-all duration-200">
                Upgrade to Premium
              </button>
            </div>
            <div className="flex-shrink-0">
              <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <Crown className="w-12 h-12" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
