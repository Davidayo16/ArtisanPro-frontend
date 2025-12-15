import React, { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  User,
  Star,
  Shield,
  CreditCard,
  Wallet,
  Smartphone,
  CheckCircle,
  AlertCircle,
  Edit,
  Info,
} from "lucide-react";

export default function BookingConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();

  // Get booking data from previous page
  const bookingData = location.state || {
    artisan: {
      id: 1,
      name: "Chidi Okafor",
      photo: "/images/artisan4.jpg",
      rating: 4.9,
      reviews: 127,
      service: "Plumbing",
      responseTime: "5 min",
    },
    service: {
      category: "Plumbing",
      subService: "Pipe Repair",
      description:
        "Kitchen sink pipe is leaking under the counter. Water dripping continuously.",
    },
    schedule: {
      date: "2025-10-25",
      time: "10:00 AM",
      duration: "2 hours",
    },
    location: {
      address: "15 Admiralty Way, Lekki Phase 1",
      city: "Lagos",
      landmark: "Near Circle Mall",
    },
    pricing: {
      serviceCharge: 12000,
      platformFee: 1200,
      tax: 660,
      total: 13860,
    },
  };

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const paymentMethods = [
    { id: "card", name: "Debit/Credit Card", icon: CreditCard, popular: true },
    { id: "wallet", name: "Wallet Balance", icon: Wallet, balance: "₦25,000" },
    { id: "transfer", name: "Bank Transfer", icon: Smartphone },
    { id: "mobile", name: "Mobile Money (MTN/Airtel)", icon: Smartphone },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleConfirmBooking = async () => {
    if (!agreedToTerms) {
      alert("Please accept the terms and conditions");
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Navigate to payment page
      navigate("/payment", {
        state: {
          bookingData,
          paymentMethod,
          bookingId: `BK${Date.now()}`,
        },
      });
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back</span>
            </button>

            <Link to="/" className="flex items-center gap-2">
              <img
                src="/images/logo.png"
                alt="ArtisanPro NG"
                className="w-16 h-16 object-contain"
              />
            </Link>

            <div className="w-20"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Confirm Your Booking
          </h1>
          <p className="text-gray-600">
            Review your booking details before proceeding to payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Booking Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Artisan Card */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Your Artisan
                </h2>
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Change</span>
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <img
                  src={bookingData.artisan.photo}
                  alt={bookingData.artisan.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-blue-100"
                />
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">
                    {bookingData.artisan.name}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {bookingData.artisan.service}
                  </p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {bookingData.artisan.rating}
                      </span>
                      <span className="text-gray-600">
                        ({bookingData.artisan.reviews})
                      </span>
                    </div>
                    <div className="flex items-center space-x-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>
                        Responds in {bookingData.artisan.responseTime}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Service Details
                </h2>
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Service Type</p>
                  <p className="font-semibold text-gray-900">
                    {bookingData.service.category} -{" "}
                    {bookingData.service.subService}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">
                    Problem Description
                  </p>
                  <p className="text-gray-900">
                    {bookingData.service.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Schedule */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Schedule</h2>
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(bookingData.schedule.date)}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Time</p>
                    <p className="font-semibold text-gray-900">
                      {bookingData.schedule.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {bookingData.schedule.duration}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">
                  Service Location
                </h2>
                <button
                  onClick={() => navigate(-1)}
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit</span>
                </button>
              </div>

              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 mb-1">
                    {bookingData.location.address}
                  </p>
                  <p className="text-gray-600">{bookingData.location.city}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Landmark: {bookingData.location.landmark}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Payment Method
              </h2>

              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${
                      paymentMethod === method.id
                        ? "border-blue-600 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={paymentMethod === method.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="w-5 h-5 text-blue-600"
                      />
                      <method.icon className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {method.name}
                        </p>
                        {method.balance && (
                          <p className="text-sm text-gray-600">
                            Balance: {method.balance}
                          </p>
                        )}
                      </div>
                    </div>
                    {method.popular && (
                      <span className="px-2 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <label className="flex items-start space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="w-5 h-5 text-blue-600 rounded mt-0.5"
                />
                <div className="flex-1">
                  <p className="text-gray-900">
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link
                      to="/privacy"
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    By booking, you agree to our cancellation policy and service
                    terms.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Right Column - Price Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Price Breakdown */}
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Price Summary
                </h2>

                <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Service Charge</span>
                    <span className="font-semibold text-gray-900">
                      ₦{bookingData.pricing.serviceCharge.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Platform Fee (10%)</span>
                    <span className="font-semibold text-gray-900">
                      ₦{bookingData.pricing.platformFee.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Tax (5%)</span>
                    <span className="font-semibold text-gray-900">
                      ₦{bookingData.pricing.tax.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-6">
                  <span className="text-lg font-bold text-gray-900">
                    Total Amount
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    ₦{bookingData.pricing.total.toLocaleString()}
                  </span>
                </div>

                {/* Confirm Button */}
                <button
                  onClick={handleConfirmBooking}
                  disabled={!agreedToTerms || isProcessing}
                  className="w-full py-4 rounded-xl text-white font-bold text-lg hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  {isProcessing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-6 h-6" />
                      <span>Confirm & Pay</span>
                    </>
                  )}
                </button>

                {!agreedToTerms && (
                  <p className="text-xs text-red-600 text-center mt-2 flex items-center justify-center space-x-1">
                    <AlertCircle className="w-3 h-3" />
                    <span>Please accept terms to continue</span>
                  </p>
                )}
              </div>

              {/* Security Badge */}
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1 text-sm">
                      Payment Protection
                    </h3>
                    <p className="text-xs text-blue-700">
                      Your payment is held securely until the job is completed.
                      Money-back guarantee if service not delivered.
                    </p>
                  </div>
                </div>
              </div>

              {/* Important Info */}
              <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100 mt-4">
                <div className="flex items-start space-x-3">
                  <Info className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-yellow-900 mb-1 text-sm">
                      Cancellation Policy
                    </h3>
                    <ul className="text-xs text-yellow-700 space-y-1">
                      <li>• Free cancellation up to 2 hours before service</li>
                      <li>• 50% refund if cancelled 1-2 hours before</li>
                      <li>• No refund for last-minute cancellations</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
