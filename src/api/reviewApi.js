import api from "./authApi";

export const reviewApi = {
  // ========== CREATE & MANAGE REVIEWS ==========

  // Create a review for a booking
  createReview: async (bookingId, data) => {
    const response = await api.post(`/reviews/${bookingId}`, data);
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, data) => {
    const response = await api.put(`/reviews/${reviewId}`, data);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/reviews/${reviewId}`);
    return response.data;
  },

  // ========== RESPOND TO REVIEWS ==========

  // Respond to a review (artisan responds to customer review)
  respondToReview: async (reviewId, responseText) => {
    const response = await api.post(`/reviews/${reviewId}/respond`, {
      responseText,
    });
    return response.data;
  },

  // ========== MARK HELPFUL ==========

  // Mark review as helpful or not helpful
  markReviewHelpful: async (reviewId, isHelpful) => {
    const response = await api.post(`/reviews/${reviewId}/helpful`, {
      isHelpful,
    });
    return response.data;
  },

  // ========== FLAG REVIEW ==========

  // Flag a review for moderation
  flagReview: async (reviewId, reason) => {
    const response = await api.post(`/reviews/${reviewId}/flag`, {
      reason,
    });
    return response.data;
  },

  // ========== GET REVIEWS ==========

  // Get reviews for a specific artisan (PUBLIC)
  getArtisanReviews: async (artisanId, params = {}) => {
    const response = await api.get(`/reviews/artisan/${artisanId}`, {
      params,
    });
    return response.data;
  },

  // Get customer's reviews (reviews they've written)
  getCustomerReviews: async () => {
    const response = await api.get("/reviews/customer/my-reviews");
    return response.data;
  },

  // Get reviews received by artisan (PROTECTED - must be logged in as artisan)
  getArtisanReceivedReviews: async (params = {}) => {
    const response = await api.get("/reviews/artisan/received", { params });
    return response.data;
  },
  getReviewStats: async (artisanId) => {
    const response = await api.get(`/reviews/artisan/${artisanId}/stats`);
    return response.data;
  },
};

export default reviewApi;
