import React, { useEffect, useState } from "react";
import { Image, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useTheme } from "../Context/themeContext";
import { useNavigate, useParams } from "react-router-dom";

function EditBlog() {
  const { accessToken } = useAuth();
  const { theme } = useTheme();
  const { blogId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch existing blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/userBlog/${blogId}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const blog = response.data.blog;
        setTitle(blog.title || "");
        setContent(blog.content || "");
        setCategories(blog.category || []);
        setPreviewImage(blog.blogImage?.url || null);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching blog:", error);
        toast.error("Failed to load blog data");
        setLoading(false);
        navigate("/");
      }
    };

    if (blogId && accessToken) {
      fetchBlog();
    }
  }, [blogId, accessToken, navigate]);

  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle category input
  const handleCategoryKeyPress = (e) => {
    if (e.key === "Enter" && categoryInput.trim()) {
      e.preventDefault();
      if (!categories.includes(categoryInput.trim())) {
        setCategories([...categories, categoryInput.trim()]);
      }
      setCategoryInput("");
    }
  };

  const removeCategory = (categoryToRemove) => {
    setCategories(categories.filter((cat) => cat !== categoryToRemove));
  };

  // Update blog
  const handleUpdate = async () => {
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    const updatingBlog = toast.loading("Updating Blog...");

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());

      // Add categories to FormData
      categories.forEach((cat) => formData.append("category", cat));

      // Add image if selected
      if (coverImage) {
        formData.append("blogImage", coverImage);
      }

      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/update-blog/${blogId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );

      toast.dismiss(updatingBlog);
      toast.success(response.data.message || "Blog updated successfully!");
      navigate(`/blog/read/${blogId}`);
    } catch (error) {
      toast.dismiss(updatingBlog);
      console.error("Error updating blog:", error);
      toast.error(error.response?.data?.message || "Error updating blog");
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-200 ${
        theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
      }`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`transition-colors duration-200 ${
            theme === 'dark' ? 'text-white' : 'text-gray-700'
          }`}>Loading blog...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen mb-[-2.5rem] transition-colors duration-200 ${
      theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
    }`}>
      {/* Header */}
      <div className={`flex justify-between items-center p-6 border-b transition-colors duration-200 ${
        theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
      }`}>
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(`/blog/read/${blogId}`)}
            className={`px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
              theme === 'dark' 
                ? 'bg-gray-800 hover:bg-gray-700 text-white'
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
            }`}
          >
            Cancel
          </button>

          <label className={`flex items-center gap-2 px-4 py-2 rounded-lg cursor-pointer transition-colors duration-200 ${
            theme === 'dark'
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}>
            <Image size={18} />
            <span>Change Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <button
          onClick={handleUpdate}
          className="px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors text-white"
        >
          Update
        </button>
      </div>

      <div className="max-w-4xl mx-auto p-6">
        {/* Cover Image Preview */}
        {previewImage && (
          <div className="mb-6 relative">
            <img
              src={previewImage}
              alt="Cover preview"
              className="w-full h-64 md:h-80 object-cover rounded-lg"
            />
            <button
              onClick={() => {
                setPreviewImage(null);
                setCoverImage(null);
              }}
              className="absolute top-2 right-2 p-2 bg-red-600 hover:bg-red-700 rounded-full cursor-pointer transition-colors text-white"
            >
              <X size={16} />
            </button>
          </div>
        )}

        {/* Title Input */}
        <div className="mb-6">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your blog title..."
            className={`w-full text-4xl md:text-5xl font-bold bg-transparent border-none outline-none resize-none transition-colors duration-200 ${
              theme === 'dark' 
                ? 'placeholder-gray-500 text-white'
                : 'placeholder-gray-400 text-gray-900'
            }`}
            style={{ lineHeight: "1.2" }}
          />
        </div>

        {/* Categories */}
        <div className="mb-6">
          <label className={`block mb-2 font-medium transition-colors duration-200 ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            Categories (max 5)
          </label>

          {/* Selected Categories */}
          <div className="flex flex-wrap gap-2 mb-3">
            {categories.map((category, index) => (
              <span
                key={index}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-full text-sm"
              >
                {category}
                <button
                  onClick={() => removeCategory(category)}
                  className="ml-1 hover:bg-blue-700 rounded-full p-1 cursor-pointer"
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>

          {/* Dropdown Select for Adding Categories */}
          <div className="flex gap-2">
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className={`flex-1 px-3 py-2 border rounded-lg outline-none transition-colors duration-200 ${
                theme === 'dark'
                  ? 'bg-gray-800 border-gray-700 text-gray-200'
                  : 'bg-white border-gray-300 text-gray-700'
              }`}
            >
              <option value="">Select a category...</option>
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
              <option value="Life">Life</option>
              <option value="Disaster">Disaster</option>
              <option value="Development">Development</option>
            </select>

            <button
              type="button"
              onClick={() => {
                if (!categoryInput) return;
                if (categories.includes(categoryInput)) {
                  toast.error("Category already added");
                  return;
                }
                if (categories.length >= 5) {
                  toast.error("You can only add up to 5 categories");
                  return;
                }
                setCategories([...categories, categoryInput]);
                setCategoryInput("");
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white transition-colors"
            >
              Add
            </button>
          </div>
        </div>

        {/* Content Textarea */}
        <div className="mb-6">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your blog content here..."
            className={`w-full min-h-96 p-4 border rounded-lg outline-none focus:border-blue-500 transition-colors resize-none text-lg leading-relaxed ${
              theme === 'dark'
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
            }`}
            style={{ fontFamily: "inherit" }}
          />
        </div>

        {/* Character Count */}
        <div className={`text-right text-sm mb-4 transition-colors duration-200 ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        }`}>
          {content.length} characters
        </div>
      </div>
    </div>
  );
}

export default EditBlog;