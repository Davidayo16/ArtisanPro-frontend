/* -------------------------------------------------------------------------- */
/*  BookingHistory.jsx – Pure JS, matches Overview design system             */
/* -------------------------------------------------------------------------- */

import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  Star,
  Download,
  AlertCircle,
  CheckCircle,
  XCircle,
  Loader,
  MapPin,
  DollarSign,
  MessageSquare,
  Shield,
  FileText,
  Filter,
  ChevronDown,
  Award,
  Phone,
  Mail,
  MoreVertical,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

/* ==================== DESIGN SYSTEM (same as Overview) ==================== */
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
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    500: "#6b7280",
    600: "#4b5563",
    900: "#111827",
  },
};

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, change, trend }) => (
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
      {trend === "up" && (
        <div
          className="flex items-center space-x-1 px-2 py-1 rounded-lg"
          style={{
            color: COLORS.success[600],
            backgroundColor: COLORS.success[50],
          }}
        >
          <span className="text-xs font-bold">{change}</span>
        </div>
      )}
    </div>
    <p className="text-sm mb-1 font-medium" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
    <p className="text-3xl font-bold mb-1" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
    {trend === "neutral" && (
      <p className="text-sm" style={{ color: COLORS.gray[500] }}>
        {change}
      </p>
    )}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function BookingHistory() {
  /* ---------------------- STATE ---------------------- */
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("date-desc");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [selectedServices, setSelectedServices] = useState([]);
  const [ratingFilter, setRatingFilter] = useState("");
  const itemsPerPage = 5;

  /* ---------------------- MOCK DATA ---------------------- */
  const bookings = useMemo(
    () => [
      {
        id: 1,
        bookingRef: "BK-2024-001",
        artisan: "Chidi Okafor",
        artisanPhone: "+234 803 456 7890",
        artisanEmail: "chidi@example.com",
        service: "Plumbing",
        subService: "Pipe Repair & Leak Fix",
        description: "Kitchen sink pipe leaking, need urgent repair",
        date: "Jun 15, 2024",
        time: "10:00 AM",
        completedDate: "Jun 15, 2024",
        completedTime: "12:30 PM",
        status: "Completed",
        amount: "₦12,000",
        deposit: "₦5,000",
        balance: "₦7,000",
        paymentStatus: "Released",
        pricingModel: "Fixed Price",
        photo: "https://i.pravatar.cc/150?img=12",
        rating: 5,
        review: "Excellent work! Very professional and quick.",
        photos: [
          "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400",
          "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
        ],
        materials: [
          { name: "PVC Pipes", cost: "₦2,000" },
          { name: "Adhesive", cost: "₦500" },
        ],
        warranty: "7 days",
        warrantyExpiry: "Jun 22, 2024",
        distance: "2.3 km",
        timeline: [
          {
            status: "Booking Created",
            date: "Jun 14, 2024 8:30 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "Jun 14, 2024 9:00 PM",
            icon: "check",
          },
          {
            status: "Payment Escrowed",
            date: "Jun 14, 2024 9:05 PM",
            icon: "dollar",
          },
          {
            status: "Artisan En Route",
            date: "Jun 15, 2024 9:45 AM",
            icon: "map",
          },
          {
            status: "Work Started",
            date: "Jun 15, 2024 10:00 AM",
            icon: "loader",
          },
          {
            status: "Work Completed",
            date: "Jun 15, 2024 12:30 PM",
            icon: "check-circle",
          },
          {
            status: "Payment Released",
            date: "Jun 15, 2024 12:35 PM",
            icon: "dollar",
          },
        ],
        canDispute: false,
        canRebook: true,
        canReview: false,
      },
      {
        id: 2,
        bookingRef: "BK-2024-002",
        artisan: "Amina Hassan",
        artisanPhone: "+234 806 123 4567",
        artisanEmail: "amina@example.com",
        service: "Electrical Work",
        subService: "Complete House Wiring",
        description: "3-bedroom apartment wiring installation",
        date: "Jun 10, 2024",
        time: "2:00 PM",
        completedDate: "Jun 12, 2024",
        completedTime: "5:00 PM",
        status: "Completed",
        amount: "₦78,500",
        deposit: "₦30,000",
        balance: "₦48,500",
        paymentStatus: "Released",
        pricingModel: "Deposit + Balance",
        photo: "https://i.pravatar.cc/150?img=45",
        rating: 4,
        review: "Good work, minor delays but overall satisfied.",
        photos: [
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
        ],
        materials: [
          { name: "Cables (100m)", cost: "₦25,000" },
          { name: "Switches & Sockets", cost: "₦8,500" },
          { name: "Circuit Breakers", cost: "₦5,000" },
        ],
        warranty: "30 days",
        warrantyExpiry: "Jul 12, 2024",
        distance: "4.1 km",
        timeline: [
          {
            status: "Booking Created",
            date: "Jun 9, 2024 3:00 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "Jun 9, 2024 4:30 PM",
            icon: "check",
          },
          {
            status: "Deposit Paid",
            date: "Jun 9, 2024 4:35 PM",
            icon: "dollar",
          },
          {
            status: "Work Started",
            date: "Jun 10, 2024 2:00 PM",
            icon: "loader",
          },
          {
            status: "Work Completed",
            date: "Jun 12, 2024 5:00 PM",
            icon: "check-circle",
          },
          {
            status: "Balance Paid",
            date: "Jun 12, 2024 5:10 PM",
            icon: "dollar",
          },
        ],
        canDispute: false,
        canRebook: true,
        canReview: false,
      },
      {
        id: 3,
        bookingRef: "BK-2024-003",
        artisan: "Tunde Adeyemi",
        artisanPhone: "+234 809 876 5432",
        artisanEmail: "tunde@example.com",
        service: "Carpentry",
        subService: "Custom Door Installation",
        description: "Install custom wooden door in bedroom",
        date: "Jun 5, 2024",
        time: "11:00 AM",
        status: "Cancelled",
        amount: "₦15,000",
        deposit: "₦0",
        balance: "₦0",
        paymentStatus: "Refunded",
        pricingModel: "Fixed Price",
        photo: "https://i.pravatar.cc/150?img=33",
        rating: null,
        review: null,
        photos: [],
        materials: [],
        warranty: null,
        warrantyExpiry: null,
        distance: "1.8 km",
        timeline: [
          {
            status: "Booking Created",
            date: "Jun 4, 2024 5:00 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "Jun 4, 2024 6:00 PM",
            icon: "check",
          },
          {
            status: "Cancelled by Artisan",
            date: "Jun 5, 2024 9:00 AM",
            icon: "x-circle",
          },
          {
            status: "Refund Processed",
            date: "Jun 5, 2024 9:15 AM",
            icon: "dollar",
          },
        ],
        cancellationReason: "Emergency family situation, unable to attend",
        canDispute: false,
        canRebook: true,
        canReview: false,
      },
      {
        id: 4,
        bookingRef: "BK-2024-004",
        artisan: "Grace Eze",
        artisanPhone: "+234 802 345 6789",
        artisanEmail: "grace@example.com",
        service: "Painting",
        subService: "Interior Wall Painting",
        description: "Paint living room and 2 bedrooms",
        date: "May 28, 2024",
        time: "9:00 AM",
        completedDate: "May 30, 2024",
        completedTime: "4:00 PM",
        status: "Completed",
        amount: "₦45,000",
        deposit: "₦15,000",
        balance: "₦30,000",
        paymentStatus: "Released",
        pricingModel: "Deposit + Balance",
        photo: "https://i.pravatar.cc/150?img=20",
        rating: 5,
        review: "Amazing transformation! Highly recommend.",
        photos: [
          "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400",
        ],
        materials: [
          { name: "Paint (20L)", cost: "₦18,000" },
          { name: "Brushes & Rollers", cost: "₦3,000" },
        ],
        warranty: "14 days",
        warrantyExpiry: "Jun 13, 2024",
        distance: "3.5 km",
        timeline: [
          {
            status: "Booking Created",
            date: "May 27, 2024 7:00 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "May 27, 2024 8:00 PM",
            icon: "check",
          },
          {
            status: "Deposit Paid",
            date: "May 27, 2024 8:05 PM",
            icon: "dollar",
          },
          {
            status: "Work Started",
            date: "May 28, 2024 9:00 AM",
            icon: "loader",
          },
          {
            status: "Work Completed",
            date: "May 30, 2024 4:00 PM",
            icon: "check-circle",
          },
          {
            status: "Balance Paid",
            date: "May 30, 2024 4:10 PM",
            icon: "dollar",
          },
        ],
        canDispute: false,
        canRebook: true,
        canReview: false,
      },
      {
        id: 5,
        bookingRef: "BK-2024-005",
        artisan: "Ibrahim Musa",
        artisanPhone: "+234 805 678 9012",
        artisanEmail: "ibrahim@example.com",
        service: "Welding",
        subService: "Metal Gate Fabrication",
        description: "Custom metal gate for compound entrance",
        date: "May 20, 2024",
        time: "8:00 AM",
        completedDate: "May 22, 2024",
        completedTime: "3:00 PM",
        status: "Disputed",
        amount: "₦35,000",
        deposit: "₦10,000",
        balance: "₦25,000",
        paymentStatus: "On Hold",
        pricingModel: "Deposit + Balance",
        photo: "https://i.pravatar.cc/150?img=51",
        rating: null,
        review: null,
        photos: [
          "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400",
        ],
        materials: [
          { name: "Metal Sheets", cost: "₦12,000" },
          { name: "Welding Rods", cost: "₦2,000" },
        ],
        warranty: null,
        warrantyExpiry: null,
        distance: "5.2 km",
        disputeReason: "Gate dimensions don't match specifications",
        disputeStatus: "Under Review",
        disputeDate: "May 23, 2024",
        timeline: [
          {
            status: "Booking Created",
            date: "May 19, 2024 2:00 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "May 19, 2024 3:00 PM",
            icon: "check",
          },
          {
            status: "Deposit Paid",
            date: "May 19, 2024 3:05 PM",
            icon: "dollar",
          },
          {
            status: "Work Started",
            date: "May 20, 2024 8:00 AM",
            icon: "loader",
          },
          {
            status: "Work Completed",
            date: "May 22, 2024 3:00 PM",
            icon: "check-circle",
          },
          {
            status: "Dispute Raised",
            date: "May 23, 2024 10:00 AM",
            icon: "alert",
          },
        ],
        canDispute: false,
        canRebook: false,
        canReview: false,
      },
      {
        id: 6,
        bookingRef: "BK-2024-006",
        artisan: "Ngozi Okeke",
        artisanPhone: "+234 807 234 5678",
        artisanEmail: "ngozi@example.com",
        service: "Tiling & Flooring",
        subService: "Bathroom Tiling",
        description: "Complete bathroom floor and wall tiling",
        date: "May 15, 2024",
        time: "10:00 AM",
        status: "In Progress",
        amount: "₦42,000",
        deposit: "₦20,000",
        balance: "₦22,000",
        paymentStatus: "Deposit Paid",
        pricingModel: "Deposit + Balance",
        photo: "https://i.pravatar.cc/150?img=25",
        rating: null,
        review: null,
        photos: [],
        materials: [
          { name: "Floor Tiles (10 sqm)", cost: "₦15,000" },
          { name: "Wall Tiles (8 sqm)", cost: "₦10,000" },
          { name: "Adhesive & Grout", cost: "₦4,000" },
        ],
        warranty: null,
        warrantyExpiry: null,
        distance: "2.9 km",
        timeline: [
          {
            status: "Booking Created",
            date: "May 14, 2024 4:00 PM",
            icon: "calendar",
          },
          {
            status: "Artisan Confirmed",
            date: "May 14, 2024 5:00 PM",
            icon: "check",
          },
          {
            status: "Deposit Paid",
            date: "May 14, 2024 5:05 PM",
            icon: "dollar",
          },
          {
            status: "Work Started",
            date: "May 15, 2024 10:00 AM",
            icon: "loader",
          },
        ],
        estimatedCompletion: "May 17, 2024",
        progress: 60,
        canDispute: false,
        canRebook: false,
        canReview: false,
      },
    ],
    []
  );

  /* ---------------------- CALCULATIONS ---------------------- */
  const totalSpent = bookings
    .filter((b) => b.status === "Completed")
    .reduce((sum, b) => sum + parseInt(b.amount.replace(/[^0-9]/g, ""), 10), 0);

  const completedBookings = bookings.filter(
    (b) => b.status === "Completed"
  ).length;
  const totalBookings = bookings.length;
  const avgRating =
    bookings.filter((b) => b.rating).reduce((sum, b) => sum + b.rating, 0) /
      bookings.filter((b) => b.rating).length || 0;

  const serviceCategories = [...new Set(bookings.map((b) => b.service))];

  /* ---------------------- FILTER / SORT ---------------------- */
  const getFilteredBookings = () => {
    let list = [...bookings];

    if (statusFilter !== "all") {
      list = list.filter(
        (b) => b.status.toLowerCase() === statusFilter.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.artisan.toLowerCase().includes(q) ||
          b.service.toLowerCase().includes(q) ||
          b.subService.toLowerCase().includes(q) ||
          b.bookingRef.toLowerCase().includes(q)
      );
    }

    if (dateRange.from || dateRange.to) {
      list = list.filter((b) => {
        const d = new Date(b.date);
        const from = dateRange.from ? new Date(dateRange.from) : new Date(0);
        const to = dateRange.to ? new Date(dateRange.to) : new Date();
        return d >= from && d <= to;
      });
    }

    if (priceRange.min || priceRange.max) {
      list = list.filter((b) => {
        const amt = parseInt(b.amount.replace(/[^0-9]/g, ""), 10);
        const min = priceRange.min ? parseInt(priceRange.min, 10) : 0;
        const max = priceRange.max ? parseInt(priceRange.max, 10) : Infinity;
        return amt >= min && amt <= max;
      });
    }

    if (selectedServices.length) {
      list = list.filter((b) => selectedServices.includes(b.service));
    }

    if (ratingFilter) {
      const minR = parseInt(ratingFilter, 10);
      list = list.filter((b) => b.rating && b.rating >= minR);
    }

    return list;
  };

  const getSortedBookings = (list) => {
    const copy = [...list];
    switch (sortBy) {
      case "date-desc":
        copy.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        break;
      case "date-asc":
        copy.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        break;
      case "amount-high":
        copy.sort(
          (a, b) =>
            parseInt(b.amount.replace(/[^0-9]/g, ""), 10) -
            parseInt(a.amount.replace(/[^0-9]/g, ""), 10)
        );
        break;
      case "amount-low":
        copy.sort(
          (a, b) =>
            parseInt(a.amount.replace(/[^0-9]/g, ""), 10) -
            parseInt(b.amount.replace(/[^0-9]/g, ""), 10)
        );
        break;
      case "rating-high":
        copy.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    return copy;
  };

  const filtered = getFilteredBookings();
  const sorted = getSortedBookings(filtered);
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const current = sorted.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  /* ---------------------- UI HELPERS ---------------------- */
  const getStatusStyle = (status) => {
    switch (status) {
      case "Completed":
        return { bg: COLORS.success[50], text: COLORS.success[600] };
      case "In Progress":
        return { bg: COLORS.primary[50], text: COLORS.primary[600] };
      case "Cancelled":
        return { bg: "#fee2e2", text: "#b91c1c" };
      case "Disputed":
        return { bg: COLORS.warning[50], text: COLORS.warning[500] };
      default:
        return { bg: COLORS.gray[100], text: COLORS.gray[600] };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4" />;
      case "In Progress":
        return <Loader className="w-4 h-4 animate-spin" />;
      case "Cancelled":
        return <XCircle className="w-4 h-4" />;
      case "Disputed":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const clearFilters = () => {
    setDateRange({ from: "", to: "" });
    setPriceRange({ min: "", max: "" });
    setSelectedServices([]);
    setRatingFilter("");
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
              Booking History
            </h1>
            <p className="mt-1" style={{ color: COLORS.gray[600] }}>
              Manage and track all your bookings
            </p>
          </div>
          <button
            className="px-6 py-3 bg-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
            style={{ color: COLORS.primary[600] }}
          >
            <Download className="w-5 h-5" />
            <span>Export History</span>
          </button>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={DollarSign}
            label="Total Spent"
            value={`₦${totalSpent.toLocaleString()}`}
            trend="up"
            change="+12%"
          />
          <StatCard
            icon={CheckCircle}
            label="Completed"
            value={`${completedBookings}/${totalBookings}`}
            trend="neutral"
            change="2 pending"
          />
          <StatCard
            icon={Star}
            label="Avg Rating"
            value={`${avgRating.toFixed(1)}/5`}
            trend="neutral"
            change="89 reviews"
          />
          <StatCard
            icon={Award}
            label="Services Used"
            value={serviceCategories.length.toString()}
            trend="neutral"
            change=""
          />
        </div>

        {/* Search & Filters */}
        <div
          className="bg-white rounded-2xl shadow-sm p-4 border"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: COLORS.gray[400] }}
              />
              <input
                type="text"
                placeholder="Search by booking ref, artisan, or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                style={{
                  borderColor: COLORS.gray[200],
                }}
              />
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:pb-0">
              {["all", "completed", "in progress", "cancelled", "disputed"].map(
                (opt) => (
                  <button
                    key={opt}
                    onClick={() => setStatusFilter(opt)}
                    className={`px-4 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${
                      statusFilter === opt
                        ? "bg-white shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    style={{
                      backgroundColor:
                        statusFilter === opt ? COLORS.primary[50] : undefined,
                      color:
                        statusFilter === opt
                          ? COLORS.primary[600]
                          : COLORS.gray[700],
                    }}
                  >
                    {opt.charAt(0).toUpperCase() + opt.slice(1)}
                  </button>
                )
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2.5 border-2 rounded-lg font-medium transition-all"
              style={{
                borderColor: COLORS.gray[300],
                color: COLORS.gray[700],
              }}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
              {(dateRange.from ||
                dateRange.to ||
                priceRange.min ||
                priceRange.max ||
                selectedServices.length ||
                ratingFilter) && (
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: COLORS.primary[600] }}
                />
              )}
            </button>
          </div>

          {showFilters && (
            <div
              className="mt-4 pt-4 border-t"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Date From
                  </label>
                  <input
                    type="date"
                    value={dateRange.from}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, from: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Date To
                  </label>
                  <input
                    type="date"
                    value={dateRange.to}
                    onChange={(e) =>
                      setDateRange({ ...dateRange, to: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Min Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="0"
                    value={priceRange.min}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, min: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Max Price (₦)
                  </label>
                  <input
                    type="number"
                    placeholder="100000"
                    value={priceRange.max}
                    onChange={(e) =>
                      setPriceRange({ ...priceRange, max: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Service Category
                  </label>
                  <select
                    multiple
                    value={selectedServices}
                    onChange={(e) =>
                      setSelectedServices(
                        Array.from(e.target.selectedOptions, (opt) => opt.value)
                      )
                    }
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 h-32"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    {serviceCategories.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.gray[500] }}
                  >
                    Hold Ctrl/Cmd to select multiple
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Minimum Rating
                  </label>
                  <select
                    value={ratingFilter}
                    onChange={(e) => setRatingFilter(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="">All Ratings</option>
                    <option value="4">4+ Stars</option>
                    <option value="5">5 Stars Only</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-sm font-medium rounded-lg hover:bg-gray-100 transition-all flex items-center space-x-2"
                  style={{ color: COLORS.gray[700] }}
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sort */}
        <div
          className="bg-white rounded-2xl shadow-sm p-4 border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <div className="flex items-center space-x-2">
            <span
              className="text-sm font-semibold"
              style={{ color: COLORS.gray[700] }}
            >
              Sort By:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              { v: "date-desc", l: "Newest First" },
              { v: "date-asc", l: "Oldest First" },
              { v: "amount-high", l: "Highest Price" },
              { v: "amount-low", l: "Lowest Price" },
              { v: "rating-high", l: "Highest Rating" },
            ].map((o) => (
              <button
                key={o.v}
                onClick={() => setSortBy(o.v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  sortBy === o.v
                    ? "bg-white shadow-sm"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
                style={{
                  backgroundColor:
                    sortBy === o.v ? COLORS.primary[50] : undefined,
                  color:
                    sortBy === o.v ? COLORS.primary[600] : COLORS.gray[700],
                }}
              >
                {o.l}
              </button>
            ))}
          </div>
        </div>

        {/* Results Summary */}
        <div
          className="bg-white rounded-2xl shadow-sm p-4 border"
          style={{ borderColor: COLORS.gray[100] }}
        >
          <p className="text-sm" style={{ color: COLORS.gray[600] }}>
            Showing{" "}
            <span className="font-bold" style={{ color: COLORS.gray[900] }}>
              {current.length}
            </span>{" "}
            of{" "}
            <span className="font-bold" style={{ color: COLORS.gray[900] }}>
              {sorted.length}
            </span>{" "}
            bookings
          </p>
        </div>

        {/* Booking List */}
        <div className="space-y-4">
          {current.length === 0 ? (
            <div
              className="bg-white rounded-2xl shadow-sm p-12 text-center border"
              style={{ borderColor: COLORS.gray[100] }}
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
              <p className="mt-1" style={{ color: COLORS.gray[600] }}>
                Try adjusting your filters or search query
              </p>
            </div>
          ) : (
            current.map((b) => {
              const statusStyle = getStatusStyle(b.status);
              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 border"
                  style={{ borderColor: COLORS.gray[100] }}
                >
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Artisan */}
                    <div className="flex items-start gap-4 lg:w-1/3">
                      <img
                        src={b.photo}
                        alt={b.artisan}
                        className="w-16 h-16 rounded-full object-cover border-2"
                        style={{ borderColor: COLORS.gray[200] }}
                      />
                      <div className="flex-1">
                        <h3
                          className="font-bold text-lg"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {b.artisan}
                        </h3>
                        <p
                          className="text-sm"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {b.service}
                        </p>
                        <p
                          className="text-xs mt-1"
                          style={{ color: COLORS.gray[500] }}
                        >
                          {b.subService}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <MapPin
                            className="w-3 h-3"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-xs"
                            style={{ color: COLORS.gray[500] }}
                          >
                            {b.distance}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p
                            className="text-xs font-medium"
                            style={{ color: COLORS.gray[500] }}
                          >
                            Booking Reference
                          </p>
                          <p
                            className="text-sm font-bold"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {b.bookingRef}
                          </p>
                        </div>
                        <div
                          className="px-3 py-1 rounded-full flex items-center space-x-2 border"
                          style={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            borderColor: statusStyle.bg,
                          }}
                        >
                          {getStatusIcon(b.status)}
                          <span className="text-xs font-semibold">
                            {b.status}
                          </span>
                        </div>
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
                              {b.date}
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
                              {b.time}
                            </span>
                          </div>
                        </div>

                        {b.completedDate && (
                          <div>
                            <p
                              className="text-xs font-medium mb-1"
                              style={{ color: COLORS.gray[500] }}
                            >
                              Completed
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
                                {b.completedDate}
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
                                {b.completedTime}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {b.status === "In Progress" && b.progress && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <p
                              className="text-xs font-medium"
                              style={{ color: COLORS.gray[500] }}
                            >
                              Progress
                            </p>
                            <span
                              className="text-xs font-bold"
                              style={{ color: COLORS.primary[600] }}
                            >
                              {b.progress}%
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                              className="h-2 rounded-full transition-all"
                              style={{
                                width: `${b.progress}%`,
                                backgroundColor: COLORS.primary[600],
                              }}
                            />
                          </div>
                          <p
                            className="text-xs mt-1"
                            style={{ color: COLORS.gray[500] }}
                          >
                            Est. completion: {b.estimatedCompletion}
                          </p>
                        </div>
                      )}

                      {b.cancellationReason && (
                        <div
                          className="bg-red-50 border rounded-lg p-3"
                          style={{ borderColor: "#fecaca" }}
                        >
                          <p
                            className="text-xs font-semibold"
                            style={{ color: "#991b1b" }}
                          >
                            Cancellation Reason
                          </p>
                          <p className="text-xs" style={{ color: "#b91c1c" }}>
                            {b.cancellationReason}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Payment & Actions */}
                    <div className="lg:w-1/4 space-y-3">
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            className="text-xs font-medium"
                            style={{ color: COLORS.gray[500] }}
                          >
                            Total Amount
                          </span>
                          <span
                            className="text-lg font-bold"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {b.amount}
                          </span>
                        </div>
                        <div className="text-xs space-y-1">
                          <div className="flex justify-between">
                            <span>Deposit:</span>
                            <span className="font-semibold">{b.deposit}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Balance:</span>
                            <span className="font-semibold">{b.balance}</span>
                          </div>
                        </div>
                        <div
                          className="mt-2 pt-2 border-t"
                          style={{ borderColor: COLORS.gray[200] }}
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className="text-xs"
                              style={{ color: COLORS.gray[500] }}
                            >
                              Payment Status
                            </span>
                            <span
                              className="text-xs font-bold"
                              style={{
                                color:
                                  b.paymentStatus === "Released"
                                    ? COLORS.success[600]
                                    : b.paymentStatus === "On Hold"
                                    ? COLORS.warning[500]
                                    : COLORS.gray[600],
                              }}
                            >
                              {b.paymentStatus}
                            </span>
                          </div>
                        </div>
                      </div>

                      {b.rating && (
                        <div className="bg-yellow-50 rounded-lg p-3">
                          <div className="flex items-center space-x-1 mb-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < b.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <p
                            className="text-xs italic"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {b.review}
                          </p>
                        </div>
                      )}

                      {b.warranty && (
                        <div
                          className="bg-green-50 border rounded-lg p-3"
                          style={{ borderColor: "#bbf7d0" }}
                        >
                          <div className="flex items-center space-x-2 mb-1">
                            <Shield
                              className="w-4 h-4"
                              style={{ color: COLORS.success[600] }}
                            />
                            <span
                              className="text-xs font-semibold"
                              style={{ color: COLORS.success[600] }}
                            >
                              Warranty Active
                            </span>
                          </div>
                          <p
                            className="text-xs"
                            style={{ color: COLORS.success[600] }}
                          >
                            {b.warranty} warranty
                          </p>
                          <p
                            className="text-xs"
                            style={{ color: COLORS.success[600] }}
                          >
                            Expires: {b.warrantyExpiry}
                          </p>
                        </div>
                      )}

                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="w-full px-4 py-2 bg-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm"
                          style={{ color: COLORS.primary[600] }}
                        >
                          View Details
                        </button>

                        {b.canRebook && (
                          <button className="w-full px-4 py-2 bg-gray-50 rounded-lg font-semibold hover:bg-gray-100 transition-all text-sm">
                            Book Again
                          </button>
                        )}

                        {b.status === "In Progress" && (
                          <button className="w-full px-4 py-2 bg-white rounded-lg font-semibold hover:shadow-lg transition-all text-sm flex items-center justify-center space-x-2">
                            <MessageSquare className="w-4 h-4" />
                            <span>Chat with Artisan</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="bg-white rounded-2xl shadow-sm p-4 flex items-center justify-between border"
            style={{ borderColor: COLORS.gray[100] }}
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

            <div className="flex items-center space-x-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-10 h-10 rounded-lg font-medium text-sm transition-all ${
                    currentPage === i + 1
                      ? "bg-white shadow-sm"
                      : "bg-gray-50 hover:bg-gray-100"
                  }`}
                  style={{
                    backgroundColor:
                      currentPage === i + 1 ? COLORS.primary[50] : undefined,
                    color:
                      currentPage === i + 1
                        ? COLORS.primary[600]
                        : COLORS.gray[700],
                  }}
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

        {/* Detail Modal */}
        {selectedBooking && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div
                className="sticky top-0 bg-white border-b p-6 flex items-center justify-between"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <div>
                  <h2
                    className="text-2xl font-bold"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Booking Details
                  </h2>
                  <p
                    className="text-sm mt-1"
                    style={{ color: COLORS.gray[600] }}
                  >
                    {selectedBooking.bookingRef}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 transition-all flex items-center justify-center"
                >
                  <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                {/* Artisan */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Artisan Information
                  </h3>
                  <div className="flex items-start gap-4">
                    <img
                      src={selectedBooking.photo}
                      alt={selectedBooking.artisan}
                      className="w-20 h-20 rounded-full object-cover border-2"
                      style={{ borderColor: COLORS.gray[200] }}
                    />
                    <div className="flex-1">
                      <h4
                        className="font-bold text-xl"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.artisan}
                      </h4>
                      <p
                        className="text-sm mt-1"
                        style={{ color: COLORS.gray[600] }}
                      >
                        {selectedBooking.service} Specialist
                      </p>
                      <div className="flex flex-wrap gap-4 mt-3">
                        <div className="flex items-center space-x-2">
                          <Phone
                            className="w-4 h-4"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {selectedBooking.artisanPhone}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Mail
                            className="w-4 h-4"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {selectedBooking.artisanEmail}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <MapPin
                            className="w-4 h-4"
                            style={{ color: COLORS.gray[400] }}
                          />
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {selectedBooking.distance} away
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service */}
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Service Details
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: COLORS.gray[500] }}
                      >
                        Service Type
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.service}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: COLORS.gray[500] }}
                      >
                        Sub-Service
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.subService}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: COLORS.gray[500] }}
                      >
                        Description
                      </p>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        {selectedBooking.description}
                      </p>
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium"
                        style={{ color: COLORS.gray[500] }}
                      >
                        Pricing Model
                      </p>
                      <p
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.pricingModel}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3
                    className="text-lg font-bold mb-4"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Booking Timeline
                  </h3>
                  <div className="space-y-4">
                    {selectedBooking.timeline.map((item, i) => {
                      const Icon = {
                        calendar: Calendar,
                        check: CheckCircle,
                        dollar: DollarSign,
                        map: MapPin,
                        loader: Loader,
                        "check-circle": CheckCircle,
                        "x-circle": XCircle,
                        alert: AlertCircle,
                      }[item.icon];
                      return (
                        <div key={i} className="flex items-start space-x-4">
                          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                            <Icon
                              className="w-4 h-4"
                              style={{ color: COLORS.primary[600] }}
                            />
                          </div>
                          <div className="flex-1">
                            <p
                              className="text-sm font-semibold"
                              style={{ color: COLORS.gray[900] }}
                            >
                              {item.status}
                            </p>
                            <p
                              className="text-xs"
                              style={{ color: COLORS.gray[500] }}
                            >
                              {item.date}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Materials */}
                {selectedBooking.materials?.length > 0 && (
                  <div>
                    <h3
                      className="text-lg font-bold mb-3"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Materials Used
                    </h3>
                    <div className="bg-gray-50 rounded-xl p-4">
                      {selectedBooking.materials.map((m, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between py-1"
                        >
                          <span
                            className="text-sm"
                            style={{ color: COLORS.gray[700] }}
                          >
                            {m.name}
                          </span>
                          <span
                            className="text-sm font-semibold"
                            style={{ color: COLORS.gray[900] }}
                          >
                            {m.cost}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Photos */}
                {selectedBooking.photos?.length > 0 && (
                  <div>
                    <h3
                      className="text-lg font-bold mb-3"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Work Photos
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {selectedBooking.photos.map((p, i) => (
                        <img
                          key={i}
                          src={p}
                          alt={`work ${i + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment */}
                <div>
                  <h3
                    className="text-lg font-bold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Payment Breakdown
                  </h3>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between">
                      <span
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        Deposit
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.deposit}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        Balance
                      </span>
                      <span
                        className="text-sm font-semibold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.balance}
                      </span>
                    </div>
                    <div
                      className="pt-3 border-t flex justify-between"
                      style={{ borderColor: COLORS.gray[200] }}
                    >
                      <span
                        className="text-base font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        Total Amount
                      </span>
                      <span
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        {selectedBooking.amount}
                      </span>
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <span
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        Payment Status
                      </span>
                      <span
                        className="text-sm font-bold"
                        style={{
                          color:
                            selectedBooking.paymentStatus === "Released"
                              ? COLORS.success[600]
                              : selectedBooking.paymentStatus === "On Hold"
                              ? COLORS.warning[500]
                              : COLORS.gray[600],
                        }}
                      >
                        {selectedBooking.paymentStatus}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button className="flex-1 px-6 py-3 bg-white rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center space-x-2">
                    <FileText
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                    <span style={{ color: COLORS.primary[600] }}>
                      Download Receipt
                    </span>
                  </button>
                  {selectedBooking.canRebook && (
                    <button className="flex-1 px-6 py-3 bg-white rounded-lg font-semibold hover:shadow-lg transition-all">
                      <span style={{ color: COLORS.primary[600] }}>
                        Book Again
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
