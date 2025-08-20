import { generateAccountDeleteTemplate } from "./emailTemplates.js";
import { sendEmail } from "./sendEmail.js";

export async function sendAccountDeleteNotification(verifyLink, otp, email) {
    try {
        const message = generateAccountDeleteTemplate(verifyLink, otp);
        sendEmail({
            email,
            subject: "Account Not Verified Verify now",
            message
        });

        console.log(`Sending account delete notification to ${email}`);
    } catch (error) {
        console.error("Error sending notification:", error.message);
        throw error;
    }
} 