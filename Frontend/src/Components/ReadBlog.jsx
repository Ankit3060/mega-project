import React, { useEffect, useState } from "react";
import { SlHeart, SlShare } from "react-icons/sl";
import {BiComment,BiBookmark,BiArrowBack,BiDotsHorizontalRounded,BiEdit,BiTrash} from "react-icons/bi";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { toast } from "react-toastify";

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

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [like, setLike] = useState(0);
  const [saved, setSaved] = useState(false);

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  // New states for edit/delete functionality
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/v1/blog/userBlog/${id}`,
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
          `http://localhost:4000/api/v1/comment/getBlog-comment/${id}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        setComments(commentRes.data.comments || []);

        setLoading(false);
      } catch (error) {
        toast.error("Error loading blog");
        console.error("Error fetching blog:", error);
        setLoading(false);
      }
    };

    if (id && accessToken) fetchBlog();
  }, [id, accessToken]);


  const likeBlog = async () => {
    try {
      const res = await axios.post(
        `http://localhost:4000/api/v1/like/like-unlike/${id}`,
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
  }


  // Close dropdown when clicking outside
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
        `http://localhost:4000/api/v1/comment/create-comment/${id}`,
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

  // Handle edit comment
  const handleEditComment = (comment) => {
    setEditingComment(comment._id);
    setEditCommentText(comment.comment);
    setActiveDropdown(null);
  };

  // Handle update comment
  const handleUpdateComment = async (commentId) => {
    if (!editCommentText.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      console.log(
        "Updating comment:",
        commentId,
        "with text:",
        editCommentText
      );
      console.log("Access token:", accessToken ? "Present" : "Missing");

      const res = await axios.patch(
        `http://localhost:4000/api/v1/comment/update-comment/${commentId}`,
        { newComment: editCommentText },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log("Update response:", res.data);

      // Update the comment in the local state
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
      console.log("PATCH failed, trying PUT:", error.message);
      toast.error(error.response?.data?.message || "Failed to update comment");
    }
  };

  // Handle delete comment
  const handleDeleteComment = async (commentId, isOwner = false) => {

    try {
      const endpoint = isOwner
        ? `http://localhost:4000/api/v1/comment/blogOwner/delete-comment/${commentId}`
        : `http://localhost:4000/api/v1/comment/delete-comment/${commentId}`;

      await axios.delete(endpoint, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      // Remove the comment from local state
      setComments(comments.filter((comment) => comment._id !== commentId));
      setActiveDropdown(null);
      toast.success("Comment deleted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingComment(null);
    setEditCommentText("");
  };

  // Check if user can edit/delete comment
  const canEditDelete = (comment) => {
    return comment.userId?._id === user?._id || comment.userId === user?._id;
  };

  // Check if blog owner can delete comment
  const canBlogOwnerDelete = () => {
    return blog?.owner?._id === user?._id;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading blog...</p>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 text-gray-600 hover:text-blue-900 transition-colors"
          >
            <BiArrowBack className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Author Info */}
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={blog.owner?.avatar?.url || "/default-avatar.png"}
                alt={blog.owner?.fullName}
                className="w-12 h-12 rounded-full border-2 border-blue-100 object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900">
                  {blog.owner?.fullName}
                </h4>
                <div className="flex items-center gap-2 text-gray-500 text-sm">
                  <span>@{blog.owner?.userName}</span>
                  <span>•</span>
                  <span>{timeAgo(blog.createdAt)}</span>
                </div>
              </div>
            </div>
            <button className="bg-blue-500 hover:bg-blue-600 cursor-pointer text-white px-4 py-1 rounded-lg text-sm font-medium">
              Follow
            </button>
          </div>

          {/* Blog Image */}
          {blog.blogImage && (
            <div className="mb-6">
              <img
                src={blog.blogImage.url}
                alt={blog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
          )}

          {/* Blog Content */}
          <div className="p-6">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              {blog.title}
            </h1>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {blog.content}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
            <div className="flex items-center gap-6">
              <button
                onClick={likeBlog}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  liked ? "text-red-500" : "text-gray-500 hover:text-red-500"
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
                className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-blue-500 transition-colors"
              >
                <BiComment className="w-5 h-5" />
                <span className="text-sm font-medium">
                  Comment {comments.length > 0 && `(${comments.length})`}
                  </span>
              </button>

              <button
                onClick={handleShare}
                className="flex cursor-pointer items-center gap-2 text-gray-500 hover:text-green-500 transition-colors"
              >
                <SlShare className="w-5 h-5" />
                <span className="text-sm font-medium">Share</span>
              </button>

              <button
                onClick={handleSave}
                className={`flex cursor-pointer items-center gap-2 transition-colors ${
                  saved
                    ? "text-yellow-600"
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

        {/* Comments Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Comments</h3>

            {/* Add Comment Form (toggle only) */}
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
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

          {/* Comments List */}
          <div className="p-6">
            {comments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
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
                      <div className="bg-gray-50 rounded-lg p-4 relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-gray-900">
                              {comment.userId?.fullName}
                            </span>
                            <span className="text-gray-500">
                              @{comment.userId?.userName}
                            </span>
                            <span className="text-gray-500 text-sm">
                              {timeAgo(comment?.createdAt)}
                            </span>
                          </div>

                          {/* Three dots menu - Show if user can edit/delete OR if blog owner */}
                          {(canEditDelete(comment) || canBlogOwnerDelete()) && (
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
                                className="p-1 cursor-pointer hover:bg-gray-200 rounded-full transition-colors"
                              >
                                <BiDotsHorizontalRounded className="w-4 h-4 text-gray-500" />
                              </button>

                              {/* Dropdown Menu */}
                              {activeDropdown === comment._id && (
                                <div className="absolute right-0 top-4 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                                  {/* Edit option - only for comment owner */}
                                  {canEditDelete(comment) && (
                                    <button
                                      onClick={() => handleEditComment(comment)}
                                      className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                    >
                                      <BiEdit className="w-4 h-4" />
                                      Edit
                                    </button>
                                  )}

                                  {/* Delete option - for comment owner or blog owner */}
                                  <button
                                    onClick={() =>
                                      handleDeleteComment(
                                        comment._id,
                                        !canEditDelete(comment)
                                      )
                                    }
                                    className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  >
                                    <BiTrash className="w-4 h-4" />
                                    Delete
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Comment content or edit form */}
                        {editingComment === comment._id ? (
                          <div className="mt-2">
                            <textarea
                              value={editCommentText}
                              onChange={(e) =>
                                setEditCommentText(e.target.value)
                              }
                              className="w-full p-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows="3"
                            />
                            <div className="flex justify-end gap-2 mt-2">
                              <button
                                onClick={cancelEdit}
                                className="px-3 cursor-pointer py-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleUpdateComment(comment._id)}
                                className="px-3 cursor-pointer py-1 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-gray-800">{comment.comment}</p>
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
