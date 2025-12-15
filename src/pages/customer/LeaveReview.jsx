// frontend/pages/customer/LeaveReview.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Upload,
  X,
  Loader,
  CheckCircle,
  ThumbsUp,
  Camera,
  MessageSquare,
  Heart,
  Award,
} from "lucide-react";
import bookingApi from "../../api/bookingApi";
import { reviewApi } from "../../api/reviewApi";
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

const DETAILED_RATINGS = [
  { key: "quality", label: "Quality of Work" },
  { key: "professionalism", label: "Professionalism" },
  { key: "communication", label: "Communication" },
  { key: "timeliness", label: "Timeliness" },
  { key: "valueForMoney", label: "Value for Money" },
];

export default function LeaveReview() {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false); // ✅ Success state

  // Form state
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [detailedRatings, setDetailedRatings] = useState({
    quality: 0,
    professionalism: 0,
    communication: 0,
    timeliness: 0,
    valueForMoney: 0,
  });
  const [comment, setComment] = useState("");
  const [isRecommended, setIsRecommended] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await bookingApi.getBooking(bookingId);
      const bookingData = res.data.data;

      if (!["completed", "payment_released"].includes(bookingData.status)) {
        toast.error("Can only review completed jobs");
        navigate("/customer/dashboard/active");
        return;
      }

      if (bookingData.customerReview) {
        toast.error("You have already reviewed this job");
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

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);

    if (photos.length + files.length > 5) {
      toast.error("Maximum 5 photos allowed");
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotos((prev) => [...prev, reader.result]);
        setPhotoPreviews((prev) => [...prev, URL.createObjectURL(file)]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPhotoPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDetailedRating = (key, value) => {
    setDetailedRatings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (rating === 0) {
      toast.error("Please select an overall rating");
      return;
    }

    if (!comment.trim() || comment.trim().length < 20) {
      toast.error("Please write a review (minimum 20 characters)");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        rating,
        detailedRatings,
        comment: comment.trim(),
        photos: photos.map((photo) => ({ url: photo })),
        isRecommended,
      };

      await reviewApi.createReview(bookingId, payload);

      // ✅ Set success state (don't navigate yet)
      setReviewSubmitted(true);
      setSubmitting(false);
    } catch (error) {
      console.error("Submit review error:", error);
      toast.error(error.response?.data?.message || "Failed to submit review", {
        duration: 4000,
        style: {
          background: "#dc2626",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });
      setSubmitting(false);
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

  // ✅ SUCCESS SCREEN (Big Company Standard)
  // Replace the SUCCESS SCREEN section (lines ~190-295) with this:

  // ✅ SUCCESS SCREEN (Professional)
  if (reviewSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
            {/* Success Icon - No Animation */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>

            {/* Success Message - No Emoji */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Thank You for Your Review
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              Your feedback helps {artisanName} improve their service
            </p>
            <p className="text-gray-500 mb-8">
              and helps other customers make informed decisions
            </p>

            {/* Review Summary */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Award className="w-8 h-8 text-yellow-600" />
                <h3 className="text-xl font-bold text-gray-900">Your Rating</h3>
              </div>
              <div className="flex justify-center items-center space-x-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-10 h-10 ${
                      star <= rating
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {rating} out of 5 stars
              </p>
              {isRecommended && (
                <div className="flex items-center justify-center space-x-2 mt-3">
                  <ThumbsUp className="w-5 h-5 text-green-600" />
                  <span className="text-green-700 font-semibold">
                    Recommended to others
                  </span>
                </div>
              )}
            </div>

            {/* Your Review Preview */}
            <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
              <h3 className="font-bold text-gray-900 mb-3">Your Review</h3>
              <p className="text-gray-700 italic">"{comment}"</p>
              {photos.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-600 mb-2">
                    {photos.length} photo{photos.length > 1 ? "s" : ""} attached
                  </p>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                onClick={() => navigate("/customer/dashboard/history")}
                className="flex-1 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-xl"
              >
                View Job History
              </button>
              <button
                onClick={() => navigate("/customer/dashboard")}
                className="flex-1 py-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all"
              >
                Back to Dashboard
              </button>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Review published:</strong> Your review is now visible
                  on {booking.artisan?.firstName}'s profile
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-sm text-green-800">
                  <strong>Points earned:</strong> You've earned reputation
                  points for leaving a review
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ✅ REGULAR REVIEW FORM (Before Submission)
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/customer/dashboard/history")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to History</span>
          </button>
          <h1
            className="text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Leave a Review
          </h1>
          <p className="text-gray-600 mt-2">
            Share your experience with {artisanName}
          </p>
        </div>

        {/* Artisan Info Card */}
        <div
          className="bg-white rounded-2xl p-6 mb-6"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <div className="flex items-center space-x-4">
            <img
              src={
                booking.artisan?.profilePhoto ||
                `https://ui-avatars.com/api/?name=${artisanName}&background=3b82f6&color=fff&size=150`
              }
              alt={artisanName}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div className="flex-1">
              <h3 className="font-bold text-lg">{artisanName}</h3>
              <p className="text-sm text-gray-600">{booking.service?.name}</p>
              <p className="text-xs text-gray-500 mt-1">
                Completed on{" "}
                {new Date(booking.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        {/* Review Form */}
        <div className="space-y-6">
          {/* Overall Rating */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="text-center mb-4">
              <h3 className="font-bold text-xl mb-2">Overall Rating</h3>
              <p className="text-sm text-gray-600">
                How would you rate your experience?
              </p>
            </div>

            <div className="flex justify-center items-center space-x-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-12 h-12 ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            {rating > 0 && (
              <p className="text-center text-gray-700 font-semibold">
                {rating === 5 && "Excellent! ⭐"}
                {rating === 4 && "Very Good! 👍"}
                {rating === 3 && "Good 👌"}
                {rating === 2 && "Fair 😐"}
                {rating === 1 && "Poor 😞"}
              </p>
            )}
          </div>

          {/* Detailed Ratings */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <h3 className="font-bold text-lg mb-4">Detailed Ratings</h3>
            <div className="space-y-4">
              {DETAILED_RATINGS.map(({ key, label }) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">
                      {label}
                    </span>
                    <span className="text-sm text-gray-600">
                      {detailedRatings[key]}/5
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleDetailedRating(key, star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= detailedRatings[key]
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Written Review */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-lg">Your Review</h3>
              <span className="text-red-500">*</span>
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about your experience. What did you like? Was there anything that could be improved?"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ borderColor: COLORS.gray[200] }}
              rows={6}
              required
            />
            <div className="flex justify-between items-center mt-2">
              <p className="text-sm text-gray-500">Minimum 20 characters</p>
              <p
                className={`text-sm ${
                  comment.length >= 20 ? "text-green-600" : "text-gray-400"
                }`}
              >
                {comment.length} characters
              </p>
            </div>
          </div>

          {/* Photos (Optional) */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-lg">Add Photos (Optional)</h3>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {photoPreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute top-2 right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {photos.length < 5 && (
                <label className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-all">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                </label>
              )}
            </div>
            <p className="text-sm text-gray-500">
              Upload up to 5 photos (max 5MB each)
            </p>
          </div>

          {/* Recommendation */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <ThumbsUp className="w-5 h-5 text-primary-600" />
                <div>
                  <h3 className="font-bold text-lg">
                    Would you recommend {booking.artisan?.firstName}?
                  </h3>
                  <p className="text-sm text-gray-600">
                    Help others make informed decisions
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecommended}
                  onChange={(e) => setIsRecommended(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/customer/dashboard/history")}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={submitting}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Submit Review</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
