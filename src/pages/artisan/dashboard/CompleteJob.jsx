// frontend/pages/artisan/CompleteJob.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Upload,
  X,
  ImageIcon,
  Loader,
  CheckCircle,
  Clock,
  Package,
  FileText,
  Camera,
} from "lucide-react";
import { useBookingStore } from "../../../stores/bookingStore";
import bookingApi from "../../../api/bookingApi";
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

export default function CompleteJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [completionNotes, setCompletionNotes] = useState("");
  const [workDuration, setWorkDuration] = useState("");
  const [materialsUsed, setMaterialsUsed] = useState([{ name: "", cost: "" }]);
  const [photos, setPhotos] = useState([]);
  const [photoPreviews, setPhotoPreviews] = useState([]);

  useEffect(() => {
    fetchBooking();
  }, [id]);

    const fetchBooking = async () => {
      console.log("🔍 Fetching booking with ID:", id);
    try {
        const res = await bookingApi.getBooking(id);
          const bookingData = res.data.data;

          // ✅ ADD THIS
          console.log("📋 Booking status:", bookingData.status);
      setBooking(res.data.data);
    } catch (error) {
      toast.error("Failed to load booking");
      navigate("/artisan/dashboard/jobs");
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

  const addMaterial = () => {
    setMaterialsUsed([...materialsUsed, { name: "", cost: "" }]);
  };

  const removeMaterial = (index) => {
    setMaterialsUsed(materialsUsed.filter((_, i) => i !== index));
  };

  const updateMaterial = (index, field, value) => {
    const updated = [...materialsUsed];
    updated[index][field] = value;
    setMaterialsUsed(updated);
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("📝 Submitting completion form");

     if (!completionNotes.trim() || completionNotes.trim().length < 20) {
       toast.error("Completion notes must be at least 20 characters");
       return;
     }

    if (photos.length === 0) {
      toast.error("Please upload at least one completion photo");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        completionNotes,
        workDuration: workDuration ? parseInt(workDuration) : null,
        materialsUsed: materialsUsed
          .filter((m) => m.name.trim())
          .map((m) => ({
            name: m.name,
            cost: parseFloat(m.cost) || 0,
          })),
        completionPhotos: photos.map((photo) => ({
          url: photo,
          type: "after",
        })),
      };
          console.log("📤 Payload being sent:", payload);
          console.log("📸 Number of photos:", photos.length);
        console.log("📝 Notes length:", completionNotes.trim().length);
        

      await bookingApi.completeJob(id, payload);

      toast.success("Job completed successfully!", {
        duration: 3000,
        style: {
          background: "#16a34a",
          color: "#fff",
          padding: "16px",
          borderRadius: "12px",
          fontWeight: "600",
        },
      });

      setTimeout(() => {
        navigate("/artisan/dashboard/jobs");
      }, 1500);
    } catch (error) {
      console.error("Completion error:", error);
      console.error("❌ Error response:", error.response?.data); // ✅ ADD THIS LINE
      toast.error(error.response?.data?.message || "Failed to complete job", {
        duration: 4000,
      });
    } finally {
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
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-600">Booking not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate("/artisan/dashboard/jobs")}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Jobs</span>
          </button>
          <h1
            className="text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Complete Job
          </h1>
          <p className="text-gray-600 mt-2">
            {booking.bookingNumber} - {booking.service.name}
          </p>
        </div>

        {/* Booking Summary */}
        <div
          className="bg-white rounded-2xl p-6 mb-6"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <h2
            className="font-bold text-xl mb-4"
            style={{ color: COLORS.gray[900] }}
          >
            Job Summary
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Customer</p>
              <p className="font-semibold">
                {booking.customer.firstName} {booking.customer.lastName}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Service</p>
              <p className="font-semibold">{booking.service.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Date</p>
              <p className="font-semibold">
                {new Date(booking.scheduledDate).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Amount</p>
              <p className="font-semibold text-xl">
                ₦{booking.estimatedPrice?.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Completion Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Completion Notes */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <FileText className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-lg">Completion Notes</h3>
              <span className="text-red-500">*</span>
            </div>
            <textarea
              value={completionNotes}
              onChange={(e) => setCompletionNotes(e.target.value)}
              placeholder="Describe what was done, any issues encountered, recommendations..."
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
              style={{ borderColor: COLORS.gray[200] }}
              rows={6}
              required
            />
            <p className="text-sm text-gray-500 mt-2">
              Minimum 20 characters required
            </p>
          </div>

          {/* Completion Photos */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-lg">Completion Photos</h3>
              <span className="text-red-500">*</span>
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
                  <span className="text-sm text-gray-500">Upload Photo</span>
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

          {/* Work Duration (Optional) */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center space-x-2 mb-4">
              <Clock className="w-5 h-5 text-primary-600" />
              <h3 className="font-bold text-lg">Work Duration (Optional)</h3>
            </div>
            <input
              type="number"
              value={workDuration}
              onChange={(e) => setWorkDuration(e.target.value)}
              placeholder="Hours spent on job"
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500"
              style={{ borderColor: COLORS.gray[200] }}
              min="0"
              step="0.5"
            />
          </div>

          {/* Materials Used (Optional) */}
          <div
            className="bg-white rounded-2xl p-6"
            style={{ border: `1px solid ${COLORS.gray[100]}` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5 text-primary-600" />
                <h3 className="font-bold text-lg">Materials Used (Optional)</h3>
              </div>
              <button
                type="button"
                onClick={addMaterial}
                className="px-4 py-2 bg-primary-50 text-primary-600 rounded-lg text-sm font-semibold hover:bg-primary-100"
              >
                + Add Material
              </button>
            </div>

            <div className="space-y-3">
              {materialsUsed.map((material, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={material.name}
                    onChange={(e) =>
                      updateMaterial(index, "name", e.target.value)
                    }
                    placeholder="Material name"
                    className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                  <input
                    type="number"
                    value={material.cost}
                    onChange={(e) =>
                      updateMaterial(index, "cost", e.target.value)
                    }
                    placeholder="Cost (₦)"
                    className="w-32 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    style={{ borderColor: COLORS.gray[200] }}
                    min="0"
                  />
                  {materialsUsed.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeMaterial(index)}
                      className="px-3 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate("/artisan/dashboard/jobs")}
              className="flex-1 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className={`flex-1 px-6 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center space-x-2 ${
                submitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {submitting ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Completing...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Complete Job</span>
                </>
              )}
            </button>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">
              <strong>Payment Release:</strong> After you complete this job, the
              customer will have 24 hours to review and release payment. If they
              don't respond, payment will be automatically released to you.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
