// frontend/stores/paymentStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import paymentApi from "../api/paymentApi";
import bookingApi from "../api/bookingApi";
import toast from "react-hot-toast";

export const usePaymentStore = create(
  devtools((set, get) => ({
    // === STATE ===
    payment: null,
    escrow: null,
    loading: false,
    error: null,
    verificationStatus: null, // 'verifying' | 'success' | 'failed'

    // ✅ NEW: SSE verification steps
    steps: [
      { id: 1, message: "Verifying payment...", status: "pending" },
      { id: 2, message: "Confirming booking...", status: "pending" },
      { id: 3, message: "Finalizing setup...", status: "pending" },
    ],

    // === INITIALIZE PAYMENT ===
    initializePayment: async (bookingId) => {
      if (!bookingId || bookingId === "undefined" || bookingId === "null") {
        const errorMsg = "Invalid booking ID provided";
        console.error("Initialize payment error:", { bookingId });
        toast.error(errorMsg, {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ error: errorMsg, loading: false });
        throw new Error(errorMsg);
      }

      set({ loading: true, error: null });
      try {
        console.log("Initializing payment for booking:", bookingId);
        const res = await paymentApi.initializePayment(bookingId);

        console.log("Payment API response:", res);
        console.log("Payment data:", res.data);

        const authUrl =
          res.data?.data?.authorization_url || res.data?.authorization_url;

        if (authUrl) {
          console.log("Redirecting to Paystack:", authUrl);
          window.location.href = authUrl;
        } else {
          console.error("No authorization URL in response:", res.data);
          throw new Error("No authorization URL received from payment gateway");
        }
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to initialize payment";
        console.error("Payment initialization error:", err);
        toast.error(msg, {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ error: msg, loading: false });
        throw err;
      }
    },

    // ✅ NEW: SSE Stream Verification
    verifyPaymentStream: (reference) => {
      if (!reference || reference === "undefined" || reference === "null") {
        const errorMsg = "Invalid payment reference";
        console.error("Verify payment error:", { reference });
        set({ error: errorMsg, verificationStatus: "failed", loading: false });
        throw new Error(errorMsg);
      }

      set({
        verificationStatus: "verifying",
        error: null,
        loading: true,
        steps: [
          { id: 1, message: "Verifying payment...", status: "loading" },
          { id: 2, message: "Confirming booking...", status: "pending" },
          { id: 3, message: "Finalizing setup...", status: "pending" },
        ],
      });

      return new Promise((resolve, reject) => {
        paymentApi.verifyPaymentStream(reference, {
          // ✅ onProgress: Update steps in real-time
          onProgress: (data) => {
            console.log("📨 Progress:", data);

            set((state) => ({
              steps: state.steps.map((step) =>
                step.id === data.step
                  ? { ...step, message: data.message, status: data.status }
                  : step
              ),
            }));
          },

          // ✅ onComplete: Fetch full booking and resolve
          onComplete: async (data) => {
            console.log("✅ Complete:", data);

            // Fetch full booking details if needed
            let fullBooking = data.booking;

            if (fullBooking && !fullBooking.artisan) {
              try {
                const bookingId = fullBooking._id || fullBooking.id;
                const res = await bookingApi.getBooking(bookingId);
                fullBooking = res.data.data || res.data;
              } catch (err) {
                console.error("Failed to fetch full booking:", err);
              }
            }

            set({
              verificationStatus: "success",
              payment: data.payment,
              loading: false,
              steps: [
                { id: 1, message: "Payment verified", status: "success" },
                { id: 2, message: "Booking confirmed", status: "success" },
                { id: 3, message: "Setup complete", status: "success" },
              ],
            });

            // ✅ DON'T show toast here - let the success page handle it
            // toast.success("Payment successful!", { ... });

            resolve({ payment: data.payment, booking: fullBooking });
          },

          // ✅ onError: Handle errors
          onError: (data) => {
            console.error("❌ Error:", data);

            set({
              verificationStatus: "failed",
              error: data.message || "Payment verification failed",
              loading: false,
            });

            toast.error(data.message || "Payment verification failed", {
              duration: 5000,
              style: {
                background: "#dc2626",
                color: "#fff",
                padding: "16px",
                borderRadius: "12px",
                fontWeight: "600",
              },
            });

            reject(new Error(data.message || "Payment verification failed"));
          },
        });
      });
    },

    // === ORIGINAL VERIFY PAYMENT (Fallback) ===
    verifyPayment: async (reference) => {
      if (!reference || reference === "undefined" || reference === "null") {
        const errorMsg = "Invalid payment reference";
        console.error("Verify payment error:", { reference });
        set({ error: errorMsg, verificationStatus: "failed", loading: false });
        throw new Error(errorMsg);
      }

      set({ verificationStatus: "verifying", error: null, loading: true });
      try {
        console.log("Verifying payment reference:", reference);
        const res = await paymentApi.verifyPayment(reference);

        set({
          payment: res.data.payment,
          verificationStatus: "success",
          loading: false,
        });

        toast.success("Payment successful!", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });

        return res.data;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Payment verification failed";
        console.error("Payment verification error:", err);
        toast.error(msg, {
          duration: 5000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({
          error: msg,
          verificationStatus: "failed",
          loading: false,
        });
        throw err;
      }
    },

    // === GET PAYMENT DETAILS ===
    getPayment: async (paymentId) => {
      if (!paymentId || paymentId === "undefined" || paymentId === "null") {
        console.error("Invalid payment ID:", paymentId);
        return null;
      }

      set({ loading: true, error: null });
      try {
        const res = await paymentApi.getPayment(paymentId);
        set({ payment: res.data, loading: false });
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch payment";
        console.error("Get payment error:", err);
        set({ error: msg, loading: false });
        throw err;
      }
    },

    // === GET ESCROW DETAILS ===
    getEscrow: async (bookingId) => {
      if (!bookingId || bookingId === "undefined" || bookingId === "null") {
        console.error("Invalid booking ID for escrow:", bookingId);
        return null;
      }

      set({ loading: true, error: null });
      try {
        const res = await paymentApi.getEscrow(bookingId);
        set({ escrow: res.data, loading: false });
        return res.data;
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to fetch escrow";
        console.error("Get escrow error:", err);
        set({ error: msg, loading: false });
        throw err;
      }
    },

    // === RELEASE ESCROW ===
    releaseEscrow: async (bookingId) => {
      if (!bookingId || bookingId === "undefined" || bookingId === "null") {
        toast.error("Invalid booking ID", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        await paymentApi.releaseEscrow(bookingId);
        toast.success("Payment released to artisan!", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ loading: false });

        await get().getEscrow(bookingId);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to release payment";
        console.error("Release escrow error:", err);
        toast.error(msg, {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ error: msg, loading: false });
        throw err;
      }
    },

    // === REQUEST REFUND ===
    requestRefund: async (bookingId, reason) => {
      if (!bookingId || bookingId === "undefined" || bookingId === "null") {
        toast.error("Invalid booking ID", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        return;
      }

      if (!reason || !reason.trim()) {
        toast.error("Please provide a reason for refund", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        return;
      }

      set({ loading: true, error: null });
      try {
        await paymentApi.requestRefund(bookingId, reason);
        toast.success("Refund request submitted!", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ loading: false });

        await get().getEscrow(bookingId);
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to request refund";
        console.error("Request refund error:", err);
        toast.error(msg, {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        set({ error: msg, loading: false });
        throw err;
      }
    },

    // === RESET STATE ===
    reset: () =>
      set({
        payment: null,
        escrow: null,
        loading: false,
        error: null,
        verificationStatus: null,
        steps: [
          { id: 1, message: "Verifying payment...", status: "pending" },
          { id: 2, message: "Confirming booking...", status: "pending" },
          { id: 3, message: "Finalizing setup...", status: "pending" },
        ],
      }),
  }))
);
