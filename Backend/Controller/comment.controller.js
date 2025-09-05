import { Blog } from "../Models/blogModel.js";
import { Comment } from "../Models/commentModel.js";

export const newComment = async (req, res) => {
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
        const { comment } = req.body;

        if (!comment || comment.trim().length === 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Comment cannot be empty",
            });
        }
               

        const newComment = await Comment.create({ comment, blogId, userId, ownerId: blog.owner._id });


        return res.status(201).json({
            statusCode: 201,
            success: true,
            message: "Comment created successfully",
            newComment
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while commenting the blog",
            error: error.message,
        })
    }
}


export const editComment = async (req, res) => {
    const { commentId } = req.params;
    if ( !commentId) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "comment id are required"
        })
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Comment not found with this id"
            })
        }

        const { newComment } = req.body;
        if (!newComment) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Comment is required"
            })
        }

        if (!newComment || newComment.trim().length === 0) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                message: "Comment cannot be empty",
            });
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "You are not authorized to edit this comment",
            });
        }


        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            { comment: newComment },
            { new: true, runValidators: true });

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: 'Comment updated successfully',
            updatedComment
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while updating comment",
            error: error.message,
        })
    }

}


export const deleteComment = async (req,res)=>{
    const {commentId} = req.params;
    if(!commentId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Comment id is required"
        })
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Comment not found with this id"
            })
        }

        if (comment.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }
        
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while deleting the comment",
            error: error.message
        })
    }
}


export const deleteCommentByBlogOwner = async (req, res)=>{
    const {commentId} = req.params;
    if(!commentId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Comment id is required"
        })
    }
    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Comment not found with this id"
            })
        }

        if (comment.ownerId.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                statusCode: 403,
                success: false,
                message: "You are not authorized to delete this comment",
            });
        }
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while deleting the comment",
            error: error.message
        })
    }
}


export const deleteCommentByAdmin = async (req,res)=>{
    const {commentId} = req.params;
    if(!commentId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Comment id is required"
        })
    }

    try {
        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "Comment not found with this id"
            })
        }
        
        await Comment.findByIdAndDelete(commentId);

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Comment deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while deleting the comment",
            error: error.message
        })
    }
}


export const getBlogComment = async (req,res)=>{
    const {blogId} = req.params;
    if(!blogId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Blog id is required"
        })
    }

    try {
        const blog = await Blog.findById(blogId);
        if(!blog){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No blog found with this id"
            })
        }

        const comments = await Comment.find({ blogId }).populate("userId", "userName fullName avatar").populate("ownerId", "userName fullName avatar").sort({ createdAt: -1 });


        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Blog comment fetched successfully",
            comments
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while fetching the comment",
            error: error.message
        })
    }
}