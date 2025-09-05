import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Context/authContext";

function ResetPassword() {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const { setIsAuthenticated, setUser, setAccessToken } = useAuth();
  const navigateTo = useNavigate();

  const validatePassword = (value) => {
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(newPassword)) {
      setPasswordError(
        <>
          Password must contain at least one uppercase, lowercase, <br />
          number, and special character.
        </>
      );
      return;
    } else {
      setPasswordError("");
    }

    if (newPassword !== confirmNewPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    } else {
      setConfirmPasswordError("");
    }

    try {
      const payload = {
        newPassword,
        confirmNewPassword,
      };

      const response = await axios.put(
        `http://localhost:4000/api/v1/auth/reset-password/${token}`,
        payload,
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Password reset successful");
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAccessToken(response.data.accessToken);
      setNewPassword("");
      setConfirmNewPassword("");
      navigateTo("/");
    } catch (err) {
      console.error("Reset password error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 mb-[-3rem]">
      <div className="w-full max-w-md bg-[#1e293b]/90 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Reset Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* New Password */}
          <div className="w-full">
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                name="newPassword"
                value={newPassword}
                onChange={(e) => {
                  const value = e.target.value;
                  setNewPassword(value);
                  if (!validatePassword(value) && value.length > 0) {
                    setPasswordError(
                      <>
                        Password must contain at least one uppercase, lowercase, <br />
                        number, and special character.
                      </>
                    );
                  } else {
                    setPasswordError("");
                  }
                }}
                placeholder="Enter new password"
                className={`w-full px-4 py-2 pr-10 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${passwordError ? "border-red-400" : "focus:ring-indigo-500"
                  }`}
                required
                minLength={8}
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && (
              <p className="text-sm text-red-400 mt-1">{passwordError}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="w-full">
            <div className="relative">
              <input
                type={showConfirmNewPassword ? "text" : "password"}
                name="confirmNewPassword"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                placeholder="Confirm new password"
                className={`w-full px-4 py-2 pr-10 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${confirmPasswordError ? "border-red-400" : "focus:ring-indigo-500"
                  }`}
                required
                minLength={8}
                maxLength={20}
              />
              <button
                type="button"
                onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-200"
              >
                {showConfirmNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && (
              <p className="text-sm text-red-400 mt-1">{confirmPasswordError}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition"
          >
            Reset Password
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Back to{" "}
          <Link to="/login" className="text-indigo-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;
