import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    content: {
        type: String,
        required: true,
        minLength: 20
    },
    blogImage:{
        public_id: String,
        url: String
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    owner:{
        type : mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    likes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ]

},{timestamps: true});

export const Blog = mongoose.model("Blog", blogSchema);
