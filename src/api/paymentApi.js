// frontend/api/paymentApi.js
import api from "./authApi";

const paymentApi = {
  // Initialize payment
  initializePayment: (bookingId) =>
    api.post("/payments/initialize", { bookingId }),

  // Verify payment
  verifyPayment: (reference) => api.get(`/payments/verify/${reference}`),

  // Get payment details
  getPayment: (paymentId) => api.get(`/payments/${paymentId}`),

  // Get escrow details
  getEscrow: (bookingId) => api.get(`/payments/escrow/${bookingId}`),

  // Release escrow (customer confirms job completion)
  releaseEscrow: (bookingId) =>
    api.post(`/payments/escrow/${bookingId}/release`),

  // Request refund
  requestRefund: (bookingId, reason) =>
    api.post(`/payments/escrow/${bookingId}/refund`, { reason }),
};

export default paymentApi;