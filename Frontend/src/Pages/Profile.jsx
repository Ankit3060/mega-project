import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext";
import { useTheme } from "../Context/themeContext";
import axios from "axios";
import blogImages from "../assets/blogImage.png";
import dogImage from "../assets/dog.png";
import { useNavigate } from "react-router-dom";

function Profile() {
  const { user, accessToken } = useAuth();
  const { theme } = useTheme();
  const [userBlog, setUserBlog] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [followingList, setFollowingList] = useState([]);
  const [followerList, setFollowerList] = useState([]);

  const id = user?._id;
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchUserBlog = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/v1/blog/my-blog",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setUserBlog(response.data.blogs);
      } catch (error) {
        console.error("Error fetching user blog:", error);
      }
    };

    const fetchFollower = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/subscribe/follower/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFollowers(response.data.subscriberCount);
        setFollowerList(response.data.followers);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/subscribe/following/${id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setFollowing(response.data.followingCount);
        setFollowingList(response.data.following);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    fetchUserBlog();
    fetchFollower();
    fetchFollowing();
  }, [accessToken, id]);

  const userData = {
    fullName: user?.fullName,
    username: "@" + user?.userName,
    profileImage: user?.avatar?.url,
    backgroundImage: user?.coverImage?.url,
    followers: followers,
    following: following,
    blogs: userBlog || [],
  };

  return (
    <div
      className={`min-h-screen mb-[-2.5rem] ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Background Header Section */}
      <div className="relative">
        <div
          className="h-48 md:h-64 bg-cover bg-center"
          style={{
            backgroundImage: userData.backgroundImage
              ? `url("${userData.backgroundImage}")`
              : `url("https://images.unsplash.com/photo-1503264116251-35a269479413?auto=format&fit=crop&w=1470&q=80")`,
          }}
        >
          <div className="absolute inset-0 bg-opacity-30"></div>
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
                    <button
                      onClick={() =>
                        navigateTo(`/${userData.username}/subscription`, {
                          state: {
                            followers: followerList,
                            following: followingList,
                            showFollowers: true,
                          },
                        })
                      }
                      className="text-center cursor-pointer"
                    >
                      <div className="text-xl md:text-2xl font-bold">
                        {userData.followers}
                      </div>
                      <div className="text-sm text-gray-300">Followers</div>
                    </button>

                    <button
                      onClick={() =>
                        navigateTo(`/${userData.username}/subscription`, {
                          state: {
                            followers: followerList,
                            following: followingList,
                            showFollowers: false,
                          },
                        })
                      }
                      className="text-center cursor-pointer"
                    >
                      <div className="text-xl md:text-2xl font-bold">
                        {userData.following}
                      </div>
                      <div className="text-sm text-gray-300">Following</div>
                    </button>
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
          <h2
            className={`text-2xl md:text-3xl font-bold mb-2 ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            Blogs ({userData.blogs.length})
          </h2>
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.blogs.map((blog) => (
            <div
              key={blog._id}
              className={`rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 ${
                theme === "dark" ? "bg-gray-800 text-white hover:shadow-blue-400" : "bg-white text-gray-800"
              }`}
            >
              <div className="h-48 overflow-hidden">
                <img
                  src={blog.blogImage?.url || blogImages}
                  alt={"blog image"}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 line-clamp-2">
                  {blog.title}
                </h3>
                <p
                  className={`mb-4 line-clamp-3 ${
                    theme === "dark" ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  {blog.content}
                </p>

                <div
                  className={`flex justify-between items-center text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>{new Date(blog.createdAt).toLocaleDateString("en-IN")}</span>
                  <span>{blog.readTime || "4 Min read"}</span>
                </div>

                <button
                  className="w-full mt-3 py-2 px-4 bg-blue-700 text-white font-medium rounded-lg hover:bg-blue-800 transition-colors duration-300 cursor-pointer"
                  onClick={() => navigateTo(`/blog/read/${blog._id}`)}
                >
                  Read
                </button>
              </div>
            </div>
          ))}
          {userData.blogs.length < 1 && (
            <div className="col-span-3 text-center">
              <img
                src={dogImage}
                alt="No blogs"
                className="mx-auto mb-4 w-48 h-48"
              />
              <p
                className={`text-center ml-9 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No blogs available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
