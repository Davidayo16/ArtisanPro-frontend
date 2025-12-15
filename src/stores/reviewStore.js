// src/stores/reviewStore.js
import { create } from "zustand";
import { reviewApi } from "../api/reviewApi";

export const useReviewStore = create((set, get) => ({
  // ========== STATE ==========

  // Reviews Data
  reviews: [],
  totalReviews: 0,
  ratingDistribution: [],

  // Pagination
  currentPage: 1,
  totalPages: 1,

  // Statistics
  stats: {
    averageRating: 0,
    totalReviews: 0,
    fiveStarCount: 0,
    fiveStarPercentage: 0,
    repliedCount: 0,
    responseRate: 0,
    totalHelpful: 0,
    reviewsThisMonth: 0,
    reviewsLastMonth: 0,
    helpfulThisWeek: 0,
  },

  // Loading States
  isLoading: false,
  isSubmittingReply: false,
  isFlagging: false,
  isMarkingHelpful: false,

  // Error Handling
  // Error Handling
  error: null,
  successMessage: null,

  // ✅ ADD CACHE MANAGEMENT
  lastFetchTime: null,
  cacheTimeout: 5 * 60 * 1000, // 5 minutes

  // ========== FETCH CUSTOMER'S WRITTEN REVIEWS ==========

  fetchCustomerReviews: async (forceRefresh = false) => {
    const state = get();
    const now = Date.now();

    // ✅ CHECK CACHE
    if (
      !forceRefresh &&
      state.lastFetchTime &&
      now - state.lastFetchTime < state.cacheTimeout &&
      state.reviews.length > 0
    ) {
      console.log("📦 Using cached customer reviews");
      return;
    }

    try {
      set({ isLoading: true, error: null });

      const response = await reviewApi.getCustomerReviews();

      set({
        reviews: response.data || [],
        totalReviews: response.count || 0,
        ratingDistribution: response.ratingDistribution || [],
        stats: response.stats || {
          averageRating: 0,
          totalReviews: 0,
          fiveStarReviews: 0,
          fiveStarPercentage: 0,
          totalHelpful: 0,
          reviewsThisMonth: 0,
          reviewsLastMonth: 0,
          helpfulThisWeek: 0,
        },
        isLoading: false,
        lastFetchTime: now, // ✅ ADD THIS
      });

      return response;
    } catch (error) {
      console.error("Error fetching customer reviews:", error);
      set({
        error: error.response?.data?.message || "Failed to load reviews",
        isLoading: false,
      });
      throw error;
    }
  },

  // ========== FETCH ARTISAN'S RECEIVED REVIEWS ==========

  fetchArtisanReceivedReviews: async (params = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await reviewApi.getArtisanReceivedReviews(params);

      // Calculate stats from the reviews
      const reviews = response.data || [];
      const total = response.total || reviews.length;
      const repliedCount = reviews.filter((r) => r.response?.text).length;
      const fiveStarCount = reviews.filter((r) => r.rating === 5).length;

      // Calculate average rating
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : 0;

      set({
        reviews,
        totalReviews: total,
        ratingDistribution: response.ratingDistribution || [],
        currentPage: response.page || 1,
        totalPages: response.pages || 1,
        stats: {
          averageRating: avgRating.toFixed(1),
          totalReviews: total,
          fiveStarCount,
          fiveStarPercentage:
            total > 0 ? ((fiveStarCount / total) * 100).toFixed(1) : 0,
          repliedCount,
          responseRate:
            total > 0 ? ((repliedCount / total) * 100).toFixed(1) : 0,
        },
        isLoading: false,
      });

      return response;
    } catch (error) {
      console.error("Error fetching reviews:", error);
      set({
        error: error.response?.data?.message || "Failed to load reviews",
        isLoading: false,
      });
      throw error;
    }
  },

  // ========== UPDATE CUSTOMER'S REVIEW ==========

  updateCustomerReview: async (reviewId, data) => {
    try {
      set({ isLoading: true, error: null });

      const response = await reviewApi.updateReview(reviewId, data);

      // Update the review in local state
    set((state) => ({
      reviews: state.reviews.map((review) =>
        review._id === reviewId ? response.data : review
      ),
      isLoading: false,
      lastFetchTime: null, // ✅ CLEAR CACHE
      successMessage: "Review updated successfully!",
    }));

      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error updating review:", error);
      set({
        error: error.response?.data?.message || "Failed to update review",
        isLoading: false,
      });
      throw error;
    }
  },

  // ========== DELETE CUSTOMER'S REVIEW ==========

  deleteCustomerReview: async (reviewId) => {
    try {
      set({ isLoading: true, error: null });

      await reviewApi.deleteReview(reviewId);

      // Remove from local state
    set((state) => ({
      reviews: state.reviews.filter((review) => review._id !== reviewId),
      totalReviews: state.totalReviews - 1,
      isLoading: false,
      lastFetchTime: null, // ✅ CLEAR CACHE
      successMessage: "Review deleted successfully!",
    }));

      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error deleting review:", error);
      set({
        error: error.response?.data?.message || "Failed to delete review",
        isLoading: false,
      });
      throw error;
    }
  },

  // ========== RESPOND TO REVIEW ==========

  respondToReview: async (reviewId, responseText) => {
    try {
      set({ isSubmittingReply: true, error: null });

      const response = await reviewApi.respondToReview(reviewId, responseText);

      // Update the review in the local state
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId ? response.data : review
        ),
        stats: {
          ...state.stats,
          repliedCount: state.stats.repliedCount + 1,
          responseRate:
            state.totalReviews > 0
              ? (
                  ((state.stats.repliedCount + 1) / state.totalReviews) *
                  100
                ).toFixed(1)
              : 0,
        },
        isSubmittingReply: false,
        successMessage: "Reply posted successfully!",
      }));

      setTimeout(() => set({ successMessage: null }), 3000);
      return response.data;
    } catch (error) {
      console.error("Error responding to review:", error);
      set({
        error: error.response?.data?.message || "Failed to post reply",
        isSubmittingReply: false,
      });
      throw error;
    }
  },

  // ========== FLAG REVIEW ==========

  flagReview: async (reviewId, reason) => {
    try {
      set({ isFlagging: true, error: null });

      await reviewApi.flagReview(reviewId, reason);

      // Optionally remove or mark the review as flagged in local state
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId
            ? { ...review, isFlagged: true, flagReason: reason }
            : review
        ),
        isFlagging: false,
        successMessage: "Review flagged successfully. Admin will review it.",
      }));

      setTimeout(() => set({ successMessage: null }), 3000);
    } catch (error) {
      console.error("Error flagging review:", error);
      set({
        error: error.response?.data?.message || "Failed to flag review",
        isFlagging: false,
      });
      throw error;
    }
  },

  // ========== MARK REVIEW AS HELPFUL ==========

  markReviewHelpful: async (reviewId, isHelpful) => {
    try {
      set({ isMarkingHelpful: true, error: null });

      const response = await reviewApi.markReviewHelpful(reviewId, isHelpful);

      // Update the review's helpful counts
      set((state) => ({
        reviews: state.reviews.map((review) =>
          review._id === reviewId
            ? {
                ...review,
                helpfulCount: response.data.helpfulCount,
                notHelpfulCount: response.data.notHelpfulCount,
              }
            : review
        ),
        isMarkingHelpful: false,
      }));
    } catch (error) {
      console.error("Error marking review helpful:", error);
      set({
        error: error.response?.data?.message || "Failed to mark review",
        isMarkingHelpful: false,
      });
      throw error;
    }
  },

  // ========== FILTER & SORT (CLIENT-SIDE) ==========

  getFilteredReviews: (filterType = "all", searchQuery = "") => {
    const { reviews } = get();
    let filtered = [...reviews];

    // Apply rating filter
    if (filterType === "5stars") {
      filtered = filtered.filter((r) => r.rating === 5);
    } else if (filterType === "4stars") {
      filtered = filtered.filter((r) => r.rating === 4);
    } else if (filterType === "unreplied") {
      filtered = filtered.filter((r) => !r.response?.text);
    }

    // Apply search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.reviewer?.firstName?.toLowerCase().includes(q) ||
          r.reviewer?.lastName?.toLowerCase().includes(q) ||
          r.booking?.service?.name?.toLowerCase().includes(q) ||
          r.comment?.toLowerCase().includes(q)
      );
    }

    return filtered;
  },

  sortReviews: (reviews, sortBy = "date-desc") => {
    const copy = [...reviews];

    switch (sortBy) {
      case "date-desc":
        copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "date-asc":
        copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case "rating-high":
        copy.sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        copy.sort((a, b) => a.rating - b.rating);
        break;
      case "replied-first":
        copy.sort(
          (a, b) => (b.response?.text ? 1 : 0) - (a.response?.text ? 1 : 0)
        );
        break;
      default:
        break;
    }

    return copy;
  },

  // ========== PAGINATION ==========

  setCurrentPage: (page) => {
    set({ currentPage: page });
  },

  // ========== UTILITY METHODS ==========

  clearError: () => set({ error: null }),

  clearSuccess: () => set({ successMessage: null }),

  reset: () => {
    set({
      reviews: [],
      totalReviews: 0,
      ratingDistribution: [],
      currentPage: 1,
      totalPages: 1,
      stats: {
        averageRating: 0,
        totalReviews: 0,
        fiveStarCount: 0,
        fiveStarPercentage: 0,
        repliedCount: 0,
        responseRate: 0,
        totalHelpful: 0,
        reviewsThisMonth: 0,
        reviewsLastMonth: 0,
        helpfulThisWeek: 0,
      },
      isLoading: false,
      isSubmittingReply: false,
      isFlagging: false,
      isMarkingHelpful: false,
      lastFetchTime: null, // ✅ ADD THIS
      cacheTimeout: 5 * 60 * 1000,
    });
  },
}));
