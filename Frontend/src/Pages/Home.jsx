import React, { useEffect, useState } from "react";
import { SlUserFollow, SlHeart, SlShare } from "react-icons/sl";
import { BiComment, BiBookmark } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";
import { useSearch } from "../Context/searchContext";
import { useTheme } from "../Context/themeContext";

function timeAgo(date) {
  const now = new Date();
  const seconds = Math.floor((now - new Date(date)) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (seconds < 60) return `${seconds} sec ago`;
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hr${hours > 1 ? "s" : ""} ago`;
  if (days < 7) return `${days} day${days > 1 ? "s" : ""} ago`;
  return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
}

function Home() {
  const { accessToken, user, isAuthenticated } = useAuth();
  const { searchQuery } = useSearch();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [blogs, setBlogs] = useState([]);
  const [like, setLike] = useState(0);
  const [liked, setLiked] = useState(false);
  const [topVoice, setTopVoice] = useState(null);
  const [suggestedUsers, setSuggestedUsers] = useState([]);

  const [followingStatus, setFollowingStatus] = useState({});
  const [topVoiceFollowing, setTopVoiceFollowing] = useState(false);

  const navigateTo = useNavigate();

  // All your data fetching and logic functions remain the same
  const checkFollowingStatus = async (userIds) => {
    try {
      const followingPromises = userIds.map(async (userId) => {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/subscribe/check-follow/${userId}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        return { userId, isFollowing: response.data.isFollowing };
      });

      const results = await Promise.all(followingPromises);
      const statusMap = {};
      results.forEach(({ userId, isFollowing }) => {
        statusMap[userId] = isFollowing;
      });

      return statusMap;
    } catch (error) {
      console.error("Error checking following status:", error);
      return {};
    }
  };

  const handleFollow = async (userId, isTopVoice = false) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/subscribe/follow-unfollow/${userId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (isTopVoice) {
        setTopVoiceFollowing(response.data.isFollowing);
      } else {
        if (response.data.isFollowing) {
          setSuggestedUsers((prev) =>
            prev.filter((user) => user._id !== userId)
          );
        }

        setFollowingStatus((prev) => ({
          ...prev,
          [userId]: response.data.isFollowing,
        }));
      }

      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow/unfollow");
    }
  };

  useEffect(() => {
    const fetchBLogs = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/all-blogs`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const fetchedBlogs = response.data.blogs;
        setBlogs(response.data.blogs);

        const userBlogCount = {};
        fetchedBlogs.forEach((blog) => {
          const ownerId = blog.owner._id;
          if (!userBlogCount[ownerId]) {
            userBlogCount[ownerId] = {
              ...blog.owner,
              count: 0,
            };
          }
          userBlogCount[ownerId].count++;
        });

        const sortedUsers = Object.values(userBlogCount).sort(
          (a, b) => b.count - a.count
        );

        const topVoiceCandidate = sortedUsers[0] || null;
        setTopVoice(topVoiceCandidate);

        const filteredUsers = sortedUsers.filter(
          (u) => u._id !== user._id && u._id !== topVoiceCandidate?._id
        );

        const allUserIds = filteredUsers.map((u) => u._id);

        if (allUserIds.length > 0) {
          const followingStatusMap = await checkFollowingStatus(allUserIds);
          setFollowingStatus(followingStatusMap);

          const unfollowedUsers = filteredUsers
            .slice(1, 10)
            .filter((u) => !followingStatusMap[u._id])
            .slice(0, 3);

          setSuggestedUsers(unfollowedUsers);
        }

        if (topVoiceCandidate) {
          try {
            const res = await axios.get(
              `${import.meta.env.VITE_BACKEND_URL}api/v1/subscribe/check-follow/${topVoiceCandidate._id}`,
              { headers: { Authorization: `Bearer ${accessToken}` } }
            );
            setTopVoice(topVoiceCandidate);
            setTopVoiceFollowing(res.data.isFollowing);
          } catch (error) {
            console.error("Error checking top voice follow status:", error);
          }
        }
      } catch (error) {
        console.log("Error while fetching blogs", error);
      }
    };

    if (accessToken && user) {
      fetchBLogs();
    }
  }, [accessToken, user]);

  const handleShare = (blog) => {
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        text: blog.content?.substring(0, 100) + "...",
        url: `${window.location.origin}/blog/read/${blog._id}`,
      });
    } else {
      navigator.clipboard.writeText(
        `${window.location.origin}/blog/read/${blog._id}`
      );
      toast.success("Link copied to clipboard!");
    }
  };

  const likeBlog = async (blogId) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/like/like-unlike/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      setBlogs((prevBlogs) =>
        prevBlogs.map((blog) =>
          blog._id === blogId ? { ...blog, likes: res.data.blog.likes } : blog
        )
      );

      toast.success(res.data.message || "Blog Liked");
    } catch (error) {
      toast.error("Error liking blog");
    }
  };

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.owner.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.owner.userName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] transition-colors duration-300 ${
        isDark
          ? "bg-gray-900 text-gray-100"
          : "bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900"
      }`}
    >
      <div className="flex max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 gap-6 h-screen">
        {/* Left side - Blog Feed */}
        <div className="flex-1 min-w-0 h-full overflow-y-auto scrollbar-hide pt-6 pb-20">
          <div className="space-y-8">
            {/* Search Results Header */}
            {searchQuery && (
              <div
                className={`p-4 mb-6 rounded-lg ${
                  isDark
                    ? "bg-gray-800 border border-gray-700"
                    : "bg-white border border-gray-200"
                }`}
              >
                <p className={`${isDark ? "text-gray-300" : "text-gray-600"}`}>
                  {filteredBlogs.length > 0
                    ? `Found ${filteredBlogs.length} result${
                        filteredBlogs.length === 1 ? "" : "s"
                      } for "${searchQuery}"`
                    : `No results found for "${searchQuery}"`}
                </p>
                {filteredBlogs.length === 0 && (
                  <p
                    className={`text-sm mt-2 ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    Try searching with different keywords or check your
                    spelling.
                  </p>
                )}
              </div>
            )}

            {/* Blogs */}
            {filteredBlogs.map((blog) => (
              <article
                key={blog._id}
                className={`border rounded-2xl shadow-lg hover:shadow-lg transition-all duration-300 overflow-hidden ${
                  isDark
                    ? "bg-gray-800 border-gray-700 hover:shadow-blue-400"
                    : "bg-white border-gray-200"
                }`}
              >
                {/* Author Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-4 mb-6">
                    <img
                      src={blog.owner.avatar?.url}
                      alt={blog.owner.fullName}
                      className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-100 shadow-md object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <h4
                        onClick={() =>
                          navigateTo(`/user/profile/${blog.owner._id}`)
                        }
                        className={`font-semibold truncate cursor-pointer ${
                          isDark ? "text-gray-100" : "text-gray-900"
                        }`}
                      >
                        {blog.owner.fullName}
                      </h4>
                      <div
                        className={`flex items-center gap-2 text-sm ${
                          isDark ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        <span>@{blog.owner.userName}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm whitespace-nowrap">
                          {timeAgo(blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    <h2
                      className={`text-xl sm:text-2xl font-bold leading-tight ${
                        isDark ? "text-gray-100" : "text-gray-900"
                      }`}
                    >
                      {blog.title}
                    </h2>
                    <p
                      className={`text-sm sm:text-base leading-relaxed line-clamp-2 ${
                        isDark ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      {blog.content}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div
                  className={`px-6 py-4 border-t ${
                    isDark
                      ? "border-gray-700 bg-gray-800/50"
                      : "border-gray-100 bg-gray-50/50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      {/* Like */}
                      <button
                        onClick={() => likeBlog(blog._id)}
                        className={`flex items-center gap-2 cursor-pointer transition-colors ${
                          blog.likes.includes(user._id)
                            ? "text-red-500"
                            : isDark
                            ? "text-gray-400 hover:text-red-400"
                            : "text-gray-500 hover:text-red-500"
                        }`}
                      >
                        <SlHeart
                          className={`w-5 h-5 ${
                            blog.likes.includes(user._id) ? "fill-current" : ""
                          }`}
                        />
                        <span className="text-sm font-medium">
                          {blog.likes.includes(user._id) ? "Liked" : "Like"}
                          {blog.likes.length > 0 && ` (${blog.likes.length})`}
                        </span>
                      </button>

                      {/* Comment */}
                      <button
                        onClick={() => navigateTo(`/blog/read/${blog._id}`)}
                        className={`flex cursor-pointer items-center gap-2 transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-blue-400"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                      >
                        <BiComment className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">
                          Comment
                        </span>
                      </button>

                      {/* Share */}
                      <button
                        onClick={() => handleShare(blog)}
                        className={`flex cursor-pointer items-center gap-2 transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-green-400"
                            : "text-gray-500 hover:text-green-500"
                        }`}
                      >
                        <SlShare className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">Share</span>
                      </button>

                      {/* Save */}
                      <button
                        className={`flex cursor-pointer items-center gap-2 transition-colors ${
                          isDark
                            ? "text-gray-400 hover:text-yellow-400"
                            : "text-gray-500 hover:text-yellow-600"
                        }`}
                      >
                        <BiBookmark className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">Save</span>
                      </button>
                    </div>

                    <button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 cursor-pointer text-white px-4 py-2 rounded-full font-medium hover:scale-105 transition-transform"
                      onClick={() => navigateTo(`/blog/read/${blog._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden xl:block w-80 h-full overflow-y-auto scrollbar-hide pt-6 space-y-6">
          {topVoice && (
            <div
              className={`p-6 rounded-2xl shadow-lg ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`font-bold mb-4 flex items-center gap-2 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <span className="text-2xl">🏆</span>
                Top Voice of the Week
              </h3>
              <div className="flex items-center gap-4">
                <img
                  src={topVoice.avatar?.url}
                  alt={topVoice.fullName}
                  className="w-12 h-12 rounded-full border-2 border-yellow-300 shadow-md object-cover"
                />
                <div className="flex-1">
                  <p
                    onClick={() => navigateTo(`/user/profile/${topVoice._id}`)}
                    className={`font-semibold cursor-pointer ${
                      isDark ? "text-gray-100" : "text-gray-900"
                    }`}
                  >
                    {topVoice.fullName}
                  </p>
                  <p
                    className={`text-sm ${
                      isDark ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    @{topVoice.userName}
                  </p>
                  <p
                    className={`text-xs ${
                      isDark ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {topVoice.count} Blogs
                  </p>
                </div>
                {user._id !== topVoice._id && !topVoiceFollowing && (
                  <button
                    onClick={() => handleFollow(topVoice._id, true)}
                    className="text-xs px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:scale-105 transition-transform"
                  >
                    Follow
                  </button>
                )}
              </div>
            </div>
          )}

          {suggestedUsers.length > 0 && (
            <div
              className={`p-6 rounded-2xl shadow-lg ${
                isDark
                  ? "bg-gray-800 border border-gray-700"
                  : "bg-white border border-gray-200"
              }`}
            >
              <h3
                className={`font-bold mb-4 flex items-center gap-2 ${
                  isDark ? "text-gray-100" : "text-gray-900"
                }`}
              >
                <SlUserFollow className="text-blue-500 text-lg" />
                People You May Follow
              </h3>
              <ul className="space-y-4">
                {suggestedUsers.map((user) => (
                  <li
                    key={user._id}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar?.url}
                        alt={user.fullName}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <span
                          onClick={() =>
                            navigateTo(`/user/profile/${user._id}`)
                          }
                          className={`font-medium text-sm cursor-pointer ${
                            isDark ? "text-gray-100" : "text-gray-900"
                          }`}
                        >
                          {user.fullName}
                        </span>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          @{user.userName}
                        </p>
                        <p
                          className={`text-xs ${
                            isDark ? "text-gray-500" : "text-gray-400"
                          }`}
                        >
                          {user.count} Blogs
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleFollow(user._id, false)}
                      className="text-xs cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-medium hover:scale-105 transition-transform"
                    >
                      Follow
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div
            className={`p-6 rounded-2xl shadow-lg ${
              isDark
                ? "bg-gray-800 border border-gray-700"
                : "bg-white border border-gray-200"
            }`}
          >
            <h3
              className={`font-bold mb-4 flex items-center gap-2 ${
                isDark ? "text-gray-100" : "text-gray-900"
              }`}
            >
              <span className="text-xl">🔥</span>
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Technology",
                "Politics",
                "AI",
                "Agriculture",
                "Celebraties",
                "Sport",
              ].map((topic) => (
                <span
                  key={topic}
                  onClick={() => navigateTo(`/explore?category=${topic}`)}
                  className={`px-3 py-2 text-sm rounded-full cursor-pointer transition-all ${
                    isDark
                      ? "bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-blue-300"
                      : "bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-700 hover:text-blue-700"
                  }`}
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white mb-6">
            <h3 className="font-bold mb-2">📧 Stay Updated</h3>
            <p className="text-sm text-blue-100 mb-4">
              Get the latest blogs delivered to your inbox
            </p>
            <button className="w-full bg-white text-blue-600 py-2 px-4 rounded-full font-medium hover:bg-blue-50 transition-colors">
              Subscribe Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
