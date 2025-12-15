// frontend/stores/bookingStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import bookingApi from "../api/bookingApi";
import toast from "react-hot-toast";
import { useNotificationStore } from "./notificationStore";

export const useBookingStore = create(
  devtools((set, get) => ({
    // === DATA ===
    bookings: [],
    stats: { pending: 0, active: 0, completed: 0, total: 0 }, // ✅ ADD THIS
    loading: false,
    actionLoading: false,
    error: null,
    pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    selectedBooking: null,
    lastFetchTime: null, // For cache invalidation

    // === MODAL STATES ===
    showProposeModal: false,
    showDeclineModal: false,
    showNegotiation: false,
    declineReason: "",
    proposeAmount: "",
    proposeMessage: "",

    // === SETTERS ===
    setSelected: (booking) => set({ selectedBooking: booking }),
    setProposeAmount: (amount) => set({ proposeAmount: amount }),
    setProposeMessage: (message) => set({ proposeMessage: message }),

    // === OPTIMIZED FETCH BOOKINGS ===
    fetchBookings: async ({
      status, // ✅ Now passed to backend
      page = 1,
      limit = 10,
      search = "",
      signal,
    }) => {
      set({ loading: true, error: null });

      try {
        const res = await bookingApi.getMyBookings({
          status, // ✅ Backend filters now
          page,
          limit,
          search,
          signal,
        });

        // Store fetch time for cache optimization
        set({
          bookings: res.data.bookings || [],
          pagination: res.data.pagination || {
            page: page,
            total: 0,
            pages: 0,
            limit: limit,
          },
          loading: false,
          lastFetchTime: Date.now(),
        });

        // Log performance (remove in production)
        if (res.data._performance) {
          console.log("📊 Query Performance:", res.data._performance);
        }
      } catch (err) {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          return;
        }
        set({
          error: err.response?.data?.message || "Failed to load jobs",
          loading: false,
        });
      }
    },
    // === FETCH STATS (Separate from bookings) ===
    // === FETCH STATS (Separate from bookings) ===
    fetchStats: async () => {
      try {
        console.log("📊 Fetching stats from API...");

        const res = await bookingApi.getStats();

        console.log("📊 Stats API response:", res.data);

        // ✅ Transform statusCounts array into counts object
        const statusCounts = res.data.stats.statusCounts || [];

        // Count by status
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
        });
      } catch (err) {
        console.error("❌ Failed to fetch stats:", err);
      }
    },

    // === REFRESH (Smart cache invalidation) ===
    refresh: async () => {
      const { pagination, fetchBookings } = get();
      await fetchBookings({
        status: undefined,
        page: pagination.page,
        limit: pagination.limit,
      });
    },

    // === MODAL CONTROLS ===
    openPropose: (booking) =>
      set({
        selectedBooking: booking,
        showProposeModal: true,
        proposeAmount: "",
        proposeMessage: "",
      }),
    closePropose: () =>
      set({
        showProposeModal: false,
        selectedBooking: null,
        proposeAmount: "",
        proposeMessage: "",
      }),
    openDecline: (booking) =>
      set({
        selectedBooking: booking,
        showDeclineModal: true,
        declineReason: "",
      }),
    closeDecline: () =>
      set({
        showDeclineModal: false,
        selectedBooking: null,
        declineReason: "",
      }),
    openNegotiation: (booking) =>
      set({ selectedBooking: booking, showNegotiation: true }),
    closeNegotiation: () =>
      set({ showNegotiation: false, selectedBooking: null }),
    setDeclineReason: (reason) => set({ declineReason: reason }),

    // === JOB ACTIONS (Optimized with refresh) ===
    accept: async (bookingId) => {
      if (!bookingId) {
        toast.error("No booking selected");
        return;
      }

      set({ actionLoading: true });
      try {
        await bookingApi.acceptBooking(bookingId);
        toast.success("Booking accepted!");

        // Refresh notifications
        useNotificationStore.getState().fetchUnreadCount();

        // ✅ Smart refresh - only refresh current view
        await get().refresh();
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to accept";
        toast.error(msg);
        set({ error: msg });
      } finally {
        set({ actionLoading: false });
      }
    },

    decline: async () => {
      const { selectedBooking, declineReason, closeDecline } = get();

      if (!selectedBooking) {
        toast.error("No booking selected");
        return;
      }

      if (!declineReason.trim()) {
        toast.error("Please provide a reason");
        return;
      }

      set({ actionLoading: true });
      try {
        // Check if it's a negotiation or regular booking
        if (selectedBooking.status === "negotiating") {
          await bookingApi.rejectNegotiation(selectedBooking._id);
          toast.success("Negotiation declined");
        } else {
          await bookingApi.declineBooking(selectedBooking._id, declineReason);
          toast.success("Booking declined");
        }

        closeDecline();

        // Refresh notifications
        useNotificationStore.getState().fetchUnreadCount();

        // ✅ Smart refresh
        await get().refresh();
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to decline";
        toast.error(msg);
        set({ error: msg });
      } finally {
        set({ actionLoading: false });
      }
    },

    proposePrice: async () => {
      const { selectedBooking, proposeAmount, proposeMessage, closePropose } =
        get();

      if (!selectedBooking) return;

      const amount = parseFloat(proposeAmount);

      if (!proposeAmount || proposeAmount.trim() === "") {
        toast.error("Please enter an amount");
        return;
      }

      if (isNaN(amount) || amount <= 0) {
        toast.error("Please enter a valid amount");
        return;
      }

      set({ actionLoading: true });

      try {
        await bookingApi.proposePrice(
          selectedBooking._id,
          amount,
          proposeMessage
        );

        toast.success("Price proposal sent!");
        closePropose();
        set({ proposeAmount: "", proposeMessage: "" });

        // ✅ Smart refresh
        await get().refresh();
      } catch (err) {
        console.error("❌ Propose price error:", err);
        const errorMsg =
          err.response?.data?.message || "Failed to send proposal";
        toast.error(errorMsg);
      } finally {
        set({ actionLoading: false });
      }
    },

    acceptCounterOffer: async (bookingId) => {
      set({ actionLoading: true });
      try {
        await bookingApi.acceptNegotiatedPrice(bookingId);

        toast.success("Counter-offer accepted!", {
          duration: 3000,
          style: {
            background: "#16a34a",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });

        // ✅ Smart refresh
        await get().refresh();
      } catch (err) {
        console.error("Accept counter error:", err);
        toast.error(
          err.response?.data?.message || "Failed to accept counter-offer",
          {
            duration: 3000,
            style: {
              background: "#dc2626",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              fontWeight: "600",
            },
          }
        );
      } finally {
        set({ actionLoading: false });
      }
    },

    startJob: async (bookingId) => {
      if (!bookingId) {
        toast.error("No booking selected");
        return;
      }

      set({ actionLoading: true });
      try {
        await bookingApi.startJob(bookingId);
        toast.success("Job started!");

        // Refresh notifications
        useNotificationStore.getState().fetchUnreadCount();

        // ✅ Smart refresh
        await get().refresh();
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to start job";
        toast.error(msg);
        set({ error: msg });
      } finally {
        set({ actionLoading: false });
      }
    },

    completeJob: async (bookingId, payload) => {
      if (!bookingId) {
        toast.error("No booking selected");
        return;
      }

      set({ actionLoading: true });
      try {
        await bookingApi.completeJob(bookingId, payload);
        toast.success("Job completed!");

        // Refresh notifications
        useNotificationStore.getState().fetchUnreadCount();

        // ✅ Smart refresh
        await get().refresh();
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to complete job";
        toast.error(msg);
        set({ error: msg });
      } finally {
        set({ actionLoading: false });
      }
    },

    // === OPTIMISTIC UPDATES (Advanced - optional) ===
    updateBookingOptimistically: (bookingId, updates) => {
      set((state) => ({
        bookings: state.bookings.map((booking) =>
          booking._id === bookingId ? { ...booking, ...updates } : booking
        ),
      }));
    },

    // === CLEAR CACHE ===
    clearCache: () => {
      set({
        bookings: [],
        pagination: { page: 1, limit: 10, total: 0, pages: 0 },
        lastFetchTime: null,
      });
    },
  }))
);
