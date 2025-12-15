// frontend/pages/customer/PaymentCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react";
import { usePaymentStore } from "../../stores/paymentStore";
import toast from "react-hot-toast"; // ✅ Import toast

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // ✅ Get from Zustand store
  const { verifyPaymentStream, steps, verificationStatus, error } =
    usePaymentStore();

  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const status = searchParams.get("status");

    // Validation
    if (!reference) {
      setLocalError("No payment reference found");
      setTimeout(() => navigate("/search"), 3000);
      return;
    }

    if (status === "cancelled") {
      setLocalError("Payment was cancelled");
      setTimeout(() => navigate("/search"), 3000);
      return;
    }

    // ✅ Dismiss any existing toasts before starting
    toast.dismiss();

    // ✅ Start SSE stream verification
    const verify = async () => {
      try {
        const result = await verifyPaymentStream(reference);

        console.log("✅ Verification complete:", result);

        // Redirect after 2 seconds
        setTimeout(() => {
          navigate("/payment/success", {
            state: {
              booking: result.booking,
              payment: result.payment,
            },
          });
        }, 2000);
      } catch (err) {
        console.error("❌ Verification error:", err);
        setLocalError(err.message || "Payment verification failed");

        setTimeout(() => {
          navigate("/payment/failed", {
            state: { error: err.message },
          });
        }, 3000);
      }
    };

    verify();
  }, [searchParams, navigate, verifyPaymentStream]);

  // Helper to get icon for status
  const getStepIcon = (status) => {
    switch (status) {
      case "loading":
        return <Loader2 className="w-5 h-5 animate-spin text-blue-600" />;
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return (
          <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          {verificationStatus === "success" && !localError && !error ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Successful!
              </h2>
              <p className="text-gray-600">
                Redirecting to confirmation page...
              </p>
            </>
          ) : localError || error ? (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-10 h-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Failed
              </h2>
              <p className="text-gray-600 mb-4">
                {localError || error || "We couldn't verify your payment"}
              </p>
              <p className="text-sm text-gray-500">Redirecting...</p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Processing Payment
              </h2>
              <p className="text-gray-600">
                Please wait while we verify your payment...
              </p>
            </>
          )}
        </div>

        {/* ✅ Progress Steps */}
        {!localError && !error && (
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.id}
                className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 transition-all"
              >
                <div className="flex-shrink-0">{getStepIcon(step.status)}</div>
                <div className="flex-1">
                  <p
                    className={`font-medium ${
                      step.status === "success"
                        ? "text-green-700"
                        : step.status === "loading"
                        ? "text-blue-700"
                        : step.status === "warning"
                        ? "text-yellow-700"
                        : step.status === "error"
                        ? "text-red-700"
                        : "text-gray-700"
                    }`}
                  >
                    {step.message}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Loading indicator at bottom */}
        {verificationStatus === "verifying" && !localError && !error && (
          <div className="mt-6 text-center">
            <div className="inline-flex items-center gap-2 text-sm text-gray-500">
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <div
                className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
