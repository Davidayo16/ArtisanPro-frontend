import api from "./authApi";

export const artisanApi = {
  // ========== PROFILE MANAGEMENT ==========

  // Get own profile
  getMyProfile: async () => {
    const response = await api.get("/artisans/me/profile");
    return response.data;
  },

  // Update basic info (Step 1 of wizard)
  updateBasicInfo: async (data) => {
    const response = await api.put("/artisans/me/basic-info", data);
    return response.data;
  },

  // Update services (Step 2 of wizard) - BULK UPDATE
  updateServices: async (serviceIds, categoryIds) => {
    const response = await api.put("/artisans/me/services", {
      serviceIds,
      categoryIds,
    });
    return response.data;
  },

  // Update working hours (Step 3 of wizard)
  updateWorkingHours: async (data) => {
    const response = await api.put("/artisans/me/working-hours", data);
    return response.data;
  },

  // Update bank details (Step 4 of wizard)
  updateBankDetails: async (data) => {
    const response = await api.put("/artisans/me/bank-details", data);
    return response.data;
  },

  // Update verification details
  updateVerification: async (data) => {
    const response = await api.put("/artisans/me/verification", data);
    return response.data;
  },

  // Toggle availability status
  toggleAvailability: async (isAvailableNow) => {
    const response = await api.put("/artisans/me/availability", {
      isAvailableNow,
    });
    return response.data;
  },

  // Get dashboard overview
  getDashboardOverview: async () => {
    const response = await api.get("/artisans/me/dashboard/overview");
    return response.data;
  },

  // ========== SERVICE MANAGEMENT (INDIVIDUAL CRUD) ==========

  // Get artisan's services
  getMyServices: async () => {
    const response = await api.get("/artisans/me/services");
    return response.data;
  },

  // Add service to artisan
  addService: async (data) => {
    const response = await api.post("/artisans/me/services", data);
    return response.data;
  },

  // Update artisan service
  updateService: async (id, data) => {
    const response = await api.put(`/artisans/me/services/${id}`, data);
    return response.data;
  },

  // Remove service from artisan
  removeService: async (id) => {
    const response = await api.delete(`/artisans/me/services/${id}`);
    return response.data;
  },

  // Toggle service enabled status
  toggleService: async (id, enabled) => {
    const response = await api.put(`/artisans/me/services/${id}/toggle`, {
      enabled,
    });
    return response.data;
  },

  // ========== PORTFOLIO MANAGEMENT ==========

  // Get own portfolio
  getMyPortfolio: async () => {
    const response = await api.get("/artisans/me/portfolio");
    return response.data;
  },

  // Add portfolio item
  addPortfolioItem: async (formData) => {
    const response = await api.post("/artisans/me/portfolio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update portfolio item
  updatePortfolioItem: async (id, data) => {
    const response = await api.put(`/artisans/me/portfolio/${id}`, data);
    return response.data;
  },

  // Delete portfolio item
  deletePortfolioItem: async (id) => {
    const response = await api.delete(`/artisans/me/portfolio/${id}`);
    return response.data;
  },

  // ========== ANALYTICS ==========

  // Get analytics data
  getAnalytics: async (days = 30) => {
    const response = await api.get("/artisans/me/analytics", {
      params: { days },
    });
    return response.data;
  },

  // Export analytics to CSV
  exportAnalytics: async (days = 30) => {
    const response = await api.get("/artisans/me/analytics/export", {
      params: { days },
      responseType: "blob", // Important for file download
    });
    return response.data;
  },

  // Get top performing services
  getTopServices: async (limit = 5) => {
    const response = await api.get("/artisans/me/analytics/top-services", {
      params: { limit },
    });
    return response.data;
  },

  // ========== PUBLIC ROUTES ==========

  // Get all artisans (with filters)
  getArtisans: async (params) => {
    const response = await api.get("/artisans", { params });
    return response.data;
  },

  // Get specific artisan profile (public view)
  getArtisanProfile: async (artisanId) => {
    const response = await api.get(`/artisans/${artisanId}`);
    return response.data;
  },

  // Get artisan's portfolio (public view)
  getArtisanPortfolio: async (artisanId) => {
    const response = await api.get(`/artisans/${artisanId}/portfolio`);
    return response.data;
  },
};

export default artisanApi;
