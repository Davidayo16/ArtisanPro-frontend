// src/stores/artisanProfileStore.js
import { create } from "zustand";
import { artisanApi } from "../api/artisanApi";
import { serviceApi } from "../api/serviceApi";
import api from "../api/authApi";
import { useAuthStore } from "./authStore"; // 🔥 ADD THIS IMPORT

export const useArtisanProfileStore = create((set, get) => ({
  // ========== STATE ==========
  // Profile Data
  profile: null,

  // Services & Categories
  myServices: [],
  allServices: [],
  allServiceCategories: [],

  // Portfolio
  portfolio: [],

  // Analytics
  analytics: null,
  topServices: [],
  selectedPeriod: 30, // Default to 30 days

  // Loading States
  isLoading: true,
  isLoadingPortfolio: false,
  isLoadingAnalytics: false,
  isLoadingTopServices: false,
  isUpdating: false,
  isUploadingPhoto: false,
  isUploadingPortfolio: false,
  isUploadingDocument: false,
  isFetchingServices: false,
  isFetchingCategories: false,
  isExporting: false,

  // Error Handling
  error: null,
  successMessage: null,

  // ========== PROFILE MANAGEMENT ==========

  fetchMyProfile: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await artisanApi.getMyProfile();
      set({
        profile: response.data,
        isLoading: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching profile:", error);
      set({
        error: error.response?.data?.message || "Failed to load profile",
        isLoading: false,
      });
      throw error;
    }
  },

  updateBasicInfo: async (data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updateBasicInfo(data);
      set({
        profile: response.data,
        isUpdating: false,
        successMessage: "Profile updated successfully!",
      });
      await useAuthStore.getState().fetchUser(); // 🔥 ADD THIS LINE
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating profile:", error);
      set({
        error: error.response?.data?.message || "Failed to update profile",
        isUpdating: false,
      });
      throw error;
    }
  },

  uploadProfilePhoto: async (file) => {
    try {
      set({ isUploadingPhoto: true, error: null });

      const formData = new FormData();
      formData.append("photo", file);

      await api.post("/upload/profile-photo", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchMyProfile();

      set({
        isUploadingPhoto: false,
        successMessage: "Profile photo updated successfully!",
      });
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error uploading photo:", error);
      set({
        error: error.response?.data?.message || "Failed to upload photo",
        isUploadingPhoto: false,
      });
      throw error;
    }
  },

  uploadIdDocument: async (file) => {
    try {
      set({ isUploadingDocument: true, error: null });

      const formData = new FormData();
      formData.append("document", file);

      await api.post("/upload/id-document", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await get().fetchMyProfile();

      set({
        isUploadingDocument: false,
        successMessage: "ID document uploaded successfully!",
      });
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error uploading document:", error);
      set({
        error: error.response?.data?.message || "Failed to upload document",
        isUploadingDocument: false,
      });
      throw error;
    }
  },

  updateWorkingHours: async (data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updateWorkingHours(data);
      set((state) => ({
        profile: {
          ...state.profile,
          workingHours: response.data.workingHours,
          serviceRadius: response.data.serviceRadius,
        },
        isUpdating: false,
        successMessage: "Working hours updated successfully!",
      }));
       await useAuthStore.getState().fetchUser();
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating working hours:", error);
      set({
        error:
          error.response?.data?.message || "Failed to update working hours",
        isUpdating: false,
      });
      throw error;
    }
  },

  updateBankDetails: async (data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updateBankDetails(data);
      set((state) => ({
        profile: {
          ...state.profile,
          bankDetails: response.data.bankDetails,
        },
        isUpdating: false,
        successMessage: "Bank details updated successfully!",
      }));
      await useAuthStore.getState().fetchUser(); // 🔥 ADD THIS LINE
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating bank details:", error);
      set({
        error: error.response?.data?.message || "Failed to update bank details",
        isUpdating: false,
      });
      throw error;
    }
  },

  updateVerification: async (data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updateVerification(data);
      set((state) => ({
        profile: {
          ...state.profile,
          verification: response.data.verification,
        },
        isUpdating: false,
        successMessage: "Verification submitted successfully!",
      }));
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating verification:", error);
      set({
        error: error.response?.data?.message || "Failed to submit verification",
        isUpdating: false,
      });
      throw error;
    }
  },

  toggleAvailability: async (isAvailableNow) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.toggleAvailability(isAvailableNow);
      set((state) => ({
        profile: {
          ...state.profile,
          isAvailableNow: response.data.isAvailableNow,
        },
        isUpdating: false,
        successMessage: response.message,
      }));
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error toggling availability:", error);
      set({
        error: error.response?.data?.message || "Failed to update availability",
        isUpdating: false,
      });
      throw error;
    }
  },

  // ========== SERVICE MANAGEMENT ==========

  fetchMyServices: async () => {
    try {
      set({ isFetchingServices: true, error: null });
      const response = await artisanApi.getMyServices();
      set({
        myServices: response.data || [],
        isFetchingServices: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching services:", error);
      set({
        error: error.response?.data?.message || "Failed to load services",
        isFetchingServices: false,
      });
      throw error;
    }
  },

  addService: async (serviceData) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.addService(serviceData);
      set((state) => ({
        myServices: [response.data, ...state.myServices],
        isUpdating: false,
        successMessage: "Service added successfully!",
      }));
      // 🔥 REFRESH PROFILE STATUS
      await useAuthStore.getState().fetchUser();
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error adding service:", error);
      set({
        error: error.response?.data?.message || "Failed to add service",
        isUpdating: false,
      });
      throw error;
    }
  },

  updateService: async (id, data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updateService(id, data);
      set((state) => ({
        myServices: state.myServices.map((service) =>
          service._id === id ? response.data : service
        ),
        isUpdating: false,
        successMessage: "Service updated successfully!",
      }));
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      set({
        error: error.response?.data?.message || "Failed to update service",
        isUpdating: false,
      });
      throw error;
    }
  },

  removeService: async (id) => {
    try {
      set({ isUpdating: true, error: null });
      await artisanApi.removeService(id);
      set((state) => ({
        myServices: state.myServices.filter((service) => service._id !== id),
        isUpdating: false,
        successMessage: "Service removed successfully!",
      }));
      // 🔥 REFRESH PROFILE STATUS
      await useAuthStore.getState().fetchUser();
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error removing service:", error);
      set({
        error: error.response?.data?.message || "Failed to remove service",
        isUpdating: false,
      });
      throw error;
    }
  },

  toggleService: async (id, enabled) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.toggleService(id, enabled);
      set((state) => ({
        myServices: state.myServices.map((service) =>
          service._id === id
            ? { ...service, enabled: response.data.enabled }
            : service
        ),
        isUpdating: false,
        successMessage: `Service ${
          enabled ? "enabled" : "disabled"
        } successfully!`,
      }));
      // 🔥 REFRESH PROFILE STATUS (important if disabling all services)
      await useAuthStore.getState().fetchUser();
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error toggling service:", error);
      set({
        error: error.response?.data?.message || "Failed to toggle service",
        isUpdating: false,
      });
      throw error;
    }
  },

  fetchServiceCategories: async () => {
    try {
      set({ isFetchingCategories: true, error: null });
      const response = await serviceApi.getAllCategories({ isActive: true });
      set({
        allServiceCategories: response.data || [],
        isFetchingCategories: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching service categories:", error);
      set({
        error: error.response?.data?.message || "Failed to load categories",
        isFetchingCategories: false,
      });
      throw error;
    }
  },

  // Line ~370-380
  fetchAllServices: async (categoryId = null) => {
    try {
      set({ isFetchingServices: true, error: null });

      const params = { isActive: true };
      if (categoryId) {
        params.category = categoryId;
      }

      const response = await serviceApi.getAllServices(params);

      // 🔥 FIX: Handle different response structures
      const servicesData = response.data || response || [];

      set({
        allServices: Array.isArray(servicesData) ? servicesData : [],
        isFetchingServices: false,
      });

      console.log("Fetched all services:", servicesData);
      return servicesData;
    } catch (error) {
      console.error("Error fetching services:", error);
      set({
        error: error.response?.data?.message || "Failed to load services",
        isFetchingServices: false,
        allServices: [], // 🔥 Set empty array on error
      });
      throw error;
    }
  },

  // ========== PORTFOLIO MANAGEMENT ==========

  fetchMyPortfolio: async () => {
    try {
      set({ isLoadingPortfolio: true, error: null });
      const response = await artisanApi.getMyPortfolio();
      set({
        portfolio: response.data || [],
        isLoadingPortfolio: false,
      });
    } catch (error) {
      set({ error: "Failed to load portfolio", isLoadingPortfolio: false });
    }
  },

  addPortfolioItemWithImages: async (portfolioData, imageFiles) => {
    try {
      set({ isUploadingPortfolio: true, error: null });

      const formData = new FormData();
      Array.from(imageFiles).forEach((file) => formData.append("images", file));

      const uploadRes = await api.post("/upload/portfolio", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const images = uploadRes.data.data.map((img) => ({
        url: img.url,
        publicId: img.publicId,
        caption: "",
      }));

      const portfolioPayload = {
        ...portfolioData,
        images: images,
        completedDate: portfolioData.completedDate || new Date().toISOString(),
      };

      const response = await api.post(
        "/artisans/me/portfolio",
        portfolioPayload
      );

      set((state) => ({
        portfolio: [response.data.data, ...state.portfolio],
        isUploadingPortfolio: false,
        successMessage: "Portfolio item added successfully!",
      }));
      setTimeout(() => set({ successMessage: null }), 3000);

      return response.data.data;
    } catch (error) {
      console.error("Error adding portfolio item:", error);
      set({
        error: error.response?.data?.message || "Failed to add portfolio item",
        isUploadingPortfolio: false,
      });
      throw error;
    }
  },

  updatePortfolioItem: async (id, data) => {
    try {
      set({ isUpdating: true, error: null });
      const response = await artisanApi.updatePortfolioItem(id, data);
      set((state) => ({
        portfolio: state.portfolio.map((item) =>
          item._id === id ? response.data : item
        ),
        isUpdating: false,
        successMessage: "Portfolio item updated successfully!",
      }));
      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating portfolio item:", error);
      set({
        error:
          error.response?.data?.message || "Failed to update portfolio item",
        isUpdating: false,
      });
      throw error;
    }
  },

  deletePortfolioItem: async (id) => {
    try {
      set({ isUpdating: true, error: null });
      await artisanApi.deletePortfolioItem(id);
      set((state) => ({
        portfolio: state.portfolio.filter((item) => item._id !== id),
        isUpdating: false,
        successMessage: "Portfolio item deleted successfully!",
      }));
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error deleting portfolio item:", error);
      set({
        error:
          error.response?.data?.message || "Failed to delete portfolio item",
        isUpdating: false,
      });
      throw error;
    }
  },

  // ========== ANALYTICS ==========

  fetchAnalytics: async (days = 30) => {
    try {
      set({ isLoadingAnalytics: true, error: null });
      const response = await artisanApi.getAnalytics(days);
      console.log("🔍 RAW RESPONSE:", response);
      console.log("🔍 response.data:", response.data);
      console.log("🔍 response.data.data:", response.data?.data);
      set({
        analytics: response.data, // ← Change to response.data (unwrap the extra layer)
        selectedPeriod: days,
        isLoadingAnalytics: false,
      });
      return response.data;
    } catch (error) {
      //...
    }
  },
  fetchTopServices: async (limit = 5) => {
    try {
      set({ isLoadingTopServices: true, error: null });
      const response = await artisanApi.getTopServices(limit);
      set({
        topServices: response.data || [],
        isLoadingTopServices: false,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching top services:", error);
      set({
        error: error.response?.data?.message || "Failed to load top services",
        isLoadingTopServices: false,
      });
      throw error;
    }
  },

  exportAnalytics: async (days = 30) => {
    try {
      set({ isExporting: true, error: null });
      const blob = await artisanApi.exportAnalytics(days);

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-${days}d-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      set({
        isExporting: false,
        successMessage: "Analytics exported successfully!",
      });
      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error exporting analytics:", error);
      set({
        error: error.response?.data?.message || "Failed to export analytics",
        isExporting: false,
      });
      throw error;
    }
  },

  setAnalyticsPeriod: (days) => {
    set({ selectedPeriod: days });
    get().fetchAnalytics(days);
  },

  // ========== UTILITY METHODS ==========

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ successMessage: null }),

  reset: () => {
    set({
      profile: null,
      myServices: [],
      allServices: [],
      allServiceCategories: [],
      portfolio: [],
      analytics: null,
      topServices: [],
      selectedPeriod: 30,
      isLoading: false,
      isLoadingPortfolio: false,
      isLoadingAnalytics: false,
      isLoadingTopServices: false,
      isUpdating: false,
      isUploadingPhoto: false,
      isUploadingPortfolio: false,
      isUploadingDocument: false,
      isFetchingServices: false,
      isFetchingCategories: false,
      isExporting: false,
      error: null,
      successMessage: null,
    });
  },
}));
