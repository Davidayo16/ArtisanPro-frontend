// frontend/pages/customer/ReviewJob.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  Package,
  FileText,
  Camera,
  AlertCircle,
  Loader,
  DollarSign,
  Shield,
  Star,
  ThumbsUp,
} from "lucide-react";
import bookingApi from "../../api/bookingApi";
import { usePaymentStore } from "../../stores/paymentStore";
import toast from "react-hot-toast";

const COLORS = {
  primary: { 600: "#2563eb", 700: "#1d4ed8" },
  success: { 600: "#16a34a" },
  gray: {
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },
};

export default function ReviewJob() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const { releaseEscrow, loading: paymentLoading } = usePaymentStore();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [releasing, setReleasing] = useState(false);
  const [paymentReleased, setPaymentReleased] = useState(false); // ✅ Success state

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await bookingApi.getBooking(bookingId);
      const bookingData = res.data.data;

      if (bookingData.status !== "completed") {
        toast.error("This job is not completed yet");
        navigate("/customer/dashboard/active");
        return;
      }

      setBooking(bookingData);
    } catch (error) {
      console.error("Fetch booking error:", error);
      toast.error("Failed to load booking");
      navigate("/customer/dashboard/active");
    } finally {
      setLoading(false);
    }
  };

  const handleReleasePayment = async () => {
    setReleasing(true);
    try {
      await releaseEscrow(bookingId);

      // ✅ Set success state (don't navigate yet)
      setPaymentReleased(true);
      setShowConfirmModal(false);
      setReleasing(false);
    } catch (error) {
      console.error("Release payment error:", error);
      toast.error(
        error.response?.data?.message || "Failed to release payment",
        {
          duration: 4000,
          style: {
            background: "#dc2626",
            color: "#fff",
            padding: "16px",
            borderRadius: "12px",
            fontWeight: "600",
          },
        }
      );
      setReleasing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (!booking) {
    return null;
  }

  const artisanName = `${booking.artisan?.firstName || ""} ${
    booking.artisan?.lastName || ""
  }`.trim();

  const totalAmount = booking.finalPrice || booking.estimatedPrice || 0;

  // ✅ SUCCESS SCREEN (Big Company Standard)
  if (paymentReleased) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 text-center">
            {/* Success Icon */}
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            {/* Success Message */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Payment Released Successfully! 🎉
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              ₦{totalAmount.toLocaleString()} has been transferred to{" "}
              {artisanName}
            </p>

            {/* Transaction Details */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">
                Transaction Details
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking Reference</span>
                  <span className="font-semibold text-gray-900">
                    {booking.bookingNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service Provider</span>
                  <span className="font-semibold text-gray-900">
                    {artisanName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Service</span>
                  <span className="font-semibold text-gray-900">
                    {booking.service?.name}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t-2 border-gray-200">
                  <span className="font-bold text-gray-900">Amount Paid</span>
                  <span className="text-xl font-bold text-green-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="bg-blue-50 rounded-2xl p-6 mb-6">
              <div className="flex items-center justify-center space-x-3 mb-3">
                <Star className="w-6 h-6 text-yellow-500 fill-yellow-500" />
                <h3 className="font-bold text-lg text-gray-900">
                  How was your experience?
                </h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Help other customers by sharing your experience with{" "}
                {booking.artisan?.firstName}
              </p>
              <button
                onClick={() => navigate(`/customer/leave-review/${bookingId}`)}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-xl transition-all flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Star className="w-5 h-5" />
                <span>Leave a Review</span>
              </button>
            </div>

            {/* Secondary Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/customer/dashboard/history")}
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                View History
              </button>
              <button
                onClick={() => navigate("/customer/dashboard")}
                className="flex-1 py-3 bg-white border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Receipt Note */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-xs text-green-800">
                <strong>✓ Receipt sent:</strong> A confirmation email has been
                sent to your registered email address.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ REGULAR REVIEW SCREEN (Before Payment Released)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/customer/dashboard/active")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </button>
          <h1
            className="text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Review Completed Job
          </h1>
          <p className="text-gray-600 mt-2">
            {booking.bookingNumber} - {booking.service?.name}
          </p>
        </div>

        {/* Status Banner */}
        <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-6 mb-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-900">
                Job Completed Successfully
              </h2>
              <p className="text-green-700 mt-1">
                {artisanName} has finished the work. Please review and release
                payment.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Summary */}
            <div
              className="bg-white rounded-2xl p-6"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <h3 className="font-bold text-xl mb-4">Job Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Artisan</p>
                  <div className="flex items-center space-x-3 mt-2">
                    <img
                      src={
                        booking.artisan?.profilePhoto ||
                        `https://ui-avatars.com/api/?name=${artisanName}&background=3b82f6&color=fff&size=150`
                      }
                      alt={artisanName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">{artisanName}</p>
                      {booking.artisan?.averageRating && (
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {booking.artisan.averageRating.toFixed(1)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Service</p>
                  <p className="font-semibold mt-2">{booking.service?.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Completed</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    <span className="font-semibold">
                      {new Date(booking.completedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Duration</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">
                      {booking.workDuration
                        ? `${booking.workDuration} hours`
                        : "Not specified"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Completion Notes */}
            {booking.completionNotes && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <FileText className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-lg">Artisan's Notes</h3>
                </div>
                <div className="bg-blue-50 rounded-xl p-4">
                  <p className="text-gray-700">{booking.completionNotes}</p>
                </div>
              </div>
            )}

            {/* Completion Photos */}
            {booking.completionPhotos &&
              booking.completionPhotos.length > 0 && (
                <div
                  className="bg-white rounded-2xl p-6"
                  style={{ border: `1px solid ${COLORS.gray[100]}` }}
                >
                  <div className="flex items-center space-x-2 mb-4">
                    <Camera className="w-5 h-5 text-primary-600" />
                    <h3 className="font-bold text-lg">Completion Photos</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {booking.completionPhotos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer rounded-lg overflow-hidden"
                      >
                        <img
                          src={photo.url}
                          alt={`Completion ${index + 1}`}
                          className="w-full h-40 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            {/* Materials Used */}
            {booking.materialsUsed && booking.materialsUsed.length > 0 && (
              <div
                className="bg-white rounded-2xl p-6"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Package className="w-5 h-5 text-primary-600" />
                  <h3 className="font-bold text-lg">Materials Used</h3>
                </div>
                <div className="space-y-2">
                  {booking.materialsUsed.map((material, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="text-gray-700">{material.name}</span>
                      <span className="font-semibold text-gray-900">
                        ₦{material.cost?.toLocaleString()}
                      </span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg border-t-2 border-blue-200">
                    <span className="font-bold text-gray-900">
                      Total Materials
                    </span>
                    <span className="font-bold text-blue-600">
                      ₦
                      {booking.materialsUsed
                        .reduce((sum, m) => sum + (m.cost || 0), 0)
                        .toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Payment Summary */}
          <div className="lg:col-span-1">
            <div
              className="bg-white rounded-2xl p-6 sticky top-6"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <h3 className="font-bold text-lg mb-4">Payment Summary</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Service Amount</span>
                  <span className="font-semibold">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Status</span>
                  <span className="font-semibold text-yellow-600">
                    Held in Escrow
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t-2 border-gray-200 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-primary-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Escrow Info */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-start space-x-2">
                  <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 mb-1">
                      Payment Protected
                    </p>
                    <p className="text-xs text-blue-700">
                      Your payment is held securely until you confirm the work
                      is satisfactory.
                    </p>
                  </div>
                </div>
              </div>

              {/* Release Button */}
              <button
                onClick={() => setShowConfirmModal(true)}
                disabled={releasing}
                className={`w-full py-4 rounded-xl font-bold text-white transition-all flex items-center justify-center space-x-2 ${
                  releasing
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
                }`}
              >
                {releasing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Releasing...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Release Payment</span>
                  </>
                )}
              </button>

              {/* Info */}
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-yellow-800">
                      <strong>Note:</strong> Once you release payment, it will
                      be transferred to the artisan. This action cannot be
                      undone.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-black/75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <DollarSign className="w-10 h-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Confirm Payment Release
                </h3>
                <p className="text-gray-600">
                  Are you satisfied with the completed work?
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Artisan</span>
                  <span className="font-semibold text-gray-900">
                    {artisanName}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Service</span>
                  <span className="font-semibold text-gray-900">
                    {booking.service?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="font-bold text-gray-900">Amount</span>
                  <span className="text-xl font-bold text-green-600">
                    ₦{totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> This action is final and cannot
                  be reversed. The payment will be transferred to the artisan
                  immediately.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  disabled={releasing}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReleasePayment}
                  disabled={releasing}
                  className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
                    releasing
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {releasing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <Loader className="w-4 h-4 animate-spin" />
                      <span>Releasing...</span>
                    </div>
                  ) : (
                    "Confirm Release"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
