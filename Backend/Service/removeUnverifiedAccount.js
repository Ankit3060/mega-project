import { User } from "../Models/userModel.js";
import cron from "node-cron";

export const removeUnverifiedAccounts = ()=>{
    cron.schedule("*/15 * * * *", async () => {

        const oneDayAgo = new Date(Date.now() - 24*60 * 60 * 1000);

        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: oneDayAgo }
        });
    });
}
