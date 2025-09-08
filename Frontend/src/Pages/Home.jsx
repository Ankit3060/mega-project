import React, { useEffect, useState } from "react";
import { SlUserFollow, SlHeart, SlShare } from "react-icons/sl";
import { BiComment, BiBookmark } from "react-icons/bi";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";
import { Navigate, useNavigate } from "react-router-dom";

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

  const [blogs, setBlogs] = useState([]);
  const [like, setLike] = useState(0);
  const [liked, setLiked] = useState(false);

  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchBLogs = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/blog/all-blogs",
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBlogs(response.data.blogs);
      } catch (error) {
        console.log("Error while fetching blogs", error);
      }
    };

    fetchBLogs();
  }, [accessToken]);

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
        `http://localhost:4000/api/v1/like/like-unlike/${blogId}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      // setLike(res.data.likes);
      // setLiked(!liked);
      // setLiked(res.data.liked);

      const updatedBlog = res.data.blog;

    setBlogs((prevBlogs) =>
  prevBlogs.map((blog) =>
    blog._id === blogId
      ? { ...blog, likes: res.data.blog.likes }
      : blog
  )
);


      toast.success(res.data.message || "Blog Liked");
    } catch (error) {
      toast.error("Error liking blog");
    }
  };

  if(!isAuthenticated) {
    return <Navigate to='/login' />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="flex max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 pt-6 pb-10 gap-6">
        {/* Left side - Blog Feed */}
        <div className="flex-1 min-w-0">
          <div className="space-y-8">
            {blogs.map((blog) => (
              <article
                key={blog._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Author Header */}
                <div className="p-6 pb-4">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={blog.owner.avatar?.url}
                        alt={blog.owner.fullName}
                        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-blue-100 shadow-md object-cover"
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {blog.owner.fullName}
                      </h4>
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <span className="truncate">@{blog.owner.userName}</span>
                        <span className="hidden sm:inline">•</span>
                        <span className="text-xs sm:text-sm whitespace-nowrap">
                          {timeAgo(blog.createdAt)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="space-y-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
                      {blog.title}
                    </h2>

                    <div className="relative">
                      <p className="text-gray-700 text-sm sm:text-base leading-relaxed line-clamp-2">
                        {blog.content}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                      <button
                        onClick={() => likeBlog(blog._id)}
                        className={`flex cursor-pointer items-center gap-2 transition-colors ${
                          blog.likes.includes(user._id)
                            ? "text-red-500"
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

                      <button 
                        onClick={() => navigateTo(`/blog/read/${blog._id}`)}
                        className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors">
                        <BiComment className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">
                          Comment
                        </span>
                      </button>
                      <button
                        onClick={() => handleShare(blog)}
                        className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
                      >
                        <SlShare className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">Share</span>
                      </button>
                      <button className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-yellow-900 transition-colors">
                        <BiBookmark className="w-5 h-5" />
                        <span className="text-sm hidden sm:inline">Save</span>
                      </button>
                    </div>

                    <button
                      className="bg-gradient-to-r cursor-pointer from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 sm:px-6 sm:py-2.5 rounded-full font-medium transition-all duration-200 transform hover:scale-105 shadow-md text-sm sm:text-base whitespace-nowrap"
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

        {/* Right side - Sidebar (hidden on mobile and tablet) */}
        <div className="hidden xl:block w-80 sticky top-6 h-fit space-y-6">
          {/* Top Voice of the Week */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              Top Voice of the Week
            </h3>
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  A
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <span className="text-xs">👑</span>
                </div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Ankit Kumar</p>
                <p className="text-sm text-gray-500">@ankit</p>
              </div>
              <button className="text-xs cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
                Follow
              </button>
            </div>
          </div>

          {/* People You May Follow */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <SlUserFollow className="text-blue-500 text-lg" />
              People You May Follow
            </h3>
            <ul className="space-y-4">
              {[1, 2, 3].map((item) => (
                <li key={item} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      A
                    </div>
                    <div>
                      <span className="font-medium text-gray-900 text-sm">
                        Ankit Kumar
                      </span>
                      <p className="text-xs text-gray-500">@ankit{item}</p>
                    </div>
                  </div>
                  <button className="text-xs cursor-pointer px-4 py-2 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium transition-all duration-200 transform hover:scale-105">
                    Follow
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Trending Topics */}
          <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg">
            <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-xl">🔥</span>
              Trending Topics
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "Technology",
                "Health",
                "Travel",
                "Food",
                "Fashion",
                "Sports",
              ].map((topic) => (
                <span
                  key={topic}
                  className="px-3 py-2 text-sm rounded-full bg-gradient-to-r from-gray-100 to-gray-200 hover:from-blue-100 hover:to-blue-200 text-gray-700 hover:text-blue-700 cursor-pointer transition-all duration-200 transform hover:scale-105"
                >
                  #{topic}
                </span>
              ))}
            </div>
          </div>

          {/* Newsletter Signup */}
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 text-white">
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
