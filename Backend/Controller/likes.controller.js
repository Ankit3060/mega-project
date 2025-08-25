import { Like } from "../Models/likeModel.js";
import {Blog} from "../Models/blogModel.js";


export const toggleLikeBlog = async (req, res) => {
    const { blogId } = req.params;

    if (!blogId) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Blog id required",
        });
    }

    const blog = await Blog.findById(blogId);
    if (!blog) {
        return res.status(404).json({
            statusCode: 404,
            success: false,
            message: "Blog not found with this id",
        });
    }

    const userId = req.user._id;

    try {
        const existingLike = await Like.findOne({ blogId, userId });

        if (existingLike) {
            await Like.deleteOne({ blogId, userId });

            blog.likes = blog.likes.filter(
                (id) => id.toString() !== userId.toString()
            );
            await blog.save();

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Blog unliked successfully",
                blog,
            });
        } else {
            const newLike = new Like({ userId, blogId });
            await newLike.save();

            blog.likes.push(userId);
            await blog.save();

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Blog liked successfully",
                blog,
            });
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error toggling like",
            error: error.message,
        });
    }
};
