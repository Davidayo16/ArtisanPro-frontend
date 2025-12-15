// src/api/serviceApi.js
import api from "./authApi";

export const serviceApi = {
  // ========== SERVICE CATEGORIES ==========

  // Get all service categories
  getAllCategories: async (params = {}) => {
    const queryParams = { ...params };

    // Handle isActive parameter
    if (queryParams.isActive !== undefined) {
      queryParams.active = queryParams.isActive;
      delete queryParams.isActive;
    }

    // Add cache buster
    queryParams._ = Date.now();

    const response = await api.get("/service-categories", {
      params: queryParams,
    });

    return response.data; // { success: true, data: [...], count: N }
  },

  // Get single category by ID
  getCategoryById: async (id) => {
    const response = await api.get(`/service-categories/${id}`);
    return response.data;
  },

  // Get category by slug
  getCategoryBySlug: async (slug) => {
    const response = await api.get(`/service-categories/slug/${slug}`);
    return response.data;
  },

  // ========== SERVICES ==========

  // Get all services (with optional filters)
  getAllServices: async (params = {}) => {
    const queryParams = { ...params };

    // Handle isActive parameter
    if (queryParams.isActive !== undefined) {
      queryParams.active = queryParams.isActive;
      delete queryParams.isActive;
    }

    // Add cache buster
    queryParams._ = Date.now();

    const response = await api.get("/services", { params: queryParams });

    // Return the data array directly
    return response.data.data || [];
  },

  // Get services by category
  getServicesByCategory: async (categoryId, params = {}) => {
    const response = await api.get("/services", {
      params: { category: categoryId, ...params },
    });
    return response.data;
  },

  // Get single service by ID
  getServiceById: async (id) => {
    const response = await api.get(`/services/${id}`);
    return response.data;
  },

  // Get service by slug
  getServiceBySlug: async (slug) => {
    const response = await api.get(`/services/slug/${slug}`);
    return response.data;
  },

  // Search services
  searchServices: async (searchTerm, params = {}) => {
    const response = await api.get("/services/search", {
      params: { q: searchTerm, ...params },
    });
    return response.data;
  },

  // Get popular services
  getPopularServices: async (limit = 10) => {
    const response = await api.get("/services/popular", {
      params: { limit },
    });
    return response.data;
  },

  // Calculate service price
  calculateServicePrice: async (serviceId, priceData) => {
    const response = await api.post(
      `/services/${serviceId}/calculate-price`,
      priceData
    );
    return response.data;
  },
};

export default serviceApi;
