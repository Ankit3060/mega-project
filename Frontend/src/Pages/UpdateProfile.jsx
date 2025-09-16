import React, { useState, useEffect } from "react";
import {
  Edit3,
  Camera,
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useTheme } from "../Context/themeContext";

function UpdateProfile() {
  const { user, setUser, accessToken } = useAuth();
  const { theme } = useTheme();

  const id = user?._id;

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");
  const [avatar, setAvatar] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    setFullName(user?.fullName);
    setUserName(user?.userName);
    setPhone(user?.phone);
    setAvatar(user?.avatar?.url);
    setCoverImage(
      user?.coverImage?.url ||
        "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80"
    );
  }, [user]);

  const userData = {
    fullName,
    userName,
    email: user?.email,
    phone,
    accountSince: user?.createdAt.split("T")[0],
    role: user?.role,
  };

  const editableData = { fullName, userName, phone };

  const handleSaveProfile = async () => {
    const loadingToast = toast.loading("Updating profile...");
    try {
      const updateUserData = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/user/update-details/${id}`,
        editableData,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.dismiss(loadingToast);
      toast.success("Profile updated successfully!");
      setUser(updateUserData.data.user);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response.data.message || "Failed to update profile.");
    }
  };

  const handleImageUpload = async (type) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        const loadingToast = toast.loading(
          `Uploading ${type === "cover" ? "cover image" : "profile image"}...`
        );

        const formData = new FormData();
        formData.append(type === "cover" ? "coverImage" : "avatar", file);

        try {
          const response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}api/v1/user/update-details/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          toast.dismiss(loadingToast);
          toast.success(
            `${type === "cover" ? "Cover image" : "Profile image"} updated successfully!`
          );

          if (response.data.user) {
            setUser(response.data.user);
            if (type === "cover") {
              setCoverImage(response.data.user.coverImage);
            } else {
              const newAvatarUrl =
                response.data.user.avatar?.url || response.data.user.avatar;
              setAvatar(newAvatarUrl);
            }
          }
        } catch (error) {
          toast.dismiss(loadingToast);
          toast.error(
            error.response?.data?.message || "Failed to upload image."
          );
        }
      }
    };
    input.click();
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (value.length === 0) {
      setPasswordError("");
      return;
    }

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    if (!(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)) {
      setPasswordError(
        <>
          Password must contain at least one uppercase, lowercase,
          <br /> number, and special character.
        </>
      );
    } else {
      setPasswordError("");
    }
  };

  const handleUpdatePassword = async () => {
    if (newPassword !== confirmNewPassword) {
      toast.error("New passwords do not match!");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long!");
      return;
    }
    if (passwordError) {
      toast.error("Please fix password requirements first!");
      return;
    }

    const loadingToast = toast.loading("Updating password...");
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/user/update-password/${id}`,
        { oldPassword, newPassword, confirmNewPassword },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      toast.dismiss(loadingToast);
      toast.success(response.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className={`min-h-screen mb-[-2.5rem] transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Cover Image Section */}
      <div className="relative">
        <div
          className="w-full h-64 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className={`absolute inset-0 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-black/50' : 'bg-black/30'
          }`}></div>
          <button
            onClick={() => handleImageUpload("cover")}
            className="absolute top-4 right-4 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            <Edit3 size={16} />
          </button>
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile"
              className={`w-32 h-32 rounded-full border-4 object-cover shadow-lg transition-colors duration-200 ${
                theme === 'dark' ? 'border-gray-800' : 'border-white'
              }`}
            />
            <button
              onClick={() => handleImageUpload("profile")}
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Camera size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Profile Info */}
          <div className={`rounded-xl shadow-lg p-8 mb-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <User className={`mr-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-blue-400' : 'text-blue-600'
              }`} size={24} />
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editable Fields */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Username
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Phone className="mr-2" size={16} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                    theme === 'dark' 
                      ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                      : 'border-gray-300 bg-white text-gray-900'
                  }`}
                />
              </div>

              {/* Readonly fields */}
              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Mail className="mr-2" size={16} />
                  Email Address
                </label>
                <div className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}>
                  {userData.email}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Calendar className="mr-2" size={16} />
                  Account Since
                </label>
                <div className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}>
                  {userData.accountSince}
                </div>
              </div>

              <div>
                <label className={`block text-sm font-medium mb-2 flex items-center transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <Shield className="mr-2" size={16} />
                  Role
                </label>
                <div className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 ${
                  theme === 'dark' 
                    ? 'bg-gray-700 border-gray-600 text-gray-300'
                    : 'bg-gray-100 border-gray-200 text-gray-700'
                }`}>
                  {userData.role}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleSaveProfile}
                className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Save Profile Changes
              </button>
            </div>
          </div>

          {/* Password Update */}
          <div className={`rounded-xl shadow-lg p-8 transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-2xl font-bold mb-6 flex items-center transition-colors duration-200 ${
              theme === 'dark' ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <Shield className={`mr-3 transition-colors duration-200 ${
                theme === 'dark' ? 'text-red-400' : 'text-red-600'
              }`} size={24} />
              Update Password
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Password */}
              <div className="md:col-span-2">
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-gray-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                      passwordError
                        ? theme === 'dark' 
                          ? 'border-red-500 bg-gray-700 text-gray-100 placeholder-gray-400'
                          : 'border-red-400 bg-white text-gray-900'
                        : theme === 'dark'
                          ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                          : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="Enter new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-gray-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className={`block text-sm font-medium mb-2 transition-colors duration-200 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 ${
                      theme === 'dark' 
                        ? 'border-gray-600 bg-gray-700 text-gray-100 placeholder-gray-400'
                        : 'border-gray-300 bg-white text-gray-900'
                    }`}
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(!showConfirmPassword)
                    }
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200 ${
                      theme === 'dark' 
                        ? 'text-gray-300 hover:text-gray-100' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleUpdatePassword}
                className="bg-red-600 hover:bg-red-700 cursor-pointer text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
              >
                Update Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateProfile;