// frontend/utils/notificationHelpers.js
import {
  Package,
  CheckCircle,
  DollarSign,
  Star,
  MessageSquare,
  Calendar,
  MapPin,
  Bell,
  AlertCircle,
  TrendingUp,
  XCircle,
  Gift,
  Award,
} from "lucide-react";

const COLORS = {
  primary: { bg: "#eff6ff", text: "#2563eb" },
  success: { bg: "#f0fdf4", text: "#16a34a" },
  warning: { bg: "#fffbeb", text: "#f59e0b" },
  danger: { bg: "#fef2f2", text: "#dc2626" },
  info: { bg: "#eff6ff", text: "#2563eb" },
  orange: { bg: "#fff4e6", text: "#f97316" },
  purple: { bg: "#faf5ff", text: "#9333ea" },
  gray: { bg: "#f3f4f6", text: "#6b7280" },
};

/**
 * Maps backend notification types to frontend display metadata
 * @param {string} type - Backend notification type
 * @returns {Object} - { category, icon, color, actionText }
 */
export const getNotificationMeta = (type) => {
  const metaMap = {
    // Booking notifications (Artisan side)
    booking_created: {
      category: "New Jobs",
      icon: Package,
      color: COLORS.primary,
      actionText: "View & Accept",
    },
    booking_accepted: {
      category: "Booking Updates",
      icon: CheckCircle,
      color: COLORS.success,
      actionText: "View Booking",
    },
    booking_declined: {
      category: "Booking Updates",
      icon: XCircle,
      color: COLORS.danger,
      actionText: "View Details",
    },
    booking_confirmed: {
      category: "Booking Updates",
      icon: CheckCircle,
      color: COLORS.success,
      actionText: "View Booking",
    },
    booking_started: {
      category: "Booking Updates",
      icon: CheckCircle,
      color: COLORS.info,
      actionText: "View Progress",
    },
    booking_completed: {
      category: "Booking Updates",
      icon: CheckCircle,
      color: COLORS.success,
      actionText: "View & Review",
    },
    booking_cancelled: {
      category: "Booking Updates",
      icon: XCircle,
      color: COLORS.gray,
      actionText: "View Details",
    },

    // Payment notifications
    payment_received: {
      category: "Earnings",
      icon: DollarSign,
      color: COLORS.success,
      actionText: "View Earnings",
    },
    payment_released: {
      category: "Payment Updates",
      icon: DollarSign,
      color: COLORS.success,
      actionText: "View Receipt",
    },
    payment_successful: {
      category: "Payment Updates",
      icon: DollarSign,
      color: COLORS.success,
      actionText: "View Receipt",
    },
    payment_failed: {
      category: "Payment Updates",
      icon: XCircle,
      color: COLORS.danger,
      actionText: "Retry Payment",
    },
    payout_processed: {
      category: "Payouts",
      icon: DollarSign,
      color: COLORS.success,
      actionText: "View Payout",
    },
    refund_processed: {
      category: "Payment Updates",
      icon: DollarSign,
      color: COLORS.info,
      actionText: "View Refund",
    },

    // Review notifications
    review_received: {
      category: "Reviews",
      icon: Star,
      color: COLORS.warning,
      actionText: "View & Reply",
    },
    review_response: {
      category: "Reviews",
      icon: Star,
      color: COLORS.warning,
      actionText: "View Review",
    },
    review_reminder: {
      category: "Review Reminders",
      icon: Star,
      color: COLORS.warning,
      actionText: "Write Review",
    },

    // Negotiation notifications
    negotiation_offer: {
      category: "Booking Updates",
      icon: DollarSign,
      color: COLORS.orange,
      actionText: "View Offer",
    },
    negotiation_accepted: {
      category: "Booking Updates",
      icon: CheckCircle,
      color: COLORS.success,
      actionText: "View Booking",
    },
    negotiation_declined: {
      category: "Booking Updates",
      icon: XCircle,
      color: COLORS.danger,
      actionText: "View Details",
    },

    // Message notifications
    message_received: {
      category: "Messages",
      icon: MessageSquare,
      color: COLORS.primary,
      actionText: "Reply",
    },

    // Location updates
    location_update: {
      category: "Location Updates",
      icon: MapPin,
      color: COLORS.primary,
      actionText: "Track Artisan",
    },
    artisan_arrived: {
      category: "Location Updates",
      icon: MapPin,
      color: COLORS.success,
      actionText: "View Booking",
    },

    // Promotions
    promotion: {
      category: "Promotions",
      icon: Gift,
      color: COLORS.purple,
      actionText: "View Offer",
    },
    special_offer: {
      category: "Promotions",
      icon: Gift,
      color: COLORS.purple,
      actionText: "Claim Offer",
    },

    // System notifications
    system_announcement: {
      category: "System Alerts",
      icon: Bell,
      color: COLORS.info,
      actionText: "Learn More",
    },
    profile_update_required: {
      category: "System Alerts",
      icon: AlertCircle,
      color: COLORS.warning,
      actionText: "Update Profile",
    },
    verification_complete: {
      category: "System Alerts",
      icon: CheckCircle,
      color: COLORS.success,
      actionText: "View Profile",
    },
    new_artisan_available: {
      category: "Promotions",
      icon: Award,
      color: COLORS.purple,
      actionText: "Browse Artisans",
    },
  };

  // Return metadata or default
  return (
    metaMap[type] || {
      category: "Notification",
      icon: Bell,
      color: COLORS.gray,
      actionText: "View",
    }
  );
};

