// frontend/api/notificationApi.js
import api from "./authApi";

const notificationApi = {
  // Get all notifications with filters
  getNotifications: ({ page = 1, limit = 20, isRead, signal } = {}) =>
    api.get("/notifications", {
      params: { page, limit, isRead },
      signal,
    }),

  // Get unread count
  getUnreadCount: () => api.get("/notifications/unread-count"),

  // Mark single notification as read
  markAsRead: (id) => api.put(`/notifications/${id}/read`),

  // Mark all notifications as read
  markAllAsRead: () => api.put("/notifications/read-all"),

  // Delete single notification
  deleteNotification: (id) => api.delete(`/notifications/${id}`),

  // Delete all notifications
  deleteAllNotifications: () => api.delete("/notifications"),
};

export default notificationApi;
