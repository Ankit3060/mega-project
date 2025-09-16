import React, { useEffect, useState } from "react";
import { SlHeart, SlShare } from "react-icons/sl";
import {
  BiComment,
  BiBookmark,
  BiArrowBack,
  BiDotsHorizontalRounded,
  BiEdit,
  BiTrash,
} from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";
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

function ReadBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { accessToken, user } = useAuth();
  const { theme } = useTheme();

  const isDark = theme === "dark";

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const [saved, setSaved] = useState(false);
  const [following, setFollowing] = useState(false);
  const [blogMenuOpen, setBlogMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/userBlog/${id}`,
          {
            withCredentials: true,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setBlog(response.data.blog);
        setLiked(response.data.blog.likes.includes(user._id));

        const commentRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/getBlog-comment/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setComments(commentRes.data.comments || []);

        const followRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}api/v1/subscribe/check-follow/${response.data.blog.owner._id}`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        setFollowing(followRes.data.isFollowing);

        setLoading(false);
      } catch (error) {
        toast.error("Error loading blog");
        setLoading(false);
      }
    };

    if (id && accessToken) fetchBlog();
  }, [id, accessToken, user._id]);

  const likeBlog = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/like/like-unlike/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      setLiked(res.data.liked);
      setLike(res.data.likes);
      setLiked(!liked);
      toast.success(res.data.message || "Blog Liked");
    } catch (error) {
      toast.error("Error liking blog");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setActiveDropdown(null);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const handleSave = () => setSaved(!saved);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        text: blog?.content?.substring(0, 100) + "...",
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/create-comment/${id}`,
        { comment: newComment },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setComments([res.data.newComment, ...comments]);
      setNewComment("");
      setShowCommentBox(false);
      toast.success("Comment added!");
    } catch (error) {
      toast.error("Failed to add comment");
    }
  };

  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment);
    setActiveDropdown(null);
  };

  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const res = await axios.patch(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/update-comment/${commentId}`,
        { newComment: editCommentText },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      setComments(
        comments.map((comment) =>
          comment._id === commentId
            ? { ...comment, comment: editCommentText }
            : comment
        )
      );

      setEditingComment(null);
      setEditCommentText("");
      toast.success("Comment updated successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId, isOwner = false) => {
    try {
      const endpoint = isOwner
        ? `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/blogOwner/delete-comment/${commentId}`
        : `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/delete-comment/${commentId}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      setComments(comments.filter((comment) => comment._id !== commentId));
      setActiveDropdown(null);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  const cancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  const canEditDelete = (comment) => {
    return comment.userId?._id === user?._id || comment.userId === user?._id;
  };

  const canBlogOwnerDelete = () => {
    return blog?.owner?._id === user?._id;
  };

  const followUnfollow = async () => {
    if (!blog?.owner?._id) return;
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/subscribe/follow-unfollow/${blog.owner._id}`,
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setFollowing(res.data.isFollowing);
      toast.success(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to follow/unfollow");
    }
  };

  const handleDeleteBlog = async (blogId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/delete-blog/${blogId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      toast.success("Blog deleted successfully!");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    }
  };

  useEffect(() => {
    const handleClickOutside = () => setBlogMenuOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    if (user?.role === "Admin") {
      setIsAdmin(true);
    }
  }, [user]);

  const handleDeleteBlogByAdmin = async (blogId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/blog/admin/delete-blog/${blogId}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      toast.success("Blog deleted successfully by Admin!");
      navigate("/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete blog by Admin"
      );
    }
  };

  const handleDeleteCommentByAdmin = async (commentId) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}api/v1/comment/admin/delete-comment/${commentId}`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      setComments(comments.filter((c) => c._id !== commentId));
      toast.success("Comment deleted successfully by Admin!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete comment by Admin"
      );
    }
  };

  if (loading) {
    return (
      <div
        className={`min-h-screen mb-[-2.5rem] flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className={`${isDark ? "text-gray-400" : "text-gray-600"}`}>
            Loading blog...
          </p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div
        className={`min-h-screen flex items-center justify-center ${
          isDark ? "bg-gray-900" : "bg-gray-50"
        }`}
      >
        <div className="text-center">
          <h2
            className={`text-2xl font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Blog not found
          </h2>
          <button
            onClick={() => navigate("/")}
            className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-lg"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen mb-[-2.5rem] ${isDark ? "bg-gray-900" : "bg-gray-50"}`}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <article
          className={`rounded-2xl shadow-lg overflow-hidden ${
            isDark
              ? "bg-gray-800 shadow-2xl shadow-blue-900/10"
              : "bg-white"
          }`}
        >
          {/* Author Info */}
          <div
            className={`p-6 border-b flex items-center justify-between ${
              isDark ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <img
                src={blog.owner?.avatar?.url || "/default-avatar.png"}
                alt={blog.owner?.fullName}
                className="w-12 h-12 rounded-full border-2 border-blue-100 object-cover"
              />
              <div>
                <h4
                  onClick={() => navigate("/user/profile/" + blog.owner?._id)}
                  className={`font-semibold cursor-pointer ${
                    isDark ? "text-gray-100" : "text-gray-900"
                  }`}
                >
                  {blog.owner?.fullName}
                </h4>
                <div
                  className={`flex items-center gap-2 text-sm ${
                    isDark ? "text-gray-400" : "text-gray-500"
                  }`}
                >
                  <span>@{blog.owner?.userName}</span>
                  <span>•</span>
                  <span>{timeAgo(blog.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 relative">
              {user?._id !== blog.owner?._id && (
                <button
                  onClick={followUnfollow}
                  className={`${
                    following
                      ? "bg-green-400 hover:bg-green-500"
                      : "bg-blue-500 hover:bg-blue-600"
                  } cursor-pointer text-white px-4 py-1 rounded-lg text-sm font-medium`}
                >
                  {following ? "Following" : "Follow"}
                </button>
              )}

              {(user?._id === blog.owner?._id || isAdmin) && (
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setBlogMenuOpen(!blogMenuOpen);
                    }}
                    className={`p-2 cursor-pointer rounded-full ${
                      isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
                    }`}
                  >
                    <BiDotsHorizontalRounded
                      className={`w-5 h-5 ${
                        isDark ? "text-gray-400" : "text-gray-600"
                      }`}
                    />
                  </button>

                  {blogMenuOpen && (
                    <div
                      className={`absolute right-0 mt-2 w-40 border rounded-lg shadow-lg py-1 z-20 ${
                        isDark
                          ? "bg-gray-800 border-gray-600"
                          : "bg-white border-gray-200"
                      }`}
                    >
                      {user?._id === blog.owner?._id && (
                        <button
                          onClick={() => navigate(`/edit-blog/${blog._id}`)}
                          className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm w-full text-left ${
                            isDark
                              ? "text-gray-300 hover:bg-gray-700"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <BiEdit className="w-4 h-4" />
                          Edit
                        </button>
                      )}

                      <button
                        onClick={() =>
                          isAdmin
                            ? handleDeleteBlogByAdmin(blog._id)
                            : handleDeleteBlog(blog._id)
                        }
                        className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm w-full text-left ${
                          isDark
                            ? "text-red-500 hover:bg-red-900/50"
                            : "text-red-600 hover:bg-red-50"
                        }`}
                      >
                        <BiTrash className="w-4 h-4" />
                        {isAdmin ? "Delete by Admin" : "Delete"}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {blog.blogImage && (
            <div className="mb-6">
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          <div className="p-6">
            <h1
              className={`text-3xl md:text-4xl font-bold mb-6 leading-tight ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {blog.title}
            </h1>
            <div className="prose prose-lg max-w-none">
              <p
                className={`whitespace-pre-wrap ${
                  isDark ? "text-gray-300" : "text-gray-800"
                }`}
              >
                {blog.content}
              </p>
            </div>
          </div>

          <div
            className={`px-6 py-4 border-t ${
              isDark
                ? "border-gray-700 bg-gray-800/50"
                : "border-gray-100 bg-gray-50"
            }`}
          >
            <div className="flex items-center gap-6">
              <button
                onClick={likeBlog}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  liked
                    ? "text-red-500"
                    : isDark
                    ? "text-gray-400 hover:text-red-400"
                    : "text-gray-500 hover:text-red-500"
                }`}
              >
                <SlHeart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                <span className="text-sm font-medium">
                  {liked ? "Liked" : "Like"}
                  {blog.likes.length > 0 && ` (${blog.likes.length})`}
                </span>
              </button>

              <button
                onClick={() => setShowCommentBox(!showCommentBox)}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-blue-400"
                    : "text-gray-500 hover:text-blue-500"
                }`}
              >
                <BiComment className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Comment {comments.length > 0 && `(${comments.length})`}
                </span>
              </button>

              <button
                onClick={handleShare}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  isDark
                    ? "text-gray-400 hover:text-green-400"
                    : "text-gray-500 hover:text-green-500"
                }`}
              >
                <SlShare className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  saved
                    ? isDark
                      ? "text-yellow-500"
                      : "text-yellow-600"
                    : isDark
                    ? "text-gray-400 hover:text-yellow-500"
                    : "text-gray-500 hover:text-yellow-600"
                }`}
              >
                <BiBookmark
                  className={`w-5 h-5 ${saved ? "fill-current" : ""}`}
                />
                <span className="text-sm font-medium">
                  {saved ? "Saved" : "Save"}
                </span>
              </button>
            </div>
          </div>
        </article>

        <div
          className={`mt-8 rounded-2xl shadow-lg overflow-hidden ${
            isDark
              ? "bg-gray-800 shadow-2xl shadow-blue-900/10"
              : "bg-white"
          }`}
        >
          <div
            className={`p-6 border-b ${
              isDark ? "border-gray-700" : "border-gray-100"
            }`}
          >
            <h3
              className={`text-xl font-bold mb-4 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Comments
            </h3>

            {showCommentBox && (
              <form onSubmit={handleCommentSubmit} className="mb-6">
                <div className="flex gap-4">
                  <img
                    src={user?.avatar?.url}
                    alt={user?.fullName}
                    className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover"
                  />
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Write a comment..."
                      className={`w-full p-3 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isDark
                          ? "bg-gray-700 border-gray-600 placeholder-gray-400 text-white"
                          : "border-gray-300"
                      }`}
                      rows="3"
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        type="submit"
                        className="bg-blue-500 cursor-pointer hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        Post Comment
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          <div className="p-6">
            {comments.length === 0 ? (
              <p
                className={`text-center py-8 ${
                  isDark ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No comments yet. Be the first to comment!
              </p>
            ) : (
              <div className="space-y-6">
                {comments.map((comment) => (
                  <div key={comment?._id} className="flex gap-4">
                    <img
                      src={comment?.userId?.avatar?.url || user?.avatar?.url}
                      alt={comment?.userId?.fullName}
                      className="w-10 h-10 rounded-full border-2 border-blue-100 object-cover"
                    />
                    <div className="flex-1">
                      <div
                        className={`rounded-lg p-4 relative ${
                          isDark ? "bg-gray-700" : "bg-gray-50"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() =>
                                navigate(`/user/profile/${comment.userId?._id}`)
                              }
                              className={`font-semibold cursor-pointer ${
                                isDark ? "text-gray-100" : "text-gray-900"
                              }`}
                            >
                              {comment.userId?.fullName}
                            </span>
                            <span
                              className={`${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              @{comment.userId?.userName}
                            </span>
                            <span
                              className={`text-sm ${
                                isDark ? "text-gray-400" : "text-gray-500"
                              }`}
                            >
                              {timeAgo(comment?.createdAt)}
                            </span>
                          </div>

                          {(canEditDelete(comment) ||
                            canBlogOwnerDelete() ||
                            isAdmin) && (
                            <div className="relative">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(
                                    activeDropdown === comment._id
                                      ? null
                                      : comment._id
                                  );
                                }}
                                className={`p-1 cursor-pointer rounded-full transition-colors ${
                                  isDark
                                    ? "hover:bg-gray-600"
                                    : "hover:bg-gray-200"
                                }`}
                              >
                                <BiDotsHorizontalRounded
                                  className={`w-4 h-4 ${
                                    isDark
                                      ? "text-gray-400"
                                      : "text-gray-500"
                                  }`}
                                />
                              </button>

                              {activeDropdown === comment._id && (
                                <div
                                  className={`absolute right-0 top-4 border rounded-lg shadow-lg py-1 z-20 min-w-[120px] ${
                                    isDark
                                      ? "bg-gray-800 border-gray-600"
                                      : "bg-white border-gray-200"
                                  }`}
                                >
                                  {canEditDelete(comment) && (
                                    <button
                                      onClick={() =>
                                        handleEditComment(comment)
                                      }
                                      className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm w-full text-left ${
                                        isDark
                                          ? "text-gray-300 hover:bg-gray-700"
                                          : "text-gray-700 hover:bg-gray-100"
                                      }`}
                                    >
                                      <BiEdit className="w-4 h-4" />
                                      Edit
                                    </button>
                                  )}
                                  <button
                                    onClick={() =>
                                      isAdmin
                                        ? handleDeleteCommentByAdmin(
                                            comment._id
                                          )
                                        : handleDeleteComment(
                                            comment._id,
                                            !canEditDelete(comment)
                                          )
                                    }
                                    className={`flex cursor-pointer items-center gap-2 px-3 py-2 text-sm w-full text-left ${
                                      isDark
                                        ? "text-red-500 hover:bg-red-900/50"
                                        : "text-red-600 hover:bg-red-50"
                                    }`}
                                  >
                                    <BiTrash className="w-4 h-4" />
                                    {isAdmin ? "Delete " : "Delete"}
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {editingComment === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              className={`w-full p-2 border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                                isDark
                                  ? "bg-gray-600 border-gray-500 text-white"
                                  : "border-gray-300"
                              }`}
                              rows="3"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEdit}
                                className={`px-3 cursor-pointer py-1 text-sm transition-colors ${
                                  isDark
                                    ? "text-gray-400 hover:text-gray-200"
                                    : "text-gray-600 hover:text-gray-800"
                                }`}
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() =>
                                  handleUpdateComment(comment._id)
                                }
                                className="px-3 cursor-pointer py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className={`${
                              isDark ? "text-gray-300" : "text-gray-800"
                            }`}
                          >
                            {comment.comment}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReadBlog;