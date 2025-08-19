import cron from "node-cron";
import {User} from "../Models/userModel.js";
import {sendAccountDeleteNotification} from "../Utils/sendAccountDeleteNotification.js";

export const notifyUserAccountDelete = () => {
    cron.schedule("*/5 * * * *", async () => {
        const users = await User.find({ accountVerified: false });
        users.forEach(user => {
            const verifyLink = `${process.env.FRONTEND_URL}/verify-account/`;
            const otp = user.verificationCode;
            sendAccountDeleteNotification(verifyLink, otp, user.email);
        });
    });
};
