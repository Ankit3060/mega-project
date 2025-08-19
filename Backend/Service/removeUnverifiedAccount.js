import { User } from "../Models/userModel.js";
import cron from "node-cron";

export const removeUnverifiedAccounts = ()=>{
    cron.schedule("*/5 * * * *", async () => {

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        await User.deleteMany({
            accountVerified: false,
            createdAt: { $lt: oneHourAgo }
        });
    });
}
