// ============================================
// 📁 src/stores/authStore.js
// Updated with Event Handling & Error Management
// ============================================

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api/authApi";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      // ========== STATE ==========
      user: null,
      token: null,
      isAuthenticated: false,
      role: null,
      isLoading: false,
      error: null,

      profileStatus: {
        profileComplete: false,
        completionPercentage: 0,
        missingRequired: [],
        missingOptional: [],
        canReceiveJobs: false,
        hasCompletedInitialSetup: false,
      },

      verificationStatus: {
        isEmailVerified: false,
        isPhoneVerified: false,
        emailOTPSent: false,
        phoneOTPSent: false,
      },

      // ========== ACTIONS ==========
      setAuth: (userData) => {
        console.log("✅ setAuth called with:", userData);

        const profileComplete =
          userData.profileStatus?.profileComplete ??
          userData.profileComplete ??
          false;

        const hasCompletedInitialSetup =
          userData.profileStatus?.hasCompletedInitialSetup ?? false;

        set({
          user: userData.user,
          token: userData.token,
          role: userData.user.role,
          isAuthenticated: true,
          error: null,
          verificationStatus: {
            isEmailVerified: userData.user.isEmailVerified || false,
            isPhoneVerified: userData.user.isPhoneVerified || false,
            emailOTPSent: false,
            phoneOTPSent: false,
          },
          profileStatus: {
            profileComplete,
            completionPercentage:
              userData.profileStatus?.completionPercentage ||
              (profileComplete ? 100 : 0),
            missingRequired: userData.profileStatus?.missingRequired || [],
            missingOptional: userData.profileStatus?.missingOptional || [],
            canReceiveJobs: userData.profileStatus?.canReceiveJobs || false,
            hasCompletedInitialSetup,
          },
        });

        console.log("✅ setAuth complete:", {
          profileComplete,
          hasCompletedInitialSetup,
        });
      },

      setProfileStatus: (status) => {
        console.log("🔧 setProfileStatus called with:", status);

        set({
          profileStatus: {
            profileComplete: status.profileComplete || false,
            completionPercentage: status.completionPercentage || 0,
            missingRequired: status.missingRequired || [],
            missingOptional: status.missingOptional || [],
            canReceiveJobs: status.canReceiveJobs || false,
            hasCompletedInitialSetup: status.hasCompletedInitialSetup || false,
          },
        });

        console.log(
          "✅ setProfileStatus complete. New state:",
          get().profileStatus
        );
      },

      fetchUser: async () => {
        try {
          set({ isLoading: true, error: null });

          const response = await api.get("/auth/profile-status");

          // 🔥 DETAILED LOGGING
          console.log(
            "📦 RAW Response from /auth/profile-status:",
            response.data
          );
          console.log("📊 Profile Status Data:", {
            profileComplete: response.data.data.profileComplete,
            completionPercentage: response.data.data.completionPercentage,
            missingRequired: response.data.data.missingRequired,
            canReceiveJobs: response.data.data.canReceiveJobs,
            hasCompletedInitialSetup:
              response.data.data.hasCompletedInitialSetup,
          });

          if (response.data.success) {
            const newProfileStatus = {
              profileComplete: response.data.data.profileComplete || false,
              completionPercentage:
                response.data.data.completionPercentage || 0,
              missingRequired: response.data.data.missingRequired || [],
              missingOptional: response.data.data.missingOptional || [],
              canReceiveJobs: response.data.data.canReceiveJobs || false,
              hasCompletedInitialSetup:
                response.data.data.hasCompletedInitialSetup || false,
            };

            console.log("🔧 Setting profileStatus to:", newProfileStatus);

            set({
              profileStatus: newProfileStatus,
              isLoading: false,
            });

            console.log(
              "✅ Profile status SAVED in store. Verify with get():",
              get().profileStatus
            );
          }
        } catch (error) {
          console.error("❌ Failed to fetch profile status:", error);
          set({
            isLoading: false,
            error:
              error.response?.data?.message || "Failed to fetch profile status",
          });
        }
      },
      updateUser: (updates) =>
        set((state) => ({
          user: { ...state.user, ...updates },
        })),

      updateVerificationStatus: (updates) =>
        set((state) => ({
          verificationStatus: { ...state.verificationStatus, ...updates },
        })),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error }),

      clearError: () => set({ error: null }),

      logout: () => {
        console.log("🚪 Logging out user");
        localStorage.removeItem("token");
        localStorage.removeItem("auth-storage");

        set({
          user: null,
          token: null,
          role: null,
          isAuthenticated: false,
          profileStatus: {
            profileComplete: false,
            completionPercentage: 0,
            missingRequired: [],
            missingOptional: [],
            canReceiveJobs: false,
            hasCompletedInitialSetup: false,
          },
          verificationStatus: {
            isEmailVerified: false,
            isPhoneVerified: false,
            emailOTPSent: false,
            phoneOTPSent: false,
          },
          error: null,
        });
      },

      // ========== COMPUTED GETTERS ==========
      isArtisan: () => get().role === "artisan",
      isCustomer: () => get().role === "customer",
      isAdmin: () => get().role === "admin",
      getToken: () => get().token,
      needsVerification: () => {
        const { isEmailVerified, isPhoneVerified } = get().verificationStatus;
        return !isEmailVerified || !isPhoneVerified;
      },

      // ========== NETWORK STATUS ==========
      isOnline: navigator.onLine,
      setOnlineStatus: (status) => set({ isOnline: status }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user
          ? {
              ...state.user,
              profilePhoto: state.user.profilePhoto,
            }
          : null,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        profileStatus: state.profileStatus,
      }),
      // Handle storage errors gracefully
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error("Failed to rehydrate auth store:", error);
        } else {
          console.log("✅ Auth store rehydrated successfully");
        }
      },
    }
  )
);

// ========== NETWORK STATUS MONITORING ==========
if (typeof window !== "undefined") {
  window.addEventListener("online", () => {
    console.log("🌐 Connection restored");
    useAuthStore.getState().setOnlineStatus(true);
  });

  window.addEventListener("offline", () => {
    console.log("📴 Connection lost");
    useAuthStore.getState().setOnlineStatus(false);
  });
}