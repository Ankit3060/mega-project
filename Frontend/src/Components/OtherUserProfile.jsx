import React, { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext";
import { useTheme } from "../Context/themeContext";
import axios from "axios";
import blogImages from "../assets/blogImage.png";
import dogImage from "../assets/dog.png";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

function OtherUserProfile() {
  const { accessToken, user: currentUser } = useAuth();
  const { theme } = useTheme();
  const [user, setUser] = useState({});
  const [userBlog, setUserBlog] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);

  const { id } = useParams();
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/user/get-user/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    const fetchUserBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/blog/user-blog/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setUserBlog(response.data.blogsOfUser);
      } catch (error) {
        console.error("Error fetching user blog:", error);
      }
    };

    const fetchFollower = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/subscribe/follower/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFollowers(response.data.subscriberCount);
      } catch (error) {
        console.error("Error fetching followers:", error);
      }
    };

    const fetchFollowing = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/subscribe/following/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFollowing(response.data.followingCount);
      } catch (error) {
        console.error("Error fetching following:", error);
      }
    };

    const checkFollowStatus = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/api/v1/subscribe/check-follow/${id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setIsFollowing(res.data.isFollowing);
      } catch (error) {
        console.error("Error checking follow status:", error);
      }
    };

    fetchUser();
    fetchUserBlog();
    fetchFollower();
    fetchFollowing();
    if (id && accessToken) checkFollowStatus();
  }, [accessToken, id]);

  const toggleFollow = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/subscribe/follow-unfollow/${id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setIsFollowing(res.data.isFollowing);

      if (res.data.isFollowing) {
        setFollowers((prev) => prev + 1);
      } else {
        setFollowers((prev) => prev - 1);
      }

      toast.success(res.data.message);
    } catch (error) {
      toast.error("Failed to follow/unfollow");
    }
  };

  const userData = {
    fullName: user?.fullName,
    username: "@" + user?.userName,
    profileImage: user?.avatar?.url,
    backgroundImage: user?.coverImage?.url,
    followers,
    following,
    blogs: userBlog || [],
  };

  const isOtherUser = currentUser?._id !== id;

  return (
    <div className={`${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"} min-h-screen mb-[-2.5rem]`}>
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

        {isOtherUser && (
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleFollow}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer ${
                isFollowing
                  ? "bg-green-500 text-white hover:bg-green-600 border-2 border-green-500"
                  : "bg-blue-500 text-white hover:bg-blue-600 border-2 border-blue-500"
              }`}
            >
              {isFollowing ? "Following" : "Follow"}
            </button>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/70 to-transparent">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
              <div className="relative">
                <img
                  src={userData.profileImage || "https://via.placeholder.com/128"}
                  alt={userData.fullName}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">
                      {userData.fullName}
                    </h1>
                    <p className="text-gray-300">{userData.username}</p>
                  </div>

                  <div className="flex gap-6">
                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-white">
                        {userData.followers}
                      </div>
                      <div className="text-sm text-gray-300">Followers</div>
                    </div>

                    <div className="text-center">
                      <div className="text-xl md:text-2xl font-bold text-white">
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
          <h2 className="text-2xl md:text-3xl font-bold mb-2">
            Blogs ({userData.blogs.length})
          </h2>
          <div className="w-16 h-1 bg-blue-600"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userData.blogs.map((blog) => (
            <div
              key={blog._id}
              className={`${theme === "dark" ? "bg-gray-800 text-white hover:shadow-blue-400" : "bg-white text-gray-800"} rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300`}
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
                <p className="mb-4 line-clamp-3">{blog.content}</p>

                <div className="flex justify-between items-center text-sm opacity-80">
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
              <img src={dogImage} alt="No blogs" className="mx-auto mb-4 w-48 h-48" />
              <p className="text-gray-500">No blogs available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default OtherUserProfile;
