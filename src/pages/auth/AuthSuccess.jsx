// src/pages/AuthSuccess.jsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader } from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { authApi } from "../../api/authApi";
import toast from "react-hot-toast";

export default function AuthSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  const hasRun = useRef(false); // ← ADD THIS

  useEffect(() => {
    if (hasRun.current) return; // ← ADD THIS
    hasRun.current = true; // ← ADD THIS

    const run = async () => {
      const token = searchParams.get("token");
      if (!token) {
        toast.error("Login failed");
        return navigate("/login");
      }

      localStorage.setItem("token", token);

      try {
        const userRes = await authApi.getMe();
        const user = userRes.data;

        if (user.role === "artisan") {
          const profileRes = await authApi.getProfileStatus();
          const profileData = profileRes.data || profileRes;

          setAuth({
            user,
            token,
            profileStatus: profileData,
          });

          navigate(
            profileData.profileComplete
              ? "/artisan/dashboard"
              : "/complete-profile"
          );
        } else {
          setAuth({ user, token });
          navigate("/customer/dashboard");
        }

        // toast.success("Welcome back!");
      } catch (err) {
        toast.error("Login failed");
        navigate("/login");
      }
    };

    run();
  }, [searchParams, navigate, setAuth]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <Loader className="w-16 h-16 text-blue-600 animate-spin mx-auto mb-4" />
        <h2 className="text-2xl font-bold">Signing you in...</h2>
      </div>
    </div>
  );
}
