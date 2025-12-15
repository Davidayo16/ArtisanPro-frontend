// frontend/api/customerApi.js
import api from "./authApi";

// ✅ AXIOS CANCEL TOKEN STORAGE
let savedArtisansCancelToken = null;

export const customerApi = {
  // ========== DASHBOARD ==========

  getDashboardOverview: async () => {
    const response = await api.get("/customers/dashboard/overview");
    return response.data;
  },

  // ========== PROFILE ==========

  getProfile: async () => {
    const response = await api.get("/customers/profile");
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await api.put("/customers/profile", profileData);
    return response.data;
  },

  updateProfilePhoto: async (photoData) => {
    const response = await api.put("/customers/profile/photo", {
      profilePhoto: photoData,
    });
    return response.data;
  },

  changePassword: async (passwordData) => {
    const response = await api.put("/customers/profile/password", passwordData);
    return response.data;
  },

  updateNotificationPreferences: async (preferences) => {
    const response = await api.put(
      "/customers/profile/preferences",
      preferences
    );
    return response.data;
  },

  deactivateAccount: async (password) => {
    const response = await api.put("/customers/profile/deactivate", {
      password,
    });
    return response.data;
  },

  // ========== SAVED ARTISANS (OPTIMIZED WITH PAGINATION) ==========

  /**
   * Get saved artisans with pagination and filters
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.limit - Items per page (default: 20)
   * @param {string} params.category - Filter by service category (optional)
   * @param {number} params.minRating - Filter by minimum rating (optional)
   * @param {number} params.maxDistance - Filter by maximum distance in km (optional)
   * @param {string} params.sortBy - Sort option: 'date-desc', 'rating-high', 'distance', 'price-low', 'most-booked' (default: 'date-desc')
   * @param {string} params.search - Search query for artisan name/service (optional)
   */
  getSavedArtisans: async (params = {}) => {
    // ✅ CANCEL PREVIOUS REQUEST if still pending
    if (savedArtisansCancelToken) {
      savedArtisansCancelToken.cancel("New request initiated");
    }

    // ✅ CREATE NEW CANCEL TOKEN
    savedArtisansCancelToken = api.CancelToken?.source() || null;

    try {
      // Build query params
      const queryParams = {
        page: params.page || 1,
        limit: params.limit || 20,
        ...(params.category && { category: params.category }),
        ...(params.minRating && { minRating: params.minRating }),
        ...(params.maxDistance && { maxDistance: params.maxDistance }),
        ...(params.sortBy && { sortBy: params.sortBy }),
        ...(params.search && { search: params.search }),
      };

      const response = await api.get("/customers/saved-artisans", {
        params: queryParams,
        ...(savedArtisansCancelToken && {
          cancelToken: savedArtisansCancelToken.token,
        }),
      });

      return response.data;
    } catch (error) {
      // ✅ HANDLE CANCELLATION GRACEFULLY
      if (api.isCancel?.(error)) {
        console.log("Previous request cancelled:", error.message);
        return null; // Return null for cancelled requests
      }
      throw error;
    } finally {
      savedArtisansCancelToken = null;
    }
  },

  saveArtisan: async (artisanId) => {
    const response = await api.post(`/customers/saved-artisans/${artisanId}`);
    return response.data;
  },

  unsaveArtisan: async (artisanId) => {
    const response = await api.delete(`/customers/saved-artisans/${artisanId}`);
    return response.data;
  },

  // ========== BOOKINGS (Future) ==========

  getMyBookings: async (params) => {
    const response = await api.get("/bookings/my-bookings", { params });
    return response.data;
  },
};

export default customerApi;
