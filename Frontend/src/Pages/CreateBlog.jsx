import React, { useState } from "react";
import { Image, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

function CreateBlog() {
  const { accessToken } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [categoryInput, setCategoryInput] = useState("");
  const [categories, setCategories] = useState([]);

  const navigateTo = useNavigate();

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 🔹 Add category
  const handleAddCategory = () => {
    const trimmed = categoryInput.trim();
    if (!trimmed) return;
    if (categories.includes(trimmed)) {
      toast.error("Category already added");
      return;
    }
    if (categories.length >= 5) {
      toast.error("You can only add up to 5 categories");
      return;
    }
    setCategories([...categories, trimmed]);
    setCategoryInput("");
  };

  // 🔹 Remove category
  const handleRemoveCategory = (cat) => {
    setCategories(categories.filter((c) => c !== cat));
  };

  const handlePublish = async () => {
    const uploadingBlog = toast.loading("Publishing Blog...");
    if (!title.trim()) {
      toast.error("Please add a title to your blog post");
      toast.dismiss(uploadingBlog);
      return;
    }
    if (!content.trim()) {
      toast.error("Please add some content to your blog post");
      toast.dismiss(uploadingBlog);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      // 🔹 Append categories as array
      categories.forEach((cat) => formData.append("category", cat));

      if (coverImage) {
        formData.append("blogImage", coverImage);
      }
      const response = await axios.post(
        "http://localhost:4000/api/v1/blog/create",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`,
          },
          withCredentials: true,
        }
      );
      toast.dismiss(uploadingBlog);
      toast.success(response.data.message || "Blog published successfully!");
      setTitle("");
      setContent("");
      setCategories([]);
      setCoverImage(null);
      navigateTo("/");
    } catch (error) {
      toast.dismiss(uploadingBlog);
      toast.error(error.response?.data?.message || "Error publishing blog");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white mb-[-2.5rem]">
      {/* Header */}
      <div className="flex justify-between items-center p-6 border-b border-gray-800">
        <div className="flex items-center gap-4">
          {/* Add Cover Button */}
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg cursor-pointer transition-colors">
            <Image size={18} />
            <span>Add Cover</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          className="px-6 py-2 cursor-pointer bg-blue-600 hover:bg-blue-500 rounded-lg font-medium transition-colors"
        >
          Publish
        </button>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6 border border-gray-600 rounded-lg mt-6">
        
        {/* Categories */}
        <div className="mb-8">
          <label className="block mb-2 text-gray-400 font-medium">
            Categories (max 5)
          </label>
          <div className="flex gap-2 mb-4">
            <select
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg outline-none text-gray-200"
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
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg text-white"
            >
              Add
            </button>
          </div>

          {/* Show selected category list */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <div
                key={cat}
                className="flex items-center gap-2 px-3 py-1 bg-gray-700 text-sm rounded-lg"
              >
                {cat}
                <button
                  onClick={() => handleRemoveCategory(cat)}
                  className="text-red-400 hover:text-red-600"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Cover Image Preview */}
        {coverImage && (
          <div className="mb-8 relative">
            {previewImage && (
              <img
                src={previewImage}
                alt="Cover Preview"
                className="w-full h-70 object-cover rounded-lg"
              />
            )}
            <button
              onClick={() => setCoverImage(null)}
              className="absolute cursor-pointer top-4 right-4 p-2 bg-gray-900 bg-opacity-75 hover:bg-opacity-100 rounded-full transition-colors"
            >
              <Plus size={16} className="rotate-45" />
            </button>
          </div>
        )}

        {/* Title Input */}
        <div className="mb-8">
          <input
            type="text"
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-gray-500 text-gray-300"
          />
        </div>

        {/* Content Area */}
        <div className="mb-8">
          <textarea
            placeholder="Tell your story..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-96 bg-transparent border-none outline-none placeholder-gray-500 text-gray-300 text-lg leading-relaxed resize-none"
          />
        </div>

        {/* 🔹 Categories Section */}
      </div>
    </div>
  );
}

export default CreateBlog;
