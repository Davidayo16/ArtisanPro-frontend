// frontend/components/ArtisanCalendar.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  Clock,
  X,
  Briefcase,
  Loader2,
} from "lucide-react";
import { useArtisanProfileStore } from "../../../stores/artisanProfileStore";
import { useBookingStore } from "../../../stores/bookingStore";
import toast from "react-hot-toast";
import LoadingDashboard from "./../../../components/dashboard/LoadingDashboard";

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

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, color }) => (
  <div
    className="bg-white rounded-2xl p-6 transition-all duration-300 group cursor-pointer"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-start justify-between">
      <div
        className="p-3 rounded-xl group-hover:scale-110 transition-transform duration-200"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="w-6 h-6" style={{ color }} />
      </div>
    </div>
    <p
      className="text-sm mt-4 mb-1 font-medium"
      style={{ color: COLORS.gray[600] }}
    >
      {label}
    </p>
    <p className="text-3xl font-bold" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function ArtisanCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month"); // month | week
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);

  // Zustand stores
  const {
    profile,
    isLoading: profileLoading,
    fetchMyProfile,
    updateWorkingHours,
    isUpdating,
  } = useArtisanProfileStore();

  const {
    bookings,
    loading: bookingsLoading,
    fetchBookings,
  } = useBookingStore();

  // Local state for editing working hours
  const [editedHours, setEditedHours] = useState(null);

  // Fetch data on mount
  useEffect(() => {
    const controller = new AbortController();

    fetchMyProfile();
    fetchBookings({
      status: undefined,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, [fetchMyProfile, fetchBookings]);

  // Initialize edited hours when profile loads
  useEffect(() => {
    if (profile?.workingHours) {
      setEditedHours(profile.workingHours);
    }
  }, [profile?.workingHours]);

  /* ---------------------- WORKING HOURS DATA ---------------------- */
  const workingHours = useMemo(() => {
    if (!profile?.workingHours) {
      return {
        monday: null,
        tuesday: null,
        wednesday: null,
        thursday: null,
        friday: null,
        saturday: null,
        sunday: null,
      };
    }
    return profile.workingHours;
  }, [profile?.workingHours]);

  /* ---------------------- BOOKINGS DATA ---------------------- */
  const bookedSlots = useMemo(() => {
    if (!bookings || bookings.length === 0) return [];

    return bookings
      .filter((booking) =>
        ["accepted", "confirmed", "in_progress"].includes(booking.status)
      )
      .map((booking) => ({
        date: booking.scheduledDate
          ? new Date(booking.scheduledDate).toISOString().split("T")[0]
          : null,
        time: booking.scheduledTime || "N/A",
        customer: booking.customer
          ? `${booking.customer.firstName} ${booking.customer.lastName}`
          : "Unknown",
        service: booking.service?.name || "Service",
        status: booking.status,
        id: booking._id,
      }))
      .filter((slot) => slot.date);
  }, [bookings]);

  /* ---------------------- CALENDAR LOGIC ---------------------- */
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getWeekDays = (date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(date);
    monday.setDate(diff);
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(monday);
      d.setDate(monday.getDate() + i);
      days.push(d);
    }
    return days;
  };

  const formatDate = (date) => {
    if (!date) return "";
    return date.toISOString().split("T")[0];
  };

  const getDayStatus = (date) => {
    if (!date) return null;
    const dateStr = formatDate(date);
    const dayName = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toLowerCase();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return "past";

    const dayHours = workingHours[dayName];
    if (!dayHours || dayHours.isAvailable === false) return "dayoff";

    const hasBooking = bookedSlots.some((slot) => slot.date === dateStr);
    if (hasBooking) return "booked";

    return "available";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return {
          bg: COLORS.success[50],
          text: COLORS.success[600],
          border: COLORS.success[600],
        };
      case "booked":
        return {
          bg: COLORS.primary[50],
          text: COLORS.primary[600],
          border: COLORS.primary[600],
        };
      case "dayoff":
        return {
          bg: COLORS.gray[100],
          text: COLORS.gray[500],
          border: COLORS.gray[300],
        };
      case "past":
        return {
          bg: COLORS.gray[50],
          text: COLORS.gray[400],
          border: COLORS.gray[200],
        };
      default:
        return {
          bg: "white",
          text: COLORS.gray[900],
          border: COLORS.gray[200],
        };
    }
  };

  const days =
    view === "month" ? getDaysInMonth(currentDate) : getWeekDays(currentDate);

  /* ---------------------- NAVIGATION ---------------------- */
  const goToPrevious = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setDate(newDate.getDate() - 7);
    }
    setCurrentDate(newDate);
  };

  const goToNext = () => {
    const newDate = new Date(currentDate);
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1);
    } else {
      newDate.setDate(newDate.getDate() + 7);
    }
    setCurrentDate(newDate);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  /* ---------------------- STATS ---------------------- */
  const stats = useMemo(() => {
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setDate(today.getDate() + 7);

    const bookedThisWeek = bookedSlots.filter((slot) => {
      const slotDate = new Date(slot.date);
      return slotDate >= today && slotDate <= endOfWeek;
    }).length;

    const availableDays = Object.values(workingHours).filter(
      (hours) => hours && hours.isAvailable !== false
    ).length;

    const totalHours = Object.values(workingHours).reduce((sum, hours) => {
      if (!hours || hours.isAvailable === false) return sum;
      if (!hours.start || !hours.end) return sum;

      const [startH, startM] = hours.start.split(":").map(Number);
      const [endH, endM] = hours.end.split(":").map(Number);
      const hoursWorked = endH - startH + (endM - startM) / 60;
      return sum + hoursWorked;
    }, 0);

    return {
      bookedThisWeek,
      availableDays,
      totalHours: Math.round(totalHours),
    };
  }, [bookedSlots, workingHours]);

  /* ---------------------- WORKING HOURS HANDLERS ---------------------- */
  const handleToggleDay = (day) => {
    if (!editedHours) return;

    setEditedHours((prev) => ({
      ...prev,
      [day]:
        prev[day]?.isAvailable === false
          ? { start: "09:00", end: "17:00", isAvailable: true }
          : { ...prev[day], isAvailable: false },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    if (!editedHours) return;

    setEditedHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSaveWorkingHours = async () => {
    try {
      await updateWorkingHours({
        workingHours: editedHours,
        serviceRadius: profile.serviceRadius || 10,
      });
      toast.success("Working hours updated successfully!");
      setShowAvailabilityModal(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update working hours"
      );
    }
  };

  /* ---------------------- LOADING STATE ---------------------- */
  if (profileLoading || bookingsLoading) {
    return <LoadingDashboard />;
  }

  /* ---------------------- RENDER ---------------------- */
  return (
    <div className="space-y-6 px-4 sm:px-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            My Calendar
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Manage your availability and schedule
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAvailabilityModal(true)}
            className="px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 whitespace-nowrap"
            style={{
              backgroundColor: COLORS.primary[600],
              color: "white",
            }}
          >
            <Clock className="w-5 h-5" />
            <span>Set Hours</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <StatCard
          icon={Briefcase}
          label="Jobs This Week"
          value={stats.bookedThisWeek}
          color={COLORS.primary[600]}
        />
        <StatCard
          icon={Calendar}
          label="Available Days"
          value={stats.availableDays}
          color={COLORS.success[600]}
        />
        <StatCard
          icon={Clock}
          label="Working Hours/Week"
          value={`${stats.totalHours}h`}
          color={COLORS.warning[500]}
        />
      </div>

      {/* Calendar Controls */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Month/Year & Navigation */}
          <div className="flex items-center justify-center sm:justify-start space-x-4">
            <button
              onClick={goToPrevious}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Previous"
            >
              <ChevronLeft
                className="w-5 h-5"
                style={{ color: COLORS.gray[600] }}
              />
            </button>
            <h2
              className="text-lg sm:text-xl font-bold text-center sm:text-left"
              style={{ color: COLORS.gray[900] }}
            >
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h2>
            <button
              onClick={goToNext}
              className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              aria-label="Next"
            >
              <ChevronRight
                className="w-5 h-5"
                style={{ color: COLORS.gray[600] }}
              />
            </button>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={goToToday}
              className="w-full sm:w-auto px-6 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all"
            >
              Today
            </button>
            <div className="flex bg-gray-100 rounded-lg p-1 w-full sm:w-auto">
              <button
                onClick={() => setView("month")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === "month"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  view === "week"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Week
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div
        className="bg-white rounded-2xl p-4"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex flex-wrap justify-center sm:justify-start gap-4">
          {[
            { status: "available", label: "Available" },
            { status: "booked", label: "Booked" },
            { status: "dayoff", label: "Day Off" },
          ].map((item) => {
            const colors = getStatusColor(item.status);
            return (
              <div key={item.status} className="flex items-center space-x-2">
                <div
                  className="w-4 h-4 rounded border-2"
                  style={{
                    backgroundColor: colors.bg,
                    borderColor: colors.border,
                  }}
                />
                <span
                  className="text-sm font-medium"
                  style={{ color: COLORS.gray[700] }}
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Calendar Grid */}
      <div
        className="bg-white rounded-2xl p-4 sm:p-6 overflow-x-auto"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        {/* Day Headers - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="hidden md:block text-center text-sm font-bold py-3"
              style={{ color: COLORS.gray[600] }}
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-7 gap-3">
          {days.map((date, index) => {
            const status = getDayStatus(date);
            const colors = getStatusColor(status);
            const isToday =
              date && date.toDateString() === new Date().toDateString();
            const bookingsForDay = date
              ? bookedSlots.filter((slot) => slot.date === formatDate(date))
              : [];

            if (!date) {
              return <div key={index} className="min-h-32" />; // empty spacer
            }

            const dayName = date.toLocaleDateString("en-US", {
              weekday: "short",
            });

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(date)}
                className="min-h-32 sm:min-h-36 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:shadow-lg"
                style={{
                  backgroundColor: colors.bg,
                  borderColor: isToday ? COLORS.primary[600] : colors.border,
                  opacity: status === "past" ? 0.6 : 1,
                }}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex flex-col">
                      <span className="text-xs text-gray-500 md:hidden">
                        {dayName}
                      </span>
                      <span
                        className={`text-lg font-bold ${
                          isToday ? "text-white px-2 py-1 rounded-full" : ""
                        }`}
                        style={{
                          color: isToday ? "white" : colors.text,
                          backgroundColor: isToday
                            ? COLORS.primary[600]
                            : "transparent",
                        }}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                    {bookingsForDay.length > 0 && (
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: COLORS.primary[600],
                          color: "white",
                        }}
                      >
                        {bookingsForDay.length}
                      </span>
                    )}
                  </div>

                  {bookingsForDay.length > 0 && (
                    <div className="space-y-1 mt-auto text-xs">
                      {bookingsForDay.slice(0, 3).map((booking, i) => (
                        <div
                          key={i}
                          className="px-2 py-1 rounded bg-white/70 truncate"
                          style={{ color: colors.text }}
                        >
                          {booking.time}
                        </div>
                      ))}
                      {bookingsForDay.length > 3 && (
                        <div
                          className="text-center text-xs font-semibold"
                          style={{ color: colors.text }}
                        >
                          +{bookingsForDay.length - 3} more
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Date Modal - Responsive */}
      {selectedDate && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg p-6">
            {/* Modal content remains the same - it's already responsive */}
            <div className="flex justify-between items-center mb-4">
              <h3
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                {selectedDate.toLocaleDateString("en-US", {
                  weekday: "long",
                  month: "long",
                  day: "numeric",
                })}
              </h3>
              <button
                onClick={() => setSelectedDate(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-4 h-4" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p
                  className="text-sm font-medium mb-2"
                  style={{ color: COLORS.gray[600] }}
                >
                  Status
                </p>
                {(() => {
                  const status = getDayStatus(selectedDate);
                  const colors = getStatusColor(status);
                  return (
                    <div
                      className="px-4 py-2 rounded-lg font-semibold text-center"
                      style={{
                        backgroundColor: colors.bg,
                        color: colors.text,
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  );
                })()}
              </div>

              {(() => {
                const bookingsForDay = bookedSlots.filter(
                  (slot) => slot.date === formatDate(selectedDate)
                );
                if (bookingsForDay.length > 0) {
                  return (
                    <div>
                      <p
                        className="text-sm font-medium mb-2"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Bookings ({bookingsForDay.length})
                      </p>
                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {bookingsForDay.map((booking, i) => (
                          <div
                            key={i}
                            className="p-4 rounded-lg border"
                            style={{ borderColor: COLORS.gray[200] }}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span
                                className="font-bold"
                                style={{ color: COLORS.gray[900] }}
                              >
                                {booking.time}
                              </span>
                              <span
                                className="text-xs px-2 py-1 rounded-full"
                                style={{
                                  backgroundColor: COLORS.primary[100],
                                  color: COLORS.primary[700],
                                }}
                              >
                                {booking.status.replace("_", " ")}
                              </span>
                            </div>
                            <p
                              className="text-sm"
                              style={{ color: COLORS.gray[600] }}
                            >
                              {booking.customer} • {booking.service}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return (
                  <p className="text-center py-8 text-gray-500">
                    No bookings on this day
                  </p>
                );
              })()}

              <div
                className="pt-4 border-t"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <button
                  onClick={() => setSelectedDate(null)}
                  className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Set Working Hours Modal - Already quite responsive */}
      {showAvailabilityModal && editedHours && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl w-full max-w-2xl my-8 p-6">
            {/* Modal content unchanged - responsive enough */}
            <div className="flex justify-between items-center mb-6">
              <h3
                className="text-2xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Set Working Hours
              </h3>
              <button
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setEditedHours(profile.workingHours);
                }}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="space-y-4">
              {Object.entries(editedHours).map(([day, hours]) => (
                <div
                  key={day}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl border gap-4"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={hours?.isAvailable !== false}
                      onChange={() => handleToggleDay(day)}
                      className="w-5 h-5 rounded"
                    />
                    <span
                      className="font-semibold capitalize"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {day}
                    </span>
                  </div>
                  {hours?.isAvailable !== false ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="time"
                        value={hours?.start || "09:00"}
                        onChange={(e) =>
                          handleTimeChange(day, "start", e.target.value)
                        }
                        className="px-3 py-2 border rounded-lg w-full sm:w-auto"
                        style={{ borderColor: COLORS.gray[200] }}
                      />
                      <span style={{ color: COLORS.gray[500] }}>to</span>
                      <input
                        type="time"
                        value={hours?.end || "17:00"}
                        onChange={(e) =>
                          handleTimeChange(day, "end", e.target.value)
                        }
                        className="px-3 py-2 border rounded-lg w-full sm:w-auto"
                        style={{ borderColor: COLORS.gray[200] }}
                      />
                    </div>
                  ) : (
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[500] }}
                    >
                      Day Off
                    </span>
                  )}
                </div>
              ))}
            </div>

            <div
              className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <button
                onClick={() => {
                  setShowAvailabilityModal(false);
                  setEditedHours(profile.workingHours);
                }}
                disabled={isUpdating}
                className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveWorkingHours}
                disabled={isUpdating}
                className="flex-1 px-6 py-3 rounded-xl font-semibold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: COLORS.primary[600],
                  color: "white",
                }}
              >
                {isUpdating && <Loader2 className="w-5 h-5 animate-spin" />}
                {isUpdating ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
