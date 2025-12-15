import axios from "axios";
import api from "./authApi";

const bookingApi = {
  // Fetch artisan's bookings
  createBooking: (data) => api.post("/bookings", data),
  getStats: async () => {
    const response = await api.get("/bookings/artisan/stats");
    return response;
  },

  uploadPhotos: (files) => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("photos", file);
    });
    return api.post("/upload/booking-photos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  getBooking: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),

  // ========== ARTISAN ACTIONS ==========
  getMyBookings: ({ status, page = 1, limit = 10, search = "", signal }) =>
    api.get("/bookings/artisan/my-bookings", {
      params: { status, page, limit, search },
      signal,
    }),

  acceptBooking: (id) => api.put(`/bookings/${id}/accept`),

  declineBooking: (id, reason) =>
    api.put(`/bookings/${id}/decline`, { reason }),

  // ✅ FIXED: Single proposePrice that accepts amount and message as separate params
  proposePrice: (id, amount, message) =>
    api.post(`/bookings/${id}/propose-price`, {
      proposedPrice: amount,
      message, // ← FIXED: No duplicate
    }),

  startJob: (id) => api.put(`/bookings/${id}/start`),

  completeJob: (id, payload) => api.put(`/bookings/${id}/complete`, payload),

  // ========== NEGOTIATION (CUSTOMER SIDE) ==========
  counterOffer: (id, { counterPrice, message }) =>
    api.post(`/bookings/${id}/counter-offer`, { counterPrice, message }),

  acceptNegotiatedPrice: (id) => api.post(`/bookings/${id}/accept-price`),

  rejectNegotiation: (id) => api.post(`/bookings/${id}/reject-negotiation`),

  getNegotiation: (id) => api.get(`/bookings/${id}/negotiation`),
};

export default bookingApi;
