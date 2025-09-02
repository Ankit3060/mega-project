import React from "react";
import { useAuth } from "../Context/authContext";
import axios from "axios";

function Profile() {
  const { user, setAccessToken, accessToken } = useAuth();

  const userData = {
    fullName: user?.fullName,
    username: "@" + user?.userName,
    profileImage: user?.avatar.url,
    backgroundImage:"https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=300&fit=crop",
    followers: "2.5K",
    following: "150",
    blogs: [
      {
        id: 1,
        title: "Getting Started with React Hooks",
        excerpt:
          "Learn the fundamentals of React Hooks and how they can simplify your component logic...",
        date: "2 days ago",
        readTime: "5 min read",
        image:
          "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=300&h=200&fit=crop",
      },
      {
        id: 2,
        title: "Building Responsive Web Applications",
        excerpt:
          "Master the art of creating web applications that work seamlessly across all devices...",
        date: "1 week ago",
        readTime: "8 min read",
        image:
          "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=300&h=200&fit=crop",
      },
      {
        id: 3,
        title: "Understanding Modern JavaScript",
        excerpt:
          "Dive deep into ES6+ features and learn how to write cleaner, more efficient JavaScript code...",
        date: "2 weeks ago",
        readTime: "12 min read",
        image:
          "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=300&h=200&fit=crop",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Header Section */}
      <div className="relative">
        {/* Background Image */}
        <div
          className="h-48 md:h-64 bg-cover bg-center bg-gray-300"
          style={{ backgroundImage: `url(${userData.backgroundImage})` }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-30"></div>
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={userData.profileImage}
                  alt={userData.fullName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>

              {/* User Details */}
              <div className="flex-1 text-white">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">
                      {userData.fullName}
                    </h1>
                    <p className="text-gray-200 text-lg">{userData.username}</p>
                  </div>

                  {/* Followers/Following */}
                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold">
                        {userData.followers}
                      </div>
                      <div className="text-sm text-gray-300">Followers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold">
                        {userData.following}
                      </div>
                      <div className="text-sm text-gray-300">Following</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blogs Section */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Blogs
          </h2>
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.blogs.map((blog) => (
            <div
              key={blog.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              {/* Blog Image */}
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Blog Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blog.excerpt}
                </p>

                {/* Blog Meta */}
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <span>{blog.date}</span>
                  <span>{blog.readTime}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-8">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium">
            Load More Blogs
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
