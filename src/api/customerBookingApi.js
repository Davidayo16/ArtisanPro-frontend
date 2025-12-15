// frontend/api/customerBookingApi.js
import api from "./authApi";

const customerBookingApi = {
  // ========== CUSTOMER BOOKING ACTIONS ==========

  // Get all customer's bookings (with filters)
  getMyBookings: ({ status, page = 1, limit = 10, search = "", signal }) =>
    api.get("/bookings/customer/my-bookings", {
      params: { status, page, limit, search },
      signal,
    }),

  // Get single booking details (full populate)
  getBooking: (id) => api.get(`/bookings/${id}`),

  // Cancel booking
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),

  // ========== NEGOTIATION (Customer Side) ==========

  // Send counter-offer to artisan's proposed price
  counterOffer: (id, { counterPrice, message }) =>
    api.post(`/bookings/${id}/counter-offer`, { counterPrice, message }),

  // Accept artisan's negotiated price
  acceptNegotiatedPrice: (id) => api.post(`/bookings/${id}/accept-price`),

  // Reject negotiation (decline artisan's offer)
  rejectNegotiation: (id) => api.post(`/bookings/${id}/reject-negotiation`),

  // Get negotiation history
  getNegotiation: (id) => api.get(`/bookings/${id}/negotiation`),

  // ========== STATS ==========

  // Get customer booking stats (pending, active, completed counts)
  getStats: async () => {
    const response = await api.get("/bookings/customer/stats");
    return response;
  },

  // ========== CREATE BOOKING ==========

  // Create new booking
  createBooking: (data) => api.post("/bookings", data),

  // Upload booking photos
  uploadPhotos: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });
    return api.post("/upload/booking-photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default customerBookingApi;
