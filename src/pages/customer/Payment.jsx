// frontend/pages/customer/Payment.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import {
  ArrowLeft,
  Shield,
  Lock,
  CheckCircle,
  Info,
  Clock,
  Star,
  Calendar,
  MapPin,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import bookingApi from "../../api/bookingApi";
import { usePaymentStore } from "../../stores/paymentStore";

export default function Payment() {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loadingBooking, setLoadingBooking] = useState(true);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const { initializePayment, loading } = usePaymentStore();

  // Debug logging
  useEffect(() => {
    console.log("Payment page params:", { bookingId });
    console.log("Location state:", location.state);
  }, [bookingId, location.state]);

  // Fetch booking details
  useEffect(() => {
    const fetchBooking = async () => {
      // Get bookingId from params or location state
      const actualBookingId = bookingId || location.state?.bookingId;

      // Skip if bookingId is undefined during initial render
      if (actualBookingId === undefined) {
        console.log("Waiting for bookingId to be defined...");
        return;
      }

      if (
        !actualBookingId ||
        actualBookingId === "undefined" ||
        actualBookingId === "null"
      ) {
        console.error("No valid booking ID:", {
          bookingId,
          locationState: location.state,
        });
        toast.error("No booking ID provided", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        navigate("/search");
        return;
      }

      try {
        setLoadingBooking(true);
        console.log("Fetching booking:", actualBookingId);
        const res = await bookingApi.getBooking(actualBookingId);
        const bookingData = res.data.data || res.data;

        console.log("Booking data:", bookingData);

        // Check if booking is accepted
        if (bookingData.status !== "accepted") {
          toast.error("Booking must be accepted before payment", {
            duration: 3000,
            style: {
              background: "#dc2626",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
          navigate(`/booking-status/${actualBookingId}`);
          return;
        }

        // Check if already paid
        if (bookingData.paymentStatus === "paid") {
          toast.error("This booking has already been paid", {
            duration: 3000,
            style: {
              background: "#dc2626",
              color: "#fff",
              padding: "16px",
              borderRadius: "12px",
              fontWeight: "600",
            },
          });
          navigate(`/booking-status/${actualBookingId}`);
          return;
        }

        setBooking(bookingData);
      } catch (err) {
        console.error("Fetch booking error:", err);
        toast.error("Failed to load booking details", {
          duration: 3000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        });
        navigate("/search");
      } finally {
        setLoadingBooking(false);
      }
    };

    fetchBooking();
  }, [bookingId, location.state, navigate]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handlePayment = async () => {
    if (!agreedToTerms) {
      toast.error("Please agree to the terms and conditions", {
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

    const actualBookingId =
      bookingId || location.state?.bookingId || booking?._id;

    if (
      !actualBookingId ||
      actualBookingId === "undefined" ||
      actualBookingId === "null"
    ) {
      console.error("Invalid booking ID for payment:", {
        bookingId,
        booking: booking?._id,
        locationState: location.state,
      });
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

    try {
      console.log("Initializing payment for booking:", actualBookingId);
      await initializePayment(actualBookingId);
      // Will redirect to Paystack
    } catch (err) {
      console.error("Payment initialization error:", err);
    }
  };

  // Calculate pricing
  const calculatePricing = () => {
    if (!booking) return { basePrice: 0, platformFee: 0, total: 0 };

    const basePrice = booking.agreedPrice || booking.estimatedPrice || 0;
    const platformFee = Math.round(basePrice * 0.05);
    const total = basePrice + platformFee;

    return { basePrice, platformFee, total };
  };

  const pricing = calculatePricing();

  if (loadingBooking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-base text-gray-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const artisanName = `${booking.artisan?.firstName || ""} ${
    booking.artisan?.lastName || ""
  }`.trim();

  const actualBookingId =
    bookingId || location.state?.bookingId || booking?._id;

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-center" reverseOrder={false} />

      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/booking-status/${actualBookingId}`)}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Lock className="w-5 h-5 text-green-600" />
                <span className="text-sm font-medium text-gray-700">
                  Secure Payment
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Trust Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Payment held in escrow until job completion</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5" />
              <span>100% money-back guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Payment Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Method Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Complete Your Payment
              </h2>
              <p className="text-gray-600 mb-6">
                You'll be redirected to Paystack to complete payment securely
              </p>

              <div className="bg-blue-50 rounded-xl p-5">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Secure Card Payment via Paystack
                    </p>
                    <p className="text-xs text-gray-600">
                      Your card details are encrypted and secure. We never store
                      your card information. Powered by Paystack - Nigeria's
                      trusted payment gateway.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Escrow Protection */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">Escrow Protection</h3>
                  <p className="text-sm text-gray-600">
                    How your money is protected
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Payment Held Securely
                    </p>
                    <p className="text-sm text-gray-600">
                      Your ₦{pricing.total.toLocaleString()} is held in a secure
                      escrow account by Paystack
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Artisan Completes Job
                    </p>
                    <p className="text-sm text-gray-600">
                      {artisanName} completes your {booking.service?.name}{" "}
                      service
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 font-bold text-blue-600">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      You Approve & Release
                    </p>
                    <p className="text-sm text-gray-600">
                      Once satisfied, you approve and money is released to the
                      artisan
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Protected
                    </p>
                    <p className="text-sm text-gray-600">
                      If job not completed or unsatisfactory, get a full refund
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Auto-release after:</span>
                  <span className="font-semibold text-gray-900">48 hours</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Payment automatically released if you don't respond within 48
                  hours of job completion
                </p>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Terms of Service
                  </a>
                  ,{" "}
                  <a
                    href="#"
                    className="text-blue-600 hover:underline font-medium"
                  >
                    Cancellation Policy
                  </a>
                  , and understand that payment will be held in escrow until job
                  completion.
                </span>
              </label>
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={loading || !agreedToTerms}
              className={`w-full py-4 rounded-xl text-white font-bold text-lg transition-all flex items-center justify-center space-x-2 ${
                loading || !agreedToTerms
                  ? "bg-gray-400 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
              style={
                !loading && agreedToTerms
                  ? {
                      backgroundImage:
                        "linear-gradient(to right, #224e8c, #2a5ca8)",
                    }
                  : {}
              }
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Lock className="w-5 h-5" />
                  <span>Pay ₦{pricing.total.toLocaleString()}</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-gray-500">
              By clicking "Pay", you authorize this payment and agree to our
              terms
            </p>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4">Booking Summary</h3>

              {/* Artisan Info */}
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <img
                  src={
                    booking.artisan?.profilePhoto ||
                    "/images/default-avatar.jpg"
                  }
                  alt={artisanName}
                  className="w-14 h-14 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-bold text-gray-900">{artisanName}</h4>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold text-sm text-gray-900">
                      {booking.artisan?.averageRating || "5.0"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Service Details */}
              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1">SERVICE</p>
                  <p className="font-semibold text-gray-900">
                    {booking.service?.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">SCHEDULE</p>
                  <div className="flex items-center space-x-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {new Date(booking.scheduledDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">
                      {booking.scheduledTime}
                    </span>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">LOCATION</p>
                  <div className="flex items-start space-x-2 text-sm">
                    <MapPin className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-900">
                      {booking.location?.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowBreakdown(!showBreakdown)}
                  className="w-full flex items-center justify-between mb-4"
                >
                  <span className="font-bold text-gray-900">
                    Price Breakdown
                  </span>
                  {showBreakdown ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </button>

                {showBreakdown && (
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-semibold text-gray-900">
                        ₦{pricing.basePrice.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Platform Fee (5%)</span>
                      <span className="font-semibold text-gray-900">
                        ₦{pricing.platformFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-2xl text-blue-600">
                      ₦{pricing.total.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 text-right">
                    Held in escrow until completion
                  </p>
                </div>
              </div>

              {/* Security Badges */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Shield className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span>Secured by Paystack</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <Lock className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span>256-bit SSL encryption</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-700">
                  <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span>PCI DSS compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
