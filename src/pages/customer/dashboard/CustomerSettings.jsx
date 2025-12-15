import React, { useState } from "react";
import {
  Settings,
  Bell,
  Lock,
  Eye,
  Globe,
  Shield,
  Smartphone,
  Mail,
  MessageSquare,
  Moon,
  Sun,
  Volume2,
  VolumeX,
  MapPin,
  CreditCard,
  Users,
  FileText,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Download,
  Trash2,
  ChevronRight,
  Info,
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

/* ==================== MAIN COMPONENT ==================== */
export default function CustomerSettings() {
  const [activeSection, setActiveSection] = useState("notifications");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Notifications
    emailNotifications: {
      bookingUpdates: true,
      paymentReceipts: true,
      newMessages: true,
      promotions: false,
      newsletter: false,
      reviewReminders: true,
      artisanUpdates: true,
    },
    pushNotifications: {
      bookingConfirmations: true,
      artisanEnRoute: true,
      jobCompletion: true,
      newMessages: true,
      paymentAlerts: true,
      promotions: false,
    },
    smsNotifications: {
      bookingConfirmations: true,
      paymentAlerts: true,
      emergencyAlerts: true,
    },

    // Privacy
    privacy: {
      showProfile: true,
      showBookingHistory: true,
      allowSearchEngines: false,
      shareLocation: true,
      allowReviews: true,
    },

    // Display
    display: {
      theme: "light",
      language: "en",
      timezone: "Africa/Lagos",
      currency: "NGN",
      dateFormat: "DD/MM/YYYY",
      soundEffects: true,
    },

    // Security
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: "30",
    },
  });

  const handleSettingChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSaveSettings = () => {
    alert("Settings saved successfully!");
    setHasUnsavedChanges(false);
  };

  const handleResetSettings = () => {
    if (
      window.confirm(
        "Reset all settings to default? This action cannot be undone."
      )
    ) {
      alert("Settings reset to default!");
      setHasUnsavedChanges(false);
    }
  };

  const handleExportData = () => {
    alert(
      "Your data export has been initiated. You'll receive an email shortly."
    );
  };

  const handleDeleteAllData = () => {
    if (
      window.confirm(
        "Delete all your data? This will remove all bookings, reviews, and account information. This action cannot be undone."
      )
    ) {
      alert("Data deletion initiated. You will receive a confirmation email.");
    }
  };

  /* ---------------------- RENDER ---------------------- */
  const ToggleSwitch = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 rounded-lg hover:bg-gray-50 transition-all">
      <div className="flex-1 pr-4">
        <p
          className="font-semibold text-sm mb-1"
          style={{ color: COLORS.gray[900] }}
        >
          {label}
        </p>
        {description && (
          <p className="text-xs" style={{ color: COLORS.gray[600] }}>
            {description}
          </p>
        )}
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      </label>
    </div>
  );

  const sections = [
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      description: "Manage your notification preferences",
    },
    {
      id: "privacy",
      label: "Privacy & Data",
      icon: Shield,
      description: "Control your privacy and data settings",
    },
    {
      id: "security",
      label: "Security",
      icon: Lock,
      description: "Manage security and login settings",
    },
    {
      id: "display",
      label: "Display & Language",
      icon: Globe,
      description: "Customize your app experience",
    },
    {
      id: "account",
      label: "Account Management",
      icon: Users,
      description: "Manage your account data",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            Settings
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Manage your account preferences and settings
          </p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleResetSettings}
              className="px-4 py-2 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all text-sm"
              style={{
                borderColor: COLORS.gray[300],
                color: COLORS.gray[700],
              }}
            >
              Reset
            </button>
            <button
              onClick={handleSaveSettings}
              className="px-6 py-2 rounded-lg text-white font-semibold hover:shadow-lg transition-all text-sm flex items-center space-x-2"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        )}
      </div>

      {/* Unsaved Changes Alert */}
      {hasUnsavedChanges && (
        <div
          className="p-4 rounded-xl flex items-start space-x-3"
          style={{ backgroundColor: COLORS.warning[50] }}
        >
          <AlertCircle
            className="w-5 h-5 flex-shrink-0 mt-0.5"
            style={{ color: COLORS.warning[500] }}
          />
          <div>
            <p
              className="font-semibold text-sm"
              style={{ color: COLORS.warning[500] }}
            >
              You have unsaved changes
            </p>
            <p className="text-xs" style={{ color: COLORS.gray[700] }}>
              Don't forget to save your changes before leaving this page
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div
          className="lg:col-span-1 bg-white rounded-2xl p-4"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <nav className="space-y-1">
            {sections.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;

              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    isActive
                      ? {
                          backgroundImage:
                            "linear-gradient(to right, #224e8c, #2a5ca8)",
                        }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm text-left">
                    {section.label}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications Section */}
          {activeSection === "notifications" && (
            <>
              {/* Email Notifications */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <Mail
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        Email Notifications
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Manage what emails you receive
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.emailNotifications.bookingUpdates}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "bookingUpdates",
                        val
                      )
                    }
                    label="Booking Updates"
                    description="Confirmations, changes, and reminders"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.paymentReceipts}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "paymentReceipts",
                        val
                      )
                    }
                    label="Payment Receipts"
                    description="Receipts and invoices"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.newMessages}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "newMessages",
                        val
                      )
                    }
                    label="New Messages"
                    description="When artisans send you messages"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.reviewReminders}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "reviewReminders",
                        val
                      )
                    }
                    label="Review Reminders"
                    description="Reminders to review completed jobs"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.artisanUpdates}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "artisanUpdates",
                        val
                      )
                    }
                    label="Artisan Updates"
                    description="News about your saved artisans"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.promotions}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "promotions",
                        val
                      )
                    }
                    label="Promotional Emails"
                    description="Special offers and discounts"
                  />
                  <ToggleSwitch
                    checked={settings.emailNotifications.newsletter}
                    onChange={(val) =>
                      handleSettingChange(
                        "emailNotifications",
                        "newsletter",
                        val
                      )
                    }
                    label="Newsletter"
                    description="Weekly tips and platform updates"
                  />
                </div>
              </div>

              {/* Push Notifications */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <Smartphone
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        Push Notifications
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Instant alerts on your device
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.pushNotifications.bookingConfirmations}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "bookingConfirmations",
                        val
                      )
                    }
                    label="Booking Confirmations"
                    description="When artisan accepts your booking"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications.artisanEnRoute}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "artisanEnRoute",
                        val
                      )
                    }
                    label="Artisan En Route"
                    description="When artisan is on the way"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications.jobCompletion}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "jobCompletion",
                        val
                      )
                    }
                    label="Job Completion"
                    description="When job is marked as complete"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications.newMessages}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "newMessages",
                        val
                      )
                    }
                    label="New Messages"
                    description="Real-time message notifications"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications.paymentAlerts}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "paymentAlerts",
                        val
                      )
                    }
                    label="Payment Alerts"
                    description="Payment confirmations and reminders"
                  />
                  <ToggleSwitch
                    checked={settings.pushNotifications.promotions}
                    onChange={(val) =>
                      handleSettingChange(
                        "pushNotifications",
                        "promotions",
                        val
                      )
                    }
                    label="Promotional Notifications"
                    description="Deals and special offers"
                  />
                </div>
              </div>

              {/* SMS Notifications */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <MessageSquare
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        SMS Notifications
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Text message alerts
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.smsNotifications.bookingConfirmations}
                    onChange={(val) =>
                      handleSettingChange(
                        "smsNotifications",
                        "bookingConfirmations",
                        val
                      )
                    }
                    label="Booking Confirmations"
                    description="SMS when booking is confirmed"
                  />
                  <ToggleSwitch
                    checked={settings.smsNotifications.paymentAlerts}
                    onChange={(val) =>
                      handleSettingChange(
                        "smsNotifications",
                        "paymentAlerts",
                        val
                      )
                    }
                    label="Payment Alerts"
                    description="Important payment notifications"
                  />
                  <ToggleSwitch
                    checked={settings.smsNotifications.emergencyAlerts}
                    onChange={(val) =>
                      handleSettingChange(
                        "smsNotifications",
                        "emergencyAlerts",
                        val
                      )
                    }
                    label="Emergency Alerts"
                    description="Critical account security alerts"
                  />
                </div>
              </div>
            </>
          )}

          {/* Privacy Section */}
          {activeSection === "privacy" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: COLORS.primary[50] }}
                  >
                    <Shield
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Privacy Settings
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      Control who can see your information
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <ToggleSwitch
                  checked={settings.privacy.showProfile}
                  onChange={(val) =>
                    handleSettingChange("privacy", "showProfile", val)
                  }
                  label="Show Profile to Artisans"
                  description="Let artisans see your profile information"
                />
                <ToggleSwitch
                  checked={settings.privacy.showBookingHistory}
                  onChange={(val) =>
                    handleSettingChange("privacy", "showBookingHistory", val)
                  }
                  label="Show Booking History"
                  description="Display your booking count publicly"
                />
                <ToggleSwitch
                  checked={settings.privacy.allowSearchEngines}
                  onChange={(val) =>
                    handleSettingChange("privacy", "allowSearchEngines", val)
                  }
                  label="Allow Search Engines"
                  description="Let search engines index your profile"
                />
                <ToggleSwitch
                  checked={settings.privacy.shareLocation}
                  onChange={(val) =>
                    handleSettingChange("privacy", "shareLocation", val)
                  }
                  label="Share Location"
                  description="Share your location with artisans during bookings"
                />
                <ToggleSwitch
                  checked={settings.privacy.allowReviews}
                  onChange={(val) =>
                    handleSettingChange("privacy", "allowReviews", val)
                  }
                  label="Allow Artisan Reviews"
                  description="Let artisans leave reviews about you"
                />
              </div>
            </div>
          )}

          {/* Security Section */}
          {activeSection === "security" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: COLORS.primary[50] }}
                  >
                    <Lock
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Security Settings
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      Manage your account security
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <ToggleSwitch
                  checked={settings.security.twoFactorAuth}
                  onChange={(val) =>
                    handleSettingChange("security", "twoFactorAuth", val)
                  }
                  label="Two-Factor Authentication"
                  description="Add an extra layer of security to your account"
                />
                <ToggleSwitch
                  checked={settings.security.loginAlerts}
                  onChange={(val) =>
                    handleSettingChange("security", "loginAlerts", val)
                  }
                  label="Login Alerts"
                  description="Get notified of new logins to your account"
                />

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Session Timeout
                  </label>
                  <select
                    value={settings.security.sessionTimeout}
                    onChange={(e) =>
                      handleSettingChange(
                        "security",
                        "sessionTimeout",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="120">2 hours</option>
                    <option value="never">Never</option>
                  </select>
                  <p
                    className="text-xs mt-1"
                    style={{ color: COLORS.gray[500] }}
                  >
                    Automatically log out after period of inactivity
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Display Section */}
          {activeSection === "display" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <div
                className="p-6 border-b"
                style={{ borderColor: COLORS.gray[200] }}
              >
                <div className="flex items-center space-x-3">
                  <div
                    className="p-2 rounded-lg"
                    style={{ backgroundColor: COLORS.primary[50] }}
                  >
                    <Globe
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                  </div>
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Display & Language
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      Customize your app experience
                    </p>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-6">
                {/* Theme */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-3"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Theme
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: "light", label: "Light", icon: Sun },
                      { value: "dark", label: "Dark", icon: Moon },
                      { value: "auto", label: "Auto", icon: Settings },
                    ].map((theme) => {
                      const Icon = theme.icon;
                      return (
                        <button
                          key={theme.value}
                          onClick={() =>
                            handleSettingChange("display", "theme", theme.value)
                          }
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.display.theme === theme.value
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className="w-6 h-6 mx-auto mb-2"
                            style={{
                              color:
                                settings.display.theme === theme.value
                                  ? COLORS.primary[600]
                                  : COLORS.gray[600],
                            }}
                          />
                          <p
                            className="text-sm font-medium text-center"
                            style={{
                              color:
                                settings.display.theme === theme.value
                                  ? COLORS.primary[600]
                                  : COLORS.gray[700],
                            }}
                          >
                            {theme.label}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Language */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Language
                  </label>
                  <select
                    value={settings.display.language}
                    onChange={(e) =>
                      handleSettingChange("display", "language", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ig">Igbo</option>
                    <option value="ha">Hausa</option>
                  </select>
                </div>

                {/* Timezone */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Timezone
                  </label>
                  <select
                    value={settings.display.timezone}
                    onChange={(e) =>
                      handleSettingChange("display", "timezone", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="Africa/Lagos">Africa/Lagos (WAT)</option>
                    <option value="Africa/Accra">Africa/Accra (GMT)</option>
                    <option value="Africa/Nairobi">Africa/Nairobi (EAT)</option>
                  </select>
                </div>

                {/* Currency */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Currency
                  </label>
                  <select
                    value={settings.display.currency}
                    onChange={(e) =>
                      handleSettingChange("display", "currency", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="NGN">NGN (₦) - Nigerian Naira</option>
                    <option value="USD">USD ($) - US Dollar</option>
                    <option value="GHS">GHS (₵) - Ghanaian Cedi</option>
                    <option value="KES">KES (KSh) - Kenyan Shilling</option>
                  </select>
                </div>

                {/* Date Format */}
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Date Format
                  </label>
                  <select
                    value={settings.display.dateFormat}
                    onChange={(e) =>
                      handleSettingChange(
                        "display",
                        "dateFormat",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                {/* Sound Effects */}
                <ToggleSwitch
                  checked={settings.display.soundEffects}
                  onChange={(val) =>
                    handleSettingChange("display", "soundEffects", val)
                  }
                  label="Sound Effects"
                  description="Play sounds for notifications and actions"
                />
              </div>
            </div>
          )}

          {/* Account Management Section */}
          {activeSection === "account" && (
            <>
              {/* Data Export */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <Download
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        Export Your Data
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Download a copy of your data
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6">
                  <p
                    className="text-sm mb-4"
                    style={{ color: COLORS.gray[700] }}
                  >
                    Request a copy of all your data including bookings, reviews,
                    messages, and account information. You'll receive an email
                    with a download link within 24 hours.
                  </p>
                  <button
                    onClick={handleExportData}
                    className="px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
                    style={{
                      borderColor: COLORS.primary[600],
                      color: COLORS.primary[600],
                    }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Request Data Export</span>
                  </button>
                </div>
              </div>

              {/* Account Information */}
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <div
                  className="p-6 border-b"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: COLORS.primary[50] }}
                    >
                      <Info
                        className="w-5 h-5"
                        style={{ color: COLORS.primary[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.gray[900] }}
                      >
                        Account Information
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[600] }}
                      >
                        Your account details
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div
                    className="flex justify-between items-center py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Account Created
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      January 15, 2024
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Total Bookings
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      24 bookings
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Total Spent
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      ₦485,000
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Reviews Given
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      18 reviews
                    </span>
                  </div>
                  <div
                    className="flex justify-between items-center py-3"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Account Status
                    </span>
                    <span
                      className="text-sm font-semibold px-3 py-1 rounded-full"
                      style={{
                        backgroundColor: COLORS.success[50],
                        color: COLORS.success[600],
                      }}
                    >
                      Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                className="bg-white rounded-2xl overflow-hidden border-2"
                style={{ borderColor: COLORS.danger[600] }}
              >
                <div
                  className="p-6 border-b"
                  style={{
                    borderColor: COLORS.danger[600],
                    backgroundColor: COLORS.danger[50],
                  }}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className="p-2 rounded-lg"
                      style={{ backgroundColor: "white" }}
                    >
                      <AlertCircle
                        className="w-5 h-5"
                        style={{ color: COLORS.danger[600] }}
                      />
                    </div>
                    <div>
                      <h3
                        className="text-lg font-bold"
                        style={{ color: COLORS.danger[600] }}
                      >
                        Danger Zone
                      </h3>
                      <p
                        className="text-sm"
                        style={{ color: COLORS.gray[700] }}
                      >
                        Irreversible actions
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Delete All Data
                    </h4>
                    <p
                      className="text-sm mb-4"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Permanently delete all your bookings, reviews, messages,
                      and preferences. Your account will remain active but all
                      data will be removed.
                    </p>
                    <button
                      onClick={handleDeleteAllData}
                      className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center space-x-2"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Delete All Data</span>
                    </button>
                  </div>

                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Deactivate Account
                    </h4>
                    <p
                      className="text-sm mb-4"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Temporarily disable your account. You can reactivate it
                      anytime by logging back in.
                    </p>
                    <button className="px-6 py-2.5 rounded-lg border-2 border-red-600 text-red-600 font-semibold hover:bg-red-50 transition-all">
                      Deactivate Account
                    </button>
                  </div>

                  <div
                    className="pt-4 border-t"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <h4
                      className="font-semibold mb-2"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Delete Account Permanently
                    </h4>
                    <p
                      className="text-sm mb-4"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Permanently delete your account and all associated data.
                      This action cannot be undone.
                    </p>
                    <button className="px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center space-x-2">
                      <Trash2 className="w-5 h-5" />
                      <span>Delete Account</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Help Section */}
      <div
        className="bg-blue-50 rounded-2xl p-6 border"
        style={{ borderColor: "#93c5fd" }}
      >
        <div className="flex items-start space-x-4">
          <div
            className="p-3 rounded-xl flex-shrink-0"
            style={{ backgroundColor: COLORS.primary[100] }}
          >
            <Info className="w-6 h-6" style={{ color: COLORS.primary[600] }} />
          </div>
          <div className="flex-1">
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: COLORS.primary[600] }}
            >
              Need Help?
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.gray[700] }}>
              If you have questions about these settings or need assistance, our
              support team is here to help.
            </p>
            <button
              className="px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all"
              style={{
                backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
              }}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
