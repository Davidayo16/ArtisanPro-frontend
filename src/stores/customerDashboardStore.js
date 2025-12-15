// stores/customerDashboardStore.js
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import customerApi from "../api/customerApi";

export const useCustomerDashboardStore = create(
  devtools((set, get) => ({
    // ========== STATE ==========
    stats: {
      totalBookings: 0,
      bookingsChange: "+0%",
      activeJobs: 0,
      pendingJobs: 0,
      totalSpent: 0,
      spendingChange: "+0%",
      averageRatingGiven: 0,
      totalReviewsGiven: 0,
    },
    bookingTrends: [],
    spendingByService: [],
    upcomingBookings: [],
    recentActivity: [],

    profile: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      profilePhoto: "",
      gender: "",
      dateOfBirth: "",
      bio: "",
      address: "",
      city: "",
      state: "",
      country: "Nigeria",
      postalCode: "",
      isEmailVerified: false,
      isPhoneVerified: false,
      verified: false,
      totalBookings: 0,
      totalSpent: 0,
      averageRating: 0,
      savedArtisansCount: 0,
      memberSince: null,
      lastLogin: null,
      notificationPreferences: {
        email: true,
        sms: true,
        push: true,
      },
    },

    // ========== SAVED ARTISANS (OPTIMIZED WITH PAGINATION) ==========
    savedArtisans: [],
    savedArtisansTotal: 0,
    savedArtisansPage: 1,
    savedArtisansPages: 0,
    savedArtisansHasMore: false,
    savedArtisansLimit: 20,

    // ========== FILTERS & SORT ==========
    savedArtisansFilters: {
      category: null,
      minRating: null,
      maxDistance: null,
      search: "",
    },
    savedArtisansSortBy: "date-desc",

    isLoading: false,
    isProfileLoading: false,
    isSavedArtisansLoading: false,
    error: null,
    profileError: null,
    savedArtisansError: null,

    lastFetchTime: null,
    profileLastFetchTime: null,
    savedArtisansLastFetchTime: null,
    cacheTimeout: 5 * 60 * 1000, // 5 minutes

    // ========== DASHBOARD ACTIONS ==========

    fetchDashboard: async (forceRefresh = false) => {
      const { lastFetchTime, cacheTimeout } = get();
      const now = Date.now();

      if (
        !forceRefresh &&
        lastFetchTime &&
        now - lastFetchTime < cacheTimeout
      ) {
        console.log("📦 Using cached dashboard data");
        return;
      }

      set({ isLoading: true, error: null });

      try {
        const response = await customerApi.getDashboardOverview();

        set({
          stats: response.data.stats,
          bookingTrends: response.data.bookingTrends,
          spendingByService: response.data.spendingByService,
          upcomingBookings: response.data.upcomingBookings,
          recentActivity: response.data.recentActivity,
          isLoading: false,
          error: null,
          lastFetchTime: now,
        });

        console.log("✅ Dashboard data loaded");
      } catch (error) {
        if (error.isAuthRedirect) {
          set({ isLoading: false });
          return;
        }

        console.error("❌ Failed to fetch dashboard:", error);

        set({
          error: error.response?.data?.message || "Failed to load dashboard",
          isLoading: false,
        });
      }
    },

    fetchProfile: async (forceRefresh = false) => {
      const { profileLastFetchTime, cacheTimeout } = get();
      const now = Date.now();

      if (
        !forceRefresh &&
        profileLastFetchTime &&
        now - profileLastFetchTime < cacheTimeout
      ) {
        console.log("📦 Using cached profile data");
        return;
      }

      set({ isProfileLoading: true, profileError: null });

      try {
        const response = await customerApi.getProfile();

        set({
          profile: response.data,
          isProfileLoading: false,
          profileError: null,
          profileLastFetchTime: now,
        });

        console.log("✅ Profile data loaded");
      } catch (error) {
        if (error.isAuthRedirect) {
          set({ isProfileLoading: false });
          return;
        }

        console.error("❌ Failed to fetch profile:", error);
        set({
          profileError:
            error.response?.data?.message || "Failed to load profile",
          isProfileLoading: false,
        });
      }
    },

    updateProfile: async (profileData) => {
      set((state) => ({
        profile: {
          ...state.profile,
          ...profileData,
        },
      }));

      try {
        const response = await customerApi.updateProfile(profileData);
        console.log("✅ Profile updated");
        return { success: true, message: response.message };
      } catch (error) {
        console.error("❌ Failed to update profile:", error);
        await get().fetchProfile(true);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to update profile",
        };
      }
    },

    updateProfilePhoto: async (photoData) => {
      const oldPhoto = get().profile.profilePhoto;

      set((state) => ({
        profile: {
          ...state.profile,
          profilePhoto: photoData,
        },
      }));

      try {
        const response = await customerApi.updateProfilePhoto(photoData);

        set((state) => ({
          profile: {
            ...state.profile,
            profilePhoto: response.data.profilePhoto,
          },
        }));

        console.log("✅ Profile photo updated");
        return { success: true, message: response.message };
      } catch (error) {
        console.error("❌ Failed to update profile photo:", error);
        set((state) => ({
          profile: {
            ...state.profile,
            profilePhoto: oldPhoto,
          },
        }));
        return {
          success: false,
          message:
            error.response?.data?.message || "Failed to update profile photo",
        };
      }
    },

    changePassword: async (passwordData) => {
      try {
        const response = await customerApi.changePassword(passwordData);
        console.log("✅ Password changed");
        return { success: true, message: response.message };
      } catch (error) {
        console.error("❌ Failed to change password:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to change password",
        };
      }
    },

    updateNotificationPreferences: async (preferences) => {
      set((state) => ({
        profile: {
          ...state.profile,
          notificationPreferences: preferences,
        },
      }));

      try {
        const response = await customerApi.updateNotificationPreferences(
          preferences
        );
        console.log("✅ Notification preferences updated");
        return { success: true, message: response.message };
      } catch (error) {
        console.error("❌ Failed to update preferences:", error);
        await get().fetchProfile(true);
        return {
          success: false,
          message:
            error.response?.data?.message || "Failed to update preferences",
        };
      }
    },

    deactivateAccount: async (password) => {
      try {
        const response = await customerApi.deactivateAccount(password);
        console.log("✅ Account deactivated");
        return { success: true, message: response.message };
      } catch (error) {
        console.error("❌ Failed to deactivate account:", error);
        return {
          success: false,
          message:
            error.response?.data?.message || "Failed to deactivate account",
        };
      }
    },

    // ========== SAVED ARTISANS ACTIONS (OPTIMIZED) ==========

    /**
     * Fetch saved artisans with pagination
     * @param {Object} options
     * @param {boolean} options.forceRefresh - Skip cache
     * @param {boolean} options.append - Append to existing list (for "Load More")
     * @param {number} options.page - Specific page to load
     */
    fetchSavedArtisans: async ({
      forceRefresh = false,
      append = false,
      page = null,
    } = {}) => {
      const state = get();
      const now = Date.now();

      // Determine which page to load
      const targetPage = page || (append ? state.savedArtisansPage + 1 : 1);

      // Check cache (only for non-forced, non-append requests)
      if (
        !forceRefresh &&
        !append &&
        state.savedArtisansLastFetchTime &&
        now - state.savedArtisansLastFetchTime < state.cacheTimeout &&
        state.savedArtisans.length > 0
      ) {
        console.log("📦 Using cached saved artisans data");
        return;
      }

      set({ isSavedArtisansLoading: true, savedArtisansError: null });

      try {
        // Build query params
        const params = {
          page: targetPage,
          limit: state.savedArtisansLimit,
          sortBy: state.savedArtisansSortBy,
          ...(state.savedArtisansFilters.category && {
            category: state.savedArtisansFilters.category,
          }),
          ...(state.savedArtisansFilters.minRating && {
            minRating: state.savedArtisansFilters.minRating,
          }),
          ...(state.savedArtisansFilters.maxDistance && {
            maxDistance: state.savedArtisansFilters.maxDistance,
          }),
          ...(state.savedArtisansFilters.search && {
            search: state.savedArtisansFilters.search,
          }),
        };

        const response = await customerApi.getSavedArtisans(params);

        // Handle cancelled requests
        if (!response) {
          set({ isSavedArtisansLoading: false });
          return;
        }

        set({
          savedArtisans: append
            ? [...state.savedArtisans, ...response.data]
            : response.data,
          savedArtisansTotal: response.total,
          savedArtisansPage: response.page,
          savedArtisansPages: response.pages,
          savedArtisansHasMore: response.hasMore,
          isSavedArtisansLoading: false,
          savedArtisansError: null,
          savedArtisansLastFetchTime: now,
        });

        console.log(
          `✅ Saved artisans loaded: page ${response.page}/${response.pages}, ${response.data.length} items`
        );
      } catch (error) {
        if (error.isAuthRedirect) {
          set({ isSavedArtisansLoading: false });
          return;
        }

        console.error("❌ Failed to fetch saved artisans:", error);
        set({
          savedArtisansError:
            error.response?.data?.message || "Failed to load saved artisans",
          isSavedArtisansLoading: false,
        });
      }
    },

    /**
     * Load more artisans (pagination)
     */
    loadMoreSavedArtisans: async () => {
      const { savedArtisansHasMore, isSavedArtisansLoading } = get();

      if (!savedArtisansHasMore || isSavedArtisansLoading) {
        return;
      }

      await get().fetchSavedArtisans({ append: true });
    },

    /**
     * Update filters
     */
    setSavedArtisansFilters: async (filters) => {
      set({
        savedArtisansFilters: {
          ...get().savedArtisansFilters,
          ...filters,
        },
        savedArtisansPage: 1, // Reset to page 1
      });

      // Fetch with new filters
      await get().fetchSavedArtisans({ forceRefresh: true });
    },

    /**
     * Update sort
     */
    setSavedArtisansSortBy: async (sortBy) => {
      set({
        savedArtisansSortBy: sortBy,
        savedArtisansPage: 1, // Reset to page 1
      });

      // Fetch with new sort
      await get().fetchSavedArtisans({ forceRefresh: true });
    },

    /**
     * Search artisans (with debounce handled in component)
     */
    searchSavedArtisans: async (searchQuery) => {
      set({
        savedArtisansFilters: {
          ...get().savedArtisansFilters,
          search: searchQuery,
        },
        savedArtisansPage: 1,
      });

      await get().fetchSavedArtisans({ forceRefresh: true });
    },

    addSavedArtisan: async (artisanId) => {
      try {
        const response = await customerApi.saveArtisan(artisanId);

        // Refetch to get full artisan data
        await get().fetchSavedArtisans({ forceRefresh: true });

        console.log("✅ Artisan saved");
        return { success: true, message: "Artisan added to saved list" };
      } catch (error) {
        console.error("❌ Failed to save artisan:", error);
        return {
          success: false,
          message: error.response?.data?.message || "Failed to save artisan",
        };
      }
    },

    removeSavedArtisan: async (artisanId) => {
      const oldList = get().savedArtisans;

      // Optimistic update
      set((state) => ({
        savedArtisans: state.savedArtisans.filter((a) => a.id !== artisanId),
        savedArtisansTotal: state.savedArtisansTotal - 1,
      }));

      try {
        await customerApi.unsaveArtisan(artisanId);
        console.log("✅ Artisan removed");
        return { success: true, message: "Artisan removed from saved list" };
      } catch (error) {
        console.error("❌ Failed to remove artisan:", error);

        // Rollback on error
        set({ savedArtisans: oldList });

        return {
          success: false,
          message: error.response?.data?.message || "Failed to remove artisan",
        };
      }
    },

    // ========== GENERAL ACTIONS ==========

    refresh: async () => {
      await get().fetchDashboard(true);
    },

    refreshProfile: async () => {
      await get().fetchProfile(true);
    },

    refreshSavedArtisans: async () => {
      await get().fetchSavedArtisans({ forceRefresh: true });
    },

    clearError: () => set({ error: null }),

    clearProfileError: () => set({ profileError: null }),

    clearSavedArtisansError: () => set({ savedArtisansError: null }),

    reset: () => {
      set({
        stats: {
          totalBookings: 0,
          bookingsChange: "+0%",
          activeJobs: 0,
          pendingJobs: 0,
          totalSpent: 0,
          spendingChange: "+0%",
          averageRatingGiven: 0,
          totalReviewsGiven: 0,
        },
        bookingTrends: [],
        spendingByService: [],
        upcomingBookings: [],
        recentActivity: [],
        profile: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          profilePhoto: "",
          gender: "",
          dateOfBirth: "",
          bio: "",
          address: "",
          city: "",
          state: "",
          country: "Nigeria",
          postalCode: "",
          isEmailVerified: false,
          isPhoneVerified: false,
          verified: false,
          totalBookings: 0,
          totalSpent: 0,
          averageRating: 0,
          savedArtisansCount: 0,
          memberSince: null,
          lastLogin: null,
          notificationPreferences: {
            email: true,
            sms: true,
            push: true,
          },
        },
        savedArtisans: [],
        savedArtisansTotal: 0,
        savedArtisansPage: 1,
        savedArtisansPages: 0,
        savedArtisansHasMore: false,
        savedArtisansFilters: {
          category: null,
          minRating: null,
          maxDistance: null,
          search: "",
        },
        savedArtisansSortBy: "date-desc",
        isLoading: false,
        isProfileLoading: false,
        isSavedArtisansLoading: false,
        error: null,
        profileError: null,
        savedArtisansError: null,
        lastFetchTime: null,
        profileLastFetchTime: null,
        savedArtisansLastFetchTime: null,
      });
    },
  }))
);
