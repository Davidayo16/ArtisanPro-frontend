// ============================================
// 📁 frontend/stores/customerBookingStore.js
// FIXED: Force stats refresh after status changes
// ============================================

import { create } from "zustand";
import { devtools } from "zustand/middleware";
import customerBookingApi from "../api/customerBookingApi";
import toast from "react-hot-toast";

export const useCustomerBookingStore = create(
  devtools((set, get) => ({
    // === DATA ===
    bookings: [],
    stats: { pending: 0, active: 0, completed: 0, total: 0 },
    loading: false,
    actionLoading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    selectedBooking: null,
    lastFetchTime: null,
    lastStatsFetchTime: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    // === MODAL STATES ===
    showCancelModal: false,
    showCounterOfferModal: false,
    cancelReason: "",
    counterAmount: "",
    counterMessage: "",

    // === SETTERS ===
    setSelected: (booking) => set({ selectedBooking: booking }),
    setCounterAmount: (amount) => set({ counterAmount: amount }),
    setCounterMessage: (message) => set({ counterMessage: message }),
    setCancelReason: (reason) => set({ cancelReason: reason }),

    // 🔥 SIMPLIFIED: Fetch bookings (like artisan store)
    fetchBookings: async ({
      status,
      page = 1,
      limit = 10,
      search = "",
      signal,
    }) => {
      set({ loading: true, error: null });

      try {
        const res = await customerBookingApi.getMyBookings({
          status,
          page,
          limit,
          search,
          signal,
        });

        set({
          bookings: res.data.data || [],
          pagination: {
            page: res.data.page || page,
            total: res.data.total || 0,
            pages: res.data.pages || 0,
            limit: limit,
          },
          loading: false,
          error: null,
        });

        console.log("✅ Customer bookings fetched:", res.data);
      } catch (err) {
        // Skip if request was aborted
        if (err.name === "AbortError" || err.name === "CanceledError") {
          set({ loading: false });
          return;
        }

        // Skip if auth redirect
        if (err.isAuthRedirect) {
          set({ loading: false });
          return;
        }

        console.error("❌ Fetch bookings error:", err);

        set({
          error: err.response?.data?.message || "Failed to load bookings",
          loading: false,
        });
      }
    },

    // 🔥 OPTIMIZED: Fetch stats with caching
    fetchStats: async (forceRefresh = false) => {
      const state = get();
      const now = Date.now();

      // ✅ Better cache check - separate cache time for stats
      const statsCacheTimeout = 10 * 60 * 1000;
      const lastStatsFetch = state.lastStatsFetchTime || 0;

      if (
        !forceRefresh &&
        lastStatsFetch &&
        now - lastStatsFetch < statsCacheTimeout &&
        state.stats.total > 0 // Only use cache if we have data
      ) {
        console.log("📦 Using cached stats");
        return;
      }

      try {
        console.log("📊 Fetching customer stats...");

        const res = await customerBookingApi.getStats();

        console.log("📊 Stats API response:", res.data);

        const statusCounts = res.data.stats?.statusCounts || [];

        let pending = 0;
        let active = 0;
        let completed = 0;
        let total = 0;

        statusCounts.forEach((item) => {
          const status = item._id;
          const count = item.count;

          total += count;

          if (status === "pending") {
            pending = count;
          } else if (
            ["accepted", "confirmed", "in_progress", "negotiating"].includes(
              status
            )
          ) {
            active += count;
          } else if (status === "completed") {
            completed = count;
          }
        });

        console.log("📊 Processed stats:", {
          pending,
          active,
          completed,
          total,
        });

        set({
          stats: {
            pending,
            active,
            completed,
            total,
          },
          lastStatsFetchTime: now,
        });
      } catch (err) {
        if (err.isAuthRedirect) return;
        console.error("❌ Failed to fetch stats:", err);
      }
    },

    // 🔥 NEW: Force refresh stats (bypass cache)
    forceRefreshStats: async () => {
      console.log("🔄 Force refreshing stats...");
      set({ lastStatsFetchTime: null }); // Clear cache timestamp
      await get().fetchStats(true); // Force fetch
    },

    // === REFRESH ===
    refresh: async () => {
      const { pagination } = get();

      // ✅ Fetch bookings AND stats in parallel (both force refresh)
      await Promise.all([
        get().fetchBookings({
          status: undefined,
          page: pagination.page,
          limit: pagination.limit,
          forceRefresh: true,
        }),
        get().forceRefreshStats(), // ✅ USE NEW FORCE REFRESH
      ]);
    },

    // === MODAL CONTROLS ===
    openCancel: (booking) =>
      set({
        selectedBooking: booking,
        showCancelModal: true,
        cancelReason: "",
      }),
    closeCancel: () =>
      set({
        showCancelModal: false,
        selectedBooking: null,
        cancelReason: "",
      }),

    openCounterOffer: (booking) =>
      set({
        selectedBooking: booking,
        showCounterOfferModal: true,
        counterAmount: "",
        counterMessage: "",
      }),
    closeCounterOffer: () =>
      set({
        showCounterOfferModal: false,
        selectedBooking: null,
        counterAmount: "",
        counterMessage: "",
      }),

    // 🔥 OPTIMISTIC: Cancel booking
    cancelBooking: async () => {
      const { selectedBooking, cancelReason, closeCancel } = get();

      if (!selectedBooking) {
        toast.error("No booking selected");
        return;
      }

      if (!cancelReason.trim()) {
        toast.error("Please provide a reason for cancellation");
        return;
      }

      // 1. Store old booking for rollback
      const oldBooking = selectedBooking;

      // 2. Update UI immediately (optimistic)
      set((state) => ({
        bookings: state.bookings.map((b) =>
          b._id === selectedBooking._id
            ? { ...b, status: "cancelled", cancelledAt: new Date() }
            : b
        ),
        actionLoading: true,
      }));

      closeCancel();

      try {
        await customerBookingApi.cancelBooking(
          selectedBooking._id,
          cancelReason
        );

        toast.success("Booking cancelled successfully");

        // ✅ Refresh to get updated data
        await get().refresh();
      } catch (err) {
        // 3. Rollback on error
        set((state) => ({
          bookings: state.bookings.map((b) =>
            b._id === selectedBooking._id ? oldBooking : b
          ),
        }));

        const msg = err.response?.data?.message || "Failed to cancel booking";
        toast.error(msg);
        console.error("❌ Cancel booking error:", err);
      } finally {
        set({ actionLoading: false });
      }
    },

    // 🔥 OPTIMISTIC: Counter offer
    sendCounterOffer: async () => {
      const {
        selectedBooking,
        counterAmount,
        counterMessage,
        closeCounterOffer,
      } = get();

      if (!selectedBooking) {
        toast.error("No booking selected");
        return;
      }

      const amount = parseFloat(counterAmount);

      if (!counterAmount || counterAmount.trim() === "") {
        toast.error("Please enter an amount");
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      set({ actionLoading: true });

      try {
        await customerBookingApi.counterOffer(selectedBooking._id, {
          counterPrice: amount,
          message: counterMessage,
        });

        toast.success("Counter-offer sent!", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });

        closeCounterOffer();

        // ✅ FORCE REFRESH (includes stats)
        await get().refresh();
      } catch (err) {
        const msg =
          err.response?.data?.message || "Failed to send counter-offer";
        toast.error(msg);
        console.error("❌ Counter offer error:", err);
      } finally {
        set({ actionLoading: false });
      }
    },

    // === ACCEPT NEGOTIATED PRICE ===
    acceptNegotiatedPrice: async (bookingId) => {
      if (!bookingId) {
        toast.error("No booking selected");
        return;
      }

      set({ actionLoading: true });

      try {
        await customerBookingApi.acceptNegotiatedPrice(bookingId);

        toast.success("Price accepted! Redirecting to payment...", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });

        // ✅ FORCE REFRESH (includes stats)
        await get().refresh();
      } catch (err) {
        const msg =
          err.response?.data?.message || "Failed to accept negotiated price";
        toast.error(msg);
        console.error("❌ Accept price error:", err);
      } finally {
        set({ actionLoading: false });
      }
    },

    // === REJECT NEGOTIATION ===
    rejectNegotiation: async (bookingId) => {
      if (!bookingId) {
        toast.error("No booking selected");
        return;
      }

      set({ actionLoading: true });

      try {
        await customerBookingApi.rejectNegotiation(bookingId);

        toast.error("Negotiation rejected", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });

        // ✅ FORCE REFRESH (includes stats)
        await get().refresh();
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to reject offer";
        toast.error(msg);
        console.error("❌ Reject negotiation error:", err);
      } finally {
        set({ actionLoading: false });
      }
    },

    // === CLEAR CACHE ===
    clearCache: () => {
      set({
        bookings: [],
        stats: { pending: 0, active: 0, completed: 0, total: 0 },
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        lastFetchTime: null,
        lastStatsFetchTime: null,
      });
    },
  }))
);
