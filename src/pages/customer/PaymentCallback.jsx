// frontend/pages/customer/PaymentCallback.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { usePaymentStore } from "../../stores/paymentStore";
import bookingApi from "../../api/bookingApi";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { verifyPayment, verificationStatus } = usePaymentStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const reference = searchParams.get("reference");
    const status = searchParams.get("status");

    if (!reference) {
      setError("No payment reference found");
      setTimeout(() => navigate("/search"), 3000);
      return;
    }

    // If Paystack returned cancelled status
    if (status === "cancelled") {
      setError("Payment was cancelled");
      setTimeout(() => navigate("/search"), 3000);
      return;
    }

    // Verify payment
    const verify = async () => {
      try {
        const result = await verifyPayment(reference);
        
        console.log("✅ Verification result:", result);
        
        // Backend returns: { success, message, data: { payment, booking } }
        const bookingData = result.data?.booking || result.booking;
        const paymentData = result.data?.payment || result.payment;
        
        // If backend only returns partial booking (id, bookingNumber, status)
        // Fetch full booking details
        if (bookingData && !bookingData.artisan) {
          console.log("📥 Fetching full booking details...");
          const bookingId = bookingData.id || bookingData._id || bookingData.bookingNumber;
          
          if (!bookingId) {
            throw new Error("No booking ID found in response");
          }
          
          try {
            const fullBookingRes = await bookingApi.getBooking(bookingId);
            const fullBooking = fullBookingRes.data.data || fullBookingRes.data;
            
            console.log("✅ Full booking fetched:", fullBooking);
            
            // Navigate with full booking
            setTimeout(() => {
              navigate("/payment/success", {
                state: { 
                  booking: fullBooking,
                  payment: paymentData 
                },
              });
            }, 2000);
          } catch (fetchErr) {
            console.error("❌ Failed to fetch full booking:", fetchErr);
            throw new Error("Payment successful but couldn't load booking details");
          }
        } else {
          // Backend returned full booking
          setTimeout(() => {
            navigate("/payment/success", {
              state: { 
                booking: bookingData,
                payment: paymentData 
              },
            });
          }, 2000);
        }
      } catch (err) {
        console.error("❌ Verification error:", err);
        setError(err.message || "Payment verification failed");
        setTimeout(() => {
          navigate("/payment/failed", {
            state: { error: err.message },
          });
        }, 3000);
      }
    };

    verify();
  }, [searchParams, navigate, verifyPayment]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        {verificationStatus === "verifying" && !error && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Verifying Payment
            </h2>
            <p className="text-gray-600">
              Please wait while we confirm your payment...
            </p>
          </>
        )}

        {verificationStatus === "success" && !error && (
          <>
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-gray-600">Redirecting to confirmation page...</p>
          </>
        )}

        {(verificationStatus === "failed" || error) && (
          <>
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Failed
            </h2>
            <p className="text-gray-600 mb-4">
              {error || "We couldn't verify your payment"}
            </p>
            <p className="text-sm text-gray-500">Redirecting...</p>
          </>
        )}
      </div>
    </div>
  );
}