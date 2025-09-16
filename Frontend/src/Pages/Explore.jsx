import React, { useEffect, useState } from "react";
import { Search } from "lucide-react";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useTheme } from "../Context/themeContext"

function Explore() {
  const { accessToken } = useAuth();
  const { theme } = useTheme();
  const [blogs, setBlogs] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get("category");
    if (category) {
      setSearchInput(category);
      fetchByCategory(category);
    } else {
      fetchAllBlogs();
    }
  }, [location.search]);

  const fetchAllBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/all-blogs`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setBlogs(res.data.blogs || res.data.data || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchByCategory = async (category) => {
    if (!category || !category.trim()) {
      fetchAllBlogs();
      return;
    }
    try {
      setLoading(true);
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/category/${category}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
          withCredentials: true,
        }
      );
      setBlogs(res.data.blog || res.data.data || []);
    } catch (error) {
      toast.error("Error fetching blogs by category");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/explore?category=${searchInput}`);
    } else {
      navigate("/explore");
    }
  };

  return (
    <div
      className={`min-h-screen p-6 mb-[-2.5rem] transition-colors duration-300 
      ${theme === "light" ? "bg-gray-200 text-black" : "bg-gray-900 text-white"}`}
    >
      {/* Search Bar with Select */}
      <form
        onSubmit={handleSearch}
        className="flex items-center max-w-xl mx-auto mb-10 gap-2"
      >
        {/* Dropdown for categories */}
        <select
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className={`flex-1 px-4 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-600 border
            ${theme === "light"
              ? "bg-gray-100 text-gray-800 border-gray-300"
              : "bg-gray-800 text-gray-200 border-gray-700"}`}
        >
          <option value="">All Categories</option>
          <option value="Sport">Sport</option>
          <option value="Fashion">Fashion</option>
          <option value="Politics">Politics</option>
          <option value="Cricket">Cricket</option>
          <option value="Celebraties">Celebraties</option>
          <option value="Glamour">Glamour</option>
          <option value="Geopolitics">Geopolitics</option>
          <option value="Breaking">Breaking</option>
          <option value="AI">AI</option>
          <option value="Technology">Technology</option>
          <option value="Revolution">Revolution</option>
          <option value="Agriculture">Agriculture</option>
          <option value="Corporate">Corporate</option>
          <option value="Vehicle">Vehicle</option>
          <option value="Social">Social</option>
          <option value="Disaster">Disaster</option>
          <option value="Development">Development</option>
        </select>

        {/* Search Button */}
        <button
          type="submit"
          className="px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg flex items-center justify-center"
        >
          <Search size={24} />
        </button>
      </form>

      {/* 🔹 Blog Results */}
      {loading ? (
        <p className="text-center text-gray-400">Loading blogs...</p>
      ) : blogs.length === 0 ? (
        <p className="text-center text-gray-400">No blogs found.</p>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 ">
          {blogs.map((blog) => (
            <div
              key={blog._id}
              className={`rounded-xl shadow-lg hover:shadow-xl overflow-hidden hover:scale-[1.02] transition flex flex-col 
                ${theme === "light" ? "bg-gray-100" : "bg-gray-800 hover:shadow-blue-400"}`}
            >
              {blog.blogImage?.url && (
                <img
                  src={blog.blogImage.url}
                  alt={blog.title}
                  className="w-full h-44 object-cover"
                />
              )}

              <div className="p-5 flex flex-col flex-grow">
                <h2
                  className={`text-xl font-bold mb-2 
                    ${theme === "light" ? "text-black" : "text-white"}`}
                >
                  {blog.title}
                </h2>
                <p
                  className={`text-sm line-clamp-3 mb-3 
                    ${theme === "light" ? "text-gray-700" : "text-gray-400"}`}
                >
                  {blog.content}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {blog.category?.map((cat) => (
                    <span
                      key={cat}
                      className="px-3 py-1 text-xs text-white bg-blue-700 rounded-full"
                    >
                      {cat}
                    </span>
                  ))}
                </div>

                <div className="mt-auto">
                  <button
                    onClick={() => navigate(`/blog/read/${blog._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white py-2 rounded-lg w-full"
                  >
                    Read More
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
