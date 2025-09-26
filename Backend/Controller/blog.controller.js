import { Blog } from "../Models/blogModel.js";
import { User } from "../Models/userModel.js";
import { Comment } from "../Models/commentModel.js";
import { v2 as cloudinary } from "cloudinary";
import { sendSuccessfulPostMail } from "../Utils/sendSuccessfullpost.js"
import { sendSuccessfulPostUpdateMail } from "../Utils/senSuccessfullPostUpdate.js"

export const createNewBlog = async (req, res) => {
    try {
        const { title, content, category } = req.body;
        const ownerId = req.user._id;

        if (!title || !content || !category) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Title, content, and category are required",
            });
        }

        if (!ownerId) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }

        let blogImageData;

        if (req.files && req.files?.blogImage) {
            const { blogImage } = req.files;
            const allowedFormat = [
                "image/png",
                "image/jpeg",
                "image/webp",
                "image/jpg",
                "image/svg+xml",
            ];
            if (!allowedFormat.includes(blogImage.mimetype)) {
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Invalid image format",
                });
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(
                blogImage.tempFilePath,
                {
                    folder: "Mega_Project",
                }
            );

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Cloudinary upload failed",
                });
            }

            blogImageData = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }

        let finalCategories = [];

        if (Array.isArray(category)) {
            finalCategories = category.map((cat) => cat.trim());
        } else if (typeof category === "string") {
            finalCategories = category.split(",").map((cat) => cat.trim());
        }

        if (finalCategories.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "At least one category is required",
            });
        }

        const blog = await Blog.create({
            title,
            content,
            category: finalCategories,
            owner: ownerId,
            blogImage: blogImageData,
            isPublished: true
        });

        const postUrl = `${process.env.FRONTEND_URL}/blog/my-blog`;
        sendSuccessfulPostMail(postUrl, req.user.email);

        let user = await User.findById(ownerId);
        if(!user){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message : "User not found"
            })
        }
        user.credits = (user.credits || 0) + 10;
        await user.save();

        res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Blog created successfully",
            blog,
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error creating blog",
            error: error.message,
        });
    }
};


export const updateBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { title, content, category } = req.body;

        if (!blogId) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No blog found with this id to be edited",
            });
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Blog not found",
            });
        }

        if (blog.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "You are not authorized to edit this blog",
            });
        }

        if (req.files && req.files.blogImage) {
            const { blogImage } = req.files;
            const allowedFormat = ["image/png", "image/jpeg", "image/webp", "image/jpg", "image/svg+xml"];
            if (!allowedFormat.includes(blogImage.mimetype)) {
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "Invalid image format",
                });
            }

            if (blog.blogImage?.public_id) {
                await cloudinary.uploader.destroy(blog.blogImage.public_id);
            }

            const cloudinaryResponse = await cloudinary.uploader.upload(
                blogImage.tempFilePath,
                {
                    folder: "Mega_Project",
                }
            );

            if (!cloudinaryResponse || cloudinaryResponse.error) {
                return res.status(500).json({
                    statusCode: 500,
                    success: false,
                    message: "Cloudinary upload failed",
                });
            }

            blog.blogImage = {
                public_id: cloudinaryResponse.public_id,
                url: cloudinaryResponse.secure_url,
            };
        }

        if (title) blog.title = title;
        if (content) blog.content = content;
        if (category) {
            let finalCategories = [];

            if (Array.isArray(category)) {
                finalCategories = category.map((cat) => cat.trim());
            } else if (typeof category === "string") {
                finalCategories = category.split(",").map((cat) => cat.trim());
            }

            if (finalCategories.length > 5) {
                return res.status(400).json({
                    statusCode: 400,
                    success: false,
                    message: "You can only add up to 5 categories",
                });
            }

            blog.category = finalCategories;
        }

        blog.isPublished = true,

            await blog.save();

        const postUrl = `${process.env.FRONTEND_URL}/blog/my-blog`;
        sendSuccessfulPostUpdateMail(postUrl, req.user.email);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog updated successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error updating blog",
            error: error.message,
        });
    }
};


export const deleteBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!blogId) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Blog id is required"
            })
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Blog not found",
            });
        }

        if (blog.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete this blog",
            });
        }

        if (blog.blogImage?.public_id) {
            await cloudinary.uploader.destroy(blog.blogImage.public_id);
        }

        await Blog.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        await Comment.deleteMany({ blogId });

        let user = await User.findById(req.user._id);
        user.credits = Math.max(0, user.credits - 9);
        await user.save();

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog and its comments deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error in deleting blog",
            error: error.message,
        })
    }
}


export const deleteBlogByAdmin = async (req, res) => {
    try {
        const { blogId } = req.params;
        if (!blogId) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Blog id is required"
            })
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Blog not found",
            });
        }


        if (blog.blogImage?.public_id) {
            await cloudinary.uploader.destroy(blog.blogImage.public_id);
        }


        await Blog.findByIdAndDelete(blogId);
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: "Blog not found",
            });
        }
        await Comment.deleteMany({ blogId });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog and its comments deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error in deleting blog",
            error: error.message,
        })
    }
}


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
            .populate("owner", "userName fullName avatar")
            .sort({ createdAt: -1 });
        res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blogs fetched successfully",
            blogs,
        });
    } catch (error) {
        res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error fetching blogs",
            error: error.message,
        });
    }
};


export const getBlogByCategory = async (req, res) => {
    try {
        const category = req.params.category.trim();

        const blog = await Blog.find({ category: { $in: [category] } }).populate("owner", "fullName userName avatar").sort({ createdAt: -1 });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog with category fetched successfully",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Internal sever errror",
            error: error.message
        })
    }
}



export const getParticularBlog = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Blog id is required"
            })
        }
        const blog = await Blog.findById(id).populate("owner", "userName fullName avatar");
        if (!blog) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Blog not found",
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog fetched successfully",
            blog,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error fetching blog",
            error: error.message,
        });
    }
}


export const getCurrentUserBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ owner: req.user._id });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blogs successfully fetched",
            blogs,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error fetching blogs",
            error: error.message,
        });
    }
};


export const getParticularUserBlog = async (req, res) => {
    try {
        const { userId } = req.params;

        if (!userId) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "UserId is required",
            });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "User not found",
            });
        }

        const blogsOfUser = await Blog.find({ owner: userId });

        if (blogsOfUser.length === 0) {
            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "No blogs found with this user",
                blogsOfUser: []
            });
        }

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blogs fetched successfully",
            blogsOfUser,
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error fetching blogs",
            error: error.message,
        });
    }
};
