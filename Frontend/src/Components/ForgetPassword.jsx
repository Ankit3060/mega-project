import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {   
      setError("Email is required");
      return;
    }

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/auth/forget-password`,
        { email },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(response.data.message || "Reset link sent to your email");
      setError("");
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      toast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 mb-[-3rem]">
      <div className="w-full max-w-md bg-[#1e293b]/90 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Forgot Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Enter your email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition"
          >
            Send Reset Link
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

export default ForgotPassword;
