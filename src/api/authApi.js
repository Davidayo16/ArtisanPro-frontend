// ============================================
// 📁 src/api/authApi.js
// Production-Ready Auth API with Advanced Error Handling
// ============================================

import axios from "axios";

// ========== CONFIGURATION ==========
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/v1";

const CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  MAX_RETRIES: 2,
  RETRY_DELAY: 2000, // 2 seconds
  RETRY_STATUS_CODES: [408, 429, 500, 502, 503, 504],
};

// ========== AXIOS INSTANCE ==========
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: CONFIG.TIMEOUT,
  withCredentials: false,
});

// ========== STATE MANAGEMENT ==========
let isRefreshing = false;
let isRedirecting = false;
let failedQueue = [];

// Process queued requests after token refresh
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ========== UTILITY FUNCTIONS ==========
const isNetworkError = (error) => {
  return (
    !error.response &&
    (error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error" ||
      error.message.includes("timeout"))
  );
};

const isRetryableError = (error) => {
  if (isNetworkError(error)) return true;
  if (!error.response) return false;
  return CONFIG.RETRY_STATUS_CODES.includes(error.response.status);
};

const isAuthError = (error) => {
  if (error.response?.status !== 401) return false;

  const message = error.response?.data?.message?.toLowerCase() || "";
  return (
    message.includes("token") ||
    message.includes("unauthorized") ||
    message.includes("authentication") ||
    message.includes("expired") ||
    message.includes("invalid")
  );
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// ========== LOGGING UTILITY ==========
const logger = {
  info: (message, ...args) => {
    if (import.meta.env.DEV) {
      console.log(`[API INFO] ${message}`, ...args);
    }
  },
  warn: (message, ...args) => {
    console.warn(`[API WARN] ${message}`, ...args);
  },
  error: (message, ...args) => {
    console.error(`[API ERROR] ${message}`, ...args);
  },
};

// ========== REQUEST INTERCEPTOR ==========
// ========== REQUEST INTERCEPTOR ==========
api.interceptors.request.use(
  (config) => {
    // 🔥 FIX: Get token from auth-storage (Zustand persist)
    let token = localStorage.getItem("token");
    
    // If not found, check inside auth-storage
    if (!token) {
      try {
        const authStorage = localStorage.getItem("auth-storage");
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          token = parsed.state?.token;
        }
      } catch (error) {
        console.error("Failed to parse auth-storage:", error);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request metadata
    config.metadata = { startTime: new Date().getTime() };

    logger.info(`Request: ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error) => {
    logger.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

// ========== RESPONSE INTERCEPTOR ==========
api.interceptors.response.use(
  (response) => {
    // Log successful request duration
    const duration = new Date().getTime() - response.config.metadata.startTime;
    logger.info(
      `Response: ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`
    );

    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Prevent infinite loops
    if (!originalRequest) {
      return Promise.reject(error);
    }

    // Initialize retry count
    originalRequest._retryCount = originalRequest._retryCount || 0;

    // ========== HANDLE NETWORK ERRORS & RETRYABLE ERRORS ==========
    if (
      isRetryableError(error) &&
      originalRequest._retryCount < CONFIG.MAX_RETRIES &&
      !originalRequest._isRetry
    ) {
      originalRequest._retryCount += 1;
      originalRequest._isRetry = true;

      logger.warn(
        `Retrying request (${originalRequest._retryCount}/${CONFIG.MAX_RETRIES}): ${originalRequest.url}`
      );

      // Exponential backoff
      const delay = CONFIG.RETRY_DELAY * originalRequest._retryCount;
      await sleep(delay);

      try {
        return await api(originalRequest);
      } catch (retryError) {
        if (originalRequest._retryCount >= CONFIG.MAX_RETRIES) {
          logger.error(
            `Max retries reached for: ${originalRequest.url}`,
            retryError
          );
        }
        return Promise.reject(retryError);
      }
    }

    // ========== HANDLE 401 AUTHENTICATION ERRORS ==========
    if (isAuthError(error) && !originalRequest._isRetry) {
      // Prevent multiple simultaneous redirects
      if (isRedirecting) {
        return Promise.reject(error);
      }

      // Check if we're already in login/register flow
      const isAuthRoute =
        window.location.pathname.includes("/auth/") ||
        window.location.pathname.includes("/login") ||
        window.location.pathname.includes("/register");

      if (isAuthRoute) {
        logger.info("Already on auth route, skipping redirect");
        return Promise.reject(error);
      }

      logger.error("Authentication failed - logging out user");

      isRedirecting = true;

      // Clear auth data
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");

      // Show user-friendly message
      const event = new CustomEvent("auth:expired", {
        detail: {
          message: "Your session has expired. Please login again.",
        },
      });
      window.dispatchEvent(event);

      // Redirect after small delay
      await sleep(500);
      window.location.href = "/auth/login";

      return Promise.reject(error);
    }

    // ========== HANDLE 403 FORBIDDEN ==========
    if (error.response?.status === 403) {
      logger.error("Access forbidden:", error.response?.data?.message);

      const event = new CustomEvent("auth:forbidden", {
        detail: {
          message:
            error.response?.data?.message ||
            "You don't have permission to access this resource.",
        },
      });
      window.dispatchEvent(event);
    }

    // ========== HANDLE 429 RATE LIMITING ==========
    if (error.response?.status === 429) {
      logger.warn("Rate limit exceeded");

      const event = new CustomEvent("api:ratelimit", {
        detail: {
          message: "Too many requests. Please try again later.",
          retryAfter: error.response?.headers["retry-after"],
        },
      });
      window.dispatchEvent(event);
    }

    // ========== HANDLE 500+ SERVER ERRORS ==========
    if (error.response?.status >= 500) {
      logger.error("Server error:", error.response?.status);

      const event = new CustomEvent("api:servererror", {
        detail: {
          message: "Server error. Our team has been notified.",
          status: error.response?.status,
        },
      });
      window.dispatchEvent(event);
    }

    // ========== HANDLE NETWORK ERRORS ==========
    if (isNetworkError(error)) {
      logger.error("Network error - connection lost");

      const event = new CustomEvent("api:networkerror", {
        detail: {
          message:
            "Unable to connect. Please check your internet connection.",
        },
      });
      window.dispatchEvent(event);
    }

    return Promise.reject(error);
  }
);

// ========== AUTH API ENDPOINTS ==========
export const authApi = {
  // 1. REGISTER
  register: async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      logger.error("Register failed:", error);
      throw error;
    }
  },

  // 2. LOGIN
  login: async (credentials) => {
    try {
      const response = await api.post("/auth/login", credentials);
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      logger.error("Login failed:", error);
      throw error;
    }
  },

  // 3. GET CURRENT USER
  getMe: async () => {
    try {
      const response = await api.get("/auth/me");
      return response.data;
    } catch (error) {
      logger.error("Get user failed:", error);
      throw error;
    }
  },

  // 4. LOGOUT
  logout: async () => {
    try {
      const response = await api.get("/auth/logout");
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");
      return response.data;
    } catch (error) {
      logger.error("Logout failed:", error);
      // Still clear local storage even if API call fails
      localStorage.removeItem("token");
      localStorage.removeItem("auth-storage");
      throw error;
    }
  },

  // 5. GET PROFILE STATUS (for artisans)
  getProfileStatus: async () => {
    try {
      const response = await api.get("/auth/profile-status");
      return response.data;
    } catch (error) {
      logger.error("Get profile status failed:", error);
      throw error;
    }
  },

  // 6. SEND EMAIL OTP
  sendEmailOTP: async () => {
    try {
      const response = await api.post("/auth/send-email-otp");
      return response.data;
    } catch (error) {
      logger.error("Send email OTP failed:", error);
      throw error;
    }
  },

  // 7. VERIFY EMAIL
  verifyEmail: async (otp) => {
    try {
      const response = await api.post("/auth/verify-email", { otp });
      return response.data;
    } catch (error) {
      logger.error("Verify email failed:", error);
      throw error;
    }
  },

  // 8. SEND PHONE OTP
  sendPhoneOTP: async () => {
    try {
      const response = await api.post("/auth/send-phone-otp");
      return response.data;
    } catch (error) {
      logger.error("Send phone OTP failed:", error);
      throw error;
    }
  },

  // 9. VERIFY PHONE
  verifyPhone: async (otp) => {
    try {
      const response = await api.post("/auth/verify-phone", { otp });
      return response.data;
    } catch (error) {
      logger.error("Verify phone failed:", error);
      throw error;
    }
  },

  // 10. RESEND OTP
  resendOTP: async (type) => {
    try {
      const response = await api.post("/auth/resend-otp", { type });
      return response.data;
    } catch (error) {
      logger.error("Resend OTP failed:", error);
      throw error;
    }
  },

  // 11. FORGOT PASSWORD
  forgotPassword: async (email) => {
    try {
      const response = await api.post("/auth/forgot-password", { email });
      return response.data;
    } catch (error) {
      logger.error("Forgot password failed:", error);
      throw error;
    }
  },

  // 12. VERIFY RESET OTP
  verifyResetOTP: async (email, otp) => {
    try {
      const response = await api.post("/auth/verify-reset-otp", {
        email,
        otp,
      });
      return response.data;
    } catch (error) {
      logger.error("Verify reset OTP failed:", error);
      throw error;
    }
  },

  // 13. RESET PASSWORD
  resetPassword: async (email, otp, newPassword) => {
    try {
      const response = await api.post("/auth/reset-password", {
        email,
        otp,
        newPassword,
      });
      return response.data;
    } catch (error) {
      logger.error("Reset password failed:", error);
      throw error;
    }
  },

  // 14. CHANGE PASSWORD
  changePassword: async (currentPassword, newPassword) => {
    try {
      const response = await api.put("/auth/change-password", {
        currentPassword,
        newPassword,
      });
      return response.data;
    } catch (error) {
      logger.error("Change password failed:", error);
      throw error;
    }
  },

  // 15. GOOGLE AUTH
  googleAuthCustomer: () => {
    window.location.href = `${API_URL}/auth/google/customer`;
  },

  googleAuthArtisan: () => {
    window.location.href = `${API_URL}/auth/google/artisan`;
  },

  // 16. REFRESH TOKEN (if implemented on backend)
  refreshToken: async () => {
    try {
      const response = await api.post("/auth/refresh-token");
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data;
    } catch (error) {
      logger.error("Refresh token failed:", error);
      throw error;
    }
  },
};

// ========== HELPER FUNCTIONS ==========

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

/**
 * Get stored token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Clear authentication data
 */
export const clearAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("auth-storage");
};

/**
 * Setup global event listeners for API errors
 * Call this in your App.jsx or main.jsx
 */
export const setupApiErrorHandlers = () => {
  // Handle auth expiration
  window.addEventListener("auth:expired", (event) => {
    // Show toast notification
    console.log(event.detail.message);
    // You can integrate with your toast library here
  });

  // Handle forbidden access
  window.addEventListener("auth:forbidden", (event) => {
    console.log(event.detail.message);
  });

  // Handle rate limiting
  window.addEventListener("api:ratelimit", (event) => {
    console.log(event.detail.message);
  });

  // Handle server errors
  window.addEventListener("api:servererror", (event) => {
    console.log(event.detail.message);
  });

  // Handle network errors
  window.addEventListener("api:networkerror", (event) => {
    console.log(event.detail.message);
  });
};

// ========== HEALTH CHECK ==========
export const checkApiHealth = async () => {
  try {
    const response = await api.get("/health");
    return { healthy: true, data: response.data };
  } catch (error) {
    logger.error("API health check failed:", error);
    return { healthy: false, error: error.message };
  }
};

// Export axios instance for other API services
export default api;