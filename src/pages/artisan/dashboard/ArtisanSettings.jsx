/* ==================== ArtisanSettings.jsx ==================== */
import React, { useState } from "react";
import {
  Settings,
  Bell,
  Clock,
  DollarSign,
  Shield,
  Globe,
  Lock,
  Users,
  MapPin,
  AlertCircle,
  Save,
  RefreshCw,
  Download,
  Trash2,
  Info,
  Sun,
  Moon,
  Mail,
  Smartphone,
  MessageSquare,
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
export default function ArtisanSettings() {
  const [activeSection, setActiveSection] = useState("notifications");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [settings, setSettings] = useState({
    notifications: {
      email: {
        newJobRequests: true,
        paymentReceived: true,
        newReviews: true,
        newMessages: true,
        payoutAlerts: true,
        promotions: false,
      },
      push: {
        newJobRequests: true,
        paymentReceived: true,
        jobReminders: true,
        newMessages: true,
        reviewReminders: true,
      },
      sms: {
        urgentJobRequests: true,
        payoutAlerts: true,
      },
    },
    availability: {
      workingHours: {
        monday: { enabled: true, start: "08:00", end: "18:00" },
        tuesday: { enabled: true, start: "08:00", end: "18:00" },
        wednesday: { enabled: true, start: "08:00", end: "18:00" },
        thursday: { enabled: true, start: "08:00", end: "18:00" },
        friday: { enabled: true, start: "08:00", end: "18:00" },
        saturday: { enabled: true, start: "09:00", end: "14:00" },
        sunday: { enabled: false, start: "00:00", end: "00:00" },
      },
      serviceRadius: 25,
      autoAcceptJobs: false,
      emergencyJobs: true,
    },
    pricing: {
      baseRate: 5000,
      travelFeePerKm: 200,
      emergencySurcharge: 3000,
      minimumJobValue: 3000,
    },
    privacy: {
      showProfile: true,
      showReviews: true,
      showLocation: true,
      allowCustomerReviews: true,
    },
    security: {
      twoFactorAuth: false,
      loginAlerts: true,
      sessionTimeout: "30",
    },
    display: {
      theme: "light",
      language: "en",
      currency: "NGN",
      dateFormat: "DD/MM/YYYY",
    },
  });

  /* ==================== HANDLERS ==================== */
  const handleChange = (category, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: { ...prev[category], [key]: value },
    }));
    setHasUnsavedChanges(true);
  };

  const handleNestedChange = (category, sub, key, value) => {
    setSettings((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [sub]: { ...prev[category][sub], [key]: value },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleWorkingHourChange = (day, field, value) => {
    setSettings((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        workingHours: {
          ...prev.availability.workingHours,
          [day]: { ...prev.availability.workingHours[day], [field]: value },
        },
      },
    }));
    setHasUnsavedChanges(true);
  };

  const handleSave = () => {
    alert("Settings saved successfully!");
    setHasUnsavedChanges(false);
  };

  const handleReset = () => {
    if (window.confirm("Reset all settings to default?")) {
      alert("Settings reset!");
      setHasUnsavedChanges(false);
    }
  };

  const handleExport = () => alert("Data export requested. Check email.");
  const handleDelete = () => {
    if (window.confirm("Permanently delete account? This cannot be undone.")) {
      alert("Account deletion initiated.");
    }
  };

  /* ==================== COMPONENTS ==================== */
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

  const SectionHeader = ({ icon: Icon, title, subtitle }) => (
    <div className="p-6 border-b" style={{ borderColor: COLORS.gray[200] }}>
      <div className="flex items-center space-x-3">
        <div
          className="p-2 rounded-lg"
          style={{ backgroundColor: COLORS.primary[50] }}
        >
          <Icon className="w-5 h-5" style={{ color: COLORS.primary[600] }} />
        </div>
        <div>
          <h3 className="text-lg font-bold" style={{ color: COLORS.gray[900] }}>
            {title}
          </h3>
          <p className="text-sm" style={{ color: COLORS.gray[600] }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );

  const sections = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "availability", label: "Availability", icon: Clock },
    { id: "pricing", label: "Pricing", icon: DollarSign },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "security", label: "Security", icon: Lock },
    { id: "display", label: "Display", icon: Globe },
    { id: "account", label: "Account", icon: Users },
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
            Manage your artisan account and preferences
          </p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex gap-2">
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all text-sm"
              style={{ borderColor: COLORS.gray[300], color: COLORS.gray[700] }}
            >
              Reset
            </button>
            <button
              onClick={handleSave}
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

      {/* Unsaved Alert */}
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
              Unsaved changes
            </p>
            <p className="text-xs" style={{ color: COLORS.gray[700] }}>
              Save before leaving
            </p>
          </div>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div
          className="lg:col-span-1 bg-white rounded-2xl p-4"
          style={{ border: `1px solid ${COLORS.gray[100]}` }}
        >
          <nav className="space-y-1">
            {sections.map((s) => {
              const Icon = s.icon;
              const active = activeSection === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveSection(s.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                    active
                      ? "text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                  style={
                    active
                      ? {
                          backgroundImage:
                            "linear-gradient(to right, #224e8c, #2a5ca8)",
                        }
                      : {}
                  }
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="font-medium text-sm">{s.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* NOTIFICATIONS */}
          {activeSection === "notifications" && (
            <>
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <SectionHeader
                  icon={Mail}
                  title="Email Notifications"
                  subtitle="Stay updated via email"
                />
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.notifications.email.newJobRequests}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "newJobRequests",
                        v
                      )
                    }
                    label="New Job Requests"
                    description="When customers request your service"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.email.paymentReceived}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "paymentReceived",
                        v
                      )
                    }
                    label="Payment Received"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.email.newReviews}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "newReviews",
                        v
                      )
                    }
                    label="New Reviews"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.email.newMessages}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "newMessages",
                        v
                      )
                    }
                    label="New Messages"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.email.payoutAlerts}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "payoutAlerts",
                        v
                      )
                    }
                    label="Payout Alerts"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.email.promotions}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "email",
                        "promotions",
                        v
                      )
                    }
                    label="Promotions"
                  />
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <SectionHeader
                  icon={Smartphone}
                  title="Push Notifications"
                  subtitle="Instant alerts on your phone"
                />
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.notifications.push.newJobRequests}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "push",
                        "newJobRequests",
                        v
                      )
                    }
                    label="New Job Requests"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.push.paymentReceived}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "push",
                        "paymentReceived",
                        v
                      )
                    }
                    label="Payment Received"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.push.jobReminders}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "push",
                        "jobReminders",
                        v
                      )
                    }
                    label="Job Reminders"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.push.newMessages}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "push",
                        "newMessages",
                        v
                      )
                    }
                    label="New Messages"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.push.reviewReminders}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "push",
                        "reviewReminders",
                        v
                      )
                    }
                    label="Review Reminders"
                  />
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <SectionHeader
                  icon={MessageSquare}
                  title="SMS Notifications"
                  subtitle="Critical alerts via text"
                />
                <div className="p-4 space-y-2">
                  <ToggleSwitch
                    checked={settings.notifications.sms.urgentJobRequests}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "sms",
                        "urgentJobRequests",
                        v
                      )
                    }
                    label="Urgent Job Requests"
                  />
                  <ToggleSwitch
                    checked={settings.notifications.sms.payoutAlerts}
                    onChange={(v) =>
                      handleNestedChange(
                        "notifications",
                        "sms",
                        "payoutAlerts",
                        v
                      )
                    }
                    label="Payout Alerts"
                  />
                </div>
              </div>
            </>
          )}

          {/* AVAILABILITY */}
          {activeSection === "availability" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <SectionHeader
                icon={Clock}
                title="Working Hours"
                subtitle="Set when you're available for jobs"
              />
              <div className="p-6 space-y-4">
                {Object.entries(settings.availability.workingHours).map(
                  ([day, config]) => (
                    <div
                      key={day}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3 flex-1">
                        <input
                          type="checkbox"
                          checked={config.enabled}
                          onChange={(e) =>
                            handleWorkingHourChange(
                              day,
                              "enabled",
                              e.target.checked
                            )
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span
                          className="capitalize font-medium"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {day}
                        </span>
                      </div>
                      {config.enabled && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="time"
                            value={config.start}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day,
                                "start",
                                e.target.value
                              )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm"
                            style={{ borderColor: COLORS.gray[300] }}
                          />
                          <span className="text-gray-500">to</span>
                          <input
                            type="time"
                            value={config.end}
                            onChange={(e) =>
                              handleWorkingHourChange(
                                day,
                                "end",
                                e.target.value
                              )
                            }
                            className="px-3 py-1.5 border rounded-lg text-sm"
                            style={{ borderColor: COLORS.gray[300] }}
                          />
                        </div>
                      )}
                    </div>
                  )
                )}

                <div
                  className="pt-4 border-t"
                  style={{ borderColor: COLORS.gray[200] }}
                >
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Service Radius (km)
                  </label>
                  <input
                    type="range"
                    min="5"
                    max="100"
                    value={settings.availability.serviceRadius}
                    onChange={(e) =>
                      handleChange(
                        "availability",
                        "serviceRadius",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs mt-1">
                    <span>5 km</span>
                    <span
                      className="font-bold"
                      style={{ color: COLORS.primary[600] }}
                    >
                      {settings.availability.serviceRadius} km
                    </span>
                    <span>100 km</span>
                  </div>
                </div>

                <ToggleSwitch
                  checked={settings.availability.autoAcceptJobs}
                  onChange={(v) =>
                    handleChange("availability", "autoAcceptJobs", v)
                  }
                  label="Auto-Accept Jobs"
                  description="Accept jobs within radius & hours automatically"
                />
                <ToggleSwitch
                  checked={settings.availability.emergencyJobs}
                  onChange={(v) =>
                    handleChange("availability", "emergencyJobs", v)
                  }
                  label="Accept Emergency Jobs"
                  description="Be available for urgent requests (higher rates)"
                />
              </div>
            </div>
          )}

          {/* PRICING */}
          {activeSection === "pricing" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <SectionHeader
                icon={DollarSign}
                title="Pricing"
                subtitle="Set your service rates"
              />
              <div className="p-6 space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Base Rate (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.baseRate}
                    onChange={(e) =>
                      handleChange(
                        "pricing",
                        "baseRate",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Travel Fee per km (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.travelFeePerKm}
                    onChange={(e) =>
                      handleChange(
                        "pricing",
                        "travelFeePerKm",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Emergency Surcharge (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.emergencySurcharge}
                    onChange={(e) =>
                      handleChange(
                        "pricing",
                        "emergencySurcharge",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Minimum Job Value (₦)
                  </label>
                  <input
                    type="number"
                    value={settings.pricing.minimumJobValue}
                    onChange={(e) =>
                      handleChange(
                        "pricing",
                        "minimumJobValue",
                        parseInt(e.target.value) || 0
                      )
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* PRIVACY */}
          {activeSection === "privacy" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <SectionHeader
                icon={Shield}
                title="Privacy Settings"
                subtitle="Control your visibility"
              />
              <div className="p-4 space-y-2">
                <ToggleSwitch
                  checked={settings.privacy.showProfile}
                  onChange={(v) => handleChange("privacy", "showProfile", v)}
                  label="Show Profile to Customers"
                />
                <ToggleSwitch
                  checked={settings.privacy.showReviews}
                  onChange={(v) => handleChange("privacy", "showReviews", v)}
                  label="Show Reviews Publicly"
                />
                <ToggleSwitch
                  checked={settings.privacy.showLocation}
                  onChange={(v) => handleChange("privacy", "showLocation", v)}
                  label="Share Location During Jobs"
                />
                <ToggleSwitch
                  checked={settings.privacy.allowCustomerReviews}
                  onChange={(v) =>
                    handleChange("privacy", "allowCustomerReviews", v)
                  }
                  label="Allow Customer Reviews"
                />
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeSection === "security" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <SectionHeader
                icon={Lock}
                title="Security"
                subtitle="Protect your account"
              />
              <div className="p-6 space-y-6">
                <ToggleSwitch
                  checked={settings.security.twoFactorAuth}
                  onChange={(v) => handleChange("security", "twoFactorAuth", v)}
                  label="Two-Factor Authentication"
                  description="Add extra login security"
                />
                <ToggleSwitch
                  checked={settings.security.loginAlerts}
                  onChange={(v) => handleChange("security", "loginAlerts", v)}
                  label="Login Alerts"
                  description="Get notified of new logins"
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
                      handleChange("security", "sessionTimeout", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="15">15 minutes</option>
                    <option value="30">30 minutes</option>
                    <option value="60">1 hour</option>
                    <option value="never">Never</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* DISPLAY */}
          {activeSection === "display" && (
            <div
              className="bg-white rounded-2xl overflow-hidden"
              style={{ border: `1px solid ${COLORS.gray[100]}` }}
            >
              <SectionHeader
                icon={Globe}
                title="Display & Language"
                subtitle="Customize your experience"
              />
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
                      { v: "light", l: "Light", i: Sun },
                      { v: "dark", l: "Dark", i: Moon },
                      { v: "auto", l: "Auto", i: Settings },
                    ].map((t) => {
                      const Icon = t.i;
                      return (
                        <button
                          key={t.v}
                          onClick={() => handleChange("display", "theme", t.v)}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            settings.display.theme === t.v
                              ? "border-blue-600 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon
                            className="w-6 h-6 mx-auto mb-2"
                            style={{
                              color:
                                settings.display.theme === t.v
                                  ? COLORS.primary[600]
                                  : COLORS.gray[600],
                            }}
                          />
                          <p
                            className="text-sm font-medium text-center"
                            style={{
                              color:
                                settings.display.theme === t.v
                                  ? COLORS.primary[600]
                                  : COLORS.gray[700],
                            }}
                          >
                            {t.l}
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
                      handleChange("display", "language", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="en">English</option>
                    <option value="yo">Yoruba</option>
                    <option value="ig">Igbo</option>
                    <option value="ha">Hausa</option>
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
                      handleChange("display", "currency", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="NGN">NGN (₦)</option>
                    <option value="USD">USD ($)</option>
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
                      handleChange("display", "dateFormat", e.target.value)
                    }
                    className="w-full px-4 py-2.5 border rounded-lg"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ACCOUNT */}
          {activeSection === "account" && (
            <>
              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <SectionHeader
                  icon={Download}
                  title="Export Your Data"
                  subtitle="Download your account data"
                />
                <div className="p-6">
                  <p
                    className="text-sm mb-4"
                    style={{ color: COLORS.gray[700] }}
                  >
                    Request a copy of your jobs, earnings, reviews, and profile.
                  </p>
                  <button
                    onClick={handleExport}
                    className="px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
                    style={{
                      borderColor: COLORS.primary[600],
                      color: COLORS.primary[600],
                    }}
                  >
                    <Download className="w-5 h-5" />
                    <span>Request Export</span>
                  </button>
                </div>
              </div>

              <div
                className="bg-white rounded-2xl overflow-hidden"
                style={{ border: `1px solid ${COLORS.gray[100]}` }}
              >
                <SectionHeader
                  icon={Info}
                  title="Account Info"
                  subtitle="Your artisan stats"
                />
                <div className="p-6 space-y-4">
                  <div
                    className="flex justify-between py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Member Since
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      March 2024
                    </span>
                  </div>
                  <div
                    className="flex justify-between py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Total Jobs
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      87
                    </span>
                  </div>
                  <div
                    className="flex justify-between py-3 border-b"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Total Earnings
                    </span>
                    <span
                      className="text-sm"
                      style={{ color: COLORS.gray[900] }}
                    >
                      ₦1,250,000
                    </span>
                  </div>
                  <div className="flex justify-between py-3">
                    <span
                      className="text-sm font-medium"
                      style={{ color: COLORS.gray[700] }}
                    >
                      Rating
                    </span>
                    <span
                      className="text-sm font-bold"
                      style={{ color: COLORS.success[600] }}
                    >
                      4.8 ★
                    </span>
                  </div>
                </div>
              </div>

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
                  <button
                    onClick={handleDelete}
                    className="w-full px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all flex items-center justify-center space-x-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    <span>Delete Account Permanently</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Help */}
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
          <div>
            <h3
              className="font-bold text-lg mb-2"
              style={{ color: COLORS.primary[600] }}
            >
              Need Help?
            </h3>
            <p className="text-sm mb-4" style={{ color: COLORS.gray[700] }}>
              Our support team is here 24/7.
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
