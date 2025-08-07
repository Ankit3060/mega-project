import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema({
    subscriber: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    blogger: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{timestamps: true});


subscribeSchema.index({ subscriber: 1, blogger: 1 }, { unique: true });


export const Subscribe = mongoose.model("Subscribe", subscribeSchema);
