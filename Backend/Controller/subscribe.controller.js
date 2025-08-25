import { User } from "../Models/userModel.js";
import { Subscribe } from "../Models/subscribeModel.js";

export const subscription = async (req, res) => {
    const { bloggerId } = req.params;
    if (!bloggerId) {
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message: "Blogger id is required"
        })
    }

    try {
        const blogger = await User.findById(bloggerId);
        if(!blogger){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No user found with this is"
            })
        }

        const subscriber = req.user._id;
        if (subscriber.toString() === bloggerId) {
            return res.status(400).json({
                success: false,
                message: "You cannot subscribe to yourself"
            });
        }

        const exists = await Subscribe.findOne({ subscriber, blogger: bloggerId });
        if (exists) {

            await exists.deleteOne();

            return res.status(200).json({
                success: true,
                message: "Unfollow successful"
            });
        }else{
            const newSubscriber = await Subscribe.create({ subscriber, blogger: bloggerId});

            return res.status(200).json({
                statusCode: 200,
                success: true,
                message: "Follow successfully",
                newSubscriber
            })
        }
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while following/unfollowing user",
            error: error.message
        })
    }
}


export const followerCount = async (req,res)=>{
    const {bloggerId} = req.params;
    if(!bloggerId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message : "Blogger id is required"
        })
    }

    try {
        const blogger = await User.findById(bloggerId);
        if(!blogger){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No blogger found with this id"
            })
        }

        const subscriberCount = await Subscribe.countDocuments({ blogger: bloggerId });
        const followers = await Subscribe.find({ blogger: bloggerId }).populate("subscriber", "userName fullName");

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User follower fetched",
            subscriberCount,
            followers
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while fetching follower ",
            error: error.message
        })
    }
}


export const followingCount = async (req,res)=>{
    const {userId} = req.params;
    if(!userId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message : "Blogger id is required"
        })
    }

    try {
        const blogger = await User.findById(userId);
        if(!blogger){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No blogger found with this id"
            })
        }

        const followingCount = await Subscribe.countDocuments({ subscriber: userId });
        const following = await Subscribe.find({ subscriber: userId }).populate("blogger", "userName fullName");

        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "User following fetched",
            followingCount,
            following
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while fetching follower ",
            error: error.message
        })
    }
}


export const removeFollower = async (req,res)=>{
    const {followerId} = req.params;
    if(!followerId){
        return res.status(400).json({
            statusCode: 400,
            success: false,
            message : "Follower id is required"
        })
    }

    try {
        const follower = await User.findById(followerId);
        if(!follower){
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "No blogger found with this id"
            })
        }

        const userId = req.user._id;

        const removed = await Subscribe.findOneAndDelete({
            subscriber: followerId,
            blogger: userId
        });

        if (!removed) {
            return res.status(404).json({
                statusCode: 404,
                success: false,
                message: "This user is not your follower"
            });
        }
        
        return res.status(200).json({
            statusCode: 200,
            success: true,
            message: "Follower removed successfully",
            removed
        })
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            success: false,
            message: "Error while removing follower ",
            error: error.message
        })
    }
}