/**
 * Builds action URL based on notification type, data, and user role
 * @param {Object} notification - Notification object
 * @param {string} userRole - 'customer' or 'artisan' (optional, auto-detected from notification.recipient)
 * @returns {string} - URL to navigate to
 */
export const getActionUrl = (notification, userRole = null) => {
  const { type, data, actionUrl, recipient } = notification;

  // If backend provides actionUrl, use it
  if (actionUrl) return actionUrl;

  // Auto-detect user role from recipient if not provided
  const role = userRole || recipient?.role || "customer";

  // Customer-specific routes
  if (role === "customer") {
    const customerUrlMap = {
      // Booking-related
      booking_accepted: "/customer/dashboard/active",
      booking_declined: "/customer/dashboard/history",
      booking_confirmed: "/customer/dashboard/active",
      booking_started: "/customer/dashboard/active",
      booking_completed: "/customer/dashboard/active",
      booking_cancelled: "/customer/dashboard/history",

      // Negotiation
      negotiation_offer: "/customer/dashboard/active",
      negotiation_accepted: "/customer/dashboard/active",
      negotiation_declined: "/customer/dashboard/active",

      // Payments
      payment_successful: "/customer/dashboard/history",
      payment_failed: "/customer/dashboard/active",
      refund_processed: "/customer/dashboard/history",

      // Reviews
      review_reminder: "/customer/dashboard/reviews",
      review_response: "/customer/dashboard/reviews",

      // Messages
      message_received: "/customer/dashboard/active",

      // Location
      location_update: "/customer/dashboard/active",
      artisan_arrived: "/customer/dashboard/active",

      // Promotions
      promotion: "/customer/dashboard/promotions",
      special_offer: "/customer/dashboard/promotions",
      new_artisan_available: "/artisan-search",

      // System
      system_announcement: "/customer/dashboard",
      profile_update_required: "/customer/dashboard/profile",
      verification_complete: "/customer/dashboard/profile",
    };

    return customerUrlMap[type] || "/customer/dashboard/notifications";
  }

  // Artisan-specific routes
  if (role === "artisan") {
    const artisanUrlMap = {
      // Booking-related
      booking_created: "/artisan/dashboard/jobs",
      booking_accepted: "/artisan/dashboard/jobs",
      booking_declined: "/artisan/dashboard/jobs",
      booking_confirmed: "/artisan/dashboard/jobs",
      booking_started: "/artisan/dashboard/jobs",
      booking_completed: "/artisan/dashboard/jobs",
      booking_cancelled: "/artisan/dashboard/jobs",

      // Negotiation
      negotiation_offer: "/artisan/dashboard/jobs",
      negotiation_accepted: "/artisan/dashboard/jobs",
      negotiation_declined: "/artisan/dashboard/jobs",

      // Payments
      payment_received: "/artisan/dashboard/earnings",
      payment_released: "/artisan/dashboard/earnings",
      payout_processed: "/artisan/dashboard/earnings",

      // Reviews
      review_received: "/artisan/dashboard/reviews",
      review_response: "/artisan/dashboard/reviews",

      // Messages
      message_received: "/artisan/dashboard/messages",

      // System
      system_announcement: "/artisan/dashboard",
      profile_update_required: "/artisan/dashboard/profile",
      verification_complete: "/artisan/dashboard/profile",
    };

    return artisanUrlMap[type] || "/artisan/dashboard/notifications";
  }

  // Fallback
  return "/dashboard/notifications";
};

/**
 * Groups notifications by time period
 * @param {Array} notifications - Array of notifications
 * @returns {Object} - Grouped notifications { today: [], yesterday: [], thisWeek: [], older: [] }
 */
export const groupNotificationsByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);

  notifications.forEach((notif) => {
    const notifDate = new Date(notif.createdAt);

    if (notifDate >= today) {
      groups.today.push(notif);
    } else if (notifDate >= yesterday) {
      groups.yesterday.push(notif);
    } else if (notifDate >= weekAgo) {
      groups.thisWeek.push(notif);
    } else {
      groups.older.push(notif);
    }
  });

  return groups;
};

/**
 * Formats notification timestamp to relative time
 * @param {string|Date} timestamp
 * @returns {string} - "Just now", "5 minutes ago", etc.
 */
export const formatNotificationTime = (timestamp) => {
  const now = new Date();
  const time = new Date(timestamp);
  const diffMs = now - time;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  // For older notifications, show date
  return time.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

/**
 * Gets notification priority for sorting
 * @param {Object} notification
 * @returns {number} - Lower number = higher priority
 */
export const getNotificationPriority = (notification) => {
  const priorityMap = {
    booking_created: 1,
    negotiation_offer: 1,
    payment_failed: 1,
    booking_completed: 2,
    payment_successful: 2,
    message_received: 3,
    review_reminder: 4,
    promotion: 5,
  };

  return priorityMap[notification.type] || 6;
};
