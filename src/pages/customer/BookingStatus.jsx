import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Clock,
  CheckCircle,
  XCircle,
  MessageSquare,
  DollarSign,
  AlertCircle,
  Loader2,
  ArrowLeft,
  Send,
  Shield,
  Phone,
  MapPin,
  Calendar,
  Wrench,
  Star,
} from "lucide-react";
import bookingApi from "../../api/bookingApi";
import toast from "react-hot-toast";

export default function BookingStatus() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [counterAmount, setCounterAmount] = useState("");
  const [counterMessage, setCounterMessage] = useState("");
  const [showNegotiationForm, setShowNegotiationForm] = useState(false);

  // Fetch booking on mount
  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) {
        toast.error("No booking found");
        navigate("/search");
        return;
      }

      try {
        setLoading(true);
        const res = await bookingApi.getBooking(bookingId);
        setBooking(res.data.data);

        if (res.data.data.status === "pending" && res.data.data.expiresAt) {
          const expires = new Date(res.data.data.expiresAt).getTime();
          const secondsLeft = Math.max(
            0,
            Math.floor((expires - Date.now()) / 1000)
          );
          setTimeLeft(secondsLeft);
        }
      } catch (err) {
        console.error("Fetch booking error:", err);
        toast.error("Booking not found");
        navigate("/search");
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId, navigate]);

  // Polling for status updates
  // Replace your existing polling useEffect with this updated version:

  useEffect(() => {
    if (
      !booking ||
      ![
        "pending",
        "negotiating",
        "confirmed",
        "in_progress",
        "completed",
      ].includes(booking.status)
    )
      return;

    const interval = setInterval(async () => {
      try {
        const res = await bookingApi.getBooking(bookingId);
        const updated = res.data.data;
        setBooking(updated);

        // Status change notifications
        if (updated.status === "accepted") {
          toast.success("Artisan accepted! Proceed to payment.");
          clearInterval(interval);
        } else if (updated.status === "declined") {
          toast.error("Artisan declined your booking.");
          clearInterval(interval);
        } else if (updated.status === "expired") {
          toast.error("Booking expired - no response.");
          clearInterval(interval);
        } else if (updated.status === "in_progress") {
          toast.success("Artisan has started working!");
        } else if (updated.status === "completed") {
          toast.success("Job completed!");
          // Don't clear interval - keep polling to detect payment release
        } else if (updated.status === "payment_released") {
          toast.success("Payment released successfully!");
          clearInterval(interval);
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }, [booking, bookingId]);

  // Countdown timer
  useEffect(() => {
    if (booking?.status !== "pending" || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [booking, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCounterOffer = async () => {
    if (!counterAmount || parseFloat(counterAmount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    try {
      await bookingApi.counterOffer(bookingId, {
        counterPrice: parseFloat(counterAmount),
        message: counterMessage,
      });
      toast.success("Counter-offer sent!");
      setShowNegotiationForm(false);
      setCounterAmount("");
      setCounterMessage("");

      const res = await bookingApi.getBooking(bookingId);
      setBooking(res.data.data);
    } catch (err) {
      console.error("Counter offer failed:", err);
      toast.error(
        err.response?.data?.message || "Failed to send counter-offer"
      );
    }
  };

  const handleAcceptPrice = async () => {
    try {
      await bookingApi.acceptNegotiatedPrice(bookingId);
      toast.success("Price accepted! Redirecting to payment...");
      setTimeout(() => {
        const id = bookingId || booking?._id;
        if (!id) {
          toast.error("Booking ID not found");
          navigate("/artisans");
          return;
        }
        navigate(`/payment/${id}`);
      }, 2000);
    } catch (err) {
      console.error("Accept price failed:", err);
      toast.error(err.response?.data?.message || "Failed to accept price");
    }
  };

  const handleRejectNegotiation = async () => {
    if (window.confirm("Are you sure you want to reject this negotiation?")) {
      try {
        await bookingApi.rejectNegotiation(bookingId);
        toast.error("Negotiation rejected");
        const res = await bookingApi.getBooking(bookingId);
        setBooking(res.data.data);
      } catch (err) {
        console.error("Reject failed:", err);
        toast.error(err.response?.data?.message || "Failed to reject");
      }
    }
  };

  const handleCancel = async () => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      try {
        await bookingApi.cancelBooking(bookingId);
        toast.success("Booking cancelled");
        setTimeout(() => navigate("/search"), 1500);
      } catch (err) {
        console.error("Cancel failed:", err);
        toast.error(err.response?.data?.message || "Failed to cancel");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading booking...</p>
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

  const pricing = {
    // Priority: agreedPrice (negotiated) > finalPrice (completed) > estimatedPrice (initial)
    basePrice:
      booking.agreedPrice || booking.finalPrice || booking.estimatedPrice || 0,
    platformFee: Math.round(
      (booking.agreedPrice ||
        booking.finalPrice ||
        booking.estimatedPrice ||
        0) * 0.05
    ),
    total: (() => {
      const base =
        booking.agreedPrice ||
        booking.finalPrice ||
        booking.estimatedPrice ||
        0;
      return base + Math.round(base * 0.05);
    })(),
  };

  // Status-based UI
  const getStatusUI = () => {
    switch (booking.status) {
      case "pending":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-200"></div>
              <div
                className="absolute inset-0 rounded-full border-4 border-blue-600 animate-spin"
                style={{
                  borderTopColor: "transparent",
                  borderRightColor: "transparent",
                }}
              ></div>
              <Clock className="w-12 h-12 text-blue-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Waiting for Response
            </h2>
            <p className="text-base text-gray-600 mb-6">
              {artisanName} has been notified and will respond soon
            </p>

            <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6 mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {formatTime(timeLeft)}
              </div>
              <p className="text-sm text-blue-700">Time remaining</p>
              <div className="mt-4 w-full bg-blue-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                  style={{ width: `${(timeLeft / 120) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-yellow-900 mb-1">
                    What happens next?
                  </p>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Artisan can accept your request immediately</li>
                    <li>• Or propose a different price if needed</li>
                    <li>
                      • If no response in 2 minutes, booking auto-declines
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );

      case "accepted":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Accepted!
            </h2>
            <p className="text-base text-gray-600 mb-6">
              {artisanName} has accepted your booking request
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Agreed Price</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₦{pricing.total.toLocaleString()}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Service Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-sm text-green-700">
                Proceed to payment to confirm your booking
              </p>
            </div>
            <button
              onClick={() => {
                const id = bookingId || booking?._id;
                if (!id) {
                  toast.error("Booking ID not found");
                  return;
                }
                console.log("Navigating to payment with booking:", id);
                navigate(`/payment/${id}`);
              }}
              className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              Proceed to Payment
            </button>
          </div>
        );

      case "confirmed":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Successful!
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Your booking is confirmed and payment has been secured
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Payment Status</p>
                  <p className="text-lg font-bold text-green-600">✓ Paid</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Service Date</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {new Date(booking.scheduledDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Booking Number</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Amount Paid</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{pricing.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Payment Protected by Escrow
                    </p>
                    <p className="text-xs text-blue-700">
                      Your payment is held securely until the job is completed.
                      Release payment after the artisan finishes the work.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/customer/dashboard/active")}
                className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                View in My Bookings
              </button>

              <button
                onClick={() => navigate("/artisans")}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                Book Another Service
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">What's Next?</h4>
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">1.</span>
                  <p className="text-sm text-gray-700">
                    {artisanName} will arrive at your location on the scheduled
                    date
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">2.</span>
                  <p className="text-sm text-gray-700">
                    Track the job progress in your dashboard
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">3.</span>
                  <p className="text-sm text-gray-700">
                    After completion, approve and release payment
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">4.</span>
                  <p className="text-sm text-gray-700">
                    Leave a review to help other customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "in_progress":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-pulse"></div>
              <Wrench className="w-16 h-16 text-blue-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Work In Progress
            </h2>
            <p className="text-base text-gray-600 mb-6">
              {artisanName} is currently working on your request
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Status</p>
                  <p className="text-lg font-bold text-blue-600">🔧 Active</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Started</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.startedAt
                      ? new Date(booking.startedAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "Recently"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Booking Number</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{pricing.total.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-green-900 mb-1">
                      Payment Secured in Escrow
                    </p>
                    <p className="text-xs text-green-700">
                      Your payment will be released to the artisan after you
                      confirm job completion
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate("/customer/dashboard/active")}
                className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Track Progress
              </button>

              <button
                onClick={() => {
                  // Add contact artisan functionality
                  toast.info("Contact feature coming soon");
                }}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
              >
                <Phone className="w-5 h-5" />
                <span>Contact Artisan</span>
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">
                While Work is in Progress
              </h4>
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <p className="text-sm text-gray-700">
                    The artisan is actively working on your service
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <p className="text-sm text-gray-700">
                    You'll be notified when the job is completed
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">•</span>
                  <p className="text-sm text-gray-700">
                    Contact the artisan if you have any questions
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "completed":
        // ✅ Check if payment was already released
        if (booking.paymentStatus === "released") {
          return (
            <div className="text-center">
              <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Payment Released Successfully! 🎉
              </h2>
              <p className="text-base text-gray-600 mb-6">
                ₦{pricing.total.toLocaleString()} has been transferred to{" "}
                {artisanName}
              </p>

              <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    Payment Complete
                  </span>
                </div>

                <div className="bg-white rounded-lg p-4 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">
                      Booking Number
                    </span>
                    <span className="font-mono font-semibold text-gray-900">
                      {booking.bookingNumber}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount Paid</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₦{(booking.finalPrice || pricing.total).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700">
                    Thank you for using our platform! Your review helps other
                    customers.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {/* ✅ Only show "Leave Review" if no review exists */}
                {!booking.customerReview ? (
                  <button
                    onClick={() =>
                      navigate(`/customer/leave-review/${bookingId}`)
                    }
                    className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <Star className="w-5 h-5" />
                    <span>Leave a Review</span>
                  </button>
                ) : (
                  <div className="w-full py-4 rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-700">
                      Review Submitted ✓
                    </span>
                  </div>
                )}

                <button
                  onClick={() => navigate("/customer/dashboard/history")}
                  className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                >
                  View History
                </button>
              </div>
            </div>
          );
        }

        // ✅ Otherwise show "Release Payment" button
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Job Completed!
            </h2>
            <p className="text-base text-gray-600 mb-6">
              {artisanName} has marked this job as completed
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-left">
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-lg font-bold text-green-600">
                    {booking.completedAt
                      ? new Date(booking.completedAt).toLocaleDateString()
                      : "Today"}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-gray-600">Duration</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {booking.workDuration
                      ? `${booking.workDuration} hrs`
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Booking Number</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Final Amount</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{(booking.finalPrice || pricing.total).toLocaleString()}
                  </span>
                </div>
              </div>

              {booking.completionNotes && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4 text-left">
                  <p className="text-sm font-semibold text-blue-900 mb-1">
                    Artisan's Notes:
                  </p>
                  <p className="text-sm text-blue-700">
                    {booking.completionNotes}
                  </p>
                </div>
              )}

              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="text-sm font-semibold text-yellow-900 mb-1">
                      Action Required
                    </p>
                    <p className="text-xs text-yellow-700">
                      Please review the work and release payment from your
                      dashboard. Your feedback helps other customers!
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => navigate(`/customer/review-job/${bookingId}`)}
                className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Review & Release Payment
              </button>

              {/* ✅ Only show "Leave Review" if no review exists AND payment not released */}
              {!booking.customerReview && (
                <button
                  onClick={() =>
                    navigate(`/customer/leave-review/${bookingId}`)
                  }
                  className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex items-center justify-center space-x-2"
                >
                  <Star className="w-5 h-5" />
                  <span>Leave a Review</span>
                </button>
              )}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">Next Steps</h4>
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">1.</span>
                  <p className="text-sm text-gray-700">
                    Review the completed work and verify satisfaction
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">2.</span>
                  <p className="text-sm text-gray-700">
                    Release payment from escrow to the artisan
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold mt-1">3.</span>
                  <p className="text-sm text-gray-700">
                    Leave a review to help the artisan and other customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "negotiating":
        const latestRound =
          booking.negotiation?.rounds?.[booking.negotiation.rounds.length - 1];
        const isArtisanProposal = latestRound?.proposedBy === "artisan";

        return (
          <div>
            <div className="text-center mb-6">
              <div className="w-24 h-24 mx-auto mb-6 bg-orange-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-16 h-16 text-orange-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Price Negotiation
              </h2>
              <p className="text-base text-gray-600">
                {isArtisanProposal
                  ? `${artisanName} has proposed a different price`
                  : "Your counter-offer has been sent"}
              </p>
            </div>

            {/* Negotiation History */}
            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 mb-4 flex items-center text-base">
                <MessageSquare className="w-5 h-5 mr-2" />
                Negotiation History
              </h3>

              <div className="space-y-4">
                {booking.negotiation?.rounds?.map((round, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      round.proposedBy === "artisan"
                        ? "bg-blue-50 border-l-4 border-blue-600"
                        : "bg-green-50 border-l-4 border-green-600"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 text-base">
                        {round.proposedBy === "artisan" ? artisanName : "You"}
                      </span>
                      <span className="text-sm text-gray-600">
                        Round {index + 1}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-gray-900">
                        ₦
                        {(
                          round.proposedAmount || round.amount
                        )?.toLocaleString()}
                      </span>
                    </div>
                    {round.message && (
                      <p className="text-sm text-gray-700 mt-2">
                        "{round.message}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            {isArtisanProposal && (
              <div className="space-y-3">
                {!showNegotiationForm ? (
                  <>
                    <button
                      onClick={handleAcceptPrice}
                      className="w-full py-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition-all flex items-center justify-center space-x-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>
                        Accept ₦{latestRound?.proposedAmount?.toLocaleString()}
                      </span>
                    </button>

                    <button
                      onClick={() => setShowNegotiationForm(true)}
                      className="w-full py-4 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all flex items-center justify-center space-x-2"
                    >
                      <DollarSign className="w-5 h-5" />
                      <span>Make Counter Offer</span>
                    </button>

                    <button
                      onClick={handleRejectNegotiation}
                      className="w-full py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all"
                    >
                      Reject & Cancel
                    </button>
                  </>
                ) : (
                  <div className="bg-white border-2 border-blue-600 rounded-xl p-6">
                    <h4 className="font-bold text-gray-900 mb-4 text-base">
                      Your Counter Offer
                    </h4>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Your Price (₦) *
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                          <input
                            type="number"
                            value={counterAmount}
                            onChange={(e) => setCounterAmount(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 text-base"
                            placeholder="Enter your price"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                          Message (Optional)
                        </label>
                        <textarea
                          value={counterMessage}
                          onChange={(e) => setCounterMessage(e.target.value)}
                          rows="3"
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 resize-none text-base"
                          placeholder="Explain your counter-offer..."
                        ></textarea>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => setShowNegotiationForm(false)}
                          className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleCounterOffer}
                          className="flex-1 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all flex items-center justify-center space-x-2"
                        >
                          <Send className="w-5 h-5" />
                          <span>Send Offer</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {!isArtisanProposal && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
                  <p className="text-sm text-blue-700">
                    Waiting for artisan's response to your counter-offer...
                  </p>
                </div>
              </div>
            )}
          </div>
        );

      case "declined":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-red-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Declined
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Unfortunately, {artisanName} has declined your booking request
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-base text-gray-700 mb-4">
                Don't worry! You can:
              </p>
              <ul className="text-left text-base text-gray-600 space-y-2 mb-4">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Search for other available artisans
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Adjust your requirements and try again
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  Contact customer support for assistance
                </li>
              </ul>
            </div>

            <button
              onClick={() => navigate("/search")}
              className="w-full py-4 rounded-xl text-white font-bold hover:shadow-lg transition-all"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              Find Another Artisan
            </button>
          </div>
        );

      case "expired":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <Clock className="w-16 h-16 text-gray-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Expired
            </h2>
            <p className="text-base text-gray-600 mb-6">
              The artisan didn't respond within the 2-minute window
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-6">
              <p className="text-base text-gray-700 mb-2">
                This happens when artisans are busy or unavailable
              </p>
              <p className="text-base text-gray-600">
                Try booking another artisan who might be available now
              </p>
            </div>

            <button
              onClick={() => navigate("/search")}
              className="w-full py-4 rounded-xl text-white font-bold hover:shadow-lg transition-all"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              Search Again
            </button>
          </div>
        );

      case "cancelled":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-200 rounded-full flex items-center justify-center">
              <XCircle className="w-16 h-16 text-gray-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Cancelled
            </h2>
            <p className="text-base text-gray-600 mb-6">
              Your booking request has been cancelled
            </p>

            <button
              onClick={() => navigate("/search")}
              className="w-full py-4 rounded-xl text-white font-bold hover:shadow-lg transition-all"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              Back to Search
            </button>
          </div>
        );
      // Add this case to your getStatusUI() function in BookingStatus.jsx
      // Place it AFTER the "completed" case and BEFORE "negotiating"

      case "payment_released":
        return (
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Payment Released Successfully! 🎉
            </h2>
            <p className="text-base text-gray-600 mb-6">
              ₦{pricing.total.toLocaleString()} has been transferred to{" "}
              {artisanName}
            </p>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <span className="text-lg font-bold text-green-600">
                  Transaction Complete
                </span>
              </div>

              <div className="bg-white rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Booking Number</span>
                  <span className="font-mono font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </span>
                </div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Amount Released</span>
                  <span className="text-lg font-bold text-gray-900">
                    ₦{(booking.finalPrice || pricing.total).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Released On</span>
                  <span className="text-sm text-gray-700">
                    {booking.paymentReleasedAt
                      ? new Date(booking.paymentReleasedAt).toLocaleDateString()
                      : "Recently"}
                  </span>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Thank you for using our platform! Your review helps other
                  customers make informed decisions.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Show review button only if no review exists */}
              {!booking.customerReview ? (
                <button
                  onClick={() =>
                    navigate(`/customer/leave-review/${bookingId}`)
                  }
                  className="w-full py-4 rounded-xl bg-yellow-500 hover:bg-yellow-600 text-white font-bold text-lg transition-all flex items-center justify-center space-x-2"
                >
                  <Star className="w-5 h-5" />
                  <span>Leave a Review</span>
                </button>
              ) : (
                <div className="w-full py-4 rounded-xl bg-green-50 border-2 border-green-200 flex items-center justify-center space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-semibold text-green-700">
                    Review Submitted ✓
                  </span>
                </div>
              )}

              {/* <button
                onClick={() => navigate("/customer/dashboard/history")}
                className="w-full py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all"
              >
                View Booking History
              </button> */}

              <button
                onClick={() => navigate("/artisans")}
                className="w-full py-3 rounded-xl text-white font-bold transition-all"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                Book Another Service
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">What Happened</h4>
              <div className="space-y-2 text-left">
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <p className="text-sm text-gray-700">
                    Job was completed successfully by {artisanName}
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <p className="text-sm text-gray-700">
                    You approved and released payment from escrow
                  </p>
                </div>
                <div className="flex items-start space-x-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mt-1" />
                  <p className="text-sm text-gray-700">
                    Funds have been transferred to the artisan's account
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            <p className="text-base text-gray-600">Loading booking status...</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate("/search")}
              className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 font-medium"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back to Search</span>
            </button>

            <div className="flex items-center space-x-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-sm font-medium text-gray-700">
                Secure Booking
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Left - Status */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {getStatusUI()}
            </div>

            {/* Cancel Button (only if pending) */}
            {booking.status === "pending" && (
              <button
                onClick={handleCancel}
                className="w-full mt-4 py-3 rounded-xl border border-red-300 text-red-600 font-semibold hover:bg-red-50 transition-all"
              >
                Cancel Booking Request
              </button>
            )}
          </div>

          {/* Right - Booking Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden sticky top-24">
              {/* Artisan Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      booking.artisan?.profilePhoto ||
                      "/images/default-avatar.jpg"
                    }
                    alt={artisanName}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">
                      {artisanName}
                    </h3>
                    <p className="text-base text-gray-600 mt-0.5">
                      {booking.service?.name || "Professional Service"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div className="p-6 space-y-6">
                {/* Date & Time */}
                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Date & Time
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {new Date(booking.scheduledDate).toLocaleDateString(
                        "en-US",
                        {
                          weekday: "short",
                          month: "short",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-base text-gray-700 mt-1">
                      {booking.scheduledTime}
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Location
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {booking.location?.address}
                    </p>
                    <p className="text-base text-gray-700 mt-1">
                      {booking.location?.city}, {booking.location?.state}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-6 h-6 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-500 mb-1">
                      Contact
                    </p>
                    <p className="text-base font-semibold text-gray-900">
                      {booking.customer?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                {/* Price */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="space-y-3 mb-4">
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Base Price</span>
                      <span className="font-semibold text-gray-900">
                        ₦{pricing.basePrice.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between text-base">
                      <span className="text-gray-600">Platform Fee (5%)</span>
                      <span className="font-semibold text-gray-900">
                        ₦{pricing.platformFee.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                    <span className="text-base font-bold text-gray-900">
                      Total
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      ₦{pricing.total.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Support */}
              <div className="p-6 border-t border-gray-200 bg-gray-50">
                <p className="text-base text-gray-600 mb-3">Need assistance?</p>
                <button className="w-full py-3 border border-gray-300 rounded-lg text-base font-medium text-gray-700 hover:bg-white transition-all">
                  Contact Support
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
