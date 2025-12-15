// frontend/stores/paymentStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import paymentApi from "../api/paymentApi";
import toast from "react-hot-toast";

export const usePaymentStore = create(
  devtools((set, get) => ({
    // === STATE ===
    payment: null,
    escrow: null,
    loading: false,
    error: null,
    verificationStatus: null, // 'verifying' | 'success' | 'failed'

    // === INITIALIZE PAYMENT ===
    initializePayment: async (bookingId) => {
      // Validate bookingId before making API call
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

        // Handle different response structures
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

    // === VERIFY PAYMENT ===
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
      }),
  }))
);
