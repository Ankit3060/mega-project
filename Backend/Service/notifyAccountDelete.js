import cron from "node-cron";
import { User } from "../Models/userModel.js";
import { sendAccountDeleteNotification } from "../Utils/sendAccountDeleteNotification.js";

export const notifyUserAccountDelete = () => {
    cron.schedule("*/30 * * * *", async () => {
        const now = new Date();

        const twentyTwoHoursAgo = new Date(now - 22 * 60 * 60 * 1000);
        const twentyFourHoursAgo = new Date(now - 24 * 60 * 60 * 1000);

        const users = await User.find({
            accountVerified: false,
            notified: false,
            createdAt: { $gte: twentyFourHoursAgo, $lt: twentyTwoHoursAgo }
        });

        for (const user of users) {
            const verifyLink = `${process.env.FRONTEND_URL}/verify-account/`;
            const otp = user.verificationCode;

            try {
                await sendAccountDeleteNotification(verifyLink, otp, user.email);
                user.notified = true;
                await user.save();

                console.log(`Notification sent to ${user.email}`);
            } catch (err) {
                console.error(`Failed to notify ${user.email}:`, err.message);
            }
        }
    });
};
