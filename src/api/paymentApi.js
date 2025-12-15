// frontend/api/paymentApi.js
import api from "./authApi";

const paymentApi = {
  // Initialize payment
  initializePayment: (bookingId) =>
    api.post("/payments/initialize", { bookingId }),

  // ✅ NEW: SSE Stream verification
  // In paymentApi.js - verifyPaymentStream function
  verifyPaymentStream: (reference, callbacks) => {
    const token = localStorage.getItem("token");
    // ✅ FIX: Vite uses import.meta.env
    const apiUrl =
      import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

    let buffer = "";

    fetch(`${apiUrl}/payments/verify-stream/${reference}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Stream connection failed");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        const processStream = ({ done, value }) => {
          if (done) return;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.trim() === "") continue;

            const eventMatch = line.match(/^event: (.+)$/m);
            const dataMatch = line.match(/^data: (.+)$/m);

            if (eventMatch && dataMatch) {
              const event = eventMatch[1];
              const data = JSON.parse(dataMatch[1]);

              if (event === "progress" && callbacks.onProgress) {
                callbacks.onProgress(data);
              } else if (event === "complete" && callbacks.onComplete) {
                callbacks.onComplete(data);
              } else if (event === "error" && callbacks.onError) {
                callbacks.onError(data);
              }
            }
          }

          reader.read().then(processStream);
        };

        reader.read().then(processStream);
      })
      .catch((error) => {
        if (callbacks.onError) {
          callbacks.onError({ message: error.message });
        }
      });
  },

  // Original verify payment (keep as fallback)
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
