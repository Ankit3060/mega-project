import React, { useState } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";
import axios from "axios";

function Login() {
  const { isAuthenticated, setIsAuthenticated, setUser, setAccessToken } =
    useAuth();
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validatePassword = (e) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
  };

  const navigateTo = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setPasswordError(
        <>
          Password must contain at least one uppercase, lowercase,<br></br>
          number, and special character.
        </>
      );
      return;
    } else {
      setPasswordError("");
    }

    try {
      const isEmail = emailOrUsername.includes("@");
      const loginData = isEmail
        ? { email: emailOrUsername, password }
        : { userName: emailOrUsername, password };

      const response = await axios.post(
        "http://localhost:4000/api/v1/auth/login",
        loginData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      setUser(response.data.user);
      setIsAuthenticated(true);
      setAccessToken(response.data.accessToken);
      navigateTo("/");
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response.data.message || "login failed");
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 mb-[-3rem]">
      <div className="w-full max-w-md bg-[#1e293b]/90 p-8 rounded-xl shadow-lg border border-gray-700">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-gray-300 text-sm mb-2">
              Email / Username
            </label>
            <input
              type="text"
              name="emailOrUsername"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              placeholder="Enter your email or username"
              className="w-full px-4 py-2 bg-white/10 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              required
              maxLength={50}
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => {
                const value = e.target.value;
                setPassword(value);

                if (value.length == 0) {
                  setPasswordError("");
                  return;
                }

                const hasUpperCase = /[A-Z]/.test(value);
                const hasLowerCase = /[a-z]/.test(value);
                const hasNumber = /\d/.test(value);
                const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

                if (
                  !(hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar)
                ) {
                  setPasswordError(
                    <>
                      Password must contain at least one uppercase, lowercase,
                      <br></br> number, and special character.
                    </>
                  );
                  return;
                } else {
                  setPasswordError("");
                }
              }}
              placeholder="Enter your password"
              className={`w-full px-4 py-2 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                passwordError ? "border-red-400" : "border-gray-600"
              }`}
              required
              minLength={8}
              maxLength={20}
            />
            {passwordError && (
              <p className="text-sm text-red-400 mt-1">{passwordError}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Link
              to="/forgot-password"
              className="text-sm text-indigo-400 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2 rounded-lg transition"
          >
            Login
          </button>
        </form>

        <p className="text-gray-400 text-sm text-center mt-6">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-indigo-400 hover:underline">
            Sign up now
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
