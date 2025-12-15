// src/stores/useBookingCreateStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import bookingApi from "../api/bookingApi";
import toast from "react-hot-toast";

export const useBookingCreateStore = create(
  devtools((set, get) => ({
    // === STATE ===
    artisan: null,
    service: null,
    formData: {
      serviceType: "",
      subService: "",
      description: "",
      selectedServiceId: "",
      urgency: "normal",
      location: { address: "", city: "Lagos", state: "Lagos", landmark: "" },
      contactPhone: "",
      alternatePhone: "",
      specialInstructions: "",
    },
    selectedDate: "",
    selectedTime: "",
    uploadedFiles: [],
    bookingId: null,
    timeLeft: 120,
    bookingStatus: "draft",
    negotiation: { rounds: [], isOpen: false },
    loading: false,
    error: null, // ← NEW

    // === ACTIONS ===
    setArtisan: (artisan) => set({ artisan }),
    setService: (service) => set({ service }),
    updateForm: (updates) =>
      set((state) => ({ formData: { ...state.formData, ...updates } })),
    setDate: (date) => set({ selectedDate: date }),
    setTime: (time) => set({ selectedTime: time }),
    addFiles: (files) =>
      set((state) => ({
        uploadedFiles: [...state.uploadedFiles, ...files].slice(0, 5),
      })),
    removeFile: (index) =>
      set((state) => ({
        uploadedFiles: state.uploadedFiles.filter((_, i) => i !== index),
      })),
    setError: (msg) => set({ error: msg }),
    clearError: () => set({ error: null }),

    // === UPLOAD PHOTOS ===
    // === UPLOAD PHOTOS ===
    // === UPLOAD PHOTOS ===
    uploadPhotos: async () => {
      const { uploadedFiles, setError } = get();

      if (uploadedFiles.length === 0) return [];

      try {
        const formData = new FormData();
        uploadedFiles.forEach((fileObj) => {
          formData.append("photos", fileObj.file);
        });

        const res = await bookingApi.uploadPhotos(formData);

        if (res.data && res.data.data && Array.isArray(res.data.data)) {
          return res.data.data; // [{url, publicId}, ...]
        }
        return [];
      } catch (err) {
        const msg = err.response?.data?.message || "Failed to upload photos";
        console.error("Photo upload error:", err);
        setError(msg);
        toast.error(msg);
        throw err;
      }
    },

    // === CREATE BOOKING ===
    createBooking: async () => {
      const state = get();
      if (state.loading) return;

      set({ loading: true, error: null });

      const toastId = "booking-create"; // Single consistent ID

      try {
        // Step 1: Upload photos
        toast.loading("Uploading photos...", { id: toastId });
        const photoUrls = await state.uploadPhotos();

        // Step 2: Create booking
        toast.loading("Creating booking...", { id: toastId });

        const serviceId = state.formData.selectedServiceId;
        if (!serviceId) throw new Error("No service selected");

        const selectedService = state.artisan.services?.find(
          (s) => s._id === serviceId
        );
        if (!selectedService) throw new Error("Selected service not found");

        const payload = {
          artisanId: state.artisan._id,
          serviceId,
          description: state.formData.description,
          photos: photoUrls,
          location: {
            address: state.formData.location.address,
            city: state.formData.location.city,
            state: state.formData.location.state,
            landmark: state.formData.location.landmark,
          },
          scheduledDate: state.selectedDate,
          scheduledTime: state.selectedTime,
          urgency: state.formData.urgency || "normal",
        };

        console.log("📤 BOOKING PAYLOAD:", payload);

        const res = await bookingApi.createBooking(payload);
        const booking = res.data.data;

        // ✅ Dismiss loading toast before showing success
        toast.dismiss(toastId);

        // ✅ Show success toast
        toast.success("Booking created! Artisan has 2 minutes to accept.", {
          duration: 3000,
        });

        set({
          bookingId: booking._id,
          bookingStatus: "pending",
          timeLeft: 120,
          loading: false,
        });

        get().startCountdown();
        get().startPolling();

        return booking;
      } catch (err) {
        const msg =
          err.response?.data?.message ||
          err.message ||
          "Failed to create booking";

        // ✅ Dismiss loading toast before showing error
        toast.dismiss(toastId);

        toast.error(msg, { duration: 4000 });

        set({ loading: false, error: msg });
        console.error("Booking creation error:", err);
        throw err;
      }
    },
    // === COUNTDOWN ===
    startCountdown: () => {
      const interval = setInterval(() => {
        set((state) => {
          if (state.timeLeft <= 0) {
            clearInterval(interval);
            get().cancelBooking();
            return { timeLeft: 0, bookingStatus: "expired" };
          }
          return { timeLeft: state.timeLeft - 1 };
        });
      }, 1000);
    },

    // === POLLING ===
    startPolling: () => {
      const { bookingId } = get();
      let pollCount = 0;
      const maxPolls = 40; // 2 minutes / 3 seconds = 40 polls

      const interval = setInterval(async () => {
        pollCount++;

        // Stop polling after timeout
        if (pollCount >= maxPolls) {
          clearInterval(interval);
          return;
        }

        try {
          const res = await bookingApi.getBooking(bookingId);
          const booking = res.data.data;

          set({ bookingStatus: booking.status });

          // Handle negotiation
          if (booking.status === "negotiating") {
            const negRes = await bookingApi.getNegotiation(bookingId);
            set({
              negotiation: {
                rounds: negRes.data.rounds || negRes.data.data?.rounds || [],
                isOpen: true,
              },
            });
          }

          // Stop polling on terminal states
          if (
            ["accepted", "declined", "cancelled", "expired"].includes(
              booking.status
            )
          ) {
            clearInterval(interval);

            if (booking.status === "accepted") {
              toast.success("Artisan accepted! Proceed to payment.");
            } else if (booking.status === "declined") {
              toast.error("Artisan declined your booking.");
            } else if (booking.status === "expired") {
              toast.error("Booking expired - no response from artisan.");
            }
          }
        } catch (err) {
          console.error("Polling error:", err);
          // Don't stop polling on transient errors
        }
      }, 3000);
    },

    // === NEGOTIATION ACTIONS ===
    counterOffer: async (amount, message) => {
      const { bookingId } = get();
      try {
        await bookingApi.counterOffer(bookingId, {
          counterPrice: amount,
          message,
        });
        toast.success("Counter-offer sent!");
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Failed to send counter-offer"
        );
      }
    },

    acceptPrice: async () => {
      const { bookingId } = get();
      try {
        await bookingApi.acceptNegotiatedPrice(bookingId);
        set({
          bookingStatus: "accepted",
          negotiation: { ...get().negotiation, isOpen: false },
        });
        toast.success("Price accepted! Proceed to payment.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to accept price");
      }
    },

    rejectNegotiation: async () => {
      const { bookingId } = get();
      try {
        await bookingApi.rejectNegotiation(bookingId);
        set({
          bookingStatus: "declined",
          negotiation: { ...get().negotiation, isOpen: false },
        });
        toast.error("Negotiation rejected.");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to reject");
      }
    },

    cancelBooking: async () => {
      const { bookingId } = get();
      if (!bookingId) return;
      try {
        await bookingApi.cancelBooking(bookingId);
        set({ bookingStatus: "cancelled" });
        toast.success("Booking cancelled");
      } catch (err) {
        toast.error(err.response?.data?.message || "Failed to cancel");
      }
    },

    reset: () =>
      set({
        artisan: null,
        service: null,
        formData: {
          serviceType: "",
          subService: "",
          description: "",
          selectedServiceId: "",
          urgency: "normal",
          location: {
            address: "",
            city: "Lagos",
            state: "Lagos",
            landmark: "",
          },
          contactPhone: "",
          alternatePhone: "",
          specialInstructions: "",
        },
        selectedDate: "",
        selectedTime: "",
        uploadedFiles: [],
        bookingId: null,
        timeLeft: 120,
        bookingStatus: "draft",
        negotiation: { rounds: [], isOpen: false },
        loading: false,
        error: null,
      }),

    calculatePrice: () => {
      const { artisan, formData } = get();

      console.log("🔍 CALCULATE PRICE - Artisan:", artisan);
      console.log(
        "🔍 CALCULATE PRICE - Selected Service ID:",
        formData.selectedServiceId
      );

      if (!artisan || !formData.selectedServiceId) {
        return { basePrice: 0, platformFee: 0, total: 0 };
      }

      const service = artisan.services?.find(
        (s) => s._id === formData.selectedServiceId
      );

      console.log("🔍 CALCULATE PRICE - Found Service:", service);

      // ✅ FIXED: Services are now flat, not nested
      if (!service) return { basePrice: 0, platformFee: 0, total: 0 };

      // ✅ FIXED: Access pricingModel and pricingConfig directly (not service.service)
      const pricingModel = service.pricingModel;
      const pricingConfig =
        service.customPricingConfig || service.pricingConfig;

      console.log("🔍 PRICING MODEL:", pricingModel);
      console.log("🔍 PRICING CONFIG:", pricingConfig);

      let base = 0;

      // Handle pricing models
      switch (pricingModel) {
        case "simple_fixed":
          base = pricingConfig?.basePrice || 0;
          break;
        case "inspection_required":
          base = pricingConfig?.inspectionFee || 0;
          break;
        case "hourly":
          base = pricingConfig?.hourlyRate || 0;
          break;
        case "range":
          base = pricingConfig?.priceRange?.min || 0;
          break;
        default:
          base = 0;
      }

      console.log("🔍 BASE PRICE BEFORE URGENCY:", base);

      // Apply urgency multiplier
      if (formData.urgency === "urgent") {
        base = base * 1.3;
      } else if (formData.urgency === "emergency") {
        base = base * 1.5;
      }

      const platformFee = Math.round(base * 0.05);
      const result = {
        basePrice: Math.round(base),
        platformFee,
        total: Math.round(base + platformFee),
      };

      console.log("✅ FINAL PRICE CALCULATION:", result);

      return result;
    },
  }))
);
