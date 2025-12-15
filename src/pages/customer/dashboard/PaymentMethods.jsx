import React, { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle,
  Star,
  DollarSign,
  Clock,
  TrendingUp,
  X,
  AlertCircle,
  Smartphone,
  Building2,
  Wallet,
  Shield,
  Calendar,
  ArrowUpRight,
} from "lucide-react";

/* ==================== DESIGN SYSTEM ==================== */
const COLORS = {
  primary: {
    50: "#eff6ff",
    100: "#dbeafe",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
  },
  success: { 50: "#f0fdf4", 600: "#16a34a" },
  warning: { 50: "#fffbeb", 500: "#f59e0b" },
  danger: { 50: "#fef2f2", 600: "#dc2626" },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    900: "#111827",
  },
};

/* ==================== REUSABLE COMPONENTS ==================== */
const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div
    className="bg-white rounded-xl p-6 transition-all duration-300 hover:shadow-lg"
    style={{ border: `1px solid ${COLORS.gray[100]}` }}
  >
    <div className="flex items-center justify-between mb-3">
      <div className="p-3 rounded-xl" style={{ backgroundColor: color.bg }}>
        <Icon className="w-6 h-6" style={{ color: color.text }} />
      </div>
    </div>
    <p className="text-3xl font-bold mb-1" style={{ color: COLORS.gray[900] }}>
      {value}
    </p>
    <p className="text-sm font-medium" style={{ color: COLORS.gray[600] }}>
      {label}
    </p>
    {subtext && (
      <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
        {subtext}
      </p>
    )}
  </div>
);

