import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Camera,
  Edit,
  Save,
  X,
  Calendar,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
  Loader2,
} from "lucide-react";
import { useCustomerDashboardStore } from "../../../stores/customerDashboardStore";

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
export default function CustomerProfile() {
  const {
    profile,
    isProfileLoading,
    profileError,
    fetchProfile,
    updateProfile,
    updateProfilePhoto,
    changePassword,
    updateNotificationPreferences,
    deactivateAccount,
    clearProfileError,
  } = useCustomerDashboardStore();

  const [activeTab, setActiveTab] = useState("personal");
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Temp state for editing
  const [editData, setEditData] = useState({});

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Delete confirmation
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    text: "",
    password: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Update editData when profile changes
  useEffect(() => {
    if (profile.email) {
      setEditData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        email: profile.email || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        dateOfBirth: profile.dateOfBirth || "",
        bio: profile.bio || "",
        address: profile.address || "",
        city: profile.city || "",
        state: profile.state || "",
        country: profile.country || "Nigeria",
        postalCode: profile.postalCode || "",
      });
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    const result = await updateProfile(editData);
    setIsSubmitting(false);

    if (result.success) {
      setIsEditing(false);
      alert(result.message || "Profile updated successfully!");
    } else {
      alert(result.message || "Failed to update profile");
    }
  };

  const handleCancel = () => {
    setEditData({
      firstName: profile.firstName || "",
      lastName: profile.lastName || "",
      email: profile.email || "",
      phone: profile.phone || "",
      gender: profile.gender || "",
      dateOfBirth: profile.dateOfBirth || "",
      bio: profile.bio || "",
      address: profile.address || "",
      city: profile.city || "",
      state: profile.state || "",
      country: profile.country || "Nigeria",
      postalCode: profile.postalCode || "",
    });
    setIsEditing(false);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Basic validation
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should be less than 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = async () => {
        const result = await updateProfilePhoto(reader.result);
        if (result.success) {
          alert(result.message || "Profile photo updated!");
        } else {
          alert(result.message || "Failed to update photo");
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = async () => {
    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert("Please fill in all fields");
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords don't match!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Password must be at least 6 characters!");
      return;
    }

    setIsSubmitting(true);
    const result = await changePassword({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });
    setIsSubmitting(false);

    if (result.success) {
      alert(result.message || "Password changed successfully!");
      setShowPasswordModal(false);
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } else {
      alert(result.message || "Failed to change password");
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation.text !== "DELETE") {
      alert('Please type "DELETE" to confirm');
      return;
    }

    if (!deleteConfirmation.password) {
      alert("Please enter your password");
      return;
    }

    setIsSubmitting(true);
    const result = await deactivateAccount(deleteConfirmation.password);
    setIsSubmitting(false);

    if (result.success) {
      alert(result.message || "Account deactivated. You will be logged out.");
      setShowDeleteModal(false);
      // TODO: Logout user
      window.location.href = "/login";
    } else {
      alert(result.message || "Failed to deactivate account");
    }
  };

  const handleNotificationToggle = async (type, value) => {
    const result = await updateNotificationPreferences({
      ...profile.notificationPreferences,
      [type]: value,
    });

    if (!result.success) {
      alert(result.message || "Failed to update preferences");
    }
  };

  const formatMemberSince = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    });
  };

  // Loading state
  if (isProfileLoading && !profile.email) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600 font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (profileError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-600 mx-auto mb-4" />
          <p className="text-red-600">{profileError}</p>
          <button
            onClick={() => {
              clearProfileError();
              fetchProfile(true);
            }}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1
            className="text-2xl sm:text-3xl font-bold"
            style={{ color: COLORS.gray[900] }}
          >
            My Profile
          </h1>
          <p className="mt-1" style={{ color: COLORS.gray[600] }}>
            Manage your account information
          </p>
        </div>
      </div>

      {/* Profile Header Card */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        {/* Cover Image */}
        <div
          className="h-32 relative"
          style={{
            backgroundImage: "linear-gradient(to right, #224e8c, #2a5ca8)",
          }}
        >
          <div className="absolute -bottom-16 left-6">
            <div className="relative">
              <img
                src={profile.profilePhoto || "/images/default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <label className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition-all">
                  <Camera
                    className="w-5 h-5"
                    style={{ color: COLORS.primary[600] }}
                  />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info */}
        <div className="pt-20 pb-6 px-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <h2
                  className="text-2xl font-bold"
                  style={{ color: COLORS.gray[900] }}
                >
                  {profile.firstName} {profile.lastName}
                </h2>
                {profile.verified && (
                  <div
                    className="p-1 rounded-full"
                    style={{ backgroundColor: COLORS.primary[50] }}
                  >
                    <CheckCircle
                      className="w-5 h-5"
                      style={{ color: COLORS.primary[600] }}
                    />
                  </div>
                )}
              </div>
              <div
                className="flex flex-wrap items-center gap-4 text-sm"
                style={{ color: COLORS.gray[600] }}
              >
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4" />
                  <span>{profile.email}</span>
                </div>
                {profile.phone && (
                  <div className="flex items-center space-x-2">
                    <Phone className="w-4 h-4" />
                    <span>{profile.phone}</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span>Member since {formatMemberSince(profile.memberSince)}</span>
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleEdit}
                className="px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #224e8c, #2a5ca8)",
                }}
              >
                <Edit className="w-5 h-5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  <Save className="w-5 h-5" />
                  <span>{isSubmitting ? "Saving..." : "Save"}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className="bg-white rounded-2xl overflow-hidden"
        style={{ border: `1px solid ${COLORS.gray[100]}` }}
      >
        <div className="border-b" style={{ borderColor: COLORS.gray[200] }}>
          <nav className="flex space-x-8 px-6">
            {[
              { id: "personal", label: "Personal Info" },
              { id: "address", label: "Address" },
              { id: "security", label: "Security" },
              { id: "preferences", label: "Preferences" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Personal Info Tab */}
          {activeTab === "personal" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    First Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.firstName : profile.firstName}
                    onChange={(e) =>
                      setEditData({ ...editData, firstName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.lastName : profile.lastName}
                    onChange={(e) =>
                      setEditData({ ...editData, lastName: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 disabled:cursor-not-allowed"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                  <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
                    Email cannot be changed
                  </p>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={isEditing ? editData.phone : profile.phone}
                    onChange={(e) =>
                      setEditData({ ...editData, phone: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Gender
                  </label>
                  <select
                    value={isEditing ? editData.gender : profile.gender}
                    onChange={(e) =>
                      setEditData({ ...editData, gender: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    value={isEditing ? editData.dateOfBirth : profile.dateOfBirth}
                    onChange={(e) =>
                      setEditData({ ...editData, dateOfBirth: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Bio
                </label>
                <textarea
                  value={isEditing ? editData.bio : profile.bio}
                  onChange={(e) =>
                    setEditData({ ...editData, bio: e.target.value })
                  }
                  disabled={!isEditing}
                  rows="4"
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50 resize-none"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="Tell us a bit about yourself..."
                />
              </div>
            </div>
          )}

          {/* Address Tab */}
          {activeTab === "address" && (
            <div className="space-y-6">
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Street Address
                </label>
                <input
                  type="text"
                  value={isEditing ? editData.address : profile.address}
                  onChange={(e) =>
                    setEditData({ ...editData, address: e.target.value })
                  }
                  disabled={!isEditing}
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                  style={{ borderColor: COLORS.gray[200] }}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    City
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.city : profile.city}
                    onChange={(e) =>
                      setEditData({ ...editData, city: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    State/Province
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.state : profile.state}
                    onChange={(e) =>
                      setEditData({ ...editData, state: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Postal Code
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.postalCode : profile.postalCode}
                    onChange={(e) =>
                      setEditData({ ...editData, postalCode: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>

                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: COLORS.gray[900] }}
                  >
                    Country
                  </label>
                  <input
                    type="text"
                    value={isEditing ? editData.country : profile.country}
                    onChange={(e) =>
                      setEditData({ ...editData, country: e.target.value })
                    }
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 disabled:bg-gray-50"
                    style={{ borderColor: COLORS.gray[200] }}
                  />
                </div>
              </div>

              {/* Map Preview Placeholder */}
              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Location Preview
                </label>
                <div
                  className="w-full h-64 rounded-lg border-2 border-dashed flex items-center justify-center"
                  style={{
                    borderColor: COLORS.gray[300],
                    backgroundColor: COLORS.gray[50],
                  }}
                >
                  <div className="text-center">
                    <MapPin
                      className="w-12 h-12 mx-auto mb-2"
                      style={{ color: COLORS.gray[400] }}
                    />
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      Map integration coming soon
                    </p>
                    {profile.address && (
                      <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
                        {profile.address}, {profile.city}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Change Password */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Password
                    </h3>
                    <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                      Keep your account secure
                    </p>
                  </div>
                  <button
                    onClick={() => setShowPasswordModal(true)}
                    className="px-4 py-2 rounded-lg text-white font-semibold hover:shadow-lg transition-all flex items-center space-x-2"
                    style={{
                      backgroundImage:
                        "linear-gradient(to right, #224e8c, #2a5ca8)",
                    }}
                  >
                    <Lock className="w-4 h-4" />
                    <span>Change Password</span>
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div
                className="p-6 rounded-xl"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3
                      className="text-lg font-bold mb-1"
                      style={{ color: COLORS.gray[900] }}
                    >
                      Two-Factor Authentication
                    </h3>
                    <p
                      className="text-sm mb-4"
                      style={{ color: COLORS.gray[600] }}
                    >
                      Add an extra layer of security to your account
                    </p>
                    <div
                      className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: COLORS.warning[50],
                        color: COLORS.warning[500],
                      }}
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>Coming Soon</span>
                    </div>
                  </div>
                  <button
                    disabled
                    className="px-4 py-2 rounded-lg border-2 font-semibold transition-all opacity-50 cursor-not-allowed"
                    style={{
                      borderColor: COLORS.gray[300],
                      color: COLORS.gray[700],
                    }}
                  >
                    Enable 2FA
                  </button>
                </div>
              </div>

              {/* Active Sessions Placeholder */}
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: COLORS.gray[900] }}
                >
                  Active Sessions
                </h3>
                <div
                  className="p-6 rounded-xl text-center"
                  style={{ backgroundColor: COLORS.gray[50] }}
                >
                  <Shield
                    className="w-12 h-12 mx-auto mb-2"
                    style={{ color: COLORS.gray[400] }}
                  />
                  <p className="text-sm" style={{ color: COLORS.gray[600] }}>
                    Session management coming soon
                  </p>
                </div>
              </div>

              {/* Danger Zone */}
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  borderColor: COLORS.danger[600],
                  backgroundColor: COLORS.danger[50],
                }}
              >
                <h3
                  className="text-lg font-bold mb-2"
                  style={{ color: COLORS.danger[600] }}
                >
                  Danger Zone
                </h3>
                <p className="text-sm mb-4" style={{ color: COLORS.gray[700] }}>
                  Once you deactivate your account, you won't be able to login. Your data will be preserved but inaccessible.
                </p>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all"
                >
                  Deactivate Account
                </button>
              </div>
            </div>
          )}
          {activeTab === "preferences" && (
            <div className="space-y-6">
              {/* Email Notifications */}
              <div>
                <h3
                  className="text-lg font-bold mb-4"
                  style={{ color: COLORS.gray[900] }}
                >
                  Notifications
                </h3>
                <div className="space-y-4">
                  {[
                    {
                      title: "Email Notifications",
                      description: "Receive updates via email",
                      type: "email",
                      enabled: profile.notificationPreferences?.email,
                    },
                    {
                      title: "SMS Notifications",
                      description: "Receive updates via SMS",
                      type: "sms",
                      enabled: profile.notificationPreferences?.sms,
                    },
                    {
                      title: "Push Notifications",
                      description: "Receive push notifications",
                      type: "push",
                      enabled: profile.notificationPreferences?.push,
                    },
                  ].map((pref, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-4 rounded-lg"
                      style={{ border: `1px solid ${COLORS.gray[200]}` }}
                    >
                      <div>
                        <p
                          className="font-semibold text-sm mb-1"
                          style={{ color: COLORS.gray[900] }}
                        >
                          {pref.title}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: COLORS.gray[600] }}
                        >
                          {pref.description}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pref.enabled}
                          onChange={(e) =>
                            handleNotificationToggle(pref.type, e.target.checked)
                          }
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Advanced Preferences - Coming Soon */}
              <div
                className="p-6 rounded-xl text-center"
                style={{ backgroundColor: COLORS.gray[50] }}
              >
                <AlertCircle
                  className="w-12 h-12 mx-auto mb-2"
                  style={{ color: COLORS.gray[400] }}
                />
                <p
                  className="text-sm font-semibold mb-1"
                  style={{ color: COLORS.gray[700] }}
                >
                  More Preferences Coming Soon
                </p>
                <p className="text-xs" style={{ color: COLORS.gray[600] }}>
                  Language, timezone, currency, and privacy settings will be
                  available in a future update
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-[100] p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div
              className="p-6 border-b flex justify-between items-center"
              style={{ borderColor: COLORS.gray[200] }}
            >
              <h2
                className="text-xl font-bold"
                style={{ color: COLORS.gray[900] }}
              >
                Change Password
              </h2>
              <button
                onClick={() => setShowPasswordModal(false)}
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
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        currentPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 pr-12"
                    style={{ borderColor: COLORS.gray[200] }}
                    placeholder="Enter current password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        current: !showPasswords.current,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.current ? (
                      <EyeOff
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 pr-12"
                    style={{ borderColor: COLORS.gray[200] }}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        new: !showPasswords.new,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.new ? (
                      <EyeOff
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    )}
                  </button>
                </div>
                <p className="text-xs mt-1" style={{ color: COLORS.gray[500] }}>
                  Must be at least 6 characters
                </p>
              </div>

              <div>
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 pr-12"
                    style={{ borderColor: COLORS.gray[200] }}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowPasswords({
                        ...showPasswords,
                        confirm: !showPasswords.confirm,
                      })
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    {showPasswords.confirm ? (
                      <EyeOff
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    ) : (
                      <Eye
                        className="w-5 h-5"
                        style={{ color: COLORS.gray[400] }}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => setShowPasswordModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordChange}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-lg text-white font-semibold hover:shadow-lg transition-all disabled:opacity-50"
                  style={{
                    backgroundImage:
                      "linear-gradient(to right, #224e8c, #2a5ca8)",
                  }}
                >
                  {isSubmitting ? "Updating..." : "Update Password"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
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
                Deactivate Account
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
                    Warning: This action cannot be undone
                  </p>
                  <p className="text-xs" style={{ color: COLORS.gray[700] }}>
                    Deactivating your account will prevent you from logging in.
                    Your data will be preserved but inaccessible until you
                    contact support to reactivate.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Type "DELETE" to confirm
                </label>
                <input
                  type="text"
                  value={deleteConfirmation.text}
                  onChange={(e) =>
                    setDeleteConfirmation({
                      ...deleteConfirmation,
                      text: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="Type DELETE to confirm"
                />
              </div>

              <div className="mb-4">
                <label
                  className="block text-sm font-semibold mb-2"
                  style={{ color: COLORS.gray[900] }}
                >
                  Enter your password
                </label>
                <input
                  type="password"
                  value={deleteConfirmation.password}
                  onChange={(e) =>
                    setDeleteConfirmation({
                      ...deleteConfirmation,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2"
                  style={{ borderColor: COLORS.gray[200] }}
                  placeholder="Enter your password"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-lg border-2 font-semibold hover:bg-gray-50 transition-all disabled:opacity-50"
                  style={{
                    borderColor: COLORS.gray[300],
                    color: COLORS.gray[700],
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-all disabled:opacity-50"
                >
                  {isSubmitting ? "Deactivating..." : "Deactivate Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}