import React, { useState } from "react";
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
import { set } from "mongoose";
import { toast } from "react-toastify";
import axios from "axios";
import { useEffect } from "react";

function UpdateProfile() {
  const {
    user,
    setUser,
    isAuthenticated,
    setIsAuthenticated,
    accessToken,
    setAccessToken,
  } = useAuth();

  const id = user?._id;

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [fullName, setFullName] = useState('');
  const [userName, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  useEffect(()=>{
    setFullName(user?.fullName);
    setUserName(user?.userName);
    setPhone(user?.phone);
    setAvatar(user?.avatar?.url);
    setCoverImage(user?.coverImage?.url || "https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80")
  },[user])

  const userData = {
    fullName: fullName,
    userName: userName,
    email: user?.email,
    phone: phone,
    accountSince: user?.createdAt.split("T")[0],
    role: user?.role,
  };

  const editableData = {
    fullName: fullName,
    userName: userName,
    phone: phone,
  };

  const handleSaveProfile = async () => {
    try {
      const updateUserData = await axios.put(
        `http://localhost:4000/api/v1/user/update-details/${id}`,
        editableData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Profile updated successfully!");
      setUser(updateUserData.data.user);
    } catch (error) {
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
        // Show loading toast
        const loadingToast = toast.loading(`Uploading ${type === "cover" ? "cover image" : "profile image"}...`);
        
        const formData = new FormData();
        formData.append(type === "cover" ? "coverImage" : "avatar", file);

        try {
          const response = await axios.put(
            `http://localhost:4000/api/v1/user/update-details/${id}`,
            formData,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "multipart/form-data",
              },
            }
          );

          // Dismiss loading toast
          toast.dismiss(loadingToast);

          console.log("Upload response:", response.data); // Debug log

          toast.success(
            `${type === "cover" ? "Cover image" : "Profile image"} updated successfully!`
          );

          // Update the user context with the full updated user data
          if (response.data.user) {
            setUser(response.data.user);
            
            // Update local state immediately for UI feedback
            if (type === "cover") {
              setCoverImage(response.data.user.coverImage);
            } else {
              // Handle both avatar.url and direct avatar cases
              const newAvatarUrl = response.data.user.avatar?.url || response.data.user.avatar;
              setAvatar(newAvatarUrl);
            }
          } else if (response.data.data) {
            // Some APIs return data nested under 'data' key
            setUser(response.data.data);
            
            if (type === "cover") {
              setCoverImage(response.data.data.coverImage);
            } else {
              const newAvatarUrl = response.data.data.avatar?.url || response.data.data.avatar;
              setAvatar(newAvatarUrl);
            }
          }

        } catch (error) {
          // Dismiss loading toast
          toast.dismiss(loadingToast);
          
          console.error("Upload error:", error.response?.data); // Debug log
          toast.error(error.response?.data?.message || "Failed to upload image.");
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

    try {
      const response = await axios.put(
        `http://localhost:4000/api/v1/user/update-password/${id}`,
        { oldPassword, newPassword, confirmNewPassword },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success(response.data.message || "Password updated successfully!");
      setOldPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Cover Image Section */}
      <div className="relative">
        <div
          className="w-full h-64 bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${coverImage})` }}
        >
          <div className="absolute inset-0  bg-opacity-30"></div>
          <button
            onClick={() => handleImageUpload("cover")}
            className="absolute top-4 right-4 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 hover:scale-105"
          >
            <Edit3 size={16} className="cursor-pointer"/>
          </button>
        </div>

        {/* Profile Image */}
        <div className="absolute -bottom-16 left-8">
          <div className="relative">
            <img
              src={avatar}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <button
              onClick={() => handleImageUpload("profile")}
              className="absolute bottom-2 right-2 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-all duration-200 hover:scale-105 shadow-lg"
            >
              <Camera size={14} className="cursor-pointer"/>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-20 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* User Info Dashboard */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <User className="mr-3 text-blue-600" size={24} />
              Profile Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Editable Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={userData.fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  name="userName"
                  value={userData.userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={userData.phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200"
                />
              </div>

              {/* Non-editable Fields */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Mail className="mr-2" size={16} />
                  Email Address
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                  {userData.email}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Calendar className="mr-2" size={16} />
                  Account Since
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
                  {userData.accountSince}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Shield className="mr-2" size={16} />
                  Role
                </label>
                <div className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-600">
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

          {/* Password Update Section */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Shield className="mr-3 text-red-600" size={24} />
              Update Password
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Old Password */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? "text" : "password"}
                    name="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2  focus:ring-blue-500  transition-all duration-200"
                    placeholder="Enter your current password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? "text" : "password"}
                    name="newPassword"
                    value={newPassword}
                    onChange={handleNewPasswordChange}
                    className={`w-full px-4 py-3 pr-12 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500  transition-all duration-200 ${
                      passwordError ? "border-red-400" : "border-gray-300"
                    }`}
                    placeholder="Enter new password"
                    minLength={8}
                    maxLength={20}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {passwordError && (
                  <p className="text-sm text-red-500 mt-2">{passwordError}</p>
                )}
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Confirm new password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
