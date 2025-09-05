import React, { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../Context/authContext.jsx";
import axios from "axios";

function Signup() {
  const { isAuthenticated, setUser } = useAuth();
  const navigateTo = useNavigate();

  const [fullName, setFullName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError(
        <>
          Password must contain at least one uppercase,
          <br />
          lowercase, number, and special character.
        </>
      );
      return;
    } else {
      setPasswordError("");
    }

    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("userName", userName);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    if (avatar) formData.append("avatar", avatar);

    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/auth/register`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setUser(res.data.user);
      toast.success(res.data.message);
      navigateTo("/verify-otp");
      setFullName("");
      setUserName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setConfirmPassword("");
      setAvatar(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/verify-otp" />;
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4  mb-[-2.5rem]">
      <div className="w-full max-w-lg bg-[#1e293b]/90 p-10 sm:p-16 rounded-xl shadow-lg border border-gray-700 flex flex-col items-center">
        <h2 className="text-3xl font-bold text-white text-center mb-4">
          Join AK Blog
        </h2>
        <p className="text-gray-300 text-center mb-6">
          Create your account to get started
        </p>

        <form onSubmit={handleSignup} className="w-full space-y-4">
          {/* Full Name + Username */}
          <div className="flex gap-4 w-full">
            <input
              placeholder="Full Name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={50}
              className="w-1/2 text-white bg-white/10 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Username"
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              required
              maxLength={30}
              className="w-1/2 text-white bg-white/10 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email + Phone */}
          <div className="flex gap-4 w-full">
            <input
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              maxLength={50}
              className="w-1/2 text-white bg-white/10 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              placeholder="Phone Number"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              maxLength={15}
              className="w-1/2 text-white bg-white/10 border border-gray-600 rounded-lg p-3 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Profile Pic */}
          <div className="sm:flex items-center sm:gap-1  sm:w-full">
            <label className="text-white whitespace-nowrap sm:w-32">
              Profile Pic:
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setAvatar(e.target.files[0])}
              className="flex-1 text-white border border-gray-600 rounded-lg w-64 sm:min-w-72 p-2 cursor-pointer "
            />
          </div>

          {/* Password */}
          <div className="w-full">
            <div className="relative">
              <input
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  const value = e.target.value;
                  setPassword(value);
                  if (!validatePassword(value) && value.length > 0) {
                    setPasswordError(
                      <>
                        Password must contain at least one uppercase, lowercase,
                        <br />
                        number, and special character.
                      </>
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
                required
                minLength={8}
                maxLength={20}
                className={`w-full text-white bg-white/10 border border-gray-600 rounded-lg p-3 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 ${passwordError ? "border-red-400" : "focus:ring-indigo-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-400 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="w-full">
            <div className="relative">
              <input
                placeholder="Confirm Password"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                maxLength={20}
                className={`w-full text-white bg-white/10 border border-gray-600 rounded-lg p-3 pr-10 placeholder-gray-400 focus:outline-none focus:ring-2 ${confirmPasswordError ? "border-red-400" : "focus:ring-indigo-500"
                  }`}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-sm text-red-400 mt-1">{confirmPasswordError}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition"
          >
            Sign Up
          </button>
        </form>

        {/* Already have account */}
        <p className="text-gray-400 text-sm text-center mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
