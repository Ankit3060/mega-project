import React, { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context/authContext";

function VerifyOtp() {
  const { isAuthenticated, setUser, setIsAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const navigateTo = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !otp) {
      setError("Both email and OTP are required");
      return;
    }

    if (!/^\d{5}$/.test(otp)) {
      setError("OTP must be exactly 5 digits");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/verify-otp",
        { email, otp },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "OTP verified successfully");
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAccessToken(response.data.accessToken);
      navigateTo("/");
      setError("");
      setEmail("");
      setOtp("");
    } catch (err) {
      console.error("Verify OTP error:", err);
      toast.error(err.response?.data?.message || "Invalid OTP or Email");
    } finally {
      setLoading(false);
    }
  };

  
  const handleResendOtp = async () => {
    if (!email) {
      toast.error("Please enter your email first");
      return;
    }
    try {
      setResendLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/resend-otp",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "OTP resent successfully");
    } catch (err) {
      console.error("Resend OTP error:", err);
      toast.error(err.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  // Restrict OTP input to only numbers in real-time
  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,5}$/.test(value)) {
      setOtp(value);
      setError("");
    } else {
      setError("OTP must be numbers only (5 digits)");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 mb-[-3rem]">
      <div className="w-full max-w-md bg-[#1e293b]/90 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Verify OTP
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Enter OTP
            </label>
            <input
              type="text"
              name="otp"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter the OTP sent to your email"
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>

          {error && <p className="text-sm text-red-400 mt-1">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 cursor-pointer hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>

        {/* 🔁 Resend OTP Button */}
        <div className="flex justify-center mt-4">
          <button
            onClick={handleResendOtp}
            disabled={resendLoading}
            className="text-sm cursor-pointer text-indigo-400 hover:underline disabled:opacity-50"
          >
            {resendLoading ? "Resending..." : "Resend OTP"}
          </button>
        </div>

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

export default VerifyOtp;
