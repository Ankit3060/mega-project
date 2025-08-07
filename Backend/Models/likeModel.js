import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    blogId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Blog",
        required: true
    }
},{timestamps: true});


likeSchema.index({ userId: 1, blogId: 1 }, { unique: true });


export const Like = mongoose.model("Like", likeSchema);