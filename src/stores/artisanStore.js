// src/stores/artisanStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { artisanApi } from "../api/artisanApi";
import { serviceApi } from "../api/serviceApi";
import { reviewApi } from "../api/reviewApi";

export const useArtisanStore = create(
  persist(
    (set, get) => ({
      // ========== STATE ==========
      artisans: [],
      totalArtisans: 0,
      totalPages: 1,
      selectedArtisan: null,

      reviews: [],
      reviewStats: null,
      totalReviews: 0,
      reviewsPage: 1,
      reviewsPages: 1,

      services: [],
      categories: [],

      isLoading: false,
      isLoadingServices: false,
      isLoadingCategories: false,
      isLoadingReviews: false,
      error: null,

      filters: {
        searchTerm: "",
        service: "",
        category: "",
        minRating: "",
        availability: false,
        verified: false,
        latitude: null,
        longitude: null,
        radius: 10,
      },

      currentPage: 1,
      itemsPerPage: 6,
      sortBy: "relevance",
      savedArtisans: [],

      // ========== ACTIONS ==========

      fetchArtisans: async () => {
        const state = get();
        try {
          set({ isLoading: true, error: null });

          const params = {
            page: state.currentPage,
            limit: state.itemsPerPage,
          };

          if (state.filters.service) params.service = state.filters.service;
          if (state.filters.category) params.category = state.filters.category;
          if (state.filters.minRating)
            params.minRating = state.filters.minRating;
          if (state.filters.availability) params.available = "true";
          if (state.filters.verified) params.verified = "true";
          if (state.filters.latitude && state.filters.longitude) {
            params.latitude = state.filters.latitude;
            params.longitude = state.filters.longitude;
            params.radius = state.filters.radius;
          }
          if (state.filters.searchTerm)
            params.search = state.filters.searchTerm;

          const response = await artisanApi.getArtisans(params);

          set({
            artisans: response.data || [],
            totalArtisans: response.total || 0,
            totalPages: response.pages || 1,
            isLoading: false,
          });
        } catch (error) {
          console.error("ERROR FETCHING ARTISANS:", error);
          set({
            error: error.response?.data?.message || "Failed to load artisans",
            isLoading: false,
            artisans: [],
          });
        }
      },

      fetchServices: async () => {
        try {
          set({ isLoadingServices: true });
          const response = await serviceApi.getAllServices({ isActive: true });
          set({ services: response || [], isLoadingServices: false });
        } catch (error) {
          console.error("Error fetching services:", error);
          set({ isLoadingServices: false });
        }
      },

      fetchCategories: async () => {
        try {
          set({ isLoadingCategories: true });
          const response = await serviceApi.getAllCategories({
            isActive: true,
          });
          set({ categories: response.data || [], isLoadingCategories: false });
        } catch (error) {
          console.error("Error fetching categories:", error);
          set({ isLoadingCategories: false });
        }
      },

      getUserLocation: () => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error("Geolocation not supported"));
            return;
          }

          set({ isLoading: true });

          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords;
              set((state) => ({
                filters: { ...state.filters, latitude, longitude },
                currentPage: 1,
                isLoading: false,
              }));
              get().fetchArtisans();
              resolve({ latitude, longitude });
            },
            (error) => {
              set({ isLoading: false });
              reject(error);
            },
            { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
          );
        });
      },

      clearLocation: () => {
        set((state) => ({
          filters: { ...state.filters, latitude: null, longitude: null },
          currentPage: 1,
        }));
        get().fetchArtisans();
      },

      setFilter: (key, value) => {
        set((state) => ({
          filters: { ...state.filters, [key]: value },
          currentPage: 1,
        }));
        get().fetchArtisans();
      },

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          currentPage: 1,
        }));
        get().fetchArtisans();
      },

      clearFilters: () => {
        set({
          filters: {
            searchTerm: "",
            service: "",
            category: "",
            minRating: "",
            availability: false,
            verified: false,
            latitude: null,
            longitude: null,
            radius: 10,
          },
          currentPage: 1,
        });
        get().fetchArtisans();
      },

      setPage: (page) => {
        set({ currentPage: page });
        get().fetchArtisans();
        window.scrollTo({ top: 0, behavior: "smooth" });
      },

      nextPage: () => {
        const { currentPage, totalPages } = get();
        if (currentPage < totalPages) get().setPage(currentPage + 1);
      },

      prevPage: () => {
        const { currentPage } = get();
        if (currentPage > 1) get().setPage(currentPage - 1);
      },

      setSortBy: (sortBy) => set({ sortBy }),

      getSortedArtisans: () => {
        const { artisans, sortBy, filters } = get();
        let list = [...artisans];

        const getPrice = (artisanService) => {
          if (!artisanService?.serviceDetails)
            return { min: Infinity, max: -Infinity };

          const service = artisanService.serviceDetails;
          const custom = artisanService.customPricingConfig;
          const base = service.pricingConfig;
          const config = custom || base;
          const model = service.pricingModel;

          if (!config || !model) return { min: 0, max: 0 };

          switch (model) {
            case "simple_fixed":
            case "unit_based":
              return { min: config.basePrice || 0, max: config.basePrice || 0 };
            case "area_based":
              return {
                min: config.pricePerUnit || 0,
                max: config.pricePerUnit || 0,
              };
            case "tiered":
              const prices = config.tiers?.map((t) => t.price) || [0];
              return { min: Math.min(...prices), max: Math.max(...prices) };
            case "component_based":
              const compPrices = config.components?.map((c) => c.price) || [0];
              return {
                min: Math.min(...compPrices),
                max: Math.max(...compPrices),
              };
            default:
              return { min: 0, max: 0 };
          }
        };

        switch (sortBy) {
          case "rating":
            return list.sort(
              (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
            );

          case "price-low":
            return list
              .map((a) => {
                const price = getPrice(a.services?.[0]);
                return { ...a, sortPrice: price.min };
              })
              .sort((a, b) => a.sortPrice - b.sortPrice);

          case "price-high":
            return list
              .map((a) => {
                const price = getPrice(a.services?.[0]);
                return { ...a, sortPrice: price.max };
              })
              .sort((a, b) => b.sortPrice - a.sortPrice);

          case "distance":
            if (filters.latitude && filters.longitude) {
              return list.sort((a, b) => {
                const distA = a.distance ?? Infinity;
                const distB = b.distance ?? Infinity;
                return distA - distB;
              });
            }
            return list;

          case "newest":
            return list.sort(
              (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );

          case "most-booked":
            return list.sort(
              (a, b) =>
                (b.totalJobsCompleted || 0) - (a.totalJobsCompleted || 0)
            );

          case "relevance":
          default:
            return list;
        }
      },

      toggleSaveArtisan: (artisanId) => {
        set((state) => {
          const saved = state.savedArtisans.includes(artisanId);
          return {
            savedArtisans: saved
              ? state.savedArtisans.filter((id) => id !== artisanId)
              : [...state.savedArtisans, artisanId],
          };
        });
      },

      isSaved: (artisanId) => get().savedArtisans.includes(artisanId),

      setSelectedArtisan: (artisan) => set({ selectedArtisan: artisan }),

      fetchArtisanById: async (artisanId) => {
        try {
          set({ isLoading: true, error: null });
          const response = await artisanApi.getArtisanProfile(artisanId);
          console.log("ARTISAN PROFILE RESPONSE:", response);
          set({ selectedArtisan: response, isLoading: false });
        } catch (error) {
          console.error("Error fetching artisan:", error);
          set({
            error: error.response?.data?.message || "Failed to load profile",
            isLoading: false,
          });
        }
      },

      // ✅ FIXED: Changed response.data to response where needed
      fetchArtisanReviews: async (artisanId, params = {}) => {
        try {
          set({ isLoadingReviews: true, error: null });
          const response = await reviewApi.getArtisanReviews(artisanId, {
            page: get().reviewsPage,
            limit: 10,
            ...params,
          });
          set({
            reviews: response.data || [],
            totalReviews: response.total || 0,
            reviewsPages: response.pages || 1,
            reviewStats: response.summary || null,
            isLoadingReviews: false,
          });
        } catch (error) {
          console.error("Error fetching reviews:", error);
          set({
            error: error.response?.data?.message || "Failed to load reviews",
            isLoadingReviews: false,
            reviews: [],
          });
        }
      },

      fetchReviewStats: async (artisanId) => {
        try {
          const response = await reviewApi.getReviewStats(artisanId);
          set({ reviewStats: response.data || null });
        } catch (error) {
          console.error("Error fetching review stats:", error);
        }
      },

      setReviewsPage: (page) => {
        set({ reviewsPage: page });
        const id = get().selectedArtisan?._id;
        if (id) get().fetchArtisanReviews(id);
      },

      clearError: () => set({ error: null }),

      reset: () => {
        set({
          artisans: [],
          totalArtisans: 0,
          totalPages: 1,
          selectedArtisan: null,
          reviews: [],
          reviewStats: null,
          totalReviews: 0,
          reviewsPage: 1,
          reviewsPages: 1,
          services: [],
          categories: [],
          isLoading: false,
          isLoadingReviews: false,
          error: null,
          filters: {
            searchTerm: "",
            service: "",
            category: "",
            minRating: "",
            availability: false,
            verified: false,
            latitude: null,
            longitude: null,
            radius: 10,
          },
          currentPage: 1,
          sortBy: "relevance",
        });
      },
    }),
    {
      name: "artisan-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ savedArtisans: state.savedArtisans }),
    }
  )
);
