import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useTheme } from "../Context/themeContext";

function FollowingUser() {
  const location = useLocation();
  const { user, accessToken } = useAuth();
  const { theme } = useTheme();
  const navigateTo = useNavigate();

  if (!user) {
    return (
      <p className="text-center mt-10 text-gray-500 dark:text-gray-400">
        Please log in to view this page.
      </p>
    );
  }

  const { following = [], followers = [], showFollowers = false } =
    location.state || {};

  const [activeTab, setActiveTab] = useState(
    showFollowers ? "followers" : "following"
  );
  const [followerList, setFollowerList] = useState(followers);
  const [followingList, setFollowingList] = useState(following);

  const list = activeTab === "followers" ? followerList : followingList;

  // Format date for "Member since"
  const memberSince = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
    })
    : "N/A";

  // Remove Follower API
  const handleRemoveFollower = async (followerId) => {
    try {
      const res = await axios.delete(
        `http://localhost:4000/api/v1/subscribe/remove-follower/${followerId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(res.data.message || "Follower removed successfully");
      setFollowerList((prev) =>
        prev.filter((f) => f.subscriber._id !== followerId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error removing follower");
    }
  };

  // Unfollow API
  const handleUnfollow = async (bloggerId) => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/subscribe/follow-unfollow/${bloggerId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success(res.data.message || "Unfollowed successfully");
      setFollowingList((prev) =>
        prev.filter((f) => f.blogger._id !== bloggerId)
      );
    } catch (error) {
      toast.error(error.response?.data?.message || "Error unfollowing user");
    }
  };

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] w-full ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <div className="max-w-6xl mx-auto p-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Section - Followers/Following */}
        <div className="md:col-span-2">
          {/* Tabs */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => setActiveTab("followers")}
              className={`px-6 py-2 text-sm font-medium rounded-lg ${activeTab === "followers"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              Followers
            </button>
            <button
              onClick={() => setActiveTab("following")}
              className={`ml-3 px-6 py-2 text-sm font-medium rounded-lg ${activeTab === "following"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                }`}
            >
              Following
            </button>
          </div>

          {/* List */}
          <div className="space-y-4">
            {list.length === 0 ? (
              <p
                className={`text-center ${theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
              >
                No {activeTab} found.
              </p>
            ) : (
              list.map((item) => {
                const userInfo =
                  activeTab === "followers" ? item.subscriber : item.blogger;

                return (
                  <div
                    key={item._id}
                    className={`flex items-center justify-between rounded-lg p-4 shadow transition-colors duration-200
                    ${theme === "light"
                        ? "bg-white shadow-lg"
                        : "bg-gray-800 border border-gray-700"
                      }`}
                  >
                    {/* Avatar + Info */}
                    <div className="flex items-center space-x-4">
                      <img
                        src={userInfo.avatar?.url}
                        alt={userInfo.fullName}
                        className="w-12 h-12 rounded-full object-cover border"
                      />
                      <div>
                        <h3
                          onClick={() =>
                            navigateTo("/user/profile/" + userInfo._id)
                          }
                          className="text-lg font-semibold cursor-pointer hover:underline"
                        >
                          {userInfo.fullName}
                        </h3>
                        <p
                          className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"
                            }`}
                        >
                          @{userInfo.userName}
                        </p>
                      </div>
                    </div>

                    {/* Right side button */}
                    {activeTab === "followers" ? (
                      <button
                        onClick={() => handleRemoveFollower(userInfo._id)}
                        className="px-4 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                      >
                        Remove
                      </button>
                    ) : (
                      <button
                        onClick={() => handleUnfollow(userInfo._id)}
                        className="px-4 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600"
                      >
                        Unfollow
                      </button>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Section - Logged-in User Info */}
        <div
          className={`rounded-lg p-6 h-fit shadow-lg transition-colors duration-200
          ${theme === "light" ? "bg-white" : "bg-gray-800 border border-gray-700"}`}
        >
          <div className="flex flex-col items-center text-center">
            <img
              src={user.avatar?.url}
              alt={user.fullName}
              className="w-20 h-20 rounded-full object-cover border mb-3"
            />
            <h2 className="text-xl font-semibold">{user.fullName}</h2>
            <p
              className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"
                }`}
            >
              @{user.userName}
            </p>
            <p
              className={`text-xs mt-1 ${theme === "light" ? "text-gray-400" : "text-gray-500"
                }`}
            >
              Member since {memberSince}
            </p>
          </div>

          {/* Stats */}
          <div className="flex justify-around mt-6">
            <div className="text-center">
              <p className="text-lg font-bold">{followerList.length}</p>
              <p
                className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
              >
                Followers
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold">{followingList.length}</p>
              <p
                className={`text-sm ${theme === "light" ? "text-gray-500" : "text-gray-400"
                  }`}
              >
                Following
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FollowingUser;