import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";
import { FaWallet, FaUsers, FaPhoneAlt, FaMoneyBillWave } from "react-icons/fa";

function Credits() {
  const { user, accessToken } = useAuth();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({ credit: 0, followerCount: 0 });
  const navigateTo = useNavigate();

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/user/get-withdraw-details`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
            withCredentials: true,
          }
        );
        if (res.data?.data) {
          setData({
            credit: res.data.data.credit ?? 0,
            followerCount: res.data.data.followerCount ?? 0,
          });
        }
      } catch (err) {
        toast.error("Failed to fetch credits data");
      }
    };
    fetchData();
  }, [user, accessToken]);

  const handleWithdraw = async () => {
    if (!phone || phone.length !== 10) {
      toast.error("Enter a valid 10-digit phone number");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/user/withdraw-credits`,
        { phone },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);
        setPhone("");
        navigateTo("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Withdrawal failed");
    } finally {
      setLoading(false);
    }
  };

  const minFollowers = 10;
  const minCredits = 400;
  const eligible = data.followerCount >= minFollowers && data.credit >= minCredits;

  return (
    <div className="flex justify-center mb-[-2.5rem] items-center min-h-screen bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 p-6">
      {!user ? (
        <p className="text-red-700 text-lg font-semibold bg-white px-4 py-2 rounded-lg shadow">
          ⚠️ Please log in to view credits
        </p>
      ) : (
        <div className="w-full max-w-lg bg-white shadow-2xl rounded-3xl p-8 space-y-6">
          <h2 className="text-2xl font-bold text-center text-gray-800 flex items-center justify-center gap-2">
            <FaWallet className="text-green-600" /> Withdraw Credits
          </h2>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-green-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaMoneyBillWave className="text-green-500 text-3xl mb-2" />
              <p className="text-gray-700 text-sm">Credits Available</p>
              <span className="text-lg font-bold text-green-600">
                {data.credit}
              </span>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 flex flex-col items-center shadow">
              <FaUsers className="text-blue-500 text-3xl mb-2" />
              <p className="text-gray-700 text-sm">Followers</p>
              <span className="text-lg font-bold text-blue-600">
                {data.followerCount}
              </span>
            </div>
          </div>

          {/* Eligibility */}
          {eligible ? (
            <>
              <div className="bg-green-100 border border-green-300 text-green-700 p-3 rounded-xl text-center font-medium">
                ✅ You are eligible for withdrawal
              </div>
              <p className="text-center text-gray-700">
                Amount You Get:{" "}
                <span className="font-bold text-green-700">
                  ₹{(data.credit / 10) * data.followerCount}
                </span>
              </p>

              {/* Phone Input */}
              <div className="flex items-center border rounded-lg overflow-hidden shadow-sm">
                <span className="bg-gray-100 px-3 py-2 text-gray-600">
                  <FaPhoneAlt />
                </span>
                <input
                  type="text"
                  placeholder="Enter Phone Number"
                  value={phone}
                  maxLength={10}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 px-3 py-2 focus:outline-none"
                />
              </div>

              {/* Withdraw Button */}
              <button
                onClick={handleWithdraw}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 text-white py-3 rounded-xl shadow-md font-semibold transition"
              >
                {loading ? "Processing..." : "Withdraw Now"}
              </button>
            </>
          ) : (
            <div className="bg-red-100 border border-red-300 text-red-700 p-3 rounded-xl text-center font-medium">
              ❌ You need at least <b>{minFollowers} followers</b> and{" "}
              <b>{minCredits} credits</b> to withdraw.
              <br />
              <span className="text-sm">
                Currently short by:{" "}
                {data.followerCount < minFollowers && (
                  <b>{minFollowers - data.followerCount} followers </b>
                )}
                {data.credit < minCredits && (
                  <b>{minCredits - data.credit} credits</b>
                )}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Credits;
