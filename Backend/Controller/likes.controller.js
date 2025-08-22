import { Like } from "../Models/likeModel.js";
import {User} from "../Models/userModel.js";;
import {Blog} from "../Models/blogModel.js";

export const likeBlog= async(req,res)=>{
    const {blogId} = req.params; 
    if(!blogId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Blog id required"
        })
    }

    const blog = await Blog.findById(blogId);
    if(!blog){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Blog not found with this id"
        })
    }
} 