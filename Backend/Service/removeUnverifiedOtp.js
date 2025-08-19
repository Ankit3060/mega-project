import cron from "node-cron";
import {User} from "../Models/userModel.js";

export const removeUnverifiedOtp = ()=>{
    cron.schedule("*/2 * * * *", async () => {
        const now = new Date();
        await User.updateMany(
            { verificationCodeExpires: { $lt: now } },
            { $unset: { verificationCode: "", verificationCodeExpires: "" } }
        );
    });
}