/* ==================== MAIN COMPONENT ==================== */
export default function PaymentMethods() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [activeTab, setActiveTab] = useState("cards");
  const [newCard, setNewCard] = useState({
    number: "",
    name: "",
    expiry: "",
    cvv: "",
  });

  // Payment methods state
  const [paymentMethods, setPaymentMethods] = useState({
    cards: [
      {
        id: 1,
        type: "visa",
        last4: "4242",
        name: "John Doe",
        expiry: "12/25",
        isDefault: true,
        addedDate: "Jan 2024",
      },
      {
        id: 2,
        type: "mastercard",
        last4: "8888",
        name: "John Doe",
        expiry: "06/26",
        isDefault: false,
        addedDate: "Mar 2024",
      },
    ],
    mobileMoney: [
      {
        id: 3,
        type: "mtn",
        number: "0803****890",
        name: "John Doe",
        isDefault: false,
        addedDate: "Feb 2024",
      },
      {
        id: 4,
        type: "airtel",
        number: "0805****234",
        name: "John Doe",
        isDefault: false,
        addedDate: "Apr 2024",
      },
    ],
    bankAccounts: [
      {
        id: 5,
        type: "bank",
        bankName: "First Bank",
        accountNumber: "****5678",
        accountName: "John Doe",
        isDefault: false,
        addedDate: "May 2024",
      },
    ],
  });

  // Recent transactions
  const recentTransactions = [
    {
      id: 1,
      description: "Plumbing Service - Chidi Okafor",
      amount: "₦12,000",
      date: "Oct 28, 2025",
      status: "Completed",
      method: "Visa ••42",
      type: "payment",
    },
    {
      id: 2,
      description: "Electrical Work - Amina Hassan",
      amount: "₦18,500",
      date: "Oct 25, 2025",
      status: "Completed",
      method: "MTN MoMo",
      type: "payment",
    },
    {
      id: 3,
      description: "Wallet Top-up",
      amount: "₦50,000",
      date: "Oct 20, 2025",
      status: "Completed",
      method: "Bank Transfer",
      type: "topup",
    },
    {
      id: 4,
      description: "Carpentry - Tunde Bakare",
      amount: "₦25,000",
      date: "Oct 15, 2025",
      status: "Completed",
      method: "Mastercard ••88",
      type: "payment",
    },
  ];

  // Stats
  const stats = {
    totalSpent: "₦485,000",
    thisMonth: "₦55,500",
    avgTransaction: "₦20,208",
    savedMethods:
      paymentMethods.cards.length +
      paymentMethods.mobileMoney.length +
      paymentMethods.bankAccounts.length,
  };

  const handleSetDefault = (id, category) => {
    setPaymentMethods((prev) => {
      const updated = { ...prev };
      // Remove default from all methods in the category
      updated[category] = updated[category].map((method) => ({
        ...method,
        isDefault: method.id === id,
      }));
      return updated;
    });
    alert("Default payment method updated!");
  };

  const handleDelete = () => {
    if (selectedMethod) {
      const { id, category } = selectedMethod;
      setPaymentMethods((prev) => ({
        ...prev,
        [category]: prev[category].filter((method) => method.id !== id),
      }));
      setShowDeleteModal(false);
      setSelectedMethod(null);
      alert("Payment method deleted!");
    }
  };

  const handleAddCard = () => {
    if (!newCard.number || !newCard.name || !newCard.expiry || !newCard.cvv) {
      alert("Please fill all fields!");
      return;
    }
    const newMethod = {
      id: Date.now(),
      type: newCard.number.startsWith("4") ? "visa" : "mastercard",
      last4: newCard.number.slice(-4),
      name: newCard.name,
      expiry: newCard.expiry,
      isDefault: paymentMethods.cards.length === 0,
      addedDate: "Just now",
    };
    setPaymentMethods((prev) => ({
      ...prev,
      cards: [...prev.cards, newMethod],
    }));
    setNewCard({ number: "", name: "", expiry: "", cvv: "" });
    setShowAddModal(false);
    alert("Card added successfully!");
  };

  const getCardIcon = (type) => {
    const icons = {
      visa: "💳",
      mastercard: "💳",
      mtn: "📱",
      airtel: "📱",
      bank: "🏦",
    };
    return icons[type] || "💳";
  };

  const getCardColor = (type) => {
    const colors = {
      visa: { bg: "#1a1f71", text: "#ffffff" },
      mastercard: { bg: "#eb001b", text: "#ffffff" },
      mtn: { bg: "#ffcb05", text: "#000000" },
      airtel: { bg: "#ed1c24", text: "#ffffff" },
      bank: { bg: COLORS.gray[700], text: "#ffffff" },
    };
    return colors[type] || { bg: COLORS.gray[700], text: "#ffffff" };
  };

  const renderPaymentCard = (method, category) => {
    const cardColor = getCardColor(method.type);

    return (
      <div
        key={method.id}
        className="bg-white rounded-2xl p-6 transition-all duration-300 hover:shadow-lg relative group"
        style={{
          border: `2px solid ${
            method.isDefault ? COLORS.primary[500] : COLORS.gray[100]
          }`,
        }}
      >
        {method.isDefault && (
          <div
            className="absolute -top-3 left-6 px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1"
            style={{
              backgroundColor: COLORS.primary[600],
              color: "white",
            }}
          >
            <Star className="w-3 h-3 fill-white" />
            <span>Default</span>
          </div>
        )}

        <div className="flex items-start justify-between mb-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
            style={{ backgroundColor: cardColor.bg }}
          >
            {getCardIcon(method.type)}
          </div>
          <div className="flex items-center space-x-2">
            {!method.isDefault && (
              <button
                onClick={() => handleSetDefault(method.id, category)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-all"
                title="Set as default"
              >
                <Star className="w-5 h-5" style={{ color: COLORS.gray[400] }} />
              </button>
            )}
            <button
              onClick={() => {
                setSelectedMethod({ ...method, category });
                setShowDeleteModal(true);
              }}
              className="p-2 rounded-lg hover:bg-red-50 transition-all"
              title="Delete"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {method.last4 && (
            <p
              className="text-2xl font-bold tracking-wider"
              style={{ color: COLORS.gray[900] }}
            >
              •••• •••• •••• {method.last4}
            </p>
          )}
          {method.number && (
            <p
              className="text-lg font-bold"
              style={{ color: COLORS.gray[900] }}
            >
              {method.number}
            </p>
          )}
          {method.accountNumber && (
            <p
              className="text-lg font-bold"
              style={{ color: COLORS.gray[900] }}
            >
              {method.accountNumber}
            </p>
          )}

          <div className="flex items-center justify-between pt-3">
            <div>
              <p
                className="text-xs font-medium"
                style={{ color: COLORS.gray[500] }}
              >
                {method.accountName || method.name}
              </p>
              {method.bankName && (
                <p
                  className="text-sm font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  {method.bankName}
                </p>
              )}
            </div>
            {method.expiry && (
              <div>
                <p
                  className="text-xs font-medium"
                  style={{ color: COLORS.gray[500] }}
                >
                  Expires
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  {method.expiry}
                </p>
              </div>
            )}
          </div>

          <div
            className="pt-3 border-t"
            style={{ borderColor: COLORS.gray[100] }}
          >
            <p className="text-xs" style={{ color: COLORS.gray[500] }}>
              Added {method.addedDate}
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Payment Methods
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Manage your payment methods and view transactions
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard
          icon={DollarSign}
          label="Total Spent"
          value={stats.totalSpent}
          subtext="All time"
          color={{ bg: COLORS.primary[50], text: COLORS.primary[600] }}
        />
        <StatCard
          icon={TrendingUp}
          label="This Month"
          value={stats.thisMonth}
          subtext="October 2025"
          color={{ bg: COLORS.success[50], text: COLORS.success[600] }}
        />
        <StatCard
          icon={Wallet}
          label="Avg Transaction"
          value={stats.avgTransaction}
          subtext="Per booking"
          color={{ bg: COLORS.warning[50], text: COLORS.warning[500] }}
        />
        <StatCard
          icon={CreditCard}
          label="Saved Methods"
          value={stats.savedMethods}
          subtext="Active"
          color={{ bg: COLORS.primary[50], text: COLORS.primary[600] }}
        />
      </div>

      {/* Security Info Banner */}
      <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 flex items-start space-x-3">
        <Shield className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-blue-900">
            Your payment information is secure
          </p>
          <p className="text-xs text-blue-700 mt-1">
            We use bank-level encryption to protect your data. We never store
            your full card details.
          </p>
        </div>
      </div>

      {/* Payment Methods Tabs */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="border-b" style={{ borderColor: COLORS.gray[200] }}>
          <nav className="flex overflow-x-auto">
            {[
              {
                id: "cards",
                label: "Cards",
                icon: CreditCard,
                count: paymentMethods.cards.length,
              },
              {
                id: "mobileMoney",
                label: "Mobile Money",
                icon: Smartphone,
                count: paymentMethods.mobileMoney.length,
              },
              {
                id: "bankAccounts",
                label: "Bank Accounts",
                icon: Building2,
                count: paymentMethods.bankAccounts.length,
              },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-6 border-b-2 font-medium text-sm transition-colors whitespace-nowrap flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{
                      backgroundColor:
                        activeTab === tab.id
                          ? COLORS.primary[100]
                          : COLORS.gray[100],
                      color:
                        activeTab === tab.id
                          ? COLORS.primary[600]
                          : COLORS.gray[600],
                    }}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {/* Add Button */}
          <div className="mb-6">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              <Plus className="w-5 h-5" />
              <span>
                Add New{" "}
                {activeTab === "cards"
                  ? "Card"
                  : activeTab === "mobileMoney"
                  ? "Mobile Money"
                  : "Bank Account"}
              </span>
            </button>
          </div>

          {/* Payment Methods Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === "cards" &&
              paymentMethods.cards.map((method) =>
                renderPaymentCard(method, "cards")
              )}
            {activeTab === "mobileMoney" &&
              paymentMethods.mobileMoney.map((method) =>
                renderPaymentCard(method, "mobileMoney")
              )}
            {activeTab === "bankAccounts" &&
              paymentMethods.bankAccounts.map((method) =>
                renderPaymentCard(method, "bankAccounts")
              )}
          </div>

          {/* Empty State */}
          {activeTab === "cards" && paymentMethods.cards.length === 0 && (
            <div className="text-center py-12">
              <CreditCard
                className="w-16 h-16 mx-auto mb-4"
                style={{ color: COLORS.gray[300] }}
              />
              <h3
                className="text-lg font-bold mb-2"
                style={{ color: COLORS.gray[900] }}
              >
                No cards added yet
              </h3>
              <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                Add a card to make payments faster
              </p>
            </div>
          )}
          {activeTab === "mobileMoney" &&
            paymentMethods.mobileMoney.length === 0 && (
              <div className="text-center py-12">
                <Smartphone
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: COLORS.gray[300] }}
                />
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  No mobile money accounts
                </h3>
                <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                  Link your mobile money account
                </p>
              </div>
            )}
          {activeTab === "bankAccounts" &&
            paymentMethods.bankAccounts.length === 0 && (
              <div className="text-center py-12">
                <Building2
                  className="w-16 h-16 mx-auto mb-4"
                  style={{ color: COLORS.gray[300] }}
                />
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  No bank accounts added
                </h3>
                <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                  Add a bank account for direct transfers
                </p>
              </div>
            )}
        </div>
      </div>

      {/* Recent Transactions */}
      <div
        className="bg-white rounded-2xl p-6"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3
            className="text-lg font-bold flex items-center space-x-2"
            style={{ color: COLORS.gray[900] }}
          >
            <Clock className="w-5 h-5" style={{ color: COLORS.primary[600] }} />
            <span>Recent Transactions</span>
          </h3>
          <button
            className="text-sm font-medium flex items-center space-x-1 hover:underline"
            style={{ color: COLORS.primary[600] }}
          >
            <span>View All</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          {recentTransactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-all"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    backgroundColor:
                      transaction.type === "topup"
                        ? COLORS.success[50]
                        : COLORS.primary[50],
                  }}
                >
                  {transaction.type === "topup" ? (
                    <ArrowUpRight
                      className="w-6 h-6"
                      style={{ color: COLORS.success[600] }}
                    />
                  ) : (
                    <DollarSign
                      className="w-6 h-6"
                      style={{ color: COLORS.primary[600] }}
                    />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p
                    className="font-semibold text-sm truncate"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {transaction.description}
                  </p>
                  <div className="flex items-center space-x-2 mt-1">
                    <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                      {transaction.date}
                    </p>
                    <span style={{ color: COLORS.gray[300] }}>•</span>
                    <p className="text-xs" style={{ color: COLORS.gray[500] }}>
                      {transaction.method}
                    </p>
                  </div>
                </div>
              </div>
              <div className="text-right flex-shrink-0 ml-4">
                <p
                  className="text-lg font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  {transaction.amount}
                </p>
                <div
                  className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs font-bold mt-1"
                  style={{
                    backgroundColor: COLORS.success[50],
                    color: COLORS.success[600],
                  }}
                >
                  <CheckCircle className="w-3 h-3" />
                  <span>{transaction.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Payment Method Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div
              className="sticky top-0 bg-white border-b p-6 flex justify-between items-center z-10"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <h2
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Add New Card
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Card Number
                </label>
                <input
                  type="text"
                  value={newCard.number}
                  onChange={(e) =>
                    setNewCard({ ...newCard, number: e.target.value })
                  }
                  placeholder="1234 5678 9012 3456"
                  maxLength="16"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Cardholder Name
                </label>
                <input
                  type="text"
                  value={newCard.name}
                  onChange={(e) =>
                    setNewCard({ ...newCard, name: e.target.value })
                  }
                  placeholder="John Doe"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Expiry Date
                  </label>
                  <input
                    type="text"
                    value={newCard.expiry}
                    onChange={(e) =>
                      setNewCard({ ...newCard, expiry: e.target.value })
                    }
                    placeholder="MM/YY"
                    maxLength="5"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    CVV
                  </label>
                  <input
                    type="text"
                    value={newCard.cvv}
                    onChange={(e) =>
                      setNewCard({ ...newCard, cvv: e.target.value })
                    }
                    placeholder="123"
                    maxLength="3"
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
              </div>

              <div
                className="p-4 rounded-lg flex items-start space-x-3"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <Shield
                  className="w-5 h-5 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.success[600] }}
                />
                <div>
                  <p
                    className="text-xs font-semibold mb-1"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Your card is secure
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                    We use 256-bit encryption to protect your payment
                    information.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddCard}
                  className="flex-1 px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  Add Card
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedMethod && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <h2
                className="text-xl font-bold"
                style={{ color: COLORS.danger[600] }}
              >
                Delete Payment Method
              </h2>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" style={{ color: COLORS.gray[600] }} />
              </button>
            </div>

            <div className="p-6">
              <div
                className="p-4 rounded-lg mb-4 flex items-start space-x-3"
                style={{ backgroundColor: COLORS.danger[50] }}
              >
                <AlertCircle
                  className="w-6 h-6 flex-shrink-0 mt-0.5"
                  style={{ color: COLORS.danger[600] }}
                />
                <div>
                  <p
                    className="font-semibold text-sm mb-1"
                    style={{ color: COLORS.danger[600] }}
                  >
                    Are you sure?
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[700] }}>
                    This payment method will be permanently removed from your
                    account.
                  </p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span style={{ color: COLORS.gray[600] }}>Type:</span>
                  <span
                    className="font-semibold capitalize"
                    style={{ color: COLORS.gray[900] }}
                  >
                    {selectedMethod.type}
                  </span>
                </div>
                {selectedMethod.last4 && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.gray[600] }}>
                      Card Number:
                    </span>
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      •••• {selectedMethod.last4}
                    </span>
                  </div>
                )}
                {selectedMethod.number && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.gray[600] }}>Number:</span>
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {selectedMethod.number}
                    </span>
                  </div>
                )}
                {selectedMethod.bankName && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: COLORS.gray[600] }}>Bank:</span>
                    <span
                      className="font-semibold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      {selectedMethod.bankName}
                    </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
