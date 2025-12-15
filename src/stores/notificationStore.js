// frontend/stores/notificationStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import notificationApi from "../api/notificationApi";
import toast from "react-hot-toast";

export const useNotificationStore = create(
  devtools((set, get) => ({
    // === STATE ===
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      limit: 20,
      total: 0,
      pages: 0,
    },

    // === FETCH NOTIFICATIONS ===
    fetchNotifications: async ({
      page = 1,
      limit = 20,
      isRead,
      signal,
    } = {}) => {
      set({ loading: true, error: null });
      try {
        const res = await notificationApi.getNotifications({
          page,
          limit,
          isRead,
          signal,
        });

        set({
          notifications: res.data.data || [],
          unreadCount: res.data.unreadCount || 0,
          pagination: {
            page: res.data.page || page,
            limit: res.data.limit || limit,
            total: res.data.total || 0,
            pages: res.data.pages || 0,
          },
          loading: false,
        });
      } catch (err) {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }
        set({
          error: err.response?.data?.message || "Failed to load notifications",
          loading: false,
        });
      }
    },

    // === FETCH UNREAD COUNT (for header badge) ===
    fetchUnreadCount: async () => {
      try {
        const res = await notificationApi.getUnreadCount();
        set({ unreadCount: res.data.count || 0 });
      } catch (err) {
        console.error("Failed to fetch unread count:", err);
      }
    },

    // === MARK AS READ (with optimistic update) ===
    markAsRead: async (notificationId) => {
      const { notifications, unreadCount } = get();

      // Find the notification
      const notification = notifications.find((n) => n._id === notificationId);
      if (!notification || notification.isRead) return; // Already read

      // Optimistic update
      set({
        notifications: notifications.map((n) =>
          n._id === notificationId
            ? { ...n, isRead: true, readAt: new Date() }
            : n
        ),
        unreadCount: Math.max(0, unreadCount - 1),
      });

      // API call (no await - fire and forget)
      try {
        await notificationApi.markAsRead(notificationId);
      } catch (err) {
        // Revert on error
        set({
          notifications: notifications,
          unreadCount: unreadCount,
        });
        toast.error("Failed to mark as read");
        console.error("markAsRead error:", err);
      }
    },

    // === MARK ALL AS READ ===
    markAllAsRead: async () => {
      const { notifications } = get();

      // Optimistic update
      const updatedNotifications = notifications.map((n) => ({
        ...n,
        isRead: true,
        readAt: new Date(),
      }));

      set({
        notifications: updatedNotifications,
        unreadCount: 0,
      });

      try {
        await notificationApi.markAllAsRead();
        toast.success("All notifications marked as read");
      } catch (err) {
        // Revert on error
        set({ notifications });
        await get().fetchUnreadCount(); // Re-fetch actual count
        toast.error("Failed to mark all as read");
        console.error("markAllAsRead error:", err);
      }
    },

    // === DELETE NOTIFICATION (with optimistic update) ===
    deleteNotification: async (notificationId) => {
      const { notifications, unreadCount, pagination } = get();

      // Find notification to check if it was unread
      const notification = notifications.find((n) => n._id === notificationId);
      const wasUnread = notification && !notification.isRead;

      // Optimistic update
      const updatedNotifications = notifications.filter(
        (n) => n._id !== notificationId
      );

      set({
        notifications: updatedNotifications,
        unreadCount: wasUnread ? Math.max(0, unreadCount - 1) : unreadCount,
        pagination: {
          ...pagination,
          total: Math.max(0, pagination.total - 1),
        },
      });

      try {
        await notificationApi.deleteNotification(notificationId);
      } catch (err) {
        // Revert on error
        set({ notifications, unreadCount, pagination });
        toast.error("Failed to delete notification");
        console.error("deleteNotification error:", err);
      }
    },

    // === DELETE SELECTED (bulk delete) ===
    deleteSelected: async (notificationIds) => {
      if (!notificationIds || notificationIds.length === 0) {
        toast.error("No notifications selected");
        return;
      }

      const { notifications, unreadCount, pagination } = get();

      // Count how many unread notifications are being deleted
      const unreadDeleteCount = notifications.filter(
        (n) => notificationIds.includes(n._id) && !n.isRead
      ).length;

      // Optimistic update
      const updatedNotifications = notifications.filter(
        (n) => !notificationIds.includes(n._id)
      );

      set({
        notifications: updatedNotifications,
        unreadCount: Math.max(0, unreadCount - unreadDeleteCount),
        pagination: {
          ...pagination,
          total: Math.max(0, pagination.total - notificationIds.length),
        },
      });

      try {
        // Delete each notification (could be optimized with batch endpoint)
        await Promise.all(
          notificationIds.map((id) => notificationApi.deleteNotification(id))
        );
        toast.success(`${notificationIds.length} notification(s) deleted`);
      } catch (err) {
        // Revert on error
        set({ notifications, unreadCount, pagination });
        toast.error("Failed to delete notifications");
        console.error("deleteSelected error:", err);
      }
    },

    // === DELETE ALL NOTIFICATIONS ===
    deleteAllNotifications: async () => {
      const { notifications, pagination } = get();

      // Optimistic update
      set({
        notifications: [],
        unreadCount: 0,
        pagination: { ...pagination, total: 0, pages: 0 },
      });

      try {
        await notificationApi.deleteAllNotifications();
        toast.success("All notifications deleted");
      } catch (err) {
        // Revert on error
        set({ notifications, pagination });
        await get().fetchUnreadCount();
        toast.error("Failed to delete all notifications");
        console.error("deleteAllNotifications error:", err);
      }
    },

    // === UPDATE LOCAL NOTIFICATION (helper for optimistic updates) ===
    updateLocalNotification: (notificationId, updates) => {
      const { notifications } = get();
      set({
        notifications: notifications.map((n) =>
          n._id === notificationId ? { ...n, ...updates } : n
        ),
      });
    },
  }))
);